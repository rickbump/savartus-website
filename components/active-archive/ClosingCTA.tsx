import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="aa-closing">
      <div className="site-container">
        <div className="aa-closing-inner">
          <p className="aa-eyebrow aa-eyebrow-light">THINK LONG TERM</p>

          <h2>
            Your information may live
            <br />
            for decades.
          </h2>

          <p className="aa-closing-statement">
            Your expensive storage doesn&apos;t have to.
          </p>

          <p className="aa-closing-copy">
            Preserve information immediately. Maintain high-performance access
            while it matters. Change storage placement as requirements change.
          </p>

          <div className="aa-closing-actions">
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