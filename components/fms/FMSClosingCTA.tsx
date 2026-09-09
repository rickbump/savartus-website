import Link from "next/link";

export function FMSClosingCTA() {
  return (
    <section className="fms-closing">
      <div className="site-container">
        <div className="fms-closing-inner">
          <p className="fms-eyebrow fms-eyebrow-light">
            SAVARTUS FILE MANAGEMENT SYSTEM
          </p>

          <h2>
            Information should be
            <br />
            more than a filename.
          </h2>

          <p>
            Identify it. Describe it. Search it. Relate it. Manage it.
          </p>

          <div className="fms-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link
              href="/data-lifecycle-management"
              className="button button-outline-light"
            >
              Explore Data Lifecycle Management
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}