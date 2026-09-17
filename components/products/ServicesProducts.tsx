import Link from "next/link";

export function ServicesProducts() {
  return (
    <section className="products-section products-services">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">LOOKING FOR A COMPLETE SOLUTION?</p>

          <h2>
            Start with the outcome.
            <br />
            Then choose deployment.
          </h2>

          <p className="products-lead">
            Products deliver the technology. Solutions define the customer
            outcome: keep information active and preserved, preserve it without
            an unnecessary performance copy, or govern it across enterprise
            repositories.
          </p>
        </div>

        <div className="products-service-panel">
          <div className="products-service-copy">
            <p className="products-card-label">
              SOLUTIONS
            </p>

            <h3>DLM decides. Storage solutions execute.</h3>

            <p>
              Data Lifecycle Management evaluates information requirements and
              authorizes action. Active Archive and Preservation provide
              storage execution options when optical preservation is the right
              strategy.
            </p>

            <div className="products-closing-actions">
              <Link href="/active-archive" className="button button-primary">
                Active Archive
              </Link>

              <Link href="/preservation" className="button button-secondary">
                Preservation
              </Link>

              <Link
                href="/data-lifecycle-management"
                className="button button-secondary"
              >
                Data Lifecycle Management
              </Link>
            </div>
          </div>

          <div className="products-service-flow">
            <div>
              <span>01</span>
              <strong>Active Archive</strong>
              <p>Performance + nearline optical</p>
            </div>

            <div className="products-service-arrow">→</div>

            <div>
              <span>02</span>
              <strong>Preservation</strong>
              <p>Cache + nearline/offline optical</p>
            </div>

            <div className="products-service-arrow">→</div>

            <div>
              <span>03</span>
              <strong>DLM</strong>
              <p>Governance across any repository</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
