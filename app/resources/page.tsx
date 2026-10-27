import type { Metadata } from "next";
import { socialImages } from "@/lib/social-images";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Archiving Resources & Specifications",

  description:
    "Find Savartus technical resources, ELS product information, and Enterprise Data Lifecycle documentation for archive and preservation planning.",

  alternates: {
    canonical: "/resources",
  },

  openGraph: {
    images: socialImages.openGraph,
    title: "Data Archiving Resources & Specifications | Savartus",
    description:
      "Technical resources for Data Lifecycle Management, Active Archive, preservation, optical storage, and Savartus Enterprise Library Systems.",
    url: "/resources",
    type: "website",
  },

  twitter: {
    images: socialImages.twitter,
    card: "summary_large_image",
    title: "Data Archiving Resources & Specifications | Savartus",
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
          <p className="resources-hero-copy">
            Start with the specification when defining governance requirements,
            the architecture pages when planning storage tiers, and the ELS
            comparison when evaluating hardware. These resources connect policy
            decisions to deployment choices without treating storage capacity
            as a substitute for information governance.
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
              Use this resource to distinguish information lifecycle state from
              storage placement and to understand how policy, authorization,
              verification, and reevaluation fit into a governed decision.
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
            <p className="resources-lead">
              For infrastructure and operations teams, these pages explain the
              relationship between active access and long-term preservation.
              Review the service option alongside the architecture to decide
              which responsibilities belong in your environment and which can
              be delivered through a managed deployment.
            </p>
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
            <p className="resources-lead">
              Compare system type, media configuration, drives, and form factor
              before selecting a library. Individual model pages include
              specifications and downloadable sell sheets. Distinguish nearline
              access from physically isolated retention when assessing how a
              system fits your preservation and recovery workflow.
            </p>
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
            <p className="resources-lead">
              Use the software resources to separate storage orchestration,
              information discovery, and governance. oRain tracks objects,
              media, and locations; FMS supplies metadata and workflow context;
              DLM addresses policy-driven information requirements rather than
              relying only on a file&apos;s age.
            </p>
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
      <section className="resources-section">
        <div className="site-container">
          <div className="resources-section-header">
            <p className="resources-eyebrow">APPLY THE ARCHITECTURE</p>
            <h2>Read the operational perspective.</h2>
            <p className="resources-lead">
              The Insights library connects archive design to real planning
              questions. These articles discuss considerations and workflows,
              not customer endorsements or guarantees of compliance.
            </p>
          </div>
          <div className="resources-grid">
            <Link
              href="/insights/medical-imaging-beyond-the-pacs-refresh-cycle"
              className="resources-card"
            >
              <span>HEALTHCARE RECORDS</span>
              <h3>Preserve imaging beyond a PACS refresh</h3>
              <p>
                Consider retrieval, patient privacy, and retention duties when
                planning an optical preservation tier for imaging records.
              </p>
            </Link>
            <Link
              href="/insights/government-records-public-access-permanent-preservation"
              className="resources-card"
            >
              <span>PUBLIC RECORDS</span>
              <h3>Keep retained records findable</h3>
              <p>
                Plan discovery, public-records access, and archival transfer
                without tying permanent information to one primary system.
              </p>
            </Link>
            <Link
              href="/insights/media-archives-find-and-reuse-preserved-content"
              className="resources-card"
            >
              <span>MEDIA ARCHIVES</span>
              <h3>Find and reuse preserved assets</h3>
              <p>
                Connect preservation to discovery, fixity, rights, and recall
                within a media-management workflow.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}