"use client";

import { useState } from "react";
import { priceMonthlyUsage, type PricedTier } from "@/lib/preservation/usage-pricing";

export type CalculatorTier = PricedTier & { label: string };

function money(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

// Monthly cost for a plan and an amount stored, using the same pricing rules
// as the invoices (lib/preservation/usage-pricing.ts).
export function UsageCalculator({ tiers, currency }: { tiers: CalculatorTier[]; currency: string }) {
  const [planId, setPlanId] = useState(tiers.find((tier) => tier.id === "tb5")?.id ?? tiers[0]?.id);
  const [stored, setStored] = useState("6");
  if (!tiers.length || !planId) return null;

  const usedTb = Math.max(0, Number(stored) || 0);
  const charge = priceMonthlyUsage(tiers, planId, usedTb);
  const monthly = charge.planTier.monthlyCents + charge.amountCents;
  const upgraded = charge.effectiveTier.id !== charge.planTier.id;
  const effective = tiers.find((tier) => tier.id === charge.effectiveTier.id)!;

  return (
    <div className="preservation-calculator">
      <h3>Estimate your monthly cost</h3>
      <div className="preservation-calculator-controls">
        <label>
          Plan
          <select value={planId} onChange={(event) => setPlanId(event.target.value)}>
            {tiers.map((tier) => (
              <option key={tier.id} value={tier.id}>
                {tier.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Data stored (TB)
          <input
            type="number"
            min={0}
            max={10000}
            step={0.5}
            inputMode="decimal"
            value={stored}
            onChange={(event) => setStored(event.target.value)}
          />
        </label>
      </div>
      <p className="preservation-calculator-result" aria-live="polite">
        <strong>{money(monthly, currency)}</strong> per month for {charge.totalTb} TB
        {charge.totalTb > usedTb && usedTb > 0 && usedTb !== charge.planTier.includedTb ? " (rounded up)" : ""}.
      </p>
      <p className="contact-form-note">
        {upgraded
          ? `At ${charge.totalTb} TB your account moves to the ${effective.label} plan, so everything is billed at its lower rate.`
          : charge.totalTb > charge.planTier.includedTb
            ? `${charge.totalTb - charge.planTier.includedTb} TB over your plan, billed at your plan's per-TB rate.`
            : "Within your plan."}{" "}
        Taxes, if any, are extra.
      </p>
    </div>
  );
}
