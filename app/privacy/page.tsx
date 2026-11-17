import type { Metadata } from "next";
import type { ReactNode } from "react";

// DRAFT for legal review. Highlighted placeholders mark facts and decisions to
// confirm before launch; remove `robots` below once the notice is final.
export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Savartus collects, uses, and protects personal information.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

function Decide({ children }: { children: ReactNode }) {
  return <span className="preservation-placeholder">[{children}]</span>;
}

export default function PrivacyPage() {
  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">PRIVACY</p>
          <h1>Privacy notice</h1>
          <p className="contact-hero-copy">
            Effective <Decide>effective date</Decide>. This notice explains what personal
            information <Decide>legal entity name</Decide> (&ldquo;Savartus&rdquo;) collects through
            savartus.com and our services, and how we use it.
          </p>
        </div>
      </section>

      <section className="preservation-doc">
        <div className="site-container preservation-doc-inner">
          <h2>What we collect</h2>
          <ul>
            <li>
              <strong>Contact and request forms:</strong> name, organization, title, email address,
              and what you ask us about.
            </li>
            <li>
              <strong>Preservation signup:</strong> name, organization, email address, optional
              phone number, chosen plan, and your acceptance of the service terms.
            </li>
            <li>
              <strong>Payments:</strong> handled by Stripe. We receive your billing name, address,
              tax ID if you provide one, and payment status; we never see or store full card numbers.
            </li>
            <li>
              <strong>Service usage:</strong> storage volumes, portal sign-ins, and activity logs
              needed to operate, bill, and secure the service.
            </li>
            <li>
              <strong>Website analytics:</strong> <Decide>describe analytics or cookies used, if any</Decide>
            </li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To set up and operate your account, and to bill for it.</li>
            <li>To send service emails, such as account activation, plan changes, and invoices.</li>
            <li>To respond to your requests and provide support.</li>
            <li>To protect our systems and comply with legal obligations.</li>
            <li>
              To send you product information if you asked for it; you can opt out at any time.{" "}
              <Decide>confirm marketing practice</Decide>
            </li>
          </ul>

          <h2>Who we share it with</h2>
          <p>
            We use service providers to run our business: Stripe (payments), Microsoft (email),
            our hosting and database providers <Decide>name hosting and database providers, e.g.
            Vercel and Neon</Decide>, and our CRM <Decide>name CRM</Decide>. They process
            information on our behalf. We do not sell personal information.
          </p>

          <h2>Data you store with us</h2>
          <p>
            Content you upload to the preservation service is yours. We access it only to operate
            and support the service, to comply with law, or with your permission. See the
            preservation service terms for retention and deletion.
          </p>

          <h2>How long we keep it</h2>
          <p>
            <Decide>retention periods for account, billing, and form records</Decide>
          </p>

          <h2>Your choices and rights</h2>
          <p>
            You can ask to access, correct, or delete your personal information by emailing{" "}
            <a href="mailto:info@savartus.com">info@savartus.com</a>. <Decide>add state-specific
            rights (e.g. California) and GDPR language if serving the EU</Decide>
          </p>

          <h2>Security</h2>
          <p>
            We use access controls, encryption in transit, and audited deletion procedures to
            protect information. No system is perfectly secure; tell us at once if you suspect your
            credentials have been exposed.
          </p>

          <h2>Contact</h2>
          <p>
            <Decide>legal entity name and postal address</Decide>,{" "}
            <a href="mailto:info@savartus.com">info@savartus.com</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
