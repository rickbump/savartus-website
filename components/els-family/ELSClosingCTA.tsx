import Link from "next/link";

export function ELSClosingCTA() {
  return (
    <section className="els-closing">
      <div className="site-container">
        <div className="els-closing-inner">
          <p className="els-eyebrow els-eyebrow-light">
            ACTIVE ARCHIVE. BUILT TO SCALE. BUILT TO PRESERVE.
          </p>

          <h2>
            Start where you are.
            <br />
            Scale where the data takes you.
          </h2>

          <p>
            From standalone systems to multi-petabyte online and off-line
            preservation, the Savartus ELS family provides an optical
            foundation for long-lived enterprise information.
          </p>

          <div className="els-closing-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/optical-object-storage"
              className="button button-outline-light"
            >
              Explore Optical Object Storage
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}