import Link from "next/link";

export function ServiceCTA() {
  return (
    <section className="aa-section aa-service">
      <div className="site-container">
        <div className="service-panel">
          <div className="service-copy">
            <p className="aa-eyebrow">ACTIVE ARCHIVE AS A SERVICE</p>

            <h2>
              The same architecture.
              <br />
              As a service.
            </h2>

            <p>
              Savartus Active Archive as a Service aligns monthly storage cost
              with the access characteristics of the information.
            </p>

            <p>
              While the high-performance SSD or HDD copy remains active, the
              customer pays for that performance tier together with optical
              preservation. When the hot copy is no longer required, the
              information remains in optical storage and the monthly rate can
              decline accordingly.
            </p>

            <Link
              href="/active-archive/service"
              className="button button-primary"
            >
              Explore Active Archive as a Service
            </Link>
          </div>

          <div className="service-economics">
            <div className="service-tier service-tier-hot">
              <div>
                <span>HOT ACCESS</span>
                <strong>SSD / HDD + Optical</strong>
              </div>

              <div className="service-price">$$$$</div>
            </div>

            <div className="service-down">↓</div>

            <div className="service-tier service-tier-online">
              <div>
                <span>ONLINE OPTICAL</span>
                <strong>Accessible Archive</strong>
              </div>

              <div className="service-price">$$</div>
            </div>

            <div className="service-down">↓</div>

            <div className="service-tier service-tier-offline">
              <div>
                <span>OFFLINE OPTICAL</span>
                <strong>Long-Term Retention</strong>
              </div>

              <div className="service-price">$</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}