export function CloudComparison() {
  return (
    <section className="aa-section aa-cloud-comparison">
      <div className="site-container">
        <div className="aa-section-header">
          <p className="aa-eyebrow">A DIFFERENT STORAGE MODEL</p>

          <h2>
            Compare the lifecycle.
            <br />
            Not just the storage price.
          </h2>

          <p className="aa-lead">
            Public cloud providers offer multiple storage classes that trade
            access, retrieval time, and cost. Savartus approaches the problem
            differently by creating the preservation copy when information
            first arrives.
          </p>
        </div>

        <div className="cloud-table">
          <div className="cloud-row cloud-header-row">
            <div>PLATFORM</div>
            <div>HIGH ACCESS</div>
            <div>ARCHIVE</div>
            <div>DEEPEST TIER</div>
            <div>PRESERVATION BEGINS</div>
          </div>

          <div className="cloud-row">
            <div className="cloud-provider">AWS</div>
            <div>S3 Standard</div>
            <div>Glacier</div>
            <div>Deep Archive</div>
            <div>After lifecycle transition</div>
          </div>

          <div className="cloud-row">
            <div className="cloud-provider">Azure</div>
            <div>Hot</div>
            <div>Cool / Cold</div>
            <div>Archive</div>
            <div>After lifecycle transition</div>
          </div>

          <div className="cloud-row">
            <div className="cloud-provider">Google Cloud</div>
            <div>Standard</div>
            <div>Nearline / Coldline</div>
            <div>Archive</div>
            <div>After lifecycle transition</div>
          </div>

          <div className="cloud-row cloud-savartus-row">
            <div className="cloud-provider">Savartus</div>
            <div>SSD / HDD + Optical</div>
            <div>Online Optical</div>
            <div>Offline Optical</div>
            <div>
              <strong>At ingest</strong>
            </div>
          </div>
        </div>

        <div className="cloud-difference">
          <p className="aa-eyebrow">THE SAVARTUS DIFFERENCE</p>

          <h3>Preservation does not wait for information to become cold.</h3>

          <p>
            The high-performance copy and the preserved optical object are
            created together. Performance storage can later be removed without
            requiring preservation to begin again somewhere else.
          </p>
        </div>

        <p className="cloud-footnote">
          Storage-class names are shown for architectural comparison. Detailed
          pricing, retrieval charges, minimum retention periods, and service
          characteristics vary by provider and region.
        </p>
      </div>
    </section>
  );
}