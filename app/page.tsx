import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="aa-hero">
        <div className="site-container aa-hero-inner">
          <p className="aa-eyebrow">SAVARTUS</p>

          <h1>
            Manage.
            <br />
            Store.
            <br />
            Preserve.
          </h1>

          <p className="aa-hero-copy">
            Savartus combines data lifecycle management, active archive,
            and optical object storage to help organizations manage
            information according to its value, requirements, and lifecycle.
          </p>

          <div className="aa-hero-actions">
            <Link href="#solutions" className="button button-primary">
              Explore Solutions
            </Link>

            <Link href="/products" className="button button-secondary">
              Explore Products
            </Link>
          </div>
        </div>
      </section>

      <section id="solutions" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">SOLUTIONS</p>

            <h2>
              Information management
              <br />
              beyond storage tiers.
            </h2>

            <p className="products-lead">
              Savartus helps organizations actively manage information,
              preserve it for the long term, and keep it accessible as
              requirements change.
            </p>
          </div>

          <div className="products-pillar-grid">
            <Link href="/active-archive" className="products-pillar">
              <span>01</span>
              <strong>Active Archive</strong>
              <p>
                Immediate performance with preservation from the moment
                information arrives.
              </p>
            </Link>

            <Link
              href="/data-lifecycle-management"
              className="products-pillar"
            >
              <span>02</span>
              <strong>Data Lifecycle Management</strong>
              <p>
                Manage information according to business state, policy,
                value, risk, and requirements.
              </p>
            </Link>

            <Link
              href="/optical-object-storage"
              className="products-pillar"
            >
              <span>03</span>
              <strong>Optical Object Storage</strong>
              <p>
                Durable, write-once object storage for accessible
                preservation and deep retention.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section id="technology" className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">TECHNOLOGY</p>

            <h2>
              Software and storage
              <br />
              working as one environment.
            </h2>

            <p className="products-lead">
              Savartus combines storage orchestration, information
              management, standards-based interfaces, and optical
              preservation technologies into a unified architecture.
            </p>
          </div>

          <div className="products-software-grid">
            <Link
              href="/technology/orain"
              className="products-software-card"
            >
              <p className="products-card-label">STORAGE OS</p>
              <h3>oRain</h3>
              <p>
                Storage management, location awareness, placement,
                orchestration, and restore across performance and optical
                tiers.
              </p>
              <span className="products-card-link">Explore oRain →</span>
            </Link>

            <Link
              href="/products/file-management"
              className="products-software-card"
            >
              <p className="products-card-label">INFORMATION MANAGEMENT</p>
              <h3>FMS</h3>
              <p>
                File references, metadata, identity, relationships,
                searchable attributes, and information context.
              </p>
              <span className="products-card-link">Explore FMS →</span>
            </Link>

            <Link
              href="/products/els"
              className="products-software-card"
            >
              <p className="products-card-label">OPTICAL STORAGE</p>
              <h3>ELS Family</h3>
              <p>
                Standalone, rack-mounted, scalable, and offline optical
                storage systems for long-lived information.
              </p>
              <span className="products-card-link">
                Explore ELS Systems →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="products-closing">
        <div className="site-container products-closing-inner">
          <p className="products-eyebrow products-eyebrow-light">
            SAVARTUS
          </p>

          <h2>
            Technology changes.
            <br />
            Information persists.
          </h2>

          <p>
            Manage the information. Use the right storage. Preserve what
            matters.
          </p>

          <div className="products-closing-actions">
            <Link href="/products" className="button button-light">
              Explore Products
            </Link>

            <Link href="/contact" className="button button-outline-light">
              Talk to Savartus
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}