import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main>
      <section className="contact-hero">
        <div className="site-container contact-hero-inner">
          <p className="contact-eyebrow">PAGE NOT FOUND</p>

          <h1>
            We couldn&apos;t find
            <br />
            that page.
          </h1>

          <p className="contact-hero-copy">
            The page may have moved or no longer exists. These pages will help
            you find what you were looking for.
          </p>

          <p style={{ marginTop: 28 }}>
            <Link href="/" className="button button-light">
              Go to the homepage
            </Link>
          </p>
        </div>
      </section>

      <section className="resources-section">
        <div className="site-container">
          <div className="resources-grid">
            <Link href="/products/els" className="resources-card">
              <span>PRODUCTS</span>
              <h3>ELS Systems</h3>
              <p>Compare Savartus optical preservation systems.</p>
            </Link>

            <Link href="/active-archive" className="resources-card">
              <span>ARCHITECTURE</span>
              <h3>Active Archive</h3>
              <p>
                See how performance storage and optical preservation work
                together.
              </p>
            </Link>

            <Link href="/insights" className="resources-card">
              <span>INSIGHTS</span>
              <h3>Insights</h3>
              <p>Read perspectives on long-term information preservation.</p>
            </Link>

            <Link href="/data-lifecycle-management" className="resources-card">
              <span>SOLUTIONS</span>
              <h3>Data Lifecycle Management</h3>
              <p>Manage information according to its requirements.</p>
            </Link>

            <Link href="/resources" className="resources-card">
              <span>RESOURCES</span>
              <h3>Resources</h3>
              <p>Browse architecture, product, and operational guidance.</p>
            </Link>

            <Link href="/contact" className="resources-card">
              <span>CONTACT</span>
              <h3>Talk with Savartus</h3>
              <p>Can&apos;t find something? Tell us what you were looking for.</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
