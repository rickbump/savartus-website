import Link from "next/link";

export function ProductsClosingCTA() {
  return (
    <section className="products-closing">
      <div className="site-container">
        <div className="products-closing-inner">
          <p className="products-eyebrow products-eyebrow-light">
            MANAGE. STORE. PRESERVE.
          </p>

          <h2>
            Build the environment
            <br />
            your information requires.
          </h2>

          <p>
            From compact Active Archive systems to petabyte-scale online and
            offline preservation, Savartus combines hardware, software, and
            services into an architecture that can grow with the information it
            manages.
          </p>

          <div className="products-closing-actions">
            <Link href="/products/els" className="button button-light">
              Explore ELS Systems
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