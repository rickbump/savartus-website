import type Stripe from "stripe";
import { attachCheckoutSession, type Account } from "./accounts";
import { siteUrl, tierStripePrice } from "./config";
import { stripe } from "./stripe";
import { findTier, productFor, type Tier } from "./tiers";

// The plan line for a tier. Standard storage uses the tier's price; evidence
// storage uses the same amount on the evidence product, so Stripe Tax applies
// that product's tax code.
export async function planLine(tier: Tier, useCase: string | null | undefined) {
  const priceId = tierStripePrice(tier);
  const product = productFor(useCase);
  if (product.id !== productFor(null).id) {
    const price = await stripe().prices.retrieve(priceId);
    if (price.unit_amount == null || !price.recurring) throw new Error(`Price ${priceId} has no fixed recurring amount`);
    return {
      price_data: {
        currency: price.currency,
        product: product.id,
        unit_amount: price.unit_amount,
        recurring: { interval: price.recurring.interval, interval_count: price.recurring.interval_count },
        tax_behavior: "exclusive" as const,
      },
    };
  }
  return { price: priceId };
}

// Starts Stripe Checkout for a pending account. An exempt signup already has
// a Stripe customer marked tax exempt, so checkout charges no tax.
export async function startCheckout(account: Account, options: { idempotent: boolean }) {
  const tier = findTier(account.tier);
  if (!tier) throw new Error(`Unknown tier ${account.tier}`);
  const base = siteUrl();
  const customer: Pick<Stripe.Checkout.SessionCreateParams, "customer" | "customer_email" | "customer_update"> =
    account.stripe_customer_id
      ? { customer: account.stripe_customer_id, customer_update: { address: "auto", name: "auto" } }
      : { customer_email: account.email };

  const session = await stripe().checkout.sessions.create(
    {
      mode: "subscription",
      client_reference_id: account.id,
      ...customer,
      // Committed plan only; usage above it is added to later invoices
      // from Cloutility's monthly billing data.
      line_items: [{ ...(await planLine(tier, account.use_case)), quantity: 1 }],
      // Stripe Tax uses the billing address to find the jurisdiction and a tax
      // ID for reverse charge (e.g. EU VAT). Automatic tax carries over to the
      // subscription, so renewals and usage invoices are taxed the same way.
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      automatic_tax: { enabled: true },
      metadata: { preservationAccountId: account.id },
      subscription_data: { metadata: { preservationAccountId: account.id } },
      success_url: `${base}/preservation/signup/complete?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/preservation/signup?canceled=1`,
    },
    options.idempotent ? { idempotencyKey: `preservation-checkout-${account.id}` } : undefined,
  );

  await attachCheckoutSession(account.id, session.id);
  return session;
}
