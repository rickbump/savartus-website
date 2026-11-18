import { cloutilityConfig } from "./config";

// Server-side client for the Cloutility REST API. Request shapes follow the
// instance's own reference: https://portal-api.savartus.com/v1/help
// (each function names the help page it implements).
//
// Operational requirements (Administrator's manual §9.3, §9.5):
//  - This site's origin must be registered under "API access" and its client
//    ID used here; every call sends that Origin header.
//  - "ClientIpSecurity" binds tokens to the caller's IP. The outbound IP of
//    this server must be stable and listed in the API's api:HostWhiteList.
//
// The API serializes with JSON.NET, which matches property names without
// regard to case on input. Responses are read through `field()` so either
// casing works. Related objects are referenced by `{ id }`.

export class CloutilityError extends Error {
  status: number;
  // Top of Cloutility's server-side stack trace, for logs only (it names the
  // failing service and line, e.g. "ORainBucketSvc.cs:line 563").
  serverStack?: string;

  constructor(message: string, status: number, serverStack?: string) {
    super(message);
    this.status = status;
    this.serverStack = serverStack;
  }
}

type Json = Record<string, unknown>;

// Reads a property by name regardless of casing (id / Id).
export function field<T = unknown>(object: unknown, name: string): T | undefined {
  if (!object || typeof object !== "object") return undefined;
  const record = object as Json;
  if (name in record) return record[name] as T;
  const match = Object.keys(record).find((key) => key.toLowerCase() === name.toLowerCase());
  return match === undefined ? undefined : (record[match] as T);
}

function idOf(object: unknown): number {
  const id = Number(field(object, "id"));
  if (!Number.isInteger(id) || id <= 0) throw new CloutilityError("Cloutility response had no id", 502);
  return id;
}

type Token = { accessToken: string; expiresAt: number };
let token: Token | undefined;

async function getToken(): Promise<string> {
  if (token && token.expiresAt > Date.now() + 60_000) return token.accessToken;

  const config = cloutilityConfig();
  const response = await fetch(`${config.apiUrl}/v1/oauth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: config.origin,
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      grant_type: "password",
      username: config.username,
      password: config.password,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new CloutilityError(`Cloutility sign-in failed (${response.status})`, response.status);
  }
  const data = (await response.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new CloutilityError("Cloutility sign-in returned no token", 502);
  token = {
    accessToken: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 600) * 1000,
  };
  return token.accessToken;
}

async function call<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const config = cloutilityConfig();
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await fetch(`${config.apiUrl}/v1/${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        Origin: config.origin,
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
    if (response.status === 401 && attempt === 0) {
      token = undefined; // expired or revoked; sign in again once
      continue;
    }
    if (!response.ok) {
      // Cloutility error bodies carry a developerMessage (User's manual §11.1.1).
      let detail = "";
      let serverStack: string | undefined;
      try {
        const data = await response.json();
        detail = String(field(data, "developerMessage") ?? field(data, "message") ?? "");
        const trace = field<string>(field(data, "exception"), "StackTraceString");
        if (trace) {
          serverStack = trace
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.startsWith("at CloudPortal."))
            .slice(0, 4)
            .join(" | ");
        }
      } catch {}
      throw new CloutilityError(
        `Cloutility ${method} ${path.split("?")[0]} failed (${response.status})${detail ? `: ${detail}` : ""}`,
        response.status,
        serverStack,
      );
    }
    if (response.status === 204) return undefined as T;
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  }
  throw new CloutilityError("Cloutility authorization failed", 401);
}

async function getOrUndefined<T = unknown>(path: string): Promise<T | undefined> {
  try {
    return await call<T>("GET", path);
  } catch (error) {
    if (error instanceof CloutilityError && error.status === 404) return undefined;
    throw error;
  }
}

function list(value: unknown): Json[] {
  if (Array.isArray(value)) return value as Json[];
  // Some list endpoints wrap results ({ items: [...] }).
  const items = field<unknown[]>(value, "items") ?? field<unknown[]>(value, "data");
  return Array.isArray(items) ? (items as Json[]) : [];
}

const ref = (id: number) => ({ id });

// --- Lookups used to fill required references -------------------------------

// GET v1/me — the service account; its language is reused for customer users.
export function getMe() {
  return call<Json>("GET", "me");
}

// GET v1/bunits/{bunitId}
export function getBusinessUnit(bunitId: number) {
  return call<Json>("GET", `bunits/${bunitId}`);
}

// GET v1/billingcycles — the monthly cycle is the one with Months = 1.
export async function monthlyBillingCycleId() {
  const cycles = list(await call("GET", "billingcycles"));
  const monthly = cycles.find((cycle) => Number(field(cycle, "months")) === 1);
  if (!monthly) throw new CloutilityError("No monthly billing cycle found in Cloutility", 500);
  return idOf(monthly);
}

// GET v1/bunits/{bunitId}/subscriptions/{subscriptionId} — the contract must use
// the subscription's currency (User's manual §5.2), so it is copied from here.
export async function subscriptionCurrency(bunitId: number, subscriptionId: number) {
  const subscription = await call("GET", `bunits/${bunitId}/subscriptions/${subscriptionId}`);
  const currency = field(subscription, "currency");
  if (!currency) throw new CloutilityError(`Subscription ${subscriptionId} has no currency`, 500);
  return { id: idOf(currency) };
}

// --- Business unit and contract ----------------------------------------------

// GET v1/bunits/{bunitId}/bunits
export async function findChildBusinessUnit(parentId: number, name: string) {
  const children = list(await call("GET", `bunits/${parentId}/bunits`));
  const match = children.find((child) => field(child, "name") === name);
  return match ? idOf(match) : undefined;
}

// POST v1/bunits/{bunitId}/bunits — Name, TimeZone and Contract are required,
// so the contract (with the tier subscription and our ERP reference, which is
// how billing data is matched back to the account) is created with the unit.
export async function createChildBusinessUnit(
  parentId: number,
  unit: {
    name: string;
    timeZone: unknown;
    erpReference: string;
    subscriptionId: number;
    billingCycleId: number;
    currency: { id: number };
    startDate: string;
  },
) {
  const config = cloutilityConfig();
  const created = await call("POST", `bunits/${parentId}/bunits`, {
    name: unit.name,
    timeZone: unit.timeZone,
    contract: {
      billingCycle: ref(unit.billingCycleId),
      currency: unit.currency,
      billingStartDate: unit.startDate,
      erpReference: unit.erpReference,
      paymentTerms: ref(config.paymentTermsId),
      subscriptions: [ref(unit.subscriptionId)],
    },
  });
  return idOf(created);
}

// GET v1/bunits/{bunitId}/contract
export async function getContractErpReference(bunitId: number) {
  const contract = await getOrUndefined(`bunits/${bunitId}/contract`);
  return field<string>(contract, "erpReference") || undefined;
}

// POST v1/bunits/{bunitId}/contract — only used if a unit exists without one.
export async function createContract(
  bunitId: number,
  contract: { erpReference: string; subscriptionId: number; billingCycleId: number; currency: { id: number }; startDate: string },
) {
  const config = cloutilityConfig();
  await call("POST", `bunits/${bunitId}/contract`, {
    billingCycle: ref(contract.billingCycleId),
    currency: contract.currency,
    billingStartDate: contract.startDate,
    erpReference: contract.erpReference,
    paymentTerms: ref(config.paymentTermsId),
    subscriptions: [ref(contract.subscriptionId)],
  });
}

// --- Portal user --------------------------------------------------------------

// GET v1/search/users?searchTerm= — whether any portal login the service
// account can see already uses this email. Cloutility allows an email on only
// one login system-wide, so signup checks this before payment.
export async function emailHasLogin(email: string) {
  const users = list(await call("GET", `search/users?searchTerm=${encodeURIComponent(email)}`));
  return users.some((user) => String(field(user, "email") ?? "").toLowerCase() === email.toLowerCase());
}

// GET v1/bunits/{bunitId}/users
export async function findUserByEmail(bunitId: number, email: string) {
  const users = list(await call("GET", `bunits/${bunitId}/users`));
  const match = users.find((user) => String(field(user, "email") ?? "").toLowerCase() === email.toLowerCase());
  return match ? idOf(match) : undefined;
}

// POST v1/bunits/{bunitId}/users?appUrl=&welcomeUrl= — with no password in the
// body, Cloutility emails a password-creation link (welcomeUrl + a token).
export async function createUser(
  bunitId: number,
  user: { name: string; email: string; phone: string | null; language: unknown },
) {
  const config = cloutilityConfig();
  const query = new URLSearchParams({ appUrl: config.portalUrl, welcomeUrl: config.welcomeUrl });
  const created = await call("POST", `bunits/${bunitId}/users?${query}`, {
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    role: ref(config.customerRoleId),
    language: user.language,
    // Required even when empty: without it Cloutility fails with a 500
    // "The given key was not present in the dictionary" before validating.
    userIdentities: [],
  });
  return idOf(created);
}

// --- S3 Optical (oRain) -------------------------------------------------------

// GET v1/bunits/{bunitId}/orainusers — own (non-inherited) users only.
export async function findOrainUser(bunitId: number, userName: string) {
  const users = list(await call("GET", `bunits/${bunitId}/orainusers`));
  const match = users.find((user) => field(user, "userName") === userName && !field(user, "inherited"));
  return match ? idOf(match) : undefined;
}

// POST v1/bunits/{bunitId}/orainusers — holds the S3 access key and secret the
// customer views or renews in the portal (User's manual §5.13.3).
export async function createOrainUser(bunitId: number, user: { name: string; userName: string; email: string }) {
  const config = cloutilityConfig();
  const created = await call("POST", `bunits/${bunitId}/orainusers`, {
    name: user.name,
    userName: user.userName,
    email: user.email,
    defaultPreset: ref(config.bucketPresetId),
    server: config.orainServerId ? ref(config.orainServerId) : undefined,
  });
  return idOf(created);
}

// GET v1/bunits/{bunitId}/consumers
export async function findConsumer(bunitId: number, externalReference: string) {
  const consumers = list(await call("GET", `bunits/${bunitId}/consumers`));
  const match = consumers.find((consumer) => field(consumer, "externalReference") === externalReference);
  return match ? idOf(match) : undefined;
}

// POST v1/bunits/{bunitId}/consumers — the consumption unit the bucket's
// storage is reported and billed on.
export async function createConsumer(
  bunitId: number,
  consumer: { name: string; externalReference: string; billingStartDate: string },
) {
  const created = await call("POST", `bunits/${bunitId}/consumers`, consumer);
  return idOf(created);
}

// GET v1/bunits/{bunitId}/consumers/{consumerId}/orainbucket — Cloutility
// answers 409 "No ORain bucket was related to the given consumption unit"
// (not 404) when the consumer has no bucket yet.
export async function getOrainBucket(bunitId: number, consumerId: number) {
  try {
    return await getOrUndefined(`bunits/${bunitId}/consumers/${consumerId}/orainbucket`);
  } catch (error) {
    if (error instanceof CloutilityError && error.status === 409 && /no orain bucket/i.test(error.message)) {
      return undefined;
    }
    throw error;
  }
}

// GET v1/bunits/{bunitId}/consumers/{consumerId}/suggestedbucketname
export async function suggestedBucketName(bunitId: number, consumerId: number) {
  const value = await getOrUndefined<unknown>(`bunits/${bunitId}/consumers/${consumerId}/suggestedbucketname`);
  const name = typeof value === "string" ? value : field<string>(value, "name");
  return name || undefined;
}

// Bucket settings a preset defines. The API does not apply a referenced preset's
// values the way the portal's form does (it rejects the bucket with "Minimum
// burn capacity must be greater than 0"), so they are copied into the request.
const PRESET_SETTINGS = [
  "burnMode",
  "burnType",
  "burnCron",
  "cleanType",
  "cleanCron",
  "raidType",
  "discType",
  "minBurnCapacityGB",
  "allowLogicalDiscAdjustment",
  "retainDiscAfterMigration",
  "delayedArchivingDays",
  "enableDelayedArchive",
  "versioningState",
];

// Drops links, operation lists and the oRain session tokens Cloutility embeds
// in server objects before an object is sent back in a request.
function withoutNoise(object: unknown): Json {
  return JSON.parse(
    JSON.stringify(object, (key, value) =>
      ["href", "operations", "actions", "token", "accessToken", "sessionId"].includes(key) ? undefined : value,
    ),
  );
}

// GET v1/bunits/{bunitId}/orainbucketpresets/{presetId}
async function bucketPreset() {
  const config = cloutilityConfig();
  const preset = withoutNoise(
    await call("GET", `bunits/${config.parentBunitId}/orainbucketpresets/${config.bucketPresetId}`),
  );
  const settings: Json = {};
  for (const name of PRESET_SETTINGS) {
    const value = field(preset, name);
    if (value !== undefined && value !== null) settings[name] = value;
  }
  if (!(Number(settings.minBurnCapacityGB) > 0)) {
    throw new CloutilityError(`Bucket preset ${config.bucketPresetId} has no minimum burn capacity`, 500);
  }
  return { preset, settings };
}

// GET v1/bunits/{bunitId}/orainmagazinefilters and .../orainmagazines — the
// magazines staff enabled for self-service under the parent's S3 Optical >
// Magazine filter. Every bucket must name its magazines.
async function selfServiceMagazines(bunitId: number) {
  const config = cloutilityConfig();
  const filters = list(await call("GET", `bunits/${config.parentBunitId}/orainmagazinefilters?offset=0&limit=1000`));
  const enabled = new Set(
    filters.filter((filter) => field(filter, "enabled") === true).map((filter) => idOf(field(filter, "magazine"))),
  );
  if (!enabled.size) {
    throw new CloutilityError(
      `No magazines are enabled in the S3 Optical magazine filter of business unit ${config.parentBunitId}`,
      500,
    );
  }
  const magazines = list(await call("GET", `bunits/${bunitId}/orainmagazines?offset=0&limit=1000`))
    .filter((magazine) => enabled.has(idOf(magazine)))
    .map(withoutNoise);
  if (magazines.length !== enabled.size) {
    throw new CloutilityError(`Business unit ${bunitId} cannot see every enabled self-service magazine`, 500);
  }
  return magazines;
}

// POST v1/bunits/{bunitId}/consumers/{consumerId}/orainbucket — burn mode, disc
// type, RAID and retention come from the preset; magazines from the filter.
// The S3 user (and magazines) must be sent as the full objects read from the
// API: with only `{ id }` references Cloutility's validation fails with a 500
// "Object reference not set to an instance of an object".
export async function createOrainBucket(
  bunitId: number,
  consumerId: number,
  bucket: { name: string; orainUserId: number },
) {
  const config = cloutilityConfig();
  const { preset, settings } = await bucketPreset();
  const user = withoutNoise(await call("GET", `bunits/${bunitId}/orainusers/${bucket.orainUserId}`));
  await call("POST", `bunits/${bunitId}/consumers/${consumerId}/orainbucket`, {
    ...settings,
    name: bucket.name,
    preset,
    magazines: await selfServiceMagazines(bunitId),
    users: [user],
    server: config.orainServerId ? ref(config.orainServerId) : undefined,
  });
}

// --- Billing data ------------------------------------------------------------
// Cloutility's billing-data "Post URL" only sends a notification
// ({"trigger":"new billing data available"}), so the data itself is read here.
// Requires Settings/Billing data View on the service account's role.

// GET v1/bunits/{bunitId}/billing — billing runs already generated.
export async function latestBillingDate(bunitId: number) {
  const runs = list(await call("GET", `bunits/${bunitId}/billing`));
  const dates = runs.map((run) => String(field(run, "invoiceDate") ?? "").slice(0, 10)).filter(Boolean);
  return dates.sort().at(-1);
}

// GET v1/bunits/{bunitId}/billing/{date}?useForecasting= — a future date
// returns simulated billing data.
export function getBillingData(bunitId: number, date: string, forecast = false) {
  return call<Json>("GET", `bunits/${bunitId}/billing/${date}?useForecasting=${forecast}`);
}

export type BillingDataLine = {
  erpReference: string;
  invoiceDate: string;
  productCode: string;
  quantity: number;
};

// Flattens BillingData > Invoices > Lines (help: ResourceModel Invoice and
// InvoiceLine). The customer is identified by the paying unit's contract ERP
// reference; the product code is Product.ProductCode.Name, falling back to the
// inherited code.
export function billingDataLines(data: unknown): BillingDataLine[] {
  const invoiceDate = String(field(data, "invoiceDate") ?? "").slice(0, 10);
  const codeName = (code: unknown) =>
    typeof code === "string" ? code : (field<string>(code, "name") ?? undefined);
  const lines: BillingDataLine[] = [];
  for (const invoice of list(field(data, "invoices"))) {
    const payer = field(invoice, "payingBusinessUnit");
    const erpReference = field<string>(field(payer, "contract"), "erpReference") ?? "";
    for (const line of list(field(invoice, "lines"))) {
      const product = field(line, "product");
      lines.push({
        erpReference,
        invoiceDate,
        productCode:
          codeName(field(product, "productCode")) ?? codeName(field(product, "inheritedProductCode")) ?? "",
        quantity: Number(field(line, "quantity")),
      });
    }
  }
  return lines;
}
