import Link from "next/link";

export function OrainClosingCTA() {
  return (
    <section className="orain-closing">
      <div className="site-container">
        <p className="orain-eyebrow orain-eyebrow-light">
          SAVARTUS oRAIN
        </p>

        <h2>
          One managed view
          <br />
          of the data.
        </h2>

        <p>
          SSD. HDD. Online optical. Offline optical.
          <br />
          oRain knows where the information is and how it can be accessed.
        </p>

        <div className="orain-actions">
          <Link href="/contact" className="button button-light">
            Talk to Savartus
          </Link>

          <Link
            href="/products/els"
            className="button button-outline-light"
          >
            Explore ELS Systems
          </Link>
        </div>
      </div>
    </section>
  );
}