import Image from "next/image";
import Link from "next/link";
import type { ELSProduct } from "@/data/els-products";

type Props = {
  product: ELSProduct;
};

export function ELSProductDetail({ product }: Props) {
  return (
    <main>
      <section className="product-detail-hero">
        <div className="site-container">
          <div className="product-detail-hero-grid">
            <div>
              <p className="product-detail-eyebrow">
                {product.category.toUpperCase()} OPTICAL STORAGE
              </p>

              <h1>{product.name}</h1>

              <h2>{product.tagline}</h2>

              <p className="product-detail-hero-copy">
                {product.description}
              </p>

              <div className="product-detail-actions">
                <Link href="/contact" className="button button-primary">
                  Talk to Savartus
                </Link>

                <Link
                  href="/products/els"
                  className="button button-secondary"
                >
                  View ELS Family
                </Link>
              </div>
            </div>

            <div>
              {product.image && (
                <div className="product-detail-image-wrap">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={700}
                    height={700}
                    className="product-detail-image"
                    priority
                  />
                </div>
              )}

              <div className="product-detail-metrics">
                {product.metrics.map((metric) => (
                  <div
                    className="product-detail-metric"
                    key={metric.label}
                  >
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="product-detail-section product-detail-architecture">
        <div className="site-container">
          <div className="product-detail-section-header">
            <p className="product-detail-eyebrow">
              ACTIVE ARCHIVE ARCHITECTURE
            </p>

            <h2>
              Performance and preservation
              <br />
              are different jobs.
            </h2>

            <p>
              Savartus systems are designed to participate in a tiered
              architecture where information can remain highly accessible
              while preserved copies reside on durable optical media.
            </p>
          </div>

          <div className="product-architecture-flow">
            <div className="product-architecture-item">
              <article className="product-architecture-card product-architecture-performance">
                <p className="product-detail-card-label">
                  PERFORMANCE TIER
                </p>

                <h3>SSD / HDD</h3>

                <p>{product.architecture.performance}</p>
              </article>
            </div>

            <div className="product-architecture-arrow">→</div>

            <div className="product-architecture-item">
              <article className="product-architecture-card product-architecture-optical">
                <p className="product-detail-card-label">
                  OPTICAL TIER
                </p>

                <h3>{product.name}</h3>

                <p>{product.architecture.optical}</p>
              </article>
            </div>

            <div className="product-architecture-arrow">→</div>

            <div className="product-architecture-item">
              <article className="product-architecture-card product-architecture-offline">
                <p className="product-detail-card-label">
                  DEEP PRESERVATION
                </p>

                <h3>Offline Optical</h3>

                <p>{product.architecture.offline}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {product.scalable && (
        <section className="product-detail-section">
          <div className="site-container">
            <div className="product-detail-section-header">
              <p className="product-detail-eyebrow">
                SCALE-OUT ARCHITECTURE
              </p>

              <h2>
                Add systems.
                <br />
                Keep one namespace.
              </h2>

              <p>
                ELS systems are network-mounted and managed through oRain.
                oRain maintains object and media location awareness across
                multiple libraries, allowing capacity to grow without
                creating isolated storage silos.
              </p>
            </div>

            <div className="els-scale-visual">
              <div className="els-scale-orain">
                <span>STORAGE CONTROL</span>
                <strong>oRain</strong>
              </div>

              <div className="els-scale-connection" />

              <div className="els-scale-systems">
                <div>{product.name}</div>
                <div>{product.name}</div>
                <div>{product.name}</div>
                <div className="els-scale-more">+ More Systems</div>
              </div>

              <p className="els-scale-statement">
                Capacity scales by adding networked libraries while oRain
                maintains awareness of where every object resides.
              </p>
            </div>
          </div>
        </section>
      )}

      {product.offline && (
        <section className="product-detail-section product-detail-architecture">
          <div className="site-container">
            <div className="product-detail-section-header">
              <p className="product-detail-eyebrow">
                OFFLINE PRESERVATION
              </p>

              <h2>
                Physically isolated.
                <br />
                Logically known.
              </h2>

              <p>
                Offline media is air-gapped from the production environment,
                but its contents and location remain indexed so information
                can be located and restored when required.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="product-detail-section product-detail-specs">
        <div className="site-container">
          <div className="product-detail-section-header">
            <p className="product-detail-eyebrow">SYSTEM CHARACTERISTICS</p>

            <h2>{product.name} at a glance.</h2>
          </div>

          <div className="product-spec-table">
            {product.specs.map((spec) => (
              <div className="product-spec-row" key={spec.label}>
                <div>{spec.label}</div>
                <div>{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-section product-use-cases">
        <div className="site-container">
          <div className="product-detail-section-header">
            <p className="product-detail-eyebrow">USE CASES</p>

            <h2>
              Built for information
              <br />
              that needs to persist.
            </h2>
          </div>

          <div className="product-use-case-grid">
            {product.useCases.map((useCase, index) => (
              <article key={useCase}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{useCase}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="product-detail-closing">
        <div className="site-container product-detail-closing-inner">
          <p className="product-detail-eyebrow product-detail-eyebrow-light">
            {product.name}
          </p>

          <h2>
            Manage.
            <br />
            Store.
            <br />
            Preserve.
          </h2>

          <div className="product-detail-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/products/els"
              className="button button-outline-light"
            >
              Explore ELS Family
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}