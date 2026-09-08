export function ServiceArchitecture() {
  return (
    <section className="aaas-section aaas-architecture">
      <div className="site-container">
        <div className="aaas-section-header">
          <p className="aaas-eyebrow">PRESERVED FROM INGEST</p>

          <h2>
            One upload.
            <br />
            Two destinations.
          </h2>

          <p>
            When information enters the Savartus environment, the architecture
            provides a performance copy for immediate access and an optical
            preservation copy for long-term retention.
          </p>
        </div>

        <div className="aaas-architecture-flow">
          <div className="aaas-ingest">
            <span>INGEST</span>
            <strong>Your Information</strong>
          </div>

          <div className="aaas-down">↓</div>

          <div className="aaas-storage-grid">
            <article className="aaas-hot-card">
              <p className="aaas-card-label">PERFORMANCE COPY</p>
              <h3>SSD / HDD</h3>
              <p>
                Immediate access for active applications, workflows and users.
              </p>
            </article>

            <div className="aaas-plus">+</div>

            <article className="aaas-optical-card">
              <p className="aaas-card-label">PRESERVATION COPY</p>
              <h3>Online Optical</h3>
              <p>
                Write-once optical preservation begins while the information is
                still active.
              </p>
            </article>
          </div>
        </div>

        <div className="aaas-architecture-message">
          <strong>
            Preservation does not wait for information to become cold.
          </strong>
        </div>
      </div>
    </section>
  );
}