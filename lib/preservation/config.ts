import type { Tier } from "./tiers";

export class ConfigError extends Error {}

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new ConfigError(`Missing environment variable ${name}`);
  return value;
}

function requiredInt(name: string): number {
  const value = Number(required(name));
  if (!Number.isInteger(value) || value <= 0) {
    throw new ConfigError(`Environment variable ${name} must be a positive integer`);
  }
  return value;
}

// Self-service signup stays hidden until PRESERVATION_SIGNUP_ENABLED=true
// (read at build time for static pages, so redeploy after changing it).
export function signupEnabled() {
  return process.env.PRESERVATION_SIGNUP_ENABLED?.trim().toLowerCase() === "true";
}

export function databaseUrl() {
  return required("DATABASE_URL");
}

// Public address of this site, for links in emails and Stripe redirects.
export function siteUrl() {
  return (process.env.SITE_URL?.trim() || "https://www.savartus.com").replace(/\/$/, "");
}

// Read separately so price lookups and billing don't need the webhook secret.
export function stripeSecretKey() {
  return required("STRIPE_SECRET_KEY");
}

export function stripeWebhookSecret() {
  return required("STRIPE_WEBHOOK_SECRET");
}

export function tierStripePrice(tier: Tier) {
  return required(tier.stripePriceEnv);
}

export function tierCloutilitySubscription(tier: Tier) {
  return requiredInt(tier.cloutilitySubscriptionEnv);
}

export function cloutilityConfig() {
  return {
    // Public API URL, e.g. https://api.savartus.com (no trailing /v1).
    apiUrl: required("CLOUTILITY_API_URL").replace(/\/$/, ""),
    // Client ID of the application registered under "API access" for this site,
    // and the origin registered with it. Cloutility rejects calls whose Origin
    // header does not match a registered application.
    clientId: required("CLOUTILITY_CLIENT_ID"),
    origin: required("CLOUTILITY_ORIGIN"),
    // Dedicated service account on the self-service parent business unit.
    username: required("CLOUTILITY_USERNAME"),
    password: required("CLOUTILITY_PASSWORD"),
    // Parent business unit every self-service customer is created under.
    parentBunitId: requiredInt("CLOUTILITY_SELF_SERVICE_BUNIT_ID"),
    // Role given to the customer's portal user.
    customerRoleId: requiredInt("CLOUTILITY_CUSTOMER_ROLE_ID"),
    // S3 Optical (oRain) bucket preset that fixes library, magazine and retention.
    bucketPresetId: requiredInt("CLOUTILITY_ORAIN_BUCKET_PRESET_ID"),
    // Cloutility web-app URL customers sign in to (appUrl in activation emails).
    portalUrl: required("CLOUTILITY_PORTAL_URL").replace(/\/$/, ""),
    // The portal's account activation (set password) page; Cloutility appends
    // the token to it in the activation email. The portal's own /welcome page
    // takes it; the bare portal URL only shows the sign-in screen.
    welcomeUrl: (process.env.CLOUTILITY_WELCOME_URL?.trim() || `${required("CLOUTILITY_PORTAL_URL").replace(/\/$/, "")}/welcome`).replace(/\/$/, ""),
    // oRain server for S3 users and buckets. Leave unset when the parent
    // business unit (or the preset) already determines the server.
    orainServerId: process.env.CLOUTILITY_ORAIN_SERVER_ID
      ? requiredInt("CLOUTILITY_ORAIN_SERVER_ID")
      : undefined,
    // Payment terms every contract must name (User's manual §5.11), e.g.
    // "Paid by card (Stripe)" defined on the system owner business unit.
    paymentTermsId: requiredInt("CLOUTILITY_PAYMENT_TERMS_ID"),
    // Product code of the total-storage product in the tier subscriptions;
    // billing-data lines with this code carry the package count.
    storageProductCode: required("CLOUTILITY_STORAGE_PRODUCT_CODE"),
  };
}

// Shared secret appended to the billing-data Post URL configured in Cloutility.
export function billingWebhookToken() {
  return required("CLOUTILITY_BILLING_WEBHOOK_TOKEN");
}

// The public S3 endpoint of the optical library (MinIO in front of oRain) and
// its signing region. Customers use the same values in their S3 software.
export function s3Settings() {
  return {
    endpoint: (process.env.PRESERVATION_S3_ENDPOINT?.trim() || "https://portal.savartus.com:9080").replace(/\/$/, ""),
    region: process.env.PRESERVATION_S3_REGION?.trim() || "us-east-2",
  };
}
