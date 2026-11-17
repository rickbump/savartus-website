// Creates or updates everything the self-service preservation signup needs in
// Stripe, then prints the environment variables to set. Safe to re-run:
// objects are found by fixed IDs / lookup keys and only changed when needed.
//
//   node --env-file=.env.local scripts/stripe-setup.mjs            # dry run
//   node --env-file=.env.local scripts/stripe-setup.mjs --apply    # make changes
//
// Needs STRIPE_SECRET_KEY and SITE_URL. Prices come from
// scripts/preservation-pricing.json (amounts in whole currency units, e.g. 7.5).
// Each tier's per-TB rate is its monthly amount divided by its TB; usage above
// the plan is billed at that rate by app/api/preservation/billing-data.
// Stripe prices are immutable: a changed amount creates a new price, moves the
// lookup key to it and archives the old one. Existing subscribers keep their
// old price until moved.

import { readFile } from "node:fs/promises";
import Stripe from "stripe";

const apply = process.argv.includes("--apply");
const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
const siteUrl = process.env.SITE_URL?.trim().replace(/\/$/, "");
if (!secretKey) fail("Set STRIPE_SECRET_KEY (use a test-mode sk_test_… key first).");
if (!siteUrl) fail("Set SITE_URL, e.g. https://www.savartus.com");

const pricing = JSON.parse(await readFile(new URL("./preservation-pricing.json", import.meta.url), "utf8"));
const tierIncludedTb = { tb1: 1, tb5: 5, tb10: 10, tb25: 25 };
const missing = [
  ...Object.keys(tierIncludedTb).flatMap((id) =>
    ["monthlyAmount"].filter((key) => !(pricing.tiers?.[id]?.[key] > 0)).map((key) => `tiers.${id}.${key}`)),
];
if (missing.length) fail(`Fill in scripts/preservation-pricing.json: ${missing.join(", ")}`);
const currency = String(pricing.currency || "usd").toLowerCase();

const stripe = new Stripe(secretKey);
const mode = secretKey.startsWith("sk_live_") || secretKey.startsWith("rk_live_") ? "LIVE" : "test";
console.log(`Stripe ${mode} mode — ${apply ? "APPLYING changes" : "dry run (pass --apply to make changes)"}\n`);

const PRODUCT_ID = "savartus_optical_preservation";
const WEBHOOK_URL = `${siteUrl}/api/preservation/stripe-webhook`;
const WEBHOOK_EVENTS = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "invoice.paid",
  "invoice.payment_failed",
  "customer.subscription.deleted",
];
const env = {};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function cents(amount) {
  return Math.round(amount * 100);
}

async function step(description, action) {
  console.log(`${apply ? "•" : "would"} ${description}`);
  return apply ? action() : undefined;
}

// 1. Product
try {
  await stripe.products.retrieve(PRODUCT_ID);
  console.log(`✓ product ${PRODUCT_ID} exists`);
} catch (error) {
  if (error?.statusCode !== 404) throw error;
  await step(`create product ${PRODUCT_ID}`, () =>
    stripe.products.create({
      id: PRODUCT_ID,
      name: "Optical Preservation",
      description: "S3-accessible preservation on write-once optical media.",
      metadata: { managedBy: "corp_web/scripts/stripe-setup.mjs" },
    }));
}

// Finds the active price for a lookup key; replaces it if the amount changed.
async function ensurePrice(lookupKey, amount, params, label) {
  const [existing] = (await stripe.prices.list({ lookup_keys: [lookupKey] })).data;
  if (existing && existing.active && existing.unit_amount === cents(amount) && existing.currency === currency) {
    console.log(`✓ ${label} price ${existing.id} (${amount} ${currency})`);
    return existing.id;
  }
  const created = await step(
    `${existing ? `replace ${label} price ${existing.id} →` : `create ${label} price`} ${amount} ${currency}`,
    () =>
      stripe.prices.create({
        product: PRODUCT_ID,
        currency,
        unit_amount: cents(amount),
        lookup_key: lookupKey,
        transfer_lookup_key: Boolean(existing),
        ...params,
      }),
  );
  if (created && existing?.active) await stripe.prices.update(existing.id, { active: false });
  return created?.id ?? existing?.id ?? "(created on --apply)";
}

// 2. Committed-capacity prices, one per tier
for (const [id, includedTb] of Object.entries(tierIncludedTb)) {
  env[`STRIPE_PRICE_${id.toUpperCase()}`] = await ensurePrice(
    `preservation_${id}_monthly`,
    pricing.tiers[id].monthlyAmount,
    {
      nickname: `${includedTb} TB committed`,
      recurring: { interval: "month", usage_type: "licensed" },
      metadata: { tier: id, includedTb: String(includedTb) },
    },
    `${includedTb} TB tier`,
  );
}

// 3. Webhook endpoint
const endpoints = await stripe.webhookEndpoints.list({ limit: 100 });
const endpoint = endpoints.data.find((item) => item.url === WEBHOOK_URL);
if (endpoint) {
  const missingEvents = WEBHOOK_EVENTS.filter((event) => !endpoint.enabled_events.includes(event) && !endpoint.enabled_events.includes("*"));
  if (missingEvents.length) {
    await step(`add events to webhook ${endpoint.id}: ${missingEvents.join(", ")}`, () =>
      stripe.webhookEndpoints.update(endpoint.id, { enabled_events: [...endpoint.enabled_events, ...missingEvents] }));
  } else {
    console.log(`✓ webhook ${endpoint.id} → ${WEBHOOK_URL}`);
  }
  if (endpoint.api_version && endpoint.api_version !== Stripe.API_VERSION) {
    console.warn(`! webhook ${endpoint.id} uses API version ${endpoint.api_version}; the site expects ${Stripe.API_VERSION}. Delete it and re-run to recreate it pinned.`);
  }
  env.STRIPE_WEBHOOK_SECRET = "(unchanged — the signing secret is only shown when created; copy it from the Dashboard if needed)";
} else {
  const created = await step(`create webhook → ${WEBHOOK_URL}`, () =>
    stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      // Match the SDK so event payloads have the shape the handler's types expect.
      api_version: Stripe.API_VERSION,
      enabled_events: WEBHOOK_EVENTS,
      description: "Savartus self-service optical preservation",
      metadata: { managedBy: "corp_web/scripts/stripe-setup.mjs" },
    }));
  env.STRIPE_WEBHOOK_SECRET = created?.secret ?? "(created on --apply)";
}

// 4. Customer portal: cards, invoices, billing details. Cancellation and plan
//    changes stay off — preservation contracts are changed with Savartus staff.
const portalSettings = {
  business_profile: {
    headline: "Savartus Optical Preservation billing",
    privacy_policy_url: pricing.privacyPolicyUrl || undefined,
    terms_of_service_url: pricing.termsUrl || undefined,
  },
  features: {
    customer_update: { enabled: true, allowed_updates: ["email", "address", "name", "phone", "tax_id"] },
    invoice_history: { enabled: true },
    payment_method_update: { enabled: true },
    subscription_cancel: { enabled: false },
    subscription_update: { enabled: false },
  },
  login_page: { enabled: true },
  metadata: { managedBy: "corp_web/scripts/stripe-setup.mjs" },
};
const portal = (await stripe.billingPortal.configurations.list({ limit: 100 })).data.find(
  (item) => item.metadata?.managedBy === portalSettings.metadata.managedBy,
);
const portalConfig = portal
  ? await step(`update customer portal ${portal.id}`, () => stripe.billingPortal.configurations.update(portal.id, portalSettings))
  : await step("create customer portal configuration", () => stripe.billingPortal.configurations.create(portalSettings));
const loginUrl = portalConfig?.login_page?.url ?? portal?.login_page?.url;

console.log("\nEnvironment variables:\n");
for (const [key, value] of Object.entries(env)) console.log(`${key}=${value}`);
if (loginUrl) console.log(`STRIPE_PORTAL_LOGIN_URL=${loginUrl}`);
if (!apply) console.log("\nNothing was changed. Re-run with --apply.");
