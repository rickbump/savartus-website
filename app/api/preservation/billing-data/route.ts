import { timingSafeEqual } from "node:crypto";
import {
  accountByErpReference,
  changeTier,
  forgetUsageCharge,
  recordUsageCharge,
  type Account,
} from "@/lib/preservation/accounts";
import { billingWebhookToken, cloutilityConfig, tierStripePrice } from "@/lib/preservation/config";
import { billingDataLines, getBillingData, latestBillingDate, type BillingDataLine } from "@/lib/preservation/cloutility";
import { sendStaffAlert, sendUpgradeEmail } from "@/lib/preservation/notify";
import { stripe } from "@/lib/preservation/stripe";
import { findTier, PRESERVATION_PRODUCT_ID, tiers } from "@/lib/preservation/tiers";
import { priceMonthlyUsage, type PricedTier } from "@/lib/preservation/usage-pricing";

export const runtime = "nodejs";
export const maxDuration = 120;

// Cloutility billing-data subscriber ("Post URL" set to
// https://<site>/api/preservation/billing-data?token=<secret>; User's manual §7.1).
// Cloutility posts only a notification, {"trigger":"new billing data available"}
// ("test for ..." from its Verify button), so on a real trigger this reads the
// newest billing run from the API. For each customer it prices the month's
// storage (lib/preservation/usage-pricing.ts), adds the charge to their next
// Stripe invoice, and upgrades their plan when they reach the next tier.
//
// GET with ?date= is a dry run (see below). Before going live, confirm with a
// dry run that Quantity on the storage line is the number of 1 TB packages.

type BillingLine = {
  InvoiceId?: string | number;
  ErpReference?: string;
  ProductCode?: string;
  InvoiceDate?: string;
  Quantity?: number | string;
};

function tokenMatches(request: Request) {
  const supplied = Buffer.from(new URL(request.url).searchParams.get("token") ?? "");
  const expected = Buffer.from(billingWebhookToken());
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function linesFrom(payload: unknown): BillingLine[] {
  if (Array.isArray(payload)) return payload as BillingLine[];
  if (payload && typeof payload === "object") {
    for (const key of ["lines", "billingData", "items", "data"]) {
      const value = (payload as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as BillingLine[];
    }
  }
  return [];
}

// Current tier prices from Stripe, so the per-TB rates always match what the
// customer was sold.
async function pricedTiers(): Promise<{ priced: PricedTier[]; currency: string }> {
  let currency = "usd";
  const priced = await Promise.all(
    tiers.map(async (tier) => {
      const price = await stripe().prices.retrieve(tierStripePrice(tier));
      if (price.unit_amount === null) throw new Error(`Stripe price for ${tier.id} has no amount`);
      currency = price.currency;
      return { id: tier.id, includedTb: tier.includedTb, monthlyCents: price.unit_amount };
    }),
  );
  return { priced, currency };
}

async function chargeAccount(
  account: Account,
  totalPackages: number,
  invoiceDate: string,
  identifier: string,
  priced: PricedTier[],
  currency: string,
) {
  const charge = priceMonthlyUsage(priced, account.tier, totalPackages);
  const upgrading = charge.effectiveTier.id !== charge.planTier.id;
  if (charge.lines.length === 0) return "nothing to charge" as const;

  const claimed = await recordUsageCharge({
    identifier,
    accountId: account.id,
    invoiceDate,
    totalTb: charge.totalTb,
    planTier: charge.planTier.id,
    effectiveTier: charge.effectiveTier.id,
    amountCents: charge.amountCents,
  });
  if (!claimed) return "already charged" as const;

  try {
    // Pending invoice items on the subscription are added to its next invoice.
    // Idempotency keys make a retried run reuse items already created.
    for (const [index, line] of charge.lines.entries()) {
      const common = {
        customer: account.stripe_customer_id!,
        subscription: account.stripe_subscription_id ?? undefined,
        description: `${line.description} (usage through ${invoiceDate})`,
        metadata: { preservationAccountId: account.id, usageIdentifier: identifier },
      };
      await stripe().invoiceItems.create(
        line.kind === "usage"
          ? {
              ...common,
              quantity: line.quantity,
              price_data: { currency, product: PRESERVATION_PRODUCT_ID, unit_amount: line.unitCents },
            }
          : { ...common, currency, amount: line.amountCents },
        { idempotencyKey: `${identifier}-line-${index}` },
      );
    }

    if (upgrading && account.stripe_subscription_id) {
      // Move the plan to the new tier from the next billing period. This
      // month's difference is covered by the invoice items above.
      const tier = findTier(charge.effectiveTier.id)!;
      const subscription = await stripe().subscriptions.retrieve(account.stripe_subscription_id);
      const planItem = subscription.items.data[0];
      await stripe().subscriptions.update(
        subscription.id,
        {
          items: [{ id: planItem.id, price: tierStripePrice(tier) }],
          proration_behavior: "none",
          metadata: { preservationAccountId: account.id, tier: tier.id },
        },
        { idempotencyKey: `${identifier}-upgrade` },
      );
      await changeTier(account.id, tier.id, tier.includedTb);
    }
  } catch (error) {
    await forgetUsageCharge(identifier); // let a re-sent notification retry
    throw error;
  }
  if (upgrading) {
    await sendUpgradeEmail(account, charge.planTier.id, charge.effectiveTier.id, charge.totalTb);
  }
  return upgrading ? ("charged and upgraded" as const) : ("charged" as const);
}

type StorageTotal = { erpReference: string; invoiceDate: string; packages: number };

// Totals the storage packages per customer and billing date. A storage line
// can be split across several rows.
function storageTotals(lines: BillingDataLine[], productCode: string) {
  const totals = new Map<string, StorageTotal>();
  for (const line of lines) {
    if (line.productCode !== productCode || !line.erpReference) continue;
    if (!Number.isFinite(line.quantity) || line.quantity < 0) continue;
    const invoiceDate = line.invoiceDate || new Date().toISOString().slice(0, 10);
    const key = `${line.erpReference}:${invoiceDate}`;
    const total = totals.get(key) ?? { erpReference: line.erpReference, invoiceDate, packages: 0 };
    total.packages += line.quantity;
    totals.set(key, total);
  }
  return totals;
}

// Older flat format (one object per line, manual §5.9.1.1), kept in case a
// sender posts the data itself.
function flatLines(payload: unknown): BillingDataLine[] {
  return linesFrom(payload).map((line) => ({
    erpReference: line.ErpReference ?? "",
    invoiceDate: String(line.InvoiceDate ?? "").slice(0, 10),
    productCode: line.ProductCode ?? "",
    quantity: Number(line.Quantity),
  }));
}

function staffAlertOnMismatch(lines: BillingDataLine[], productCode: string, invoiceDate: string) {
  if (lines.length === 0 || lines.some((line) => line.productCode === productCode)) return;
  const seen = [...new Set(lines.map((line) => line.productCode || "(none)"))].join(", ");
  console.warn("Preservation billing: no storage lines matched", { productCode, seen });
  return sendStaffAlert(
    { id: "billing-run", organization: "All preservation accounts", email: "-" },
    "Billing data had no optical preservation storage lines",
    [
      `Billing date: ${invoiceDate || "unknown"}`,
      `Expected product code: ${productCode}`,
      `Product codes found: ${seen}`,
      "No usage was charged. Check CLOUTILITY_STORAGE_PRODUCT_CODE and the billing data in Cloutility.",
    ],
  );
}

// Dry run, for checking billing before it happens:
//   GET ?token=...&date=YYYY-MM-DD[&forecast=true]
// A future date returns Cloutility's simulated billing. Nothing is charged.
export async function GET(request: Request) {
  if (!tokenMatches(request)) return new Response("Unauthorized", { status: 401 });
  const params = new URL(request.url).searchParams;
  const { parentBunitId, storageProductCode } = cloutilityConfig();
  const date = params.get("date") ?? (await latestBillingDate(parentBunitId));
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Pass date=YYYY-MM-DD (no billing has been generated yet)" }, { status: 400 });
  }
  const lines = billingDataLines(await getBillingData(parentBunitId, date, params.get("forecast") === "true"));
  const { priced, currency } = await pricedTiers();
  const charges = [];
  for (const total of storageTotals(lines, storageProductCode).values()) {
    const account = await accountByErpReference(total.erpReference);
    const charge = account ? priceMonthlyUsage(priced, account.tier, total.packages) : undefined;
    charges.push({
      erpReference: total.erpReference,
      packages: total.packages,
      account: account ? { id: account.id, organization: account.organization, tier: account.tier, status: account.status } : null,
      wouldCharge: charge
        ? { amountCents: charge.amountCents, currency, effectiveTier: charge.effectiveTier.id, lines: charge.lines }
        : "no self-service account",
    });
  }
  return Response.json(
    { date, productCode: storageProductCode, lineCount: lines.length, lines, charges },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  if (!tokenMatches(request)) return new Response("Unauthorized", { status: 401 });

  let payload: unknown;
  try {
    const text = await request.text();
    payload = text.trim() ? JSON.parse(text) : {};
  } catch {
    return new Response("Expected JSON", { status: 400 });
  }

  const trigger = (payload as { trigger?: unknown } | null)?.trigger;
  // Cloutility's "Verify" button sends a test trigger: acknowledge only.
  if (typeof trigger === "string" && /\btest\b/i.test(trigger)) {
    return Response.json({ ok: true, test: true });
  }
  const { parentBunitId, storageProductCode } = cloutilityConfig();

  let lines: BillingDataLine[];
  let invoiceDate = "";
  if (typeof trigger === "string") {
    const latest = await latestBillingDate(parentBunitId);
    if (!latest) return Response.json({ results: {}, note: "no billing data generated yet" });
    invoiceDate = latest;
    lines = billingDataLines(await getBillingData(parentBunitId, latest));
  } else {
    lines = flatLines(payload);
  }

  await staffAlertOnMismatch(lines, storageProductCode, invoiceDate);
  const totals = storageTotals(lines, storageProductCode);
  if (totals.size === 0) return Response.json({ results: {} });

  const { priced, currency } = await pricedTiers();
  const results: Record<string, string> = {};
  for (const [key, total] of totals) {
    const account = await accountByErpReference(total.erpReference);
    if (!account?.stripe_customer_id || account.status === "canceled") {
      results[key] = "no active self-service account";
      continue;
    }
    try {
      results[key] = await chargeAccount(account, total.packages, total.invoiceDate, `cloutility-${key}`, priced, currency);
    } catch (error) {
      console.error("Preservation usage charge failed", {
        accountId: account.id,
        type: error instanceof Error ? error.name : "UnknownError",
      });
      // 5xx so the sender can retry; already-charged lines are skipped.
      return Response.json({ results, failed: key }, { status: 502 });
    }
  }
  return Response.json({ results });
}
