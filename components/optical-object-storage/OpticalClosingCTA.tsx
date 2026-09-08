import Link from "next/link";

export function OpticalClosingCTA() {
  return (
    <section className="opt-closing">
      <div className="site-container">
        <div className="opt-closing-inner">
          <p className="opt-eyebrow opt-eyebrow-light">
            TECHNOLOGY CHANGES. INFORMATION PERSISTS.
          </p>

          <h2>
            Build storage around
            <br />
            the life of the information.
          </h2>

          <p>
            Savartus Enterprise Library Systems combine optical media, object
            access, software orchestration, and online/offline preservation in
            an architecture designed for long-lived enterprise information.
          </p>

          <div className="opt-closing-actions">
            <Link href="/products/els" className="button button-light">
              Explore Enterprise Library Systems
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