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
            Savartus helps organizations keep information active while it is
            needed, preserve it for the long term, and govern it according to
            what it is, what it means, and what it requires.
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
                Active when you need it. Preserved from the start.
              </p>
            </Link>

            <Link
              href="/preservation"
              className="products-pillar"
            >
              <span>02</span>
              <strong>Preservation</strong>
              <p>
                Preserve it. Keep it available. Isolate it when required.
              </p>
            </Link>

            <Link
              href="/data-lifecycle-management"
              className="products-pillar"
            >
              <span>03</span>
              <strong>Data Lifecycle Management</strong>
              <p>
                Govern information according to what it requires.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section id="deployment" className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">DEPLOYMENT</p>

            <h2>
              The solution defines the work.
              <br />
              Deployment defines delivery.
            </h2>

            <p className="products-lead">
              Active Archive, Preservation, and Data Lifecycle Management can
              be delivered on-premises, as a service, or as a hybrid model
              aligned to operational, governance, and security requirements.
            </p>
          </div>

          <div className="products-software-grid">
            <article className="products-software-card">
              <p className="products-card-label">DEPLOYMENT OPTION</p>
              <h3>On-Premises</h3>
              <p>
                Savartus technology runs within the customer environment when
                infrastructure control, locality, or physical custody are
                primary requirements.
              </p>
            </article>

            <article className="products-software-card">
              <p className="products-card-label">DEPLOYMENT OPTION</p>
              <h3>As a Service</h3>
              <p>
                Savartus operates the infrastructure and exposes the solution
                as a managed service for active archive, preservation, or DLM
                workloads.
              </p>
            </article>

            <article className="products-software-card">
              <p className="products-card-label">DEPLOYMENT OPTION</p>
              <h3>Hybrid</h3>
              <p>
                Customers can combine on-premises systems, managed services,
                and external repositories under the same solution model.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="technology" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">PRODUCTS</p>

            <h2>
              Technologies that deliver
              <br />
              the solutions.
            </h2>

            <p className="products-lead">
              Enterprise Library Systems, oRain, FMS, and the Savartus DLM
              Platform are products and technologies used to execute the
              solution strategy.
            </p>
          </div>

          <div className="products-software-grid">
            <Link href="/products/els" className="products-software-card">
              <p className="products-card-label">STORAGE SYSTEMS</p>
              <h3>Enterprise Library Systems</h3>
              <p>
                Nearline and offline optical infrastructure from compact
                systems through petabyte-scale enterprise libraries.
              </p>
              <span className="products-card-link">Explore ELS Systems →</span>
            </Link>

            <Link href="/technology/orain" className="products-software-card">
              <p className="products-card-label">STORAGE MANAGEMENT</p>
              <h3>oRain</h3>
              <p>
                Storage management across performance, nearline optical, and
                offline optical environments.
              </p>
              <span className="products-card-link">Explore oRain →</span>
            </Link>

            <Link
              href="/products/file-management"
              className="products-software-card"
            >
              <p className="products-card-label">INFORMATION MANAGEMENT</p>
              <h3>FMS + DLM Platform</h3>
              <p>
                Metadata, search, governance, policy, information context,
                workflow, and lifecycle management.
              </p>
              <span className="products-card-link">
                Explore Information Management →
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
