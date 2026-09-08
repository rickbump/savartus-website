export function ScaleAndResilience() {
  return (
    <section className="opt-section opt-scale">
      <div className="site-container">
        <div className="opt-section-header">
          <p className="opt-eyebrow">ENTERPRISE ARCHITECTURE</p>

          <h2>
            Scale capacity without
            <br />
            losing object awareness.
          </h2>

          <p className="opt-lead">
            Savartus optical systems can operate as part of a larger managed
            storage environment. As libraries and drives are added, the
            software layer maintains awareness of where objects reside and how
            they can be retrieved.
          </p>
        </div>

        <div className="opt-scale-diagram">
          <div className="opt-scale-object">
            <span>OBJECT NAMESPACE</span>
            <strong>oRain</strong>
          </div>

          <div className="opt-scale-lines">
            <div />
            <div />
            <div />
            <div />
          </div>

          <div className="opt-scale-libraries">
            <div>
              <span>LIBRARY 01</span>
              <strong>Optical Storage</strong>
            </div>
            <div>
              <span>LIBRARY 02</span>
              <strong>Optical Storage</strong>
            </div>
            <div>
              <span>LIBRARY 03</span>
              <strong>Optical Storage</strong>
            </div>
            <div>
              <span>LIBRARY N</span>
              <strong>Optical Storage</strong>
            </div>
          </div>
        </div>

        <div className="opt-value-grid">
          <article>
            <p className="opt-card-label">ENERGY</p>
            <h3>Preservation without continuously powered media.</h3>
            <p>
              Optical media does not require power to retain written
              information, reducing the infrastructure required to maintain
              inactive data.
            </p>
          </article>

          <article>
            <p className="opt-card-label">CYBER RESILIENCE</p>
            <h3>Protection that can become physical.</h3>
            <p>
              Immutable media and offline storage create preservation options
              that do not depend solely on logical access controls.
            </p>
          </article>

          <article>
            <p className="opt-card-label">ACCESS</p>
            <h3>Retention does not automatically mean inaccessible.</h3>
            <p>
              Online optical libraries provide a bridge between active storage
              and physically isolated deep retention.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}