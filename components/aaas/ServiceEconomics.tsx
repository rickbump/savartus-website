export function ServiceEconomics() {
  return (
    <section className="aaas-section aaas-economics">
      <div className="site-container">
        <div className="aaas-section-header">
          <p className="aaas-eyebrow">ECONOMICS FOLLOW ACCESS</p>

          <h2>
            The cost changes
            <br />
            when the requirement changes.
          </h2>

          <p>
            High-performance storage is valuable when information needs
            high-performance access. It does not need to remain there
            indefinitely just because the information must be retained.
          </p>
        </div>

        <div className="aaas-economic-grid">
          <article className="aaas-economic-card aaas-economic-hot">
            <div className="aaas-economic-top">
              <span>01</span>
              <p className="aaas-card-label">HOT ACCESS</p>
            </div>

            <h3>SSD / HDD + Optical</h3>

            <p>
              Performance storage provides immediate access while optical
              preservation exists simultaneously.
            </p>

            <div className="aaas-relative-cost">
              <span>RELATIVE MONTHLY COST</span>
              <strong>HIGHER</strong>
            </div>
          </article>

          <div className="aaas-economic-arrow">→</div>

          <article className="aaas-economic-card aaas-economic-online">
            <div className="aaas-economic-top">
              <span>02</span>
              <p className="aaas-card-label">ONLINE OPTICAL</p>
            </div>

            <h3>Preserved + Accessible</h3>

            <p>
              When the performance copy is no longer required, the optical copy
              remains online and retrievable.
            </p>

            <div className="aaas-relative-cost">
              <span>RELATIVE MONTHLY COST</span>
              <strong>LOWER</strong>
            </div>
          </article>

          <div className="aaas-economic-arrow">→</div>

          <article className="aaas-economic-card aaas-economic-offline">
            <div className="aaas-economic-top">
              <span>03</span>
              <p className="aaas-card-label">OFFLINE OPTICAL</p>
            </div>

            <h3>Deep Retention</h3>

            <p>
              Information can move into physically isolated optical retention
              when continuous online access is no longer required.
            </p>

            <div className="aaas-relative-cost">
              <span>RELATIVE MONTHLY COST</span>
              <strong>LOWEST</strong>
            </div>
          </article>
        </div>

        <p className="aaas-pricing-note">
          Service pricing varies by storage tier, capacity, access requirements
          and configuration.
        </p>
      </div>
    </section>
  );
}