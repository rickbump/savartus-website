import type { Metadata } from "next";
import { PreservationFaq } from "@/components/preservation/PreservationFaq";
import { SignupForm, type TierOption } from "@/components/preservation/SignupForm";
import { UsageCalculator, type CalculatorTier } from "@/components/preservation/UsageCalculator";
import { notFound } from "next/navigation";
import { signupEnabled, tierStripePrice } from "@/lib/preservation/config";
import { stripe } from "@/lib/preservation/stripe";
import { tiers } from "@/lib/preservation/tiers";
import { socialImages } from "@/lib/social-images";

export const metadata: Metadata = {
  title: "Start Optical Preservation",
  description:
    "Sign up for Savartus optical preservation: choose a starting capacity, pay securely, and receive S3 access to write-once optical storage within minutes.",
  alternates: { canonical: "/preservation/signup" },
  openGraph: {
    images: socialImages.openGraph,
    title: "Start Optical Preservation | Savartus",
    description: "Choose a starting capacity and get S3 access to write-once optical preservation.",
    url: "/preservation/signup",
    type: "website",
  },
};

export const revalidate = 3600;

type TierPricing = TierOption & { monthlyCents: number | null; currency: string | null };

async function tierOptions(): Promise<TierPricing[]> {
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

export default async function PreservationSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  if (!signupEnabled()) notFound();
  const [{ canceled }, options] = await Promise.all([searchParams, tierOptions()]);
  const notice = canceled === "1" ? "Checkout was canceled. Your card was not charged." : null;
  // The calculator needs every tier's price; it is hidden if Stripe is unavailable.
  const calculatorTiers: CalculatorTier[] = options.every((option) => option.monthlyCents !== null)
    ? options.map((option) => ({
        id: option.id,
        label: option.label,
        includedTb: tiers.find((tier) => tier.id === option.id)!.includedTb,
        monthlyCents: option.monthlyCents!,
      }))
    : [];
  const currency = options[0]?.currency ?? "usd";

  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">OPTICAL PRESERVATION</p>
          <h1>
            Preserve it once.
            <br />
            Keep it for decades.
          </h1>
          <p className="contact-hero-copy">
            Choose a starting capacity and pay online. Your S3 bucket on write-once optical media is
            ready within minutes, and you&apos;ll get an email to activate your portal login.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="site-container contact-main-grid">
          <div className="contact-info">
            <p className="contact-eyebrow">WHAT YOU GET</p>
            <h2>S3 access to an optical library.</h2>
            <ul className="preservation-points">
              <li>An S3-compatible bucket backed by write-once optical media.</li>
              <li>A portal login to see usage, reports, and your S3 keys.</li>
              <li>Capacity that grows in 1&nbsp;TB steps as your collection grows.</li>
              <li>Approved, auditable deletion, never accidental loss.</li>
            </ul>
            <UsageCalculator tiers={calculatorTiers} currency={currency} />
          </div>
          <SignupForm
            tiers={options.map(({ id, label, summary, price }) => ({ id, label, summary, price }))}
            notice={notice}
          />
        </div>
      </section>

      <section className="preservation-doc">
        <div className="site-container preservation-doc-inner">
          <PreservationFaq />
        </div>
      </section>
    </main>
  );
}
