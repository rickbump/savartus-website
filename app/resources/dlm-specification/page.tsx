import type { Metadata } from "next";
import Link from "next/link";

import { FullDocumentRequest } from "@/components/resources/FullDocumentRequest";

export const metadata: Metadata = {
  title: "Enterprise Data Lifecycle™ Specification",

  description:
    "Explore the Enterprise Data Lifecycle™ Specification, a technology-independent information governance architecture for lifecycle state, policy, governed decisions, authorization, verification, and continuous reevaluation.",

  alternates: {
    canonical: "/resources/dlm-specification",
  },

  openGraph: {
    title: "Enterprise Data Lifecycle™ Specification | Savartus",
    description:
      "A technology-independent information governance architecture for understanding enterprise information state, policy, lifecycle transitions, and governed decisions.",
    url: "/resources/dlm-specification",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Enterprise Data Lifecycle™ Specification | Savartus",
    description:
      "A technology-independent information governance architecture for understanding enterprise information state, policy, lifecycle transitions, and governed decisions.",
  },
};

const lifecycleStages = [
  "Created",
  "Active",
  "Collaborative",
  "Managed",
  "Protected",
  "Archived",
  "Preservation",
  "Disposition Eligible",
  "Disposed",
];

const dimensions = [
  "Retention",
  "Protection",
  "Security",
  "Compliance",
  "Classification",
  "Integrity",
  "Availability",
  "Identity",
  "Relationships",
  "Storage",
  "Business Value",
  "Risk",
  "Confidence",
  "Provenance",
  "Location",
];

export default function DLMSpecificationPage() {
  return (
    <main>
      <section className="dlmspec-hero">
        <div className="site-container dlmspec-hero-inner">
          <p className="dlmspec-eyebrow">ENTERPRISE DATA LIFECYCLE™</p>

          <h1>
            An architecture for governing
            <br />
            information according to
            <br />
            what it requires.
          </h1>

          <p className="dlmspec-hero-copy">
            Enterprise Data Lifecycle™ defines a technology-independent
            architecture for understanding information state, governance
            requirements, policy, governed decisions, lifecycle transitions,
            verification, and continuous reevaluation across the enterprise.
          </p>

          <div className="dlmspec-actions">
            <a href="#architecture" className="button button-primary">
              Explore the Architecture
            </a>

            <a
              href="/downloads/specification/Specification Overview.pdf"
              className="button button-secondary"
              download
            >
              Download Overview
            </a>

            <FullDocumentRequest source="DLM specification page hero" />
          </div>
        </div>
      </section>

      <section className="dlmspec-section dlmspec-downloads">
        <div className="site-container">
          <div className="dlmspec-download-panel">
            <div>
              <p className="dlmspec-eyebrow">DOCUMENTS</p>

              <h2>
                Start with the overview.
                <br />
                Request the full specification.
              </h2>

              <p>
                The overview document is available directly. The full
                Enterprise Data Lifecycle™ Specification is distributed by
                request so Savartus can send the appropriate download link.
              </p>
            </div>

            <div className="dlmspec-download-actions">
              <a
                href="/downloads/specification/Specification Overview.pdf"
                className="button button-primary"
                download
              >
                Download Overview
              </a>

              <FullDocumentRequest source="DLM specification document panel" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="architecture"
        className="dlmspec-section dlmspec-premise"
      >
        <div className="site-container">
          <div className="dlmspec-section-header">
            <p className="dlmspec-eyebrow">CORE PREMISE</p>

            <h2>
              Information lifecycle is
              <br />
              not storage lifecycle.
            </h2>

            <p className="dlmspec-lead">
              Traditional lifecycle models often infer information state from
              infrastructure characteristics such as age, access frequency, or
              storage tier. Enterprise Data Lifecycle™ separates the business
              and governance state of information from its operational state.
            </p>
          </div>

          <div className="dlmspec-state-grid">
            <article>
              <span>LIFECYCLE STATE</span>
              <h3>What the information means to the business.</h3>
              <p>
                Business purpose, governance status, value, risk, obligations,
                and lifecycle stage.
              </p>
            </article>

            <div className="dlmspec-not-equal">≠</div>

            <article>
              <span>OPERATIONAL STATE</span>
              <h3>How the information is currently managed.</h3>
              <p>
                Protection, availability, storage, security, retention,
                location, and other operational characteristics.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="dlmspec-section dlmspec-lifecycle">
        <div className="site-container">
          <div className="dlmspec-section-header">
            <p className="dlmspec-eyebrow">CANONICAL LIFECYCLE</p>

            <h2>
              One lifecycle.
              <br />
              Multiple operational states.
            </h2>
          </div>

          <div className="dlmspec-lifecycle-track">
            {lifecycleStages.map((stage, index) => (
              <div className="dlmspec-lifecycle-stage" key={stage}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage}</strong>
              </div>
            ))}
          </div>

          <p className="dlmspec-lifecycle-note">
            Lifecycle stages describe the business and governance state of
            information—not where that information is physically stored.
          </p>
        </div>
      </section>

      <section className="dlmspec-section">
        <div className="site-container">
          <div className="dlmspec-section-header">
            <p className="dlmspec-eyebrow">ENTERPRISE DATA STATE VECTOR</p>

            <h2>
              Understand the state
              <br />
              before making the decision.
            </h2>

            <p className="dlmspec-lead">
              The Enterprise Data State Vector captures the dimensions required
              to evaluate information in governed context.
            </p>
          </div>

          <div className="dlmspec-dimension-grid">
            {dimensions.map((dimension, index) => (
              <div className="dlmspec-dimension-card" key={dimension}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{dimension}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dlmspec-section dlmspec-policy">
        <div className="site-container">
          <div className="dlmspec-section-header">
            <p className="dlmspec-eyebrow">POLICY-DRIVEN GOVERNANCE</p>

            <h2>
              Information changes state when
              <br />
              its requirements change.
            </h2>

            <p className="dlmspec-lead">
              Lifecycle transitions and governance decisions are determined by
              policy and continuously reevaluated as information context,
              obligations, value, risk, relationships, and operational
              requirements change.
            </p>
          </div>

          <div className="dlmspec-policy-grid">
            <article>
              <span>01</span>
              <h3>Deterministic</h3>
              <p>
                Decisions are based on explicit policy rather than hidden
                heuristics.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Continuous</h3>
              <p>
                Governed state can be reevaluated as requirements and context
                change.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Explainable</h3>
              <p>
                Governance decisions should have a clear policy and context
                basis.
              </p>
            </article>

            <article>
              <span>04</span>
              <h3>Auditable</h3>
              <p>
                Decisions, authorized actions, outcomes, verification, and
                evidence can be recorded and reviewed.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="dlmspec-section">
        <div className="site-container">
          <div className="dlmspec-section-header">
            <p className="dlmspec-eyebrow">WHAT EDL IS — AND IS NOT</p>

            <h2>
              An information-governance architecture,
              <br />
              not a storage schedule.
            </h2>
          </div>

          <div className="dlmspec-is-grid">
            <article className="dlmspec-is">
              <span>EDL IS</span>

              <ul>
                <li>An enterprise information-governance architecture</li>
                <li>Technology independent</li>
                <li>Policy driven</li>
                <li>Context and metadata aware</li>
                <li>Business and governed-state focused</li>
              </ul>
            </article>

            <article className="dlmspec-is-not">
              <span>EDL IS NOT</span>

              <ul>
                <li>A storage-tiering algorithm</li>
                <li>An age-based archive schedule</li>
                <li>A vendor-specific storage model</li>
                <li>A replacement for enterprise governance</li>
                <li>A synonym for data movement</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="dlmspec-closing">
        <div className="site-container dlmspec-closing-inner">
          <p className="dlmspec-eyebrow dlmspec-eyebrow-light">
            ENTERPRISE DATA LIFECYCLE™
          </p>

          <h2>
            Manage information
            <br />
            according to what it requires.
          </h2>

          <p>
            Contact Savartus to discuss the Enterprise Data Lifecycle™
            architecture, reference architecture, and specification.
          </p>

          <div className="dlmspec-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <a
              href="/downloads/specification/Specification Overview.pdf"
              className="button button-outline-light"
              download
            >
              Download Overview
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}