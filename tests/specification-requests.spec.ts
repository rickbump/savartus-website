import { expect, test } from "@playwright/test";
import { neonConfig } from "@neondatabase/serverless";
import { POST } from "../app/api/specification-requests/route";
import {
  parseSpecificationRequest,
  createRequestServices,
  submitSpecificationRequest,
  type RequestServices,
} from "../lib/specification-requests";

const details = {
  name: "Alex Example",
  organization: "Example Company",
  title: "IT Director",
  email: "alex@example.com",
  source: "DLM specification page hero",
};

function fakeServices() {
  const events: string[] = [];
  const records: Parameters<RequestServices["reserve"]>[0][] = [];
  const services: RequestServices = {
    async get() { return undefined; },
    async reserve(record) {
      events.push("save");
      records.push(record);
      return true;
    },
    async update(record) {
      events.push(record.status);
      records.push(record);
    },
    async send(request) {
      expect(request).toEqual(details);
      events.push("email");
    },
  };
  return { services, events, records };
}

test("trims fields and normalizes the recipient email", () => {
  expect(parseSpecificationRequest({
    ...details,
    name: " Alex Example ",
    email: " ALEX@Example.com ",
  })).toEqual(details);
});

for (const [field, value] of [
  ["name", ""],
  ["organization", "   "],
  ["title", 42],
  ["email", "not-an-email"],
  ["email", "alex@example.com\nBcc:other@example.com"],
  ["source", "x".repeat(201)],
  ["name", "x".repeat(151)],
  ["organization", "x".repeat(201)],
  ["title", "x".repeat(151)],
  ["email", `${"x".repeat(250)}@example.com`],
] as const) {
  test(`rejects invalid ${field}: ${String(value).slice(0, 30)}`, () => {
    expect(() => parseSpecificationRequest({ ...details, [field]: value })).toThrow();
  });
}

test("rejects non-object payloads", () => {
  for (const value of [null, [], "hello", 123]) {
    expect(() => parseSpecificationRequest(value)).toThrow();
  }
});

test("persists all request fields before sending and records Graph acceptance", async () => {
  const { services, events, records } = fakeServices();
  await submitSpecificationRequest(details, services);
  expect(events).toEqual(["save", "email", "accepted"]);
  expect(records[0]).toMatchObject({ ...details, status: "pending" });
  expect(records[0].rowKey).toMatch(/^[a-f0-9]{64}$/);
  expect(records[0].rowKey).not.toContain(details.email);
  expect(records[1].emailAcceptedAt).toBeTruthy();
});

test("never sends an email when saving fails", async () => {
  const { services, events } = fakeServices();
  services.reserve = async () => { throw new Error("Storage unavailable"); };
  await expect(submitSpecificationRequest(details, services)).rejects.toThrow("Storage unavailable");
  expect(events).toEqual([]);
});

test("retains a failed request and does not record acceptance when sending fails", async () => {
  const { services, events, records } = fakeServices();
  services.send = async () => { throw new Error("Graph unavailable"); };
  await expect(submitSpecificationRequest(details, services)).rejects.toThrow("Graph unavailable");
  expect(events).toEqual(["save", "failed"]);
  expect(records[1]).toMatchObject({ ...details, status: "failed" });
});

test("does not report success when recording acceptance fails", async () => {
  const { services, events } = fakeServices();
  services.update = async () => { throw new Error("Update unavailable"); };
  await expect(submitSpecificationRequest(details, services)).rejects.toThrow("Update unavailable");
  expect(events).toEqual(["save", "email"]);
});

for (const status of ["pending", "accepted", "failed"] as const) {
  test(`rate limits a recent ${status} request without sending again`, async () => {
    const { services, events } = fakeServices();
    services.get = async (rowKey) => ({
      ...details, rowKey, status,
      requestedAt: new Date().toISOString(), version: "version-1",
    });
    await expect(submitSpecificationRequest(details, services)).rejects.toMatchObject({
      status: 429,
    });
    expect(events).toEqual([]);
  });
}

test("allows retries for failed requests after one minute using the stored version", async () => {
  const { services, records } = fakeServices();
  services.get = async (rowKey) => ({
    ...details, rowKey, status: "failed",
    requestedAt: new Date(Date.now() - 61_000).toISOString(), version: "version-1",
  });
  let suppliedVersion: string | undefined;
  services.reserve = async (record, version) => {
    suppliedVersion = version;
    records.push(record);
    return true;
  };
  await submitSpecificationRequest(details, services);
  expect(suppliedVersion).toBe("version-1");
  expect(records[1].status).toBe("accepted");
});

test("handles a concurrent reservation conflict without sending", async () => {
  const { services, events } = fakeServices();
  services.reserve = async () => false;
  await expect(submitSpecificationRequest(details, services)).rejects.toMatchObject({ status: 429 });
  expect(events).toEqual([]);
});

function apiRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/specification-requests", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

test("API rejects invalid fields without calling external services", async () => {
  const response = await POST(apiRequest(JSON.stringify({ ...details, email: "" })));
  expect(response.status).toBe(400);
  expect(await response.json()).toEqual({ error: "Please enter a valid email." });
});

test("API rejects malformed JSON, honeypot submissions, and oversized bodies", async () => {
  expect((await POST(apiRequest("{"))).status).toBe(400);
  expect((await POST(apiRequest(JSON.stringify({ ...details, website: "spam" })))).status).toBe(400);
  expect((await POST(apiRequest("x".repeat(4097)))).status).toBe(413);
});

test("API rejects cross-origin and non-JSON requests", async () => {
  const body = JSON.stringify(details);
  expect((await POST(apiRequest(body, { origin: "https://another-site.example" }))).status).toBe(403);
  expect((await POST(apiRequest(body, { "content-type": "text/plain" }))).status).toBe(415);
});

test.describe("Neon storage adapter", () => {
  const environment = {
    DATABASE_URL: "postgresql://test:test@example.neon.tech/test?sslmode=require",
    AZURE_TENANT_ID: "11111111-1111-1111-1111-111111111111",
    AZURE_CLIENT_ID: "22222222-2222-2222-2222-222222222222",
    AZURE_CLIENT_SECRET: "test-only-not-a-real-secret",
    SPECIFICATION_SENDER_EMAIL: "sender@example.com",
    SPECIFICATION_DOWNLOAD_URL: "https://example.com/specification.pdf",
  };
  let previousEnvironment: Record<string, string | undefined>;
  let previousFetch: typeof neonConfig.fetchFunction;
  let queries: { query: string; params: unknown[] }[];
  let rows: unknown[][];
  let fields: { name: string; dataTypeID: number }[];

  test.beforeEach(() => {
    previousEnvironment = Object.fromEntries(
      Object.keys(environment).map((key) => [key, process.env[key]]),
    );
    Object.assign(process.env, environment);
    previousFetch = neonConfig.fetchFunction;
    queries = [];
    rows = [];
    fields = [{ name: "email_key", dataTypeID: 25 }];
    neonConfig.fetchFunction = async (_url: string, options: RequestInit) => {
      if (typeof options.body !== "string") throw new Error("Expected Neon query body.");
      const body = JSON.parse(options.body);
      queries.push(body);
      return Response.json({ fields, rows, rowCount: rows.length, command: "SELECT" });
    };
  });

  test.afterEach(() => {
    neonConfig.fetchFunction = previousFetch;
    for (const [key, value] of Object.entries(previousEnvironment)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  const record = {
    ...details,
    rowKey: "a".repeat(64),
    version: "33333333-3333-3333-3333-333333333333",
    requestedAt: "2026-10-16T12:00:00.000Z",
    status: "pending" as const,
  };

  test("maps real Postgres timestamp results and preserves the stored version", async () => {
    fields = [
      { name: "rowKey", dataTypeID: 25 }, { name: "version", dataTypeID: 2950 },
      ...["name", "organization", "title", "email", "source"].map(
        (name) => ({ name, dataTypeID: 25 }),
      ),
      { name: "requestedAt", dataTypeID: 1184 }, { name: "status", dataTypeID: 25 },
    ];
    rows = [[record.rowKey, record.version, details.name, details.organization,
      details.title, details.email, details.source, "2026-10-16 12:00:00+00", "pending"]];
    expect(await createRequestServices().get(record.rowKey)).toEqual(record);
    expect(queries[0].params).toEqual([record.rowKey]);
  });

  test("returns undefined only for a missing record", async () => {
    expect(await createRequestServices().get(record.rowKey)).toBeUndefined();
  });

  test("parameterizes form data and uses an atomic version-checked upsert", async () => {
    rows = [[record.rowKey]];
    const maliciousName = "Alex'); DROP TABLE specification_requests; --";
    expect(await createRequestServices().reserve({ ...record, name: maliciousName })).toBe(true);
    expect(queries[0].query).toContain("ON CONFLICT (email_key) DO UPDATE");
    expect(queries[0].query).toMatch(/WHERE specification_requests\.version = \$\d+::uuid/);
    expect(queries[0].query).not.toContain(maliciousName);
    expect(queries[0].params).toContain(maliciousName);
    expect(queries[0].params.at(-1)).toBeNull();
  });

  test("passes the previous version and reports lost reservations", async () => {
    expect(await createRequestServices().reserve(record, record.version)).toBe(false);
    expect(queries[0].params.at(-1)).toBe(record.version);
  });

  test("guards status updates against stale workers", async () => {
    await expect(createRequestServices().update(record)).rejects.toThrow("changed");
    expect(queries[0].query).toMatch(/AND version = \$\d+::uuid/);
    expect(queries[0].params).toContain(record.version);
    rows = [[record.rowKey]];
    await expect(createRequestServices().update({
      ...record, status: "accepted", emailAcceptedAt: record.requestedAt,
    })).resolves.toBeUndefined();
    expect(queries[1].params).toContain("accepted");
    expect(queries[1].params).toContain(record.requestedAt);
  });

  test("rejects incomplete Microsoft 365 configuration before external calls", () => {
    delete process.env.AZURE_CLIENT_SECRET;
    expect(() => createRequestServices()).toThrow("configuration is incomplete");
    expect(queries).toEqual([]);
  });
});
