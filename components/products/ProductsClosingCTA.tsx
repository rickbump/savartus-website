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
            Choose Active Archive, Preservation, or Data Lifecycle Management,
            then deploy on-premises, as a service, or in a hybrid model.
          </p>

          <div className="products-closing-actions">
            <Link href="/active-archive" className="button button-light">
              Active Archive
            </Link>

            <Link href="/preservation" className="button button-outline-light">
              Preservation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
