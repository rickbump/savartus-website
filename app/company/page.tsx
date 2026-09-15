import Link from "next/link";

export default function CompanyPage() {
  return (
    <main>
      <section className="company-hero">
        <div className="site-container company-hero-inner">
          <p className="company-eyebrow">SAVARTUS</p>

          <h1>
            Technology changes.
            <br />
            Information persists.
          </h1>

          <p className="company-hero-copy">
            Savartus helps organizations manage, store, and preserve
            information across its lifecycle through Data Lifecycle Management,
            Active Archive, optical object storage, and enterprise storage
            management.
          </p>

          <div className="company-hero-actions">
            <Link href="/contact" className="button button-primary">
              Talk to Savartus
            </Link>
          </div>
        </div>
      </section>

      <section className="company-section company-about">
        <div className="site-container">
          <div className="company-section-header">
            <p className="company-eyebrow">WHO WE ARE</p>

            <h2>
              Built around the
              <br />
              information lifecycle.
            </h2>

            <p className="company-lead">
              Savartus was created around a simple idea: information should be
              managed according to what it is, what it means, and what it
              requires—not simply how old it is or where it happens to be
              stored.
            </p>
          </div>

          <div className="company-pillar-grid">
            <article className="company-pillar">
              <span>MANAGE</span>
              <h3>Understand the information.</h3>
              <p>
                Data Lifecycle Management, metadata, policy, search, governance,
                and workflow help organizations understand information in
                context.
              </p>
            </article>

            <article className="company-pillar">
              <span>STORE</span>
              <h3>Use the right storage state.</h3>
              <p>
                Performance storage, nearline optical object storage, and
                scalable ELS infrastructure provide the storage foundation.
              </p>
            </article>

            <article className="company-pillar">
              <span>PRESERVE</span>
              <h3>Protect what needs to persist.</h3>
              <p>
                WORM optical media and physically isolated preservation provide
                durable, cyber-resilient storage for long-term information.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="company-section company-beliefs">
        <div className="site-container">
          <div className="company-section-header">
            <p className="company-eyebrow">WHAT WE BELIEVE</p>

            <h2>
              Better information management
              <br />
              starts with better assumptions.
            </h2>
          </div>

          <div className="company-belief-list">
            <article>
              <span>01</span>
              <div>
                <h3>Information lifecycle ≠ storage lifecycle.</h3>
                <p>
                  The business state of information should not be defined by
                  the infrastructure that happens to hold it.
                </p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <h3>Information should move when its requirements change.</h3>
                <p>
                  Lifecycle decisions should reflect business value, risk,
                  retention, availability, security, and preservation
                  requirements—not just age.
                </p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <h3>Technology changes. Information persists.</h3>
                <p>
                  Applications, platforms, and media evolve. The information,
                  context, relationships, provenance, and governance must
                  survive those changes.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="company-section company-architecture">
        <div className="site-container">
          <div className="company-section-header">
            <p className="company-eyebrow">ONE ARCHITECTURE</p>

            <h2>
              Information intelligence
              <br />
              through storage execution.
            </h2>

            <p className="company-lead">
              Savartus separates information intelligence from storage
              execution while keeping both within one coordinated environment.
            </p>
          </div>

          <div className="company-architecture-stack">
            <div className="company-architecture-card">
              <span>INFORMATION GOVERNANCE</span>
              <strong>Enterprise Data Lifecycle™</strong>
              <p>
                Defines lifecycle state, policy, governance requirements, and
                transition logic.
              </p>
            </div>

            <div className="company-architecture-down">↓</div>

            <div className="company-architecture-card">
              <span>INFORMATION LAYER</span>
              <strong>FMS</strong>
              <p>
                Applications and users query the FMS information layer for
                search, management and workflow activity.
              </p>
            </div>

            <div className="company-architecture-down">↓</div>

            <div className="company-architecture-card company-architecture-orain">
              <span>STORAGE MANAGEMENT</span>
              <strong>oRain</strong>
              <p>
                oRain knows where every object is stored and retrieves it on
                request using its unique identifier or object key.
              </p>
            </div>

            <div className="company-architecture-down">↓</div>

            <div className="company-architecture-storage">
              <div>
                <span>PERFORMANCE</span>
                <strong>SSD / HDD</strong>
              </div>

              <div>
                <span>NEARLINE PRESERVATION</span>
                <strong>ELS Optical</strong>
              </div>

              <div>
                <span>OFFLINE PRESERVATION</span>
                <strong>Physically Isolated Optical</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="company-closing">
        <div className="site-container company-closing-inner">
          <p className="company-eyebrow company-eyebrow-light">
            MANAGE. STORE. PRESERVE.
          </p>

          <h2>
            Manage the information.
            <br />
            Store it appropriately.
            <br />
            Preserve what matters.
          </h2>

          <div className="company-closing-actions">
            <Link href="/contact" className="button button-light">
              Talk to Savartus
            </Link>

            <Link href="/products" className="button button-outline-light">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}