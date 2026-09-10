import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Savartus to discuss Active Archive, Enterprise Library Systems, Data Lifecycle Management, managed services, and partnerships.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">CONTACT SAVARTUS</p>

          <h1>
            Let&apos;s talk about
            <br />
            your information.
          </h1>

          <p className="contact-hero-copy">
            Whether you&apos;re evaluating Active Archive, long-term
            preservation, optical storage, or a better way to manage the
            information lifecycle, we&apos;d like to hear from you.
          </p>
        </div>
      </section>

      <section className="contact-main">
        <div className="site-container contact-main-grid">
          <div className="contact-info">
            <p className="contact-eyebrow">START A CONVERSATION</p>

            <h2>
              Tell us what
              <br />
              you&apos;re working on.
            </h2>

            <p>
              We work with organizations that need to manage information
              differently—whether that means preserving critical data,
              controlling storage costs, improving lifecycle governance, or
              building a more resilient information architecture.
            </p>

            <div className="contact-direct">
              <div>
                <span>Email</span>
                <a href="mailto:info@savartus.com">
                  info@savartus.com
                </a>
              </div>
            </div>

            <div className="contact-tagline">
              <strong>Manage. Store. Preserve.</strong>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>
    </main>
  );
}