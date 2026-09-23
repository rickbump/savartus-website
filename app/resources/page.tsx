import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resources",

  description:
    "Explore Savartus technical resources, product information, Enterprise Data Lifecycle documentation, Active Archive architecture, preservation, and Enterprise Library Systems.",

  alternates: {
    canonical: "/resources",
  },

  openGraph: {
    title: "Resources | Savartus",
    description:
      "Technical resources for Data Lifecycle Management, Active Archive, preservation, optical storage, and Savartus Enterprise Library Systems.",
    url: "/resources",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Resources | Savartus",
    description:
      "Technical resources for Data Lifecycle Management, Active Archive, preservation, optical storage, and Savartus Enterprise Library Systems.",
  },
};

export default function ResourcesPage() {
  return (
    <main>
      <section className="resources-hero">
        <div className="site-container resources-hero-inner">
          <p className="resources-eyebrow">RESOURCES</p>

          <h1>
            Understand the architecture.
            <br />
            Explore the technology.
          </h1>

          <p className="resources-hero-copy">
            Technical documents, product information, specifications, and
            educational resources for managing, storing, and preserving
            enterprise information.
          </p>
        </div>
      </section>

      <section className="resources-section resources-featured">
        <div className="site-container">
          <div className="resources-section-header">
            <p className="resources-eyebrow">FEATURED RESOURCE</p>

            <h2>
              Enterprise Data
              <br />
              Lifecycle™ Specification
            </h2>

            <p className="resources-lead">
              A technology-independent architecture for understanding
              information state, governance requirements, policy, and lifecycle
              transitions across the enterprise.
            </p>
          </div>

          <Link
            href="/resources/dlm-specification"
            className="resources-featured-card"
          >
            <div>
              <span>SPECIFICATION</span>
              <h3>Enterprise Data Lifecycle™</h3>
              <p>
                Explore the lifecycle model, Enterprise Data State Vector,
                policy architecture, and governance decision model.
              </p>
            </div>

            <strong>Explore the Specification →</strong>
          </Link>
        </div>
      </section>

      <section id="active-archive" className="resources-section">
        <div className="site-container">
          <div className="resources-section-header">
            <p className="resources-eyebrow">ACTIVE ARCHIVE</p>

            <h2>
              Performance and preservation
              <br />
              working together.
            </h2>
          </div>

          <div className="resources-grid">
            <Link href="/active-archive" className="resources-card">
              <span>ARCHITECTURE</span>
              <h3>Active Archive Overview</h3>
              <p>
                See how performance storage, nearline optical preservation, and
                offline optical retention work within one environment.
              </p>
            </Link>

            <Link
              href="/active-archive/service"
              className="resources-card"
            >
              <span>SERVICE</span>
              <h3>Active Archive as a Service</h3>
              <p>
                Explore Savartus managed Active Archive architecture and
                lifecycle economics.
              </p>
            </Link>

            <Link
              href="/preservation"
              className="resources-card"
            >
              <span>SOLUTION</span>
              <h3>Preservation</h3>
              <p>
                Preserve information on nearline optical storage with optional
                physically isolated offline optical retention.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section id="els" className="resources-section resources-els">
        <div className="site-container">
          <div className="resources-section-header">
            <p className="resources-eyebrow">ENTERPRISE LIBRARY SYSTEMS</p>

            <h2>
              Explore the
              <br />
              ELS family.
            </h2>
          </div>

          <div className="resources-grid">
            <Link href="/products/els" className="resources-card">
              <span>FAMILY OVERVIEW</span>
              <h3>ELS Systems</h3>
              <p>
                Compare compact, rack-mounted, and physically isolated optical
                preservation systems.
              </p>
            </Link>

            <Link href="/products/els150" className="resources-card">
              <span>STAND ALONE</span>
              <h3>ELS150</h3>
              <p>
                Integrated Active Archive with performance storage and optical
                preservation.
              </p>
            </Link>

            <Link href="/products/els300" className="resources-card">
              <span>RACK MOUNT</span>
              <h3>ELS300</h3>
              <p>
                Dedicated nearline optical preservation for Active Archive
                environments.
              </p>
            </Link>
          </div>

          <div className="resources-view-all">
            <Link href="/products/els" className="button button-secondary">
              Explore All ELS Systems
            </Link>
          </div>
        </div>
      </section>

      <section id="software" className="resources-section">
        <div className="site-container">
          <div className="resources-section-header">
            <p className="resources-eyebrow">SOFTWARE & MANAGEMENT</p>

            <h2>
              Information intelligence
              <br />
              and storage management.
            </h2>
          </div>

          <div className="resources-grid">
            <Link href="/technology/orain" className="resources-card">
              <span>STORAGE MANAGEMENT</span>
              <h3>oRain</h3>
              <p>
                Object, media, tier, and location awareness across Savartus
                storage environments.
              </p>
            </Link>

            <Link
              href="/products/file-management"
              className="resources-card"
            >
              <span>INFORMATION LAYER</span>
              <h3>File Management System</h3>
              <p>
                Search, metadata, management, and workflow across enterprise
                information.
              </p>
            </Link>

            <Link
              href="/data-lifecycle-management"
              className="resources-card"
            >
              <span>GOVERNANCE</span>
              <h3>Data Lifecycle Management</h3>
              <p>
                Policy-driven lifecycle management based on information
                requirements rather than age.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}