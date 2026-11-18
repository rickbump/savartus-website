// Review of tax-exempt signups. These customers were charged without sales tax
// and their certificate is stored on their Stripe customer; you get an email
// with the details and certificate when they pay.
//
//   npx tsx --env-file=.env.local scripts/preservation-tax-review.mts list
//   npx tsx --env-file=.env.local scripts/preservation-tax-review.mts approve <accountId> [--expires YYYY-MM-DD]
//   npx tsx --env-file=.env.local scripts/preservation-tax-review.mts revoke <accountId>           # dry run
//   npx tsx --env-file=.env.local scripts/preservation-tax-review.mts revoke <accountId> --apply   # charge it
//
// approve: records the review; the customer stays tax exempt.
// revoke:  talk to the customer first. Calculates the sales tax that would have
//          been due on every paid invoice (at each invoice's date and the
//          customer's billing address). With --apply it marks the customer
//          taxable from now on, charges that tax on a separate invoice to the
//          card on file, and records it in Stripe Tax reports.

import type Stripe from "stripe";
import { accountById, decideTaxExemption, exemptionRequests } from "../lib/preservation/accounts";
import { stripe } from "../lib/preservation/stripe";
import { exemptionLabel } from "../lib/preservation/tax-exemption";
import { findTier, productFor } from "../lib/preservation/tiers";

const [command, accountId, ...rest] = process.argv.slice(2);
const flag = (name: string) => rest.includes(`--${name}`);
const option = (name: string) => {
  const index = rest.indexOf(`--${name}`);
  return index >= 0 ? rest[index + 1] : undefined;
};
const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (command === "list") {
  const requests = await exemptionRequests();
  if (!requests.length) console.log("No tax-exempt signups waiting for review.");
  for (const account of requests) {
    console.log(
      [
        account.id,
        `  ${account.organization}: ${account.name} <${account.email}>`,
        `  ${exemptionLabel(account.tax_exempt_type)}, ${account.tax_exempt_state}, number ${account.tax_exempt_number ?? "(none)"}`,
        `  plan ${findTier(account.tier)?.label ?? account.tier}, storing ${account.use_case}, paid ${account.paid_at ?? "?"}`,
        `  Stripe customer ${account.stripe_customer_id}, certificate file ${account.tax_certificate_file_id ?? "(none)"}`,
      ].join("\n"),
    );
  }
  process.exit(0);
}

if ((command !== "approve" && command !== "revoke") || !accountId) {
  fail("Usage: list | approve <accountId> [--expires YYYY-MM-DD] | revoke <accountId> [--apply]");
}

const account = await accountById(accountId);
if (!account) fail(`No account ${accountId}.`);
if (!account.stripe_customer_id || !["requested", "approved"].includes(account.tax_exempt_status)) {
  fail(`Account ${accountId} has no tax exemption to review (exemption ${account.tax_exempt_status}).`);
}
const customerId = account.stripe_customer_id;

if (command === "approve") {
  const expires = option("expires");
  if (expires && !/^\d{4}-\d{2}-\d{2}$/.test(expires)) fail("--expires must be YYYY-MM-DD.");
  await stripe().customers.update(customerId, {
    metadata: {
      taxExemptStatus: "approved",
      taxExemptApprovedAt: new Date().toISOString().slice(0, 10),
      taxExemptExpires: expires ?? "",
    },
  });
  await decideTaxExemption(account.id, "approved");
  console.log(`Approved: ${account.organization} stays tax exempt${expires ? ` until ${expires}` : ""}.`);
  process.exit(0);
}

// revoke
const customer = (await stripe().customers.retrieve(customerId)) as Stripe.Customer;
if (!customer.address?.country) fail("The Stripe customer has no billing address, so tax can't be calculated.");
const taxCode = productFor(account.use_case).taxCode;
const invoices = (await stripe().invoices.list({ customer: customerId, status: "paid", limit: 100 })).data;

type Owed = { invoice: Stripe.Invoice; calculation: Stripe.Tax.Calculation };
const owed: Owed[] = [];
for (const invoice of invoices) {
  const lines = (await stripe().invoices.listLineItems(invoice.id!, { limit: 100 })).data.filter((line) => line.amount > 0);
  if (!lines.length) continue;
  const calculation = await stripe().tax.calculations.create({
    currency: invoice.currency,
    line_items: lines.map((line) => ({ amount: line.amount, reference: line.id!, tax_code: taxCode, tax_behavior: "exclusive" })),
    customer_details: {
      address: {
        line1: customer.address.line1 ?? undefined,
        line2: customer.address.line2 ?? undefined,
        city: customer.address.city ?? undefined,
        state: customer.address.state ?? undefined,
        postal_code: customer.address.postal_code ?? undefined,
        country: customer.address.country,
      },
      address_source: "billing",
    },
    tax_date: invoice.status_transitions.paid_at ?? invoice.created,
  });
  owed.push({ invoice, calculation });
}

const currency = invoices[0]?.currency ?? "usd";
const total = owed.reduce((sum, item) => sum + item.calculation.tax_amount_exclusive, 0);
console.log(`${account.organization}: sales tax that would have been due (${customer.address.state ?? ""} ${customer.address.postal_code ?? ""})`);
for (const { invoice, calculation } of owed) {
  console.log(`  ${invoice.number ?? invoice.id}  ${money(invoice.amount_paid, currency)} paid  →  tax ${money(calculation.tax_amount_exclusive, currency)}`);
}
console.log(`  Total owed: ${money(total, currency)}`);
if (total === 0) console.log("  (Zero can mean Savartus has no Stripe Tax registration in that state.)");

if (!flag("apply")) {
  console.log("\nDry run: nothing changed. Re-run with --apply after talking to the customer.");
  process.exit(0);
}

await stripe().customers.update(customerId, {
  tax_exempt: "none",
  metadata: { taxExemptStatus: "revoked", taxExemptRevokedAt: new Date().toISOString().slice(0, 10) },
});
console.log("Customer is now taxable: future invoices include sales tax.");

if (total > 0) {
  const subscription = account.stripe_subscription_id
    ? await stripe().subscriptions.retrieve(account.stripe_subscription_id)
    : undefined;
  const paymentMethod =
    (typeof subscription?.default_payment_method === "string" ? subscription.default_payment_method : subscription?.default_payment_method?.id) ??
    undefined;
  const invoice = await stripe().invoices.create(
    {
      customer: customerId,
      collection_method: "charge_automatically",
      auto_advance: false,
      automatic_tax: { enabled: false }, // the line below is the tax itself
      pending_invoice_items_behavior: "exclude",
      description: "Sales tax on earlier invoices: your tax exemption could not be confirmed.",
      metadata: { preservationAccountId: account.id, reason: "tax exemption revoked" },
    },
    { idempotencyKey: `preservation-revoke-invoice-${account.id}` },
  );
  await stripe().invoiceItems.create(
    {
      customer: customerId,
      invoice: invoice.id,
      currency,
      amount: total,
      description: `Sales tax on invoices ${owed.filter((o) => o.calculation.tax_amount_exclusive > 0).map((o) => o.invoice.number ?? o.invoice.id).join(", ")}`,
    },
    { idempotencyKey: `preservation-revoke-item-${account.id}` },
  );
  await stripe().invoices.finalizeInvoice(invoice.id!);
  try {
    const paid = await stripe().invoices.pay(invoice.id!, paymentMethod ? { payment_method: paymentMethod } : {});
    console.log(`Charged ${money(total, currency)} on invoice ${paid.number} (${paid.status}).`);
  } catch (error) {
    console.log(`Invoice ${invoice.id} finalized but the charge failed (${error instanceof Error ? error.message : error}).`);
    console.log("Stripe will email the customer to pay it; check it in the Dashboard.");
  }
  // Record the collected tax so it appears in Stripe Tax reports for filing.
  for (const { invoice: original, calculation } of owed) {
    if (calculation.tax_amount_exclusive > 0 && calculation.id) {
      await stripe().tax.transactions.createFromCalculation({
        calculation: calculation.id,
        reference: `revoked-exemption-${original.id}`,
      });
    }
  }
}

await decideTaxExemption(account.id, "declined");
console.log("Recorded as revoked.");
