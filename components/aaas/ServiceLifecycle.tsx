export function ServiceLifecycle() {
  return (
    <section className="aaas-section">
      <div className="site-container">
        <div className="aaas-section-header">
          <p className="aaas-eyebrow">CUSTOMER-DEFINED STORAGE POLICY</p>

          <h2>
            You decide how long
            <br />
            performance matters.
          </h2>

          <p>
            The performance-tier residency period can be configured around the
            requirements of the workload rather than an arbitrary universal
            storage schedule.
          </p>
        </div>

        <div className="aaas-lifecycle">
          <div className="aaas-lifecycle-stage">
            <span>DAY 0</span>

            <div>
              <strong>Information arrives</strong>
              <p>Performance access and optical preservation begin.</p>
            </div>
          </div>

          <div className="aaas-lifecycle-line">
            <span />
          </div>

          <div className="aaas-lifecycle-policy">
            <small>CUSTOMER POLICY</small>
            <strong>Performance Tier TTL</strong>
            <p>Days, months or another policy-driven trigger.</p>
          </div>

          <div className="aaas-lifecycle-line">
            <span />
          </div>

          <div className="aaas-lifecycle-stage">
            <span>POLICY TRIGGER</span>

            <div>
              <strong>Hot copy can be removed</strong>
              <p>The preserved optical object remains.</p>
            </div>
          </div>
        </div>

        <div className="aaas-lifecycle-result">
          <strong>The performance copy expires. The information does not.</strong>
        </div>
      </div>
    </section>
  );
}