import { neon } from "@neondatabase/serverless";
import { databaseUrl } from "./config";

export type AccountStatus =
  | "pending_payment"
  | "paid"
  | "provisioning"
  | "active"
  | "failed"
  | "past_due"
  | "canceled";

export type Account = {
  id: string;
  status: AccountStatus;
  tier: string;
  included_tb: number;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  use_case: string | null;
  tax_exempt_status: "none" | "requested" | "approved" | "declined";
  tax_exempt_type: string | null;
  tax_exempt_state: string | null;
  tax_exempt_number: string | null;
  tax_certificate_file_id: string | null;
  stripe_checkout_session_id: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  cloutility_bunit_id: number | null;
  cloutility_contract_erp_reference: string | null;
  cloutility_user_id: number | null;
  cloutility_orain_user_id: number | null;
  cloutility_consumer_id: number | null;
  cloutility_bucket_created: boolean;
  paid_at: string | null;
  provisioning_attempts: number;
  last_error: string | null;
};

// The organization if one was given at signup, otherwise the person's name.
// Used wherever the account needs a name: Cloutility, Stripe, emails.
export function accountName(account: Pick<Account, "organization" | "name">) {
  return account.organization?.trim() || account.name;
}

// After this many attempts the retry job stops and the account waits for
// staff. Staff resume it by resetting provisioning_attempts to 0.
export const MAX_PROVISIONING_ATTEMPTS = 8;

export function db() {
  return neon(databaseUrl());
}

export async function insertPendingAccount(account: {
  id: string;
  tier: string;
  includedTb: number;
  name: string;
  organization: string | null;
  email: string;
  phone: string | null;
  useCase: string;
  exemption: { type: string; state: string; number: string | null } | null;
}) {
  const exemption = account.exemption;
  await db()`
    INSERT INTO preservation_accounts
      (id, status, tier, included_tb, name, organization, email, phone, terms_accepted_at,
       use_case, tax_exempt_status, tax_exempt_type, tax_exempt_state, tax_exempt_number)
    VALUES
      (${account.id}, 'pending_payment', ${account.tier}, ${account.includedTb}, ${account.name},
       ${account.organization}, ${account.email}, ${account.phone}, NOW(),
       ${account.useCase}, ${exemption ? "requested" : "none"}, ${exemption?.type ?? null},
       ${exemption?.state ?? null}, ${exemption?.number ?? null})
  `;
}

export async function attachCheckoutSession(id: string, sessionId: string) {
  await db()`
    UPDATE preservation_accounts
    SET stripe_checkout_session_id = ${sessionId}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

export async function markPaid(id: string, sessionId: string, customerId: string, subscriptionId: string) {
  const rows = await db()`
    UPDATE preservation_accounts
    SET status = 'paid', stripe_customer_id = ${customerId},
        stripe_subscription_id = ${subscriptionId}, paid_at = NOW(), updated_at = NOW()
    WHERE id = ${id} AND stripe_checkout_session_id = ${sessionId} AND status = 'pending_payment'
    RETURNING id
  `;
  return rows.length > 0;
}

// Whether a signup with this email has already paid (abandoned checkouts don't count).
export async function emailHasAccount(email: string) {
  const rows = await db()`
    SELECT 1 FROM preservation_accounts
    WHERE lower(email) = lower(${email}) AND status <> 'pending_payment'
    LIMIT 1
  `;
  return rows.length > 0;
}

// An exempt signup's Stripe customer (created as tax exempt) and certificate.
export async function attachExemptCustomer(id: string, customerId: string, certificateFileId: string) {
  await db()`
    UPDATE preservation_accounts
    SET stripe_customer_id = ${customerId}, tax_certificate_file_id = ${certificateFileId}, updated_at = NOW()
    WHERE id = ${id}
  `;
}

// Staff decision after reviewing a paid exempt signup. "declined" means the
// exemption was revoked and the customer is taxed from now on.
export async function decideTaxExemption(id: string, decision: "approved" | "declined") {
  const rows = await db()`
    UPDATE preservation_accounts
    SET tax_exempt_status = ${decision}, tax_exempt_reviewed_at = NOW(), updated_at = NOW()
    WHERE id = ${id} AND tax_exempt_status IN ('requested', 'approved')
    RETURNING *
  `;
  return rows[0] as Account | undefined;
}

// Paid signups whose exemption hasn't been reviewed yet.
export async function exemptionRequests() {
  const rows = await db()`
    SELECT * FROM preservation_accounts
    WHERE tax_exempt_status = 'requested' AND status <> 'pending_payment'
    ORDER BY paid_at
  `;
  return rows as Account[];
}

// Takes the provisioning claim so only one run works on an account at a time.
// A claim older than 15 minutes is treated as abandoned (crashed run).
export async function claimForProvisioning(id: string): Promise<Account | undefined> {
  const rows = await db()`
    UPDATE preservation_accounts
    SET status = 'provisioning', provisioning_started_at = NOW(),
        provisioning_attempts = provisioning_attempts + 1, updated_at = NOW()
    WHERE id = ${id} AND (
      status IN ('paid', 'failed')
      OR (status = 'provisioning' AND provisioning_started_at < NOW() - INTERVAL '15 minutes')
    )
    RETURNING *
  `;
  return rows[0] as Account | undefined;
}

type ProvisioningField =
  | "cloutility_bunit_id"
  | "cloutility_contract_erp_reference"
  | "cloutility_user_id"
  | "cloutility_orain_user_id"
  | "cloutility_consumer_id"
  | "cloutility_bucket_created";

export async function saveStep(id: string, field: ProvisioningField, value: number | string | boolean) {
  const sql = db();
  // Column names cannot be parameters; `field` is limited to the union above.
  const queries: Record<ProvisioningField, () => Promise<unknown>> = {
    cloutility_bunit_id: () => sql`UPDATE preservation_accounts SET cloutility_bunit_id = ${value}, updated_at = NOW() WHERE id = ${id}`,
    cloutility_contract_erp_reference: () => sql`UPDATE preservation_accounts SET cloutility_contract_erp_reference = ${value}, updated_at = NOW() WHERE id = ${id}`,
    cloutility_user_id: () => sql`UPDATE preservation_accounts SET cloutility_user_id = ${value}, updated_at = NOW() WHERE id = ${id}`,
    cloutility_orain_user_id: () => sql`UPDATE preservation_accounts SET cloutility_orain_user_id = ${value}, updated_at = NOW() WHERE id = ${id}`,
    cloutility_consumer_id: () => sql`UPDATE preservation_accounts SET cloutility_consumer_id = ${value}, updated_at = NOW() WHERE id = ${id}`,
    cloutility_bucket_created: () => sql`UPDATE preservation_accounts SET cloutility_bucket_created = ${value}, updated_at = NOW() WHERE id = ${id}`,
  };
  await queries[field]();
}

export async function markActive(id: string) {
  await db()`
    UPDATE preservation_accounts
    SET status = 'active', activated_at = NOW(), last_error = NULL, updated_at = NOW()
    WHERE id = ${id} AND status = 'provisioning'
  `;
}

// `hold` stops automatic retries at once, for errors a retry cannot fix.
export async function markFailed(id: string, error: string, options: { hold?: boolean } = {}) {
  const rows = await db()`
    UPDATE preservation_accounts
    SET status = 'failed', last_error = ${error.slice(0, 1000)}, updated_at = NOW(),
        provisioning_attempts = CASE WHEN ${options.hold ?? false}
          THEN GREATEST(provisioning_attempts, ${MAX_PROVISIONING_ATTEMPTS})
          ELSE provisioning_attempts END
    WHERE id = ${id} AND status = 'provisioning'
    RETURNING provisioning_attempts
  `;
  return rows[0] ? Number(rows[0].provisioning_attempts) : undefined;
}

export async function setStatusBySubscription(subscriptionId: string, status: "active" | "past_due" | "canceled") {
  // Only move between billing states; never interrupt a provisioning run.
  await db()`
    UPDATE preservation_accounts
    SET status = ${status}, updated_at = NOW()
    WHERE stripe_subscription_id = ${subscriptionId}
      AND status IN ('active', 'past_due', 'canceled')
      AND cloutility_bucket_created
  `;
}

export async function accountsNeedingProvisioning(limit = 10) {
  const rows = await db()`
    SELECT id FROM preservation_accounts
    WHERE provisioning_attempts < ${MAX_PROVISIONING_ATTEMPTS} AND (
      status IN ('paid', 'failed')
      OR (status = 'provisioning' AND provisioning_started_at < NOW() - INTERVAL '15 minutes')
    )
    ORDER BY updated_at
    LIMIT ${limit}
  `;
  return rows.map((row) => row.id as string);
}

// Progress shown on the signup confirmation page; looked up by the Stripe
// Checkout session ID in its URL.
export async function accountByCheckoutSession(sessionId: string) {
  const rows = await db()`
    SELECT * FROM preservation_accounts WHERE stripe_checkout_session_id = ${sessionId}
  `;
  return rows[0] as Account | undefined;
}

export async function accountById(id: string) {
  const rows = await db()`SELECT * FROM preservation_accounts WHERE id = ${id}`;
  return rows[0] as Account | undefined;
}

export async function accountByErpReference(erpReference: string) {
  const rows = await db()`
    SELECT * FROM preservation_accounts WHERE cloutility_contract_erp_reference = ${erpReference}
  `;
  return rows[0] as Account | undefined;
}

// Claims a billing line. Returns false if it was already charged.
export async function recordUsageCharge(charge: {
  identifier: string;
  accountId: string;
  invoiceDate: string;
  totalTb: number;
  planTier: string;
  effectiveTier: string;
  amountCents: number;
}) {
  const rows = await db()`
    INSERT INTO preservation_usage_charges
      (identifier, account_id, invoice_date, total_tb, plan_tier, effective_tier, amount_cents)
    VALUES (${charge.identifier}, ${charge.accountId}, ${charge.invoiceDate}, ${charge.totalTb},
            ${charge.planTier}, ${charge.effectiveTier}, ${charge.amountCents})
    ON CONFLICT (identifier) DO NOTHING
    RETURNING identifier
  `;
  return rows.length > 0;
}

export async function forgetUsageCharge(identifier: string) {
  await db()`DELETE FROM preservation_usage_charges WHERE identifier = ${identifier}`;
}

export async function changeTier(id: string, tier: string, includedTb: number) {
  await db()`
    UPDATE preservation_accounts
    SET tier = ${tier}, included_tb = ${includedTb}, updated_at = NOW()
    WHERE id = ${id}
  `;
}
