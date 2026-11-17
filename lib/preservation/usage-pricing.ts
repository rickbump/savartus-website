// Monthly usage pricing for optical preservation.
//
// Rules (from Savartus pricing):
//  - A customer's plan is a committed tier, billed in advance at the tier's
//    monthly price (1 TB $7.50; 5 TB $35; 10 TB $65; 25 TB $150).
//  - Usage above the plan is billed in whole-TB steps at the plan's per-TB
//    rate (5 TB plan: 6 TB costs $35 + $7 = $42).
//  - When usage reaches the next tier's size, the whole account moves to that
//    tier's pricing (5 TB plan at 10 TB costs $65, not $70) and the plan is
//    upgraded. Plans never move down; optical media is write-once.
//
// Usage is reported by Cloutility after each month, so the result describes
// what to add to the customer's next invoice for the month just measured,
// given that the current plan's monthly price was already billed.

export type PricedTier = { id: string; includedTb: number; monthlyCents: number };

export type UsageLine =
  | { kind: "usage"; description: string; quantity: number; unitCents: number }
  | { kind: "credit"; description: string; amountCents: number };

export type UsageCharge = {
  totalTb: number;
  planTier: PricedTier;
  // Tier the account is on after this month; differs from planTier on upgrade.
  effectiveTier: PricedTier;
  lines: UsageLine[];
  // Net amount added to the next invoice.
  amountCents: number;
};

export function perTbCents(tier: PricedTier) {
  return Math.round(tier.monthlyCents / tier.includedTb);
}

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function priceMonthlyUsage(tiers: PricedTier[], planTierId: string, usedTb: number): UsageCharge {
  const sorted = [...tiers].sort((a, b) => a.includedTb - b.includedTb);
  const planTier = sorted.find((tier) => tier.id === planTierId);
  if (!planTier) throw new Error(`Unknown plan tier ${planTierId}`);

  // Partial terabytes count as a full TB; never below the committed size.
  const totalTb = Math.max(Math.ceil(usedTb - 1e-9), planTier.includedTb);
  const effectiveTier = sorted
    .filter((tier) => tier.includedTb <= totalTb && tier.includedTb >= planTier.includedTb)
    .at(-1)!;

  const lines: UsageLine[] = [];
  if (effectiveTier.id === planTier.id) {
    const extraTb = totalTb - planTier.includedTb;
    if (extraTb > 0) {
      lines.push({
        kind: "usage",
        description: `Additional preservation capacity: ${extraTb} TB over the ${planTier.includedTb} TB plan at ${money(perTbCents(planTier))}/TB`,
        quantity: extraTb,
        unitCents: perTbCents(planTier),
      });
    }
  } else {
    const rate = perTbCents(effectiveTier);
    lines.push({
      kind: "usage",
      description: `Preservation capacity: ${totalTb} TB at the ${effectiveTier.includedTb} TB tier rate of ${money(rate)}/TB`,
      quantity: totalTb,
      unitCents: rate,
    });
    lines.push({
      kind: "credit",
      description: `Less ${planTier.includedTb} TB plan already billed for this month`,
      amountCents: -planTier.monthlyCents,
    });
  }

  const amountCents = lines.reduce(
    (sum, line) => sum + (line.kind === "usage" ? line.quantity * line.unitCents : line.amountCents),
    0,
  );
  return { totalTb, planTier, effectiveTier, lines, amountCents };
}
