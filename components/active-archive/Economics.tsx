export function Economics() {
  return (
    <section className="aa-section aa-economics">
      <div className="site-container">
        <div className="aa-section-header">
          <p className="aa-eyebrow">LIFECYCLE ECONOMICS</p>

          <h2>
            Stop paying for performance
            <br />
            you no longer need.
          </h2>

          <p className="aa-lead">
            High-performance storage has value when information is actively
            being used. But that does not mean every retained object needs to
            remain on SSD or HDD indefinitely. Savartus allows storage cost to
            decline as access requirements change while preservation continues.
          </p>
        </div>

        <div className="economics-flow">
          <article className="economics-card economics-hot">
            <div className="economics-number">01</div>
            <p className="economics-label">HOT ACCESS</p>
            <h3>SSD / HDD + Optical</h3>
            <p>
              High-performance access with simultaneous optical preservation.
            </p>

            <div className="economics-cost">
              <span>Relative cost</span>
              <strong>$$$$</strong>
            </div>
          </article>

          <div className="economics-arrow">→</div>

          <article className="economics-card economics-online">
            <div className="economics-number">02</div>
            <p className="economics-label">ONLINE OPTICAL</p>
            <h3>Accessible + Preserved</h3>
            <p>
              The hot copy can be removed while the optical object remains
              online, managed, discoverable, and retrievable.
            </p>

            <div className="economics-cost">
              <span>Relative cost</span>
              <strong>$$</strong>
            </div>
          </article>

          <div className="economics-arrow">→</div>

          <article className="economics-card economics-offline">
            <div className="economics-number">03</div>
            <p className="economics-label">OFFLINE OPTICAL</p>
            <h3>Long-Term Retention</h3>
            <p>
              Information can move into physically isolated optical storage
              when immediate online access is no longer required.
            </p>

            <div className="economics-cost">
              <span>Relative cost</span>
              <strong>$</strong>
            </div>
          </article>
        </div>

        <div className="economics-statement">
          <span>PERFORMANCE</span>

          <div className="economics-statement-line" />

          <strong>
            Pay for performance when you need it. Preserve for as long as you
            need it.
          </strong>

          <div className="economics-statement-line" />

          <span>PRESERVATION</span>
        </div>

        <p className="economics-footnote">
          Storage placement is policy-driven and can change in either direction
          as information requirements change.
        </p>
      </div>
    </section>
  );
}