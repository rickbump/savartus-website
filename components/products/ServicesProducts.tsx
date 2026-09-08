import Link from "next/link";

export function ServicesProducts() {
  return (
    <section className="products-section products-services">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">AS A SERVICE</p>

          <h2>
            Savartus architecture.
            <br />
            Without owning the infrastructure.
          </h2>

          <p className="products-lead">
            Savartus can deliver the same Active Archive and preservation
            architecture as a managed service, allowing organizations to align
            storage economics with information access requirements.
          </p>
        </div>

        <div className="products-service-panel">
          <div className="products-service-copy">
            <p className="products-card-label">
              ACTIVE ARCHIVE AS A SERVICE
            </p>

            <h3>Performance when you need it. Preservation throughout.</h3>

            <p>
              Information enters a performance tier and optical preservation
              simultaneously. As the high-performance copy is no longer
              required, storage placement and monthly economics can change
              while the preserved information remains available.
            </p>

            <Link
              href="/active-archive/service"
              className="button button-primary"
            >
              Explore Active Archive as a Service
            </Link>
          </div>

          <div className="products-service-flow">
            <div>
              <span>01</span>
              <strong>Hot Access</strong>
              <p>SSD / HDD + Optical</p>
            </div>

            <div className="products-service-arrow">→</div>

            <div>
              <span>02</span>
              <strong>Online Optical</strong>
              <p>Accessible + Preserved</p>
            </div>

            <div className="products-service-arrow">→</div>

            <div>
              <span>03</span>
              <strong>Offline Optical</strong>
              <p>Physical Isolation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}