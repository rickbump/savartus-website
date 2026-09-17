export function ProductArchitecture() {
  return (
    <section className="products-section products-architecture">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">PRODUCTS IN CONTEXT</p>

          <h2>
            The same products support
            <br />
            different solution strategies.
          </h2>

          <p className="products-lead">
            Active Archive and Preservation use Savartus storage technologies
            for execution. DLM remains independent and can govern information
            across Savartus and non-Savartus repositories.
          </p>
        </div>

        <div className="products-architecture-diagram">
          <div className="products-architecture-apps">
            <span>APPLICATIONS</span>
            <span>USERS</span>
            <span>S3 / API</span>
            <span>BROWSER</span>
          </div>

          <div className="products-architecture-down">↓</div>

          <div className="products-architecture-software">
            <div>
              <span>MANAGE</span>
              <strong>DLM Platform</strong>
            </div>

            <div>
              <span>ORCHESTRATE</span>
              <strong>oRain</strong>
            </div>

            <div>
              <span>UNDERSTAND</span>
              <strong>File Management System</strong>
            </div>
          </div>

          <div className="products-architecture-down">↓</div>

          <div className="products-architecture-storage">
            <div className="products-tier-hot">
              <span>ACTIVE ARCHIVE</span>
              <strong>Performance Storage + Optical</strong>
            </div>

            <div className="products-tier-online">
              <span>PRESERVATION</span>
              <strong>Cache + Nearline Optical</strong>
            </div>

            <div className="products-tier-offline">
              <span>DLM</span>
              <strong>Cloud / NAS / Object / SSD / HDD / Optical / Tape</strong>
            </div>
          </div>
        </div>

        <div className="products-architecture-message">
          <strong>
            DLM decides based on information requirements. Active Archive and
            Preservation execute the appropriate storage strategy.
          </strong>
        </div>
      </div>
    </section>
  );
}
