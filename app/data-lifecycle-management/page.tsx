import Image from "next/image";
import Link from "next/link";

const edsvDimensions = [
  {
    name: "Identity",
    description: "What the information is and how it is persistently identified.",
  },
  {
    name: "Relationships",
    description:
      "How the information relates to people, systems, records, and other information.",
  },
  {
    name: "Business Value",
    description:
      "The current and potential importance of the information to the enterprise.",
  },
  {
    name: "Risk",
    description:
      "Business, operational, legal, security, and preservation risk.",
  },
  {
    name: "Retention",
    description:
      "How long the information must or should remain available.",
  },
  {
    name: "Protection",
    description:
      "The protection requirements that apply to the information.",
  },
  {
    name: "Security",
    description:
      "Access, confidentiality, isolation, and security requirements.",
  },
  {
    name: "Compliance",
    description:
      "Regulatory, legal, contractual, and governance obligations.",
  },
  {
    name: "Classification",
    description:
      "The information's governing classification and handling requirements.",
  },
  {
    name: "Integrity",
    description:
      "The trustworthiness and integrity requirements of the information.",
  },
  {
    name: "Availability",
    description:
      "How accessible the information must be to authorized users and systems.",
  },
  {
    name: "Provenance",
    description:
      "Where the information came from and the history relevant to its trust.",
  },
];

const governanceSteps = [
  {
    number: "01",
    label: "UNDERSTAND",
    title: "Understand the information",
    description:
      "Establish identity, metadata, relationships, provenance, business context, and governance-relevant state.",
  },
  {
    number: "02",
    label: "EVALUATE",
    title: "Apply enterprise policy",
    description:
      "Determine which retention, protection, security, compliance, preservation, business, and other governance requirements apply.",
  },
  {
    number: "03",
    label: "DECIDE",
    title: "Determine what should happen",
    description:
      "Produce an explainable Governance Decision based on current governed state and applicable policy.",
  },
  {
    number: "04",
    label: "ACT",
    title: "Authorize and carry out the action",
    description:
      "Establish authority and authorization, then carry out the permitted or required action through the appropriate enterprise technology.",
  },
  {
    number: "05",
    label: "VERIFY",
    title: "Confirm what actually happened",
    description:
      "Establish the outcome, verify that requirements were satisfied, and preserve the evidence needed to substantiate the result.",
  },
  {
    number: "06",
    label: "REEVALUATE",
    title: "Govern from the new context",
    description:
      "Outcomes, events, changing requirements, new relationships, and other material changes update enterprise context and may trigger another evaluation.",
  },
];

const lifecycleStages = [
  {
    number: "01",
    name: "Created",
    description: "Information has been created and enters enterprise context.",
  },
  {
    number: "02",
    name: "Active",
    description: "Information is actively used in business operations.",
  },
  {
    number: "03",
    name: "Collaborative",
    description: "Information is actively changed by multiple users or systems.",
  },
  {
    number: "04",
    name: "Managed",
    description:
      "Information remains operationally valuable while governance becomes increasingly important.",
  },
  {
    number: "05",
    name: "Protected",
    description:
      "Protection requirements become a defining part of the information's governed state.",
  },
  {
    number: "06",
    name: "Archived",
    description:
      "Information is retained primarily for historical, evidentiary, analytical, or governance value.",
  },
  {
    number: "07",
    name: "Preservation",
    description:
      "Long-term integrity, authenticity, context, and usability become primary requirements.",
  },
  {
    number: "08",
    name: "Disposition Eligible",
    description:
      "Policy conditions permit disposition, subject to authority and authorization.",
  },
  {
    number: "09",
    name: "Disposed",
    description:
      "Authorized disposition has been completed and appropriately evidenced.",
  },
];

const lifecycleStateExamples = [
  "Created",
  "Active",
  "Collaborative",
  "Managed",
  "Protected",
  "Archived",
  "Preservation",
  "Disposition Eligible",
];

const storageExamples = [
  {
    label: "HIGH-PERFORMANCE",
    value: "SSD / HDD / Object",
  },
  {
    label: "ONLINE",
    value: "Disk / Object / Optical",
  },
  {
    label: "PRESERVATION",
    value: "Optical / Object / Preservation technologies",
  },
  {
    label: "OFFLINE / ISOLATED",
    value: "Removable / Air-gapped / Deep preservation",
  },
  {
    label: "OTHER",
    value: "Cloud / NAS / Tape / Application-managed storage",
  },
];

export default function DataLifecycleManagementPage() {
  return (
    <main>
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="dlm2-hero">
        <div className="site-container dlm2-hero-inner">
          <p className="dlm2-eyebrow">DATA LIFECYCLE MANAGEMENT</p>

          <h1>
            Your data has more
            <br />
            than a birthday.
          </h1>

          <p className="dlm2-hero-copy">
            Savartus Data Lifecycle Management evaluates and governs
            information based on what it is, what it means, what obligations
            apply to it, what it is worth, and what the organization needs from
            it — not simply how long it has existed.
          </p>

          <div className="dlm2-age-statement">
            <span>90 DAYS</span>

            <strong>
              A file turning 90 days old isn&apos;t a business event.
            </strong>
          </div>

          <div className="dlm2-hero-actions">
            <a href="#understand" className="button button-primary">
              See How DLM Works
            </a>

            <Link
              href="/resources/dlm-specification"
              className="button button-secondary"
            >
              Explore the Specification
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          UNDERSTAND / EDSV
          ===================================================== */}

      <section id="understand" className="dlm2-section dlm2-context">
        <div className="site-container">
          <div className="dlm2-section-header">
            <p className="dlm2-eyebrow">ENTERPRISE DATA STATE VECTOR</p>

            <h2>
              Age is only
              <br />
              one characteristic.
            </h2>

            <p className="dlm2-lead">
              Lifecycle governance depends on a much richer understanding of
              information — its identity, relationships, obligations, value,
              risk, protection requirements, integrity, availability,
              location, provenance, and other governance-relevant context.
            </p>
          </div>

          <div className="dlm2-dimension-grid">
            {edsvDimensions.map((dimension, index) => (
              <article className="dlm2-dimension-card" key={dimension.name}>
                <span>{String(index + 1).padStart(2, "0")}</span>

                <h3>{dimension.name}</h3>

                <p>{dimension.description}</p>
              </article>
            ))}
          </div>

          <div className="dlm2-edsv-more">
            <span>+</span>

            <div>
              <strong>Other governance-relevant context</strong>
              <p>
                The canonical Enterprise Data State Vector also incorporates
                dimensions such as Confidence, Storage, and Location as part of
                the governed understanding of information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INFORMATION IN CONTEXT
          ===================================================== */}

      <section className="dlm2-section dlm2-knowledge">
        <div className="site-container">
          <div className="dlm2-section-header">
            <p className="dlm2-eyebrow">INFORMATION IN CONTEXT</p>

            <h2>
              Govern what the information means —
              <br />
              not just where it lives.
            </h2>

            <p className="dlm2-lead">
              Savartus establishes persistent identity and connects metadata,
              assertions, relationships, events, provenance, and business context so
              information can be understood consistently across systems and over
              time.
            </p>
          </div>

           <div className="dlm2-illustration">
             <Image
               src="/images/dlm/dlm-information-in-context.png"
               alt="Identity, metadata, relationships, events, provenance, and context combine to establish enterprise knowledge."
               width={1942}
               height={809}
               className="dlm2-illustration-image"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          GOVERNANCE CYCLE
          ===================================================== */}

      <section className="dlm2-section dlm2-governance">
        <div className="site-container">
          <div className="dlm2-section-header">
            <p className="dlm2-eyebrow">POLICY-DRIVEN GOVERNANCE</p>

            <h2>
                Understand. Evaluate. Decide.
                <br />
                Act. Verify. Reevaluate.
            </h2>

            <p className="dlm2-lead">
                Governance is a continuous cycle. Savartus evaluates enterprise
                context against policy, determines what should happen, preserves the
                distinction between decision and authorization, verifies the outcome,
                and governs again from the resulting context.
            </p>
            </div>

            <div className="dlm2-illustration">
            <Image
                src="/images/dlm/dlm-governance-cycle.png"
                alt="Continuous policy-driven governance cycle: Understand, Evaluate, Decide, Act, Verify, and Reevaluate."
                width={1944}
                height={445}
                className="dlm2-illustration-image"
            />
          </div>
        </div>
      </section>
      {/* =====================================================
          LIFECYCLE
          ===================================================== */}

      <section className="dlm2-section dlm2-lifecycle">
        <div className="site-container">
          <div className="dlm2-section-header">
            <p className="dlm2-eyebrow">ENTERPRISE DATA LIFECYCLE™</p>

            <h2>
              Information has a
              <br />
              business lifecycle.
            </h2>

            <p className="dlm2-lead">
              Lifecycle stages describe the business and governance state of
              information. They do not define the storage technology that holds
              it.
            </p>
          </div>

          <div className="dlm2-lifecycle-track">
            {lifecycleStages.map((stage) => (
              <article className="dlm2-lifecycle-stage" key={stage.name}>
                <span>{stage.number}</span>

                <h3>{stage.name}</h3>

                <p>{stage.description}</p>
              </article>
            ))}
          </div>

          <div className="dlm2-transition-line">
            <span>←</span>
            <div />
            <strong>POLICY-DRIVEN TRANSITIONS</strong>
            <div />
            <span>→</span>
          </div>

          <p className="dlm2-transition-copy">
            Lifecycle transitions may move forward or backward as information
            requirements change. The appropriate transition is determined by
            policy and governed context — not merely by elapsed time.
          </p>
        </div>
      </section>

      {/* =====================================================
          STATE ≠ STORAGE
          ===================================================== */}

      <section className="dlm2-section dlm2-separation">
        <div className="site-container">
            <div className="dlm2-section-header">
            <p className="dlm2-eyebrow">A CRITICAL DISTINCTION</p>

            <h2>
                Information state is
                <br />
                not storage state.
            </h2>

            <p className="dlm2-lead">
                An information object can remain in the same lifecycle state while its
                storage placement changes — or change lifecycle state without requiring
                a storage migration.
            </p>
            </div>

            <div className="dlm2-illustration">
            <Image
                src="/images/dlm/dlm-state-vs-storage.png"
                alt="Information lifecycle state is distinct from storage placement and storage technology."
                width={1944}
                height={364}
                className="dlm2-illustration-image"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          PRACTICAL EXAMPLE
          ===================================================== */}

      <section className="dlm2-section dlm2-example">
        <div className="site-container">
          <div className="dlm2-example-inner">
            <p className="dlm2-eyebrow">PRACTICAL EXAMPLE</p>

            <h2>
              Archived information can become
              <br />
              operationally important again.
            </h2>

            <p>
              A dataset may remain in an <strong>Archived</strong> lifecycle
              state while moving from low-cost storage back to a
              high-performance tier because a new analytics or AI workload
              requires it.
            </p>

            <div className="dlm2-example-flow">
              <div>
                <span>LIFECYCLE STATE</span>
                <strong>Archived</strong>
              </div>

              <div className="dlm2-example-arrow">→</div>

              <div>
                <span>NEW BUSINESS REQUIREMENT</span>
                <strong>AI / Analytics</strong>
              </div>

              <div className="dlm2-example-arrow">→</div>

              <div>
                <span>STORAGE PLACEMENT</span>
                <strong>High Performance</strong>
              </div>
            </div>

            <p className="dlm2-example-close">
              <strong>Its storage changed. Its lifecycle state did not.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          SPECIFICATION RELATIONSHIP
          ===================================================== */}

      <section className="dlm2-section dlm2-specification">
        <div className="site-container">
          <div className="dlm2-specification-panel">
            <div>
              <p className="dlm2-eyebrow">
                ENTERPRISE DATA LIFECYCLE™ SPECIFICATION
              </p>

              <h2>
                The architecture
                <br />
                behind Savartus DLM.
              </h2>

              <p>
                Savartus Data Lifecycle Management is based on the architectural
                principles defined by the Enterprise Data Lifecycle™
                Specification: persistent information identity, governed state,
                policy-driven decisions, authorized action, verification,
                evidence, and continuous reevaluation.
              </p>
            </div>

            <div className="dlm2-specification-actions">
              <Link
                href="/resources/dlm-specification"
                className="button button-primary"
              >
                Explore the Specification
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLOSING
          ===================================================== */}

      <section className="dlm2-closing">
        <div className="site-container dlm2-closing-inner">
          <p className="dlm2-eyebrow dlm2-eyebrow-light">
            DATA LIFECYCLE MANAGEMENT
          </p>

          <h2>
            Govern the information.
            <br />
            Not just the infrastructure.
          </h2>

          <p>
            Understand what information is, what it means, what it requires,
            and what should happen next — then verify the result and govern
            from the new context.
          </p>

          <div className="dlm2-closing-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/resources/dlm-specification"
              className="button button-outline-light"
            >
              Explore Enterprise Data Lifecycle™
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}