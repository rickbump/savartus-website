import { createHash, randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { ClientSecretCredential } from "@azure/identity";
import { syncSpecificationContact } from "./specification-crm";

export type SpecificationRequest = {
  name: string;
  organization: string;
  title: string;
  email: string;
  source: string;
};

type RequestRecord = SpecificationRequest & {
  rowKey: string;
  version: string;
  requestedAt: string;
  status: "pending" | "accepted" | "failed";
  emailAcceptedAt?: string;
};

export type RequestServices = {
  get: (rowKey: string) => Promise<RequestRecord | undefined>;
  reserve: (record: RequestRecord, previousVersion?: string) => Promise<boolean>;
  update: (record: RequestRecord) => Promise<void>;
  send: (request: SpecificationRequest) => Promise<void>;
  sync: (requestId: string) => Promise<boolean>;
};

export class SpecificationRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryAfter?: number,
  ) {
    super(message);
  }
}

export function parseSpecificationRequest(value: unknown): SpecificationRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new SpecificationRequestError("Please check the form and try again.", 400);
  }

  const fields: Record<string, unknown> = { ...value };
  function readField(key: keyof SpecificationRequest, limit: number) {
    const field = fields[key];
    if (
      typeof field !== "string" ||
      !field.trim() ||
      field.trim().length > limit ||
      Array.from(field).some((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || code === 127;
      })
    ) {
      throw new SpecificationRequestError(
        `Please enter a valid ${key === "organization" ? "company" : key}.`,
        400,
      );
    }
    return field.trim();
  }

  const result: SpecificationRequest = {
    name: readField("name", 150),
    organization: readField("organization", 200),
    title: readField("title", 150),
    email: readField("email", 254).toLowerCase(),
    source: readField("source", 200),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) {
    throw new SpecificationRequestError("Please enter a valid email address.", 400);
  }

  return result;
}

export async function submitSpecificationRequest(
  request: SpecificationRequest,
  services: RequestServices,
) {
  const now = Date.now();
  const rowKey = createHash("sha256").update(request.email).digest("hex");
  const previous = await services.get(rowKey);
  if (previous) {
    const cooldown = previous.status === "failed" ? 60_000 : 600_000;
    const remaining = Date.parse(previous.requestedAt) + cooldown - now;
    if (remaining > 0) {
      throw new SpecificationRequestError(
        "A link was recently requested for this address. Check your inbox and spam folder, or try again later.",
        429,
        Math.ceil(remaining / 1000),
      );
    }
  }

  const record: RequestRecord = {
    ...request,
    rowKey,
    version: randomUUID(),
    requestedAt: new Date(now).toISOString(),
    status: "pending",
  };

  if (!await services.reserve(record, previous?.version)) {
    throw new SpecificationRequestError(
      "A request is already being processed for this address. Please try again later.",
      429,
      60,
    );
  }

  try {
    await services.sync(record.version);
  } catch (error) {
    // The sync job was saved with the request; a CRM/storage outage must not block the email.
    console.error("Specification CRM sync interrupted; job retained for retry", {
      requestId: record.version,
      type: error instanceof Error ? error.name : "UnknownError",
    });
  }

  try {
    await services.send(request);
  } catch (error) {
    await services.update({ ...record, status: "failed" });
    throw error;
  }

  await services.update({
    ...record,
    status: "accepted",
    emailAcceptedAt: new Date().toISOString(),
  });
}

export function createRequestServices(): RequestServices {
  const databaseUrl = process.env.DATABASE_URL;
  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;
  const sender = process.env.SPECIFICATION_SENDER_EMAIL;
  const downloadUrl = process.env.SPECIFICATION_DOWNLOAD_URL;

  if (!databaseUrl || !tenantId || !clientId || !clientSecret || !sender || !downloadUrl) {
    throw new Error("Specification request service configuration is incomplete.");
  }
  if (!["postgres:", "postgresql:"].includes(new URL(databaseUrl).protocol) ||
      new URL(downloadUrl).protocol !== "https:" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sender)) {
    throw new Error("Specification request service configuration is invalid.");
  }

  const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
  const sql = neon(databaseUrl);

  return {
    async get(rowKey) {
      const rows = await sql`
        SELECT email_key AS "rowKey", version, name, organization, title, email,
               source, requested_at AS "requestedAt", status,
               email_accepted_at AS "emailAcceptedAt"
        FROM specification_requests WHERE email_key = ${rowKey}
      `;
      if (!rows.length) return undefined;
      const row = rows[0];
      const fields = parseSpecificationRequest(row);
      const timestamp: unknown = row.requestedAt;
      const requestedAt = timestamp instanceof Date
        ? timestamp
        : typeof timestamp === "string" ? new Date(timestamp) : undefined;
      const status: unknown = row.status;
      if (typeof row.version !== "string" || !requestedAt ||
          !Number.isFinite(requestedAt.getTime()) ||
          (status !== "pending" && status !== "accepted" && status !== "failed")) {
        throw new Error("Stored specification request is invalid.");
      }
      return {
        ...fields,
        rowKey,
        version: row.version,
        requestedAt: requestedAt.toISOString(),
        status,
      };
    },
    async reserve(record, previousVersion) {
      const results = await sql.transaction([sql`
        INSERT INTO specification_requests
          (email_key, version, name, organization, title, email, source, requested_at, status)
        VALUES
          (${record.rowKey}, ${record.version}, ${record.name}, ${record.organization},
           ${record.title}, ${record.email}, ${record.source}, ${record.requestedAt}, 'pending')
        ON CONFLICT (email_key) DO UPDATE SET
          version = EXCLUDED.version, name = EXCLUDED.name,
          organization = EXCLUDED.organization, title = EXCLUDED.title,
          email = EXCLUDED.email, source = EXCLUDED.source,
          requested_at = EXCLUDED.requested_at, status = 'pending', email_accepted_at = NULL
        WHERE specification_requests.version = ${previousVersion ?? null}::uuid
        RETURNING email_key
      `, sql`
        INSERT INTO specification_crm_sync (request_id, email_key, payload)
        SELECT ${record.version}::uuid, email_key,
          ${JSON.stringify({
            requestId: record.version,
            name: record.name,
            organization: record.organization,
            title: record.title,
            email: record.email,
            source: record.source,
            leadSource: "Website - Specification page",
            requestedAt: record.requestedAt,
          })}::jsonb
        FROM specification_requests
        WHERE email_key = ${record.rowKey} AND version = ${record.version}::uuid
        ON CONFLICT (request_id) DO NOTHING
      `]);
      return results[0].length === 1;
    },
    sync: (requestId) => syncSpecificationContact(sql, requestId),
    async update(record) {
      const rows = await sql`
        UPDATE specification_requests
        SET status = ${record.status}, email_accepted_at = ${record.emailAcceptedAt ?? null}
        WHERE email_key = ${record.rowKey} AND version = ${record.version}::uuid
        RETURNING email_key
      `;
      if (rows.length !== 1) {
        throw new Error("The specification request changed before its status could be saved.");
      }
    },
    async send(request) {
      const token = await credential.getToken("https://graph.microsoft.com/.default");
      if (!token) {
        throw new Error("Microsoft Graph authentication failed.");
      }
      const response = await fetch(
        `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(sender)}/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              subject: "Your Enterprise Data Lifecycle Specification download",
              body: {
                contentType: "Text",
                content: [
                  `Hello ${request.name},`,
                  "",
                  "Thank you for your interest in the Enterprise Data Lifecycle Specification.",
                  "Download the complete specification here:",
                  downloadUrl,
                  "",
                  "The Savartus team",
                  "You received this email because a specification link was requested for this address.",
                  "If you did not request it, you can ignore this email.",
                ].join("\n"),
              },
              toRecipients: [{ emailAddress: { address: request.email } }],
              bccRecipients: [{ emailAddress: { address: "rick.bump@savartus.com" } }],
            },
          }),
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (response.status !== 202) {
        const error = new Error("Microsoft Graph did not accept the email.");
        error.name = `GraphSendMailHTTP${response.status}`;
        throw error;
      }
    },
  };
}
