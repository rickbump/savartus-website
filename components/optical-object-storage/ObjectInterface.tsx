export function ObjectInterface() {
  return (
    <section className="opt-section opt-interface">
      <div className="site-container">
        <div className="opt-section-header">
          <p className="opt-eyebrow">OBJECT STORAGE ACCESS</p>

          <h2>
            Optical media.
            <br />
            Modern object access.
          </h2>

          <p className="opt-lead">
            Savartus exposes optical storage through an object-storage
            architecture, allowing applications and users to interact with
            preserved information through familiar interfaces rather than
            treating optical media as an isolated storage silo.
          </p>
        </div>

        <div className="opt-interface-diagram">
          <div className="opt-interface-top">
            <div>Applications</div>
            <div>Browser</div>
            <div>S3-Compatible API</div>
            <div>Integrations</div>
          </div>

          <div className="opt-interface-arrow">↓</div>

          <div className="opt-orain-card">
            <span>SAVARTUS SOFTWARE</span>
            <strong>oRain</strong>
            <p>
              Object management, location awareness, access, and orchestration
              across optical storage resources.
            </p>
          </div>

          <div className="opt-interface-arrow">↓</div>

          <div className="opt-interface-bottom">
            <div>
              <span>ONLINE</span>
              <strong>Optical Libraries</strong>
            </div>

            <div>
              <span>OFFLINE</span>
              <strong>Optical Preservation</strong>
            </div>
          </div>
        </div>

        <div className="opt-interface-statement">
          <strong>
            Object storage accessibility. Optical preservation characteristics.
          </strong>
        </div>
      </div>
    </section>
  );
}