export function OrainControlPlane() {
  return (
    <section className="orain-section orain-control-section">
      <div className="site-container">
        <div className="orain-section-header">
          <p className="orain-eyebrow">ONE MANAGED ENVIRONMENT</p>

          <h2>
            Storage changes.
            <br />
            oRain keeps track.
          </h2>

          <p>
            Performance storage, online optical libraries and physically
            offline optical media can operate as parts of one managed
            storage architecture.
          </p>
        </div>

        <div className="orain-control-plane">
          <div className="orain-tier">
            <span>HOT / WARM</span>
            <strong>SSD / HDD</strong>
            <p>Performance storage</p>
          </div>

          <div className="orain-connection">↕</div>

          <div className="orain-os">
            <span>STORAGE MANAGEMENT + ORCHESTRATION</span>
            <strong>oRain</strong>

            <div className="orain-os-functions">
              <span>Location</span>
              <span>Placement</span>
              <span>Write Strategy</span>
              <span>Restore</span>
            </div>
          </div>

          <div className="orain-connection">↕</div>

          <div className="orain-storage-row">
            <div className="orain-tier orain-tier-optical">
              <span>ONLINE</span>
              <strong>Optical</strong>
              <p>Accessible preservation</p>
            </div>

            <div className="orain-tier orain-tier-offline">
              <span>OFFLINE</span>
              <strong>Optical</strong>
              <p>Deep preservation</p>
            </div>
          </div>
        </div>

        <p className="orain-control-statement">
          The storage tier can change without losing awareness of the
          information or where it resides.
        </p>
      </div>
    </section>
  );
}