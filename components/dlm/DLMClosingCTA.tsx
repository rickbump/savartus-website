import Link from "next/link";

export function DLMClosingCTA() {
  return (
    <section className="dlm-closing">
      <div className="site-container">
        <div className="dlm-closing-inner">
          <p className="dlm-eyebrow dlm-eyebrow-light">
            GOVERN INFORMATION. NOT INFRASTRUCTURE.
          </p>

          <h2>
            Technology changes.
            <br />
            Information persists.
          </h2>

          <p className="dlm-closing-copy">
            Savartus Data Lifecycle Management provides a policy-driven
            framework for understanding, governing, protecting, preserving,
            and continuously optimizing enterprise information throughout its
            existence.
          </p>

          <div className="dlm-closing-actions">
            <Link
              href="/resources/dlm-specification"
              className="button button-light"
            >
              Explore the DLM Specification
            </Link>

            <Link href="/contact" className="button button-outline-light">
              Talk to Savartus
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}