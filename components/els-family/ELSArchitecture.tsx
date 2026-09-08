export function ELSArchitecture() {
  return (
    <section className="els-section els-architecture">
      <div className="site-container">
        <div className="els-section-header">
          <p className="els-eyebrow">ACTIVE ARCHIVE ARCHITECTURE</p>

          <h2>
            One managed environment
            <br />
            across storage tiers.
          </h2>

          <p className="els-lead">
            ELS systems provide the optical foundation of Savartus Active
            Archive. Performance storage, online optical preservation, and
            offline optical retention remain part of one oRain-managed
            environment.
          </p>
        </div>

        <div className="els-architecture-stack">
          <div className="els-architecture-orain">
            <span>oRain STORAGE OS</span>
            <strong>One managed view of the information</strong>
            <p>
              Namespace · object location · media location · system location ·
              orchestration · retrieval
            </p>
          </div>

          <div className="els-architecture-arrow">↓</div>

          <div className="els-tier-grid">
            <article className="els-tier-hot">
              <p className="els-card-label">PERFORMANCE TIER</p>
              <h3>SSD / HDD</h3>
              <p>
                Sized and configured for the workload and required access
                performance.
              </p>
            </article>

            <article className="els-tier-online">
              <p className="els-card-label">ONLINE OPTICAL</p>
              <h3>ELS Systems</h3>
              <p>
                Automated write-once optical preservation with online
                retrieval.
              </p>
            </article>

            <article className="els-tier-offline">
              <p className="els-card-label">OFF-LINE OPTICAL</p>
              <h3>ELS-OL Systems</h3>
              <p>
                Physically isolated media retained within the managed
                information environment.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}