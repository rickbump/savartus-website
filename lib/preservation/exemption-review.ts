import { accountById, accountName, attachExemptCustomer, type Account } from "./accounts";
import { stripeSecretKey } from "./config";
import { sendStaffAlert } from "./notify";
import { stripe } from "./stripe";
import { certificateKind, checkExemption, exemptionLabel } from "./tax-exemption";
import { findTier } from "./tiers";

// Tax-exempt signups: the customer is created in Stripe as tax exempt, with
// the certificate stored as a Stripe file on it, so checkout and every later
// invoice charge no tax. Staff review after payment and can revoke
// (scripts/preservation-tax-review.mts).

export async function createExemptCustomer(account: Account, certificate: { name: string; bytes: Uint8Array }) {
  const kind = certificateKind(certificate.bytes);
  if (!kind) throw new Error("Certificate is not a PDF, JPEG or PNG");

  const file = await stripe().files.create({
    purpose: "tax_document_user_upload",
    file: {
      data: Buffer.from(certificate.bytes),
      name: `exemption-certificate-${account.id}.${kind.extension}`,
      type: kind.type,
    },
  });

  const customer = await stripe().customers.create(
    {
      email: account.email,
      name: accountName(account),
      phone: account.phone ?? undefined,
      tax_exempt: "exempt",
      metadata: {
        preservationAccountId: account.id,
        taxExemptStatus: "pending review",
        taxExemptType: account.tax_exempt_type ?? "",
        taxExemptState: account.tax_exempt_state ?? "",
        taxExemptNumber: account.tax_exempt_number ?? "",
        taxExemptCertificateFile: file.id,
        taxExemptCertificateName: certificate.name.slice(0, 200),
      },
    },
    { idempotencyKey: `preservation-exempt-customer-${account.id}` },
  );

  await attachExemptCustomer(account.id, customer.id, file.id);
  return customer.id;
}

function formatWarnings(account: Account) {
  const check = checkExemption({ type: account.tax_exempt_type, state: account.tax_exempt_state, number: account.tax_exempt_number });
  return check.ok ? check.warnings : [check.error];
}

function dashboardUrl(path: string) {
  const test = stripeSecretKey().includes("_test_");
  return `https://dashboard.stripe.com/${test ? "test/" : ""}${path}`;
}

async function downloadCertificate(fileId: string) {
  const response = await fetch(`https://files.stripe.com/v1/files/${fileId}/contents`, {
    headers: { Authorization: `Bearer ${stripeSecretKey()}` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Stripe file download returned ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const kind = certificateKind(bytes);
  return { name: `exemption-certificate.${kind?.extension ?? "pdf"}`, contentType: kind?.type ?? "application/pdf", bytes };
}

// Emails staff the claim and certificate once the exempt signup has paid.
// Best-effort: a failure is logged and never blocks provisioning.
export async function sendExemptionReview(accountId: string) {
  try {
    const account = await accountById(accountId);
    if (!account || account.tax_exempt_status !== "requested") return;

    const attachments = [];
    let certificateNote = "Certificate: attached.";
    if (account.tax_certificate_file_id) {
      try {
        attachments.push(await downloadCertificate(account.tax_certificate_file_id));
      } catch {
        certificateNote = `Certificate: couldn't attach it; open Stripe file ${account.tax_certificate_file_id}.`;
      }
    } else {
      certificateNote = "Certificate: none on file.";
    }

    await sendStaffAlert(
      account,
      "Tax-exempt signup to review",
      [
        "This customer was charged WITHOUT sales tax, based on the exemption below.",
        "",
        `Exemption: ${exemptionLabel(account.tax_exempt_type)}`,
        `Issuing state: ${account.tax_exempt_state}`,
        `Number: ${account.tax_exempt_number ?? "(none given)"}`,
        certificateNote,
        ...formatWarnings(account).map((warning) => `Check: ${warning}`),
        `Contact: ${account.name}${account.phone ? `, ${account.phone}` : ""}`,
        `Plan: ${findTier(account.tier)?.label ?? account.tier}, storing: ${account.use_case}`,
        `Stripe customer: ${account.stripe_customer_id ? dashboardUrl(`customers/${account.stripe_customer_id}`) : "(missing)"}`,
        "",
        "Check that the certificate names the organization, matches the number and state, is signed and",
        "isn't expired. Then:",
        `  Valid:     npx tsx --env-file=.env.local scripts/preservation-tax-review.mts approve ${account.id} --expires YYYY-MM-DD`,
        `  Not valid: talk to the customer first, then`,
        `             npx tsx --env-file=.env.local scripts/preservation-tax-review.mts revoke ${account.id}`,
        "             (shows the tax owed; add --apply to charge it and tax them from now on)",
      ],
      attachments,
    );
  } catch (error) {
    console.error("Exemption review email failed", { accountId, type: error instanceof Error ? error.message : "UnknownError" });
  }
}
