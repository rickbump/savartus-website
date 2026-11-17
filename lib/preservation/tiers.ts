// Starting capacity options shown at signup. Each tier maps to:
//  - a recurring Stripe price (the committed monthly charge; its per-TB rate is
//    the price divided by `includedTb`), and
//  - a Cloutility subscription whose "total storage" product is settled as
//    packages of 1 TB. Cloutility's monthly package count drives usage billing
//    (see usage-pricing.ts).

// Stripe product created by scripts/stripe-setup.mjs; usage invoice items use it.
export const PRESERVATION_PRODUCT_ID = "savartus_optical_preservation";

export type TierId = "tb1" | "tb5" | "tb10" | "tb25";

export type Tier = {
  id: TierId;
  label: string;
  includedTb: number;
  summary: string;
  stripePriceEnv: string;
  cloutilitySubscriptionEnv: string;
};

export const tiers: Tier[] = [
  {
    id: "tb1",
    label: "1 TB",
    includedTb: 1,
    summary: "Records, evidence, and small collections.",
    stripePriceEnv: "STRIPE_PRICE_TB1",
    cloutilitySubscriptionEnv: "CLOUTILITY_SUBSCRIPTION_TB1",
  },
  {
    id: "tb5",
    label: "5 TB",
    includedTb: 5,
    summary: "Departmental archives and media libraries.",
    stripePriceEnv: "STRIPE_PRICE_TB5",
    cloutilitySubscriptionEnv: "CLOUTILITY_SUBSCRIPTION_TB5",
  },
  {
    id: "tb10",
    label: "10 TB",
    includedTb: 10,
    summary: "Organization-wide preservation programs.",
    stripePriceEnv: "STRIPE_PRICE_TB10",
    cloutilitySubscriptionEnv: "CLOUTILITY_SUBSCRIPTION_TB10",
  },
  {
    id: "tb25",
    label: "25 TB",
    includedTb: 25,
    summary: "Large collections and multi-year retention.",
    stripePriceEnv: "STRIPE_PRICE_TB25",
    cloutilitySubscriptionEnv: "CLOUTILITY_SUBSCRIPTION_TB25",
  },
];

export function findTier(id: unknown): Tier | undefined {
  return tiers.find((tier) => tier.id === id);
}
