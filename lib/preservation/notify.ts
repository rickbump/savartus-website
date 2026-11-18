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

type Attachment = { name: string; contentType: string; bytes: Uint8Array };

async function send(message: {
  to: string;
  subject: string;
  lines: string[];
  copyStaff?: boolean;
  attachments?: Attachment[];
}) {
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
            attachments: (message.attachments ?? []).map((file) => ({
              "@odata.type": "#microsoft.graph.fileAttachment",
              name: file.name,
              contentType: file.contentType,
              contentBytes: Buffer.from(file.bytes).toString("base64"),
            })),
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
// activation (password creation) email. Written for someone who has never used
// S3 storage before.
export function sendWelcomeEmail(account: Account, bucketName: string | undefined) {
  const endpoint = process.env.PRESERVATION_S3_ENDPOINT?.trim();
  const region = process.env.PRESERVATION_S3_REGION?.trim() || "us-east-1";
  const tier = findTier(account.tier);
  const userAccount = `pres-${account.id.slice(0, 8)}`;
  const server = endpoint ? endpoint.replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined;
  return send({
    to: account.email,
    copyStaff: true,
    subject: "Your Savartus optical preservation space is ready",
    lines: [
      `Hello ${account.name},`,
      "",
      `Thank you for choosing Savartus. Your optical preservation space for ${account.organization}`,
      `is ready${tier ? ` on the ${tier.label} plan` : ""}.`,
      "",
      "Files you upload are written to write-once Blu-ray media in our optical library, where they",
      "can't be altered, encrypted by ransomware, or erased.",
      "",
      "Getting set up takes about 15 minutes and three steps. Keep this email handy until you're done.",
      "",
      "YOUR DETAILS",
      `   Portal:        ${portal() || "the Savartus portal"}`,
      `   Login email:   ${account.email}`,
      `   S3 account:    ${userAccount}`,
      bucketName ? `   Bucket:        ${bucketName}` : "   Bucket:        shown under Consumption units in the portal",
      endpoint ? `   Endpoint:      ${endpoint}` : "   Endpoint:      we will email you the address separately",
      `   Region:        ${region}`,
      "",
      "STEP 1. ACTIVATE YOUR PORTAL LOGIN (2 minutes)",
      "   You'll receive a second email, from the Savartus portal, with a link to create your password.",
      "   It usually arrives within a few minutes; check your spam or junk folder if you don't see it.",
      "   Open the link, choose a password, and sign in. The portal is where you see how much you have",
      "   stored and where you create the key your software uses to upload.",
      "",
      "STEP 2. CREATE YOUR ACCESS KEY (3 minutes)",
      "   Think of the access key and secret key as a username and password for upload software.",
      "   1. In the portal, click the gear icon at the top right.",
      "   2. Open S3 Optical, then User accounts.",
      `   3. Click your account, ${userAccount}.`,
      '   4. Click "Renew secret". Two values appear: the access key and the secret key.',
      "   5. Copy both into a password manager now. The secret key is shown only once. If you lose it,",
      '      click "Renew secret" again for a new one (the old one stops working).',
      "   Never email the secret key to anyone, including us.",
      "",
      "STEP 3. UPLOAD YOUR FIRST FILES (10 minutes)",
      "   Your space works with any software that supports \"S3\" storage. If you're new to this, we",
      "   suggest Cyberduck, a free drag-and-drop app for Windows and Mac (cyberduck.io):",
      "   1. Install and open Cyberduck, then click \"Open Connection\".",
      '   2. In the drop-down at the top, choose "Amazon S3".',
      server ? `   3. Server: ${server}    Port: 443` : "   3. Server: the endpoint address from our separate email.    Port: 443",
      "   4. Access Key ID: your access key from step 2. Secret Access Key: your secret key.",
      '   5. Click "Connect". You\'ll see your bucket as a folder.',
      "   6. Open the bucket and drag files or folders into the window to upload them.",
      "   Backup and archiving software with an S3 option is set up with the same details. When it asks,",
      `   use region ${region} and "path-style" addressing.`,
      "",
      "GOOD TO KNOW",
      "   - Preserve finished material, not working files. Once written to optical media, data can't be",
      "     changed. Deleting or replacing a file through S3 doesn't erase what was already written.",
      "   - Use clear folder names (for example department/year/project) so files are easy to find later.",
      "   - Check what you've stored in the portal: Consumption units > your unit > Bucket > Files.",
      "   - Staying within your plan? Usage is measured daily. Each terabyte above your plan (partial",
      "     terabytes round up) is added to your next monthly invoice at your plan's per-TB rate. If you",
      "     grow into the next plan, your whole account moves to its lower rate and we let you know.",
      "   - Cards and invoices are handled by Stripe. Your receipts link to the Stripe billing portal.",
      "",
      "Full instructions, including setup for the AWS command line and rclone:",
      `   ${site()}/preservation/getting-started`,
      "",
      "Questions or stuck on a step? Reply to this email or write to info@savartus.com and tell us",
      "which step you're on. We're happy to walk you through it.",
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
export function sendStaffAlert(
  account: Pick<Account, "id" | "organization" | "email">,
  subject: string,
  details: string[],
  attachments?: Attachment[],
) {
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
    attachments,
  });
}
