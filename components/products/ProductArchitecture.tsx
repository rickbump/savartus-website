export function ProductArchitecture() {
  return (
    <section className="products-section products-architecture">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">ONE ARCHITECTURE</p>

          <h2>
            Hardware and software
            <br />
            working as one environment.
          </h2>

          <p className="products-lead">
            Savartus products are designed as components of a managed
            information environment rather than isolated storage appliances.
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
              <strong>Data Lifecycle Management</strong>
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
              <span>PERFORMANCE</span>
              <strong>SSD / HDD</strong>
            </div>

            <div className="products-tier-online">
              <span>ONLINE PRESERVATION</span>
              <strong>ELS Optical Libraries</strong>
            </div>

            <div className="products-tier-offline">
              <span>OFFLINE PRESERVATION</span>
              <strong>ELS-OL Libraries</strong>
            </div>
          </div>
        </div>

        <div className="products-architecture-message">
          <strong>
            One managed view across performance, online optical, and offline
            optical storage.
          </strong>
        </div>
      </div>
    </section>
  );
}