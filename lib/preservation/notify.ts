import { ClientSecretCredential } from "@azure/identity";
import type { Account } from "./accounts";
import { findTier } from "./tiers";

// Emails for the self-service preservation service, sent through Microsoft
// Graph with the same app registration as the specification emails
// (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET; the app needs the
// Mail.Send application permission for the sender mailbox).
//
// Sending is best-effort: a missing configuration or a Graph failure is logged
// and never fails provisioning or billing.

function mailConfig() {
  const tenantId = process.env.AZURE_TENANT_ID?.trim();
  const clientId = process.env.AZURE_CLIENT_ID?.trim();
  const clientSecret = process.env.AZURE_CLIENT_SECRET?.trim();
  const sender = (process.env.PRESERVATION_SENDER_EMAIL || process.env.SPECIFICATION_SENDER_EMAIL)?.trim();
  if (!tenantId || !clientId || !clientSecret || !sender) return undefined;
  return {
    credential: new ClientSecretCredential(tenantId, clientId, clientSecret),
    sender,
    // Staff mailbox for alerts and a copy of customer emails.
    staff: process.env.PRESERVATION_STAFF_EMAIL?.trim() || undefined,
  };
}

let config: ReturnType<typeof mailConfig> | null = null;

async function send(message: { to: string; subject: string; lines: string[]; copyStaff?: boolean }) {
  config ??= mailConfig();
  if (!config) {
    console.warn("Preservation email not sent: mail settings are incomplete", { subject: message.subject });
    return false;
  }
  try {
    const token = await config.credential.getToken("https://graph.microsoft.com/.default");
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.sender)}/sendMail`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          message: {
            subject: message.subject,
            body: { contentType: "Text", content: message.lines.join("\n") },
            toRecipients: [{ emailAddress: { address: message.to } }],
            bccRecipients:
              message.copyStaff && config.staff && config.staff !== message.to
                ? [{ emailAddress: { address: config.staff } }]
                : [],
          },
        }),
        signal: AbortSignal.timeout(15_000),
      },
    );
    if (response.status !== 202) throw new Error(`Graph sendMail returned ${response.status}`);
    return true;
  } catch (error) {
    console.error("Preservation email failed", {
      subject: message.subject,
      type: error instanceof Error ? error.message : "UnknownError",
    });
    return false;
  }
}

function site() {
  return (process.env.SITE_URL ?? "https://www.savartus.com").replace(/\/$/, "");
}

function portal() {
  return (process.env.CLOUTILITY_PORTAL_URL ?? "").replace(/\/$/, "");
}

// Sent when provisioning finishes. Cloutility separately sends the portal
// activation (password creation) email.
export function sendWelcomeEmail(account: Account, bucketName: string | undefined) {
  const endpoint = process.env.PRESERVATION_S3_ENDPOINT?.trim();
  const tier = findTier(account.tier);
  return send({
    to: account.email,
    copyStaff: true,
    subject: "Your Savartus optical preservation space is ready",
    lines: [
      `Hello ${account.name},`,
      "",
      `Your optical preservation space for ${account.organization} is ready${tier ? ` on the ${tier.label} plan` : ""}.`,
      "",
      "1. Activate your portal login",
      "   You will receive a separate email from the Savartus portal with a link to create your",
      `   password. After that, sign in at ${portal() || "the Savartus portal"}.`,
      "",
      "2. Create your S3 access key",
      "   In the portal, click the gear icon, open S3 Optical > User accounts, select your account",
      `   (pres-${account.id.slice(0, 8)}), and click "Renew secret". Copy the access key and secret`,
      "   and store them somewhere safe; the secret is not shown again.",
      "",
      "3. Connect your S3 client",
      endpoint ? `   Endpoint: ${endpoint}` : "   Endpoint: we will send your S3 endpoint address separately.",
      bucketName ? `   Bucket:   ${bucketName}` : "   Bucket:   shown under Consumption units in the portal.",
      "",
      `Step-by-step instructions and client examples: ${site()}/preservation/getting-started`,
      "",
      `Billing, cards, and invoices are managed through Stripe; reply to this email if you need help.`,
      "",
      "The Savartus team",
    ],
  });
}

// Sent when monthly usage moves the account to the next plan.
export function sendUpgradeEmail(account: Account, fromTierId: string, toTierId: string, usedTb: number) {
  const from = findTier(fromTierId)?.label ?? fromTierId;
  const to = findTier(toTierId)?.label ?? toTierId;
  return send({
    to: account.email,
    copyStaff: true,
    subject: `Your preservation plan has moved to ${to}`,
    lines: [
      `Hello ${account.name},`,
      "",
      `Last month ${account.organization} stored ${usedTb} TB, which reached the ${to} plan.`,
      `Your account has moved from the ${from} plan to the ${to} plan, so all of your storage is now`,
      "billed at that plan's lower per-TB rate. Your next invoice shows the adjustment for last",
      "month, and the new plan applies from your next billing period.",
      "",
      "Plans never move down, because preserved data is written once to optical media.",
      "",
      `Pricing details: ${site()}/preservation/signup`,
      "",
      "The Savartus team",
    ],
  });
}

// Staff alert for an account that needs attention. Never includes credentials.
export function sendStaffAlert(account: Pick<Account, "id" | "organization" | "email">, subject: string, details: string[]) {
  config ??= mailConfig();
  if (!config?.staff) {
    console.warn("Preservation staff alert not sent: PRESERVATION_STAFF_EMAIL is not set", { subject });
    return Promise.resolve(false);
  }
  return send({
    to: config.staff,
    subject: `[Preservation] ${subject}: ${account.organization}`,
    lines: [
      `Account: ${account.id}`,
      `Organization: ${account.organization}`,
      `Customer email: ${account.email}`,
      "",
      ...details,
      "",
      "Runbook: docs/preservation-self-service.md",
    ],
  });
}
