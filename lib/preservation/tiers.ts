// Starting capacity options shown at signup. Each tier maps to:
//  - a recurring Stripe price (the committed monthly charge; its per-TB rate is
//    the price divided by `includedTb`), and
//  - a Cloutility subscription whose "total storage" product is settled as
//    packages of 1 TB. Cloutility's monthly package count drives usage billing
//    (see usage-pricing.ts).

// Stripe product created by scripts/stripe-setup.mjs; usage invoice items use it.
export const PRESERVATION_PRODUCT_ID = "savartus_optical_preservation";

// Stripe Tax classification: "Infrastructure as a service (IaaS) - business
// use", which expressly covers storage provided over the internet. Signup
// requires an organization, so every subscriber is a business customer.
// Confirm with the tax adviser; scripts/stripe-setup.mjs sets it on the product.
export const PRESERVATION_TAX_CODE = "txcd_10101000";

// Evidence storage is sold as the evidence-management service, classed as
// "Software as a service (SaaS) - business use". It has its own Stripe product
// (same prices) so its invoice lines carry that code.
export const EVIDENCE_PRODUCT_ID = "savartus_evidence_preservation";
export const EVIDENCE_TAX_CODE = "txcd_10103001";

export const useCases = [
  { id: "evidence", label: "Evidence (law enforcement or legal)" },
  { id: "records", label: "Records and archives" },
  { id: "media", label: "Media and creative assets" },
  { id: "research", label: "Research and scientific data" },
  { id: "backup", label: "Backups and disaster recovery" },
  { id: "other", label: "Something else" },
] as const;

export type UseCase = (typeof useCases)[number]["id"];

export function findUseCase(id: unknown): UseCase | undefined {
  return useCases.find((option) => option.id === id)?.id;
}

// Stripe product, and so tax code, for an account's storage use.
export function productFor(useCase: string | null | undefined) {
  return useCase === "evidence"
    ? { id: EVIDENCE_PRODUCT_ID, taxCode: EVIDENCE_TAX_CODE }
    : { id: PRESERVATION_PRODUCT_ID, taxCode: PRESERVATION_TAX_CODE };
}

// Prices exclude tax; Stripe Tax adds it on top where Savartus is registered.
export const PRESERVATION_TAX_BEHAVIOR = "exclusive" as const;

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
