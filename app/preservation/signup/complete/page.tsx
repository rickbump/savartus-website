import type { Metadata } from "next";
import Link from "next/link";
import { ProvisioningProgress } from "@/components/preservation/ProvisioningProgress";
import { stripe } from "@/lib/preservation/stripe";

export const metadata: Metadata = {
  title: "Signup Complete",
  robots: { index: false, follow: false },
};

async function paidSession(sessionId: string | undefined) {
  if (!sessionId || !/^cs_[A-Za-z0-9_]+$/.test(sessionId)) return null;
  try {
    const session = await stripe().checkout.sessions.retrieve(sessionId);
    const email = session.customer_details?.email;
    return session.payment_status === "paid" && email ? { id: session.id, email } : null;
  } catch {
    return null;
  }
}

export default async function SignupCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await paidSession(session_id);
  const portalUrl = process.env.STRIPE_PORTAL_LOGIN_URL?.trim();

  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">{session ? "PAYMENT RECEIVED" : "ALMOST THERE"}</p>
          <h1>{session ? "We're setting up your preservation space." : "We're confirming your payment."}</h1>

          {session ? (
            <ProvisioningProgress sessionId={session.id} email={session.email} />
          ) : (
            <p className="contact-hero-copy">
              If you completed checkout, you&apos;ll receive an activation email shortly. If nothing
              arrives within 30 minutes, contact <a href="mailto:info@savartus.com">info@savartus.com</a>.
            </p>
          )}

          <p className="contact-hero-copy">
            New to the service? Read the{" "}
            <Link href="/preservation/getting-started">getting started guide</Link>.
            {portalUrl && (
              <>
                {" "}Update your card or billing details, or download invoices, in the{" "}
                <a href={portalUrl}>billing portal</a>.
              </>
            )}
          </p>
        </div>
      </section>
    </main>
  );
}
