export function StateSeparation() {
  return (
    <section className="dlm-section dlm-separation">
      <div className="site-container">
        <div className="dlm-section-header">
          <p className="dlm-eyebrow">A CRITICAL DISTINCTION</p>

          <h2>
            Information state
            <br />
            is not storage state.
          </h2>

          <p className="dlm-lead">
            An information object can remain in the same lifecycle state while
            its storage placement changes — or change lifecycle state without
            requiring a storage migration.
          </p>
        </div>

        <div className="dlm-separation-panel">
          <div className="dlm-state-column">
            <p className="dlm-state-label">INFORMATION LIFECYCLE</p>

            <div className="dlm-state-stack">
              <div>Created</div>
              <div>Active</div>
              <div>Collaborative</div>
              <div>Managed</div>
              <div>Protected</div>
              <div>Archived</div>
              <div>Preserved</div>
            </div>

            <p className="dlm-state-caption">
              What is the information&apos;s current lifecycle context?
            </p>
          </div>

          <div className="dlm-not-equal">≠</div>

          <div className="dlm-state-column">
            <p className="dlm-state-label">STORAGE PLACEMENT</p>

            <div className="dlm-storage-stack">
              <div>
                <span>HOT</span>
                <strong>SSD / HDD</strong>
              </div>

              <div>
                <span>ONLINE</span>
                <strong>Optical Object Storage</strong>
              </div>

              <div>
                <span>OFFLINE</span>
                <strong>Optical Preservation</strong>
              </div>

              <div>
                <span>OTHER</span>
                <strong>Cloud / NAS / Object / Tape</strong>
              </div>
            </div>

            <p className="dlm-state-caption">
              Where and how should the information be stored right now?
            </p>
          </div>
        </div>

        <div className="dlm-separation-example">
          <p className="dlm-eyebrow">EXAMPLE</p>

          <h3>Archived information can become operationally important again.</h3>

          <p>
            A dataset may remain in an Archived lifecycle state while moving
            from low-cost storage back to a high-performance tier because a new
            analytics or AI workload requires it.
          </p>

          <strong>
            The access requirement changed. The lifecycle state did not.
          </strong>
        </div>
      </div>
    </section>
  );
}