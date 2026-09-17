export function ActiveArchiveArchitecture() {
  return (
    <section className="aa-section aa-dual-write">
      <div className="site-container">
        <div className="aa-section-header">
         <p className="aa-eyebrow">ACTIVE ARCHIVE ARCHITECTURE</p>

          <h2>
            Performance storage and optical preservation
            <br />
            working together.
          </h2>

          <p className="aa-lead">
            Information is written to performance storage for active use and to
            nearline optical storage for preservation. When the performance copy
            is no longer required, it can be removed according to policy while
            the preserved optical copy remains discoverable and retrievable.
          </p>
        </div>

        <div className="dual-write-diagram">
          <div className="dual-ingest">
            <div className="dual-object">OBJECT</div>
            <div className="dual-line dual-line-down" />
          </div>

          <div className="dual-split">
            <div className="dual-card">
              <div className="dual-card-label">PERFORMANCE STORAGE</div>
              <h3>SSD / HDD</h3>
              <p>Immediate access while the workload requires it.</p>
            </div>

            <div className="dual-card dual-card-optical">
              <div className="dual-card-label">NEARLINE PRESERVATION</div>
              <h3>Optical</h3>
              <p>
                An independent preserved copy designed for long-term retention.
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
