import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { renderMarkdown } from "@/lib/simple-markdown";

// DRAFT for legal review. Highlighted placeholders mark decisions that must be
// made before launch; remove `robots` below once the terms are final.
export const metadata: Metadata = {
  title: "Optical Preservation Service Terms",
  description: "Terms for the Savartus self-service optical preservation service.",
  alternates: { canonical: "/preservation/terms" },
  robots: { index: false, follow: true },
};

function Decide({ children }: { children: ReactNode }) {
  return <span className="preservation-placeholder">[{children}]</span>;
}

// Final terms live in content/legal/optical-preservation-terms.md. Until that
// file contains a "## " heading, the built-in draft below is shown instead.
const TERMS_FILE = path.join(process.cwd(), "content/legal/optical-preservation-terms.md");
const PDF_PATH = "/downloads/legal/savartus-optical-preservation-terms.pdf";

function finalTerms() {
  try {
    const text = readFileSync(TERMS_FILE, "utf8");
    return /^##\s/m.test(text.replace(/<!--[\s\S]*?-->/g, "")) ? text : undefined;
  } catch {
    return undefined;
  }
}

export default function PreservationTermsPage() {
  const terms = finalTerms();
  const hasPdf = existsSync(path.join(process.cwd(), "public", PDF_PATH));

  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">OPTICAL PRESERVATION</p>
          <h1>Service terms</h1>
          <p className="contact-hero-copy">
            {terms ? (
              "These terms apply to the self-service optical preservation service you buy at savartus.com."
            ) : (
              <>
                Effective <Decide>effective date</Decide>. These terms apply to the self-service
                optical preservation service you buy at savartus.com.
              </>
            )}
          </p>
          {hasPdf ? (
            <p>
              <a className="button button-secondary" href={PDF_PATH} download>
                Download PDF
              </a>
            </p>
          ) : null}
        </div>
      </section>

      <section className="preservation-doc">
        <div className="site-container preservation-doc-inner">
          {terms ? renderMarkdown(terms) : <DraftTerms />}
        </div>
      </section>
    </main>
  );
}

function DraftTerms() {
  return (
    <>
          <h2>1. Who we are</h2>
          <p>
            The service is provided by <Decide>legal entity name and address</Decide> (&ldquo;Savartus&rdquo;,
            &ldquo;we&rdquo;). &ldquo;You&rdquo; means the organization named at signup, and the
            person signing up confirms they may bind it to these terms.
          </p>

          <h2>2. The service</h2>
          <p>
            We provide S3-compatible storage backed by write-once optical media in a Savartus
            optical library, a portal login to view usage and manage your S3 credentials, and the
            support described in section 9. Data you upload is staged on the library&apos;s cache and
            written to optical media in batches.
          </p>

          <h2>3. Write-once media and deletion</h2>
          <ul>
            <li>
              Data written to optical media cannot be altered. Overwriting or deleting an object
              through S3 does not erase data already written.
            </li>
            <li>
              Removing preserved data requires a deletion request approved by Savartus. We may ask
              you to confirm a request in writing before approving it.
            </li>
            <li>We never delete preserved data automatically, including when payment fails.</li>
          </ul>

          <h2>4. Plans, usage, and price</h2>
          <ul>
            <li>
              You choose a plan (a committed capacity) at signup. It is billed monthly in advance
              through Stripe at the price shown at checkout.
            </li>
            <li>
              Storage above your plan is measured by our systems and billed monthly in arrears, in
              whole terabytes (partial terabytes round up), at your plan&apos;s per-TB rate.
            </li>
            <li>
              When your measured storage reaches the size of a larger plan, your account moves to
              that plan and its per-TB rate for that month and every month after. Plans do not move
              down.
            </li>
            <li>
              Prices exclude taxes unless stated. <Decide>tax handling: Stripe Tax, or customer
              responsible for applicable taxes</Decide>
            </li>
            <li>
              We may change prices with <Decide>notice period, e.g. 30 days</Decide> written notice;
              changes apply from your next billing period after the notice period.
            </li>
          </ul>

          <h2>5. Payment</h2>
          <p>
            You authorize us, through Stripe, to charge your payment method for your plan and usage.
            If a payment fails, Stripe retries it. If an invoice remains unpaid for{" "}
            <Decide>days</Decide>, we may suspend uploads and portal access until it is paid; your
            preserved data is retained during suspension.
          </p>

          <h2>6. Term and cancellation</h2>
          <ul>
            <li>The service renews monthly until cancelled.</li>
            <li>
              You may cancel by emailing info@savartus.com from your account email. Cancellation
              takes effect at the end of the current billing period; plan fees already paid are not
              refunded. <Decide>confirm refund policy</Decide>
            </li>
            <li>
              After cancellation, your preserved data is retained for <Decide>retention period after
              cancellation</Decide>. During that period you may <Decide>retrieve it / order a copy on
              media at a fee / extend retention</Decide>. After that period, Savartus{" "}
              <Decide>deletes it under an approved deletion request / continues to hold it on
              offline media</Decide>.
            </li>
            <li>
              We may end the service with <Decide>notice period</Decide> written notice, or
              immediately for material breach, including unlawful content.
            </li>
          </ul>

          <h2>7. Your responsibilities</h2>
          <ul>
            <li>Keep your S3 secret key and portal password confidential, and renew the key if it is exposed.</li>
            <li>
              Upload only data you have the right to store, and comply with applicable law, including
              export controls and data protection law.
            </li>
            <li>
              Keep your own copy of data until you have confirmed it has been preserved, and keep
              your contact details current.
            </li>
          </ul>

          <h2>8. Data protection and confidentiality</h2>
          <p>
            We access your stored data only to operate and support the service, to comply with law,
            or with your permission. Our handling of personal data is described in our{" "}
            <Link href="/privacy">privacy notice</Link>. <Decide>data processing addendum available
            on request? data location: Savartus facility, Wisconsin, USA</Decide>
          </p>

          <h2>9. Support and availability</h2>
          <p>
            Support is provided by email at info@savartus.com during{" "}
            <Decide>support hours and time zone</Decide>. We aim to keep the service available but do
            not guarantee uninterrupted access; planned maintenance is announced in advance where
            practical. <Decide>any availability or retrieval-time commitment</Decide>
          </p>

          <h2>10. Liability</h2>
          <p>
            <Decide>Warranty disclaimer and limitation of liability to be provided by legal
            counsel, e.g. liability capped at fees paid in the preceding 12 months, and exclusion of
            indirect damages.</Decide>
          </p>

          <h2>11. Changes to these terms</h2>
          <p>
            We may update these terms with <Decide>notice period</Decide> notice by email. Continuing
            to use the service after the effective date means you accept the updated terms.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These terms are governed by the laws of <Decide>state</Decide>, and disputes are heard in
            the courts of <Decide>venue</Decide>.
          </p>
    </>
  );
}
