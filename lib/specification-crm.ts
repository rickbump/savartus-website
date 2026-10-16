import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

type Database = NeonQueryFunction<false, false>;

function crmConfiguration() {
  const endpoint = process.env.CRM_CONTACT_IMPORT_URL;
  const token = process.env.CRM_CONTACT_IMPORT_TOKEN;
  if (!endpoint || !token || token.length < 32) {
    throw new Error("CRM contact import configuration is incomplete.");
  }
  const url = new URL(endpoint);
  if (url.protocol !== "https:" || url.username || url.password ||
      url.pathname !== "/api/integrations/website-contacts" || url.search || url.hash) {
    throw new Error("CRM contact import URL is invalid.");
  }
  return { endpoint, token };
}

export async function syncSpecificationContact(sql: Database, requestId: string) {
  const jobs = await sql`
    SELECT payload FROM specification_crm_sync
    WHERE request_id = ${requestId}::uuid AND status = 'pending'
  `;
  if (!jobs.length) return true;

  let contactId: string;
  try {
    const { endpoint, token } = crmConfiguration();
    const payload = jobs[0].payload;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId: payload.requestId,
        name: payload.name,
        organization: payload.organization,
        title: payload.title,
        email: payload.email,
        source: "Website - Specification page",
        requestedAt: payload.requestedAt,
      }),
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status !== 200 && response.status !== 201) {
      const error = new Error("CRM did not accept the contact.");
      error.name = `CrmImportHTTP${response.status}`;
      throw error;
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("contactId" in result) ||
        typeof result.contactId !== "string" ||
        !/^[a-f0-9-]{36}$/i.test(result.contactId)) {
      throw new Error("CRM returned an invalid contact response.");
    }
    contactId = result.contactId;
  } catch (error) {
    const type = error instanceof Error ? error.name : "UnknownError";
    console.error("Specification CRM sync failed; request retained for retry", { requestId, type });
    await sql`
      UPDATE specification_crm_sync
      SET attempts = attempts + 1, last_attempt_at = NOW(), last_error = ${type}
      WHERE request_id = ${requestId}::uuid AND status = 'pending'
    `;
    return false;
  }

  await sql`
    UPDATE specification_crm_sync
    SET status = 'synced', contact_id = ${contactId}, synced_at = NOW(),
        attempts = attempts + 1, last_attempt_at = NOW(), last_error = NULL
    WHERE request_id = ${requestId}::uuid AND status = 'pending'
  `;
  return true;
}

export async function retrySpecificationContacts(limit = 25) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("CRM retry limit must be between 1 and 100.");
  }
  crmConfiguration();
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
  const sql = neon(process.env.DATABASE_URL);
  const jobs = await sql`
    SELECT request_id FROM specification_crm_sync
    WHERE status = 'pending'
    ORDER BY last_attempt_at ASC NULLS FIRST, created_at ASC
    LIMIT ${limit}
  `;
  let synced = 0;
  for (const job of jobs) {
    if (typeof job.request_id !== "string") throw new Error("Invalid CRM sync job.");
    if (await syncSpecificationContact(sql, job.request_id)) synced += 1;
  }
  return { processed: jobs.length, synced, failed: jobs.length - synced };
}
