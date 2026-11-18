import { ClientSecretCredential } from "@azure/identity";
import { accountName, type Account } from "./accounts";
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

export async function send(message: {
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

// Sent when provisioning finishes. Written for someone who has never used S3
// storage before: the account space works in the browser, and S3 software is
// optional.
// `setPasswordLink` is set when the subscriber has no password yet.
export function sendWelcomeEmail(account: Account, setPasswordLink?: string) {
  const tier = findTier(account.tier);
  return send({
    to: account.email,
    copyStaff: true,
    subject: "Your Savartus optical preservation space is ready",
    lines: [
      `Hello ${account.name},`,
      "",
      `Thank you for choosing Savartus. Your optical preservation space for ${accountName(account)}`,
      `is ready${tier ? ` on the ${tier.label} plan` : ""}.`,
      "",
      "Files you upload are written to write-once Blu-ray media in our optical library, where they",
      "can't be altered, encrypted by ransomware, or erased.",
      "",
      "1. CHOOSE YOUR PASSWORD AND SIGN IN",
      ...(setPasswordLink
        ? [
            "   Open this link to choose a password (it works once and expires in 7 days):",
            `   ${setPasswordLink}`,
            `   After that, sign in any time at ${site()}/account with ${account.email} and your password.`,
          ]
        : [`   Sign in at ${site()}/account with ${account.email} and your existing password.`]),
      "",
      "2. UPLOAD YOUR FIRST FILES",
      "   Drag files or whole folders onto the Files page. You can make folders, search, download,",
      "   and see whether each file is already on optical disc.",
      "",
      "   IMPORTANT: FILES CAN'T BE MOVED OR RENAMED AFTER UPLOAD",
      "   Preserved files are written once to optical disc, along with their folder path and name.",
      "   That path is permanent. It's how you'll find each file later, tell files with the same name",
      "   apart, and show where a file came from. A file uploaded to the wrong folder stays there;",
      "   uploading it again stores (and bills) a second copy. So check the folder before uploading.",
      "",
      "   WHICH PATH IS SAVED",
      "   Browsers never tell a website where a file sits on your computer, so your drive letter and",
      "   the folders above the one you drop are NOT saved. What is saved: the folder you're in on",
      "   the Files page, plus the path from the dropped folder down. Example: dropping Projects",
      "   saves Projects/2024/report.pdf, not C:\\Users\\Rick\\Projects\\2024\\report.pdf.",
      "   To keep the full path, click New folder, type C/Users/Rick, then drop Projects into it.",
      "   Agree on a folder scheme with your team before the first upload.",
      "",
      "3. INVITE YOUR TEAM (optional)",
      "   As the administrator, you can invite colleagues under Members. Members can upload, browse",
      "   and download; administrators also manage members, keys and billing.",
      "",
      "FOR BULK UPLOADS OR FILES OVER 5 GB",
      "   Use S3 software such as Cyberduck, rclone, or backup software with an S3 option. Your",
      "   endpoint, bucket and access keys are under S3 keys in your account.",
      `   Instructions: ${site()}/preservation/getting-started`,
      "",
      "GOOD TO KNOW",
      "   - Preserve finished material, not working files. Once written, files can't be changed, and",
      "     a file name can't be reused.",
      "   - New uploads wait in the library's cache until they're written to disc. Files on disc are",
      "     restored to the cache (usually within minutes) before you download them.",
      "   - Usage is measured daily. Each terabyte above your plan is added to your next monthly invoice",
      "     at your plan's per-TB rate. If you grow into the next plan, your whole space moves to its",
      "     lower rate and we let you know.",
      "   - Invoices and your payment method are under Billing in your account.",
      "",
      "Questions? Reply to this email or write to info@savartus.com. We're happy to help.",
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
      `Last month ${accountName(account)} stored ${usedTb} TB, which reached the ${to} plan.`,
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
  account: Pick<Account, "id" | "organization" | "name" | "email">,
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
    subject: `[Preservation] ${subject}: ${accountName(account)}`,
    lines: [
      `Account: ${account.id}`,
      `Organization: ${account.organization || "(none given)"}`,
      `Name: ${account.name}`,
      `Customer email: ${account.email}`,
      "",
      ...details,
      "",
      "Runbook: docs/preservation-self-service.md",
    ],
    attachments,
  });
}
