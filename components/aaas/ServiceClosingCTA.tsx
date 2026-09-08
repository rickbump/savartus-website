import Link from "next/link";

export function ServiceClosingCTA() {
  return (
    <section className="aaas-closing">
      <div className="site-container">
        <div className="aaas-closing-inner">
          <p className="aaas-eyebrow aaas-eyebrow-light">
            ACTIVE ARCHIVE AS A SERVICE
          </p>

          <h2>
            Keep what matters.
            <br />
            Stop overpaying to keep it.
          </h2>

          <p>
            Performance when the information requires performance.
            Preservation for as long as the information requires preservation.
          </p>

          <div className="aaas-actions">
            <Link href="/contact" className="button button-light">
              Discuss Your Storage Requirements
            </Link>

            <Link
              href="/active-archive"
              className="button button-outline-light"
            >
              Explore Active Archive
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}