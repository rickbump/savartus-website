export function FMSRelationship() {
  return (
    <section className="fms-section fms-relationship">
      <div className="site-container">
        <div className="fms-section-header">
          <p className="fms-eyebrow">FMS + oRAIN</p>

          <h2>
            What it is.
            <br />
            Where it is.
          </h2>

          <p>
            Information management and storage management are related, but they
            are different responsibilities.
          </p>
        </div>

        <div className="fms-relationship-grid">
          <article className="fms-fms-card">
            <p className="fms-card-label">INFORMATION MANAGEMENT</p>

            <h3>FMS</h3>

            <strong>What is this information?</strong>

            <ul>
              <li>File and object identity</li>
              <li>Metadata</li>
              <li>Source information</li>
              <li>Searchable attributes</li>
              <li>Relationships</li>
              <li>Workflow context</li>
            </ul>
          </article>

          <div className="fms-plus">+</div>

          <article className="fms-orain-card">
            <p className="fms-card-label">STORAGE MANAGEMENT</p>

            <h3>oRain</h3>

            <strong>Where is it stored?</strong>

            <ul>
              <li>Current storage tier</li>
              <li>Cache residency</li>
              <li>Optical placement</li>
              <li>Media location</li>
              <li>Online / offline state</li>
              <li>Restore orchestration</li>
            </ul>
          </article>
        </div>

        <div className="fms-relationship-result">
          <span>FMS</span>
          <strong>understands the information.</strong>

          <span>oRain</span>
          <strong>understands the storage.</strong>
        </div>
      </div>
    </section>
  );
}