export function ActiveArchiveArchitecture() {
  return (
    <section className="aa-section aa-dual-write">
      <div className="site-container">
        <div className="aa-section-header">
         <p className="aa-eyebrow">ACTIVE ARCHIVE ARCHITECTURE</p>

          <h2>
            Performance and preservation
            <br />
            working together.
          </h2>

          <p className="aa-lead">
            Information is stored across both performance and preservation tiers.
            Information remains available on high-performance storage while Savartus
            automatically preserves it on optical storage. How long information remains
            on the performance tier is policy-driven and configurable.
          </p>
        </div>

        <div className="dual-write-diagram">
          <div className="dual-ingest">
            <div className="dual-object">OBJECT</div>
            <div className="dual-line dual-line-down" />
          </div>

          <div className="dual-split">
            <div className="dual-card">
              <div className="dual-card-label">HOT STORAGE</div>
              <h3>SSD / HDD</h3>
              <p>Immediate access and application performance.</p>
            </div>

            <div className="dual-card dual-card-optical">
              <div className="dual-card-label">OPTICAL OBJECT STORAGE</div>
              <h3>Preserved from day one</h3>
              <p>
                Durable, immutable storage designed for long-term retention.
              </p>
            </div>
          </div>

          <div className="dual-message">
            <strong>
              Performance and preservation begin at the same time.
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
