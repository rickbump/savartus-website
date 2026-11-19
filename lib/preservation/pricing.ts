import type { TierOption } from "@/components/preservation/SignupForm";
import { tierStripePrice } from "./config";
import { stripe } from "./stripe";
import { tiers } from "./tiers";

// Plan prices come from Stripe so the site never shows a stale price.

export type TierPricing = TierOption & { monthlyCents: number | null; currency: string | null };

export async function tierOptions(): Promise<TierPricing[]> {
  return Promise.all(
    tiers.map(async (tier) => {
      let price: string | null = null;
      let monthlyCents: number | null = null;
      let currency: string | null = null;
      try {
        const stripePrice = await stripe().prices.retrieve(tierStripePrice(tier));
        if (stripePrice.unit_amount !== null) {
          monthlyCents = stripePrice.unit_amount;
          currency = stripePrice.currency;
          const format = (cents: number) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: stripePrice.currency,
              minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
            }).format(cents / 100);
          const monthly = format(stripePrice.unit_amount);
          const perTb = format(Math.round(stripePrice.unit_amount / tier.includedTb));
          price = tier.includedTb === 1 ? `${monthly}/TB/month` : `${monthly}/month · ${perTb}/TB`;
        }
      } catch {
        // Pricing is shown at checkout if Stripe is unreachable or not configured.
      }
      return { id: tier.id, label: tier.label, summary: tier.summary, price, monthlyCents, currency };
    }),
  );
}
