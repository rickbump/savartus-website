import Link from "next/link";
import { OnlineOffline } from "@/components/optical-object-storage/OnlineOffline";
import { OpticalCharacteristics } from "@/components/optical-object-storage/OpticalCharacteristics";
import { ScaleAndResilience } from "@/components/optical-object-storage/ScaleAndResilience";
import { OpticalClosingCTA } from "@/components/optical-object-storage/OpticalClosingCTA";

export default function PreservationPage() {
  return (
    <main>
      <section className="opt-hero">
        <div className="site-container opt-hero-inner">
          <p className="opt-eyebrow">PRESERVATION</p>

          <h1>
            Preserve it.
            <br />
            Keep it available.
          </h1>

          <p className="opt-hero-copy">
            Preservation keeps information durable and retrievable without
            paying to maintain an unnecessary performance copy. Cache is used
            for ingest, staging, and restore; optical storage provides the
            preserved state.
          </p>

          <div className="opt-hero-actions">
            <a href="#workflow" className="button button-primary">
              Explore the Workflow
            </a>

            <Link href="/products/els" className="button button-secondary">
              View Enterprise Library Systems
            </Link>
          </div>
        </div>
      </section>

      <section id="workflow" className="opt-section opt-interface">
        <div className="site-container">
          <div className="opt-section-header">
            <p className="opt-eyebrow">PRESERVATION WORKFLOW</p>

            <h2>
              Cache is a staging mechanism.
              <br />
              Optical is the preserved state.
            </h2>

            <p className="opt-lead">
              In Active Archive, the performance copy remains because the
              information is still actively used. In Preservation, cache exists
              primarily for ingest, staging, and restore. After optical commit
              and finalization, the cache can be cleared as soon as policy
              allows.
            </p>
          </div>

          <div className="opt-interface-diagram">
            <div className="opt-interface-top">
              <div>Applications</div>
              <div>Bulk ingest</div>
              <div>S3-compatible API</div>
              <div>Restore requests</div>
            </div>

            <div className="opt-interface-arrow">↓</div>

            <div className="opt-orain-card">
              <span>TEMPORARY CACHE</span>
              <strong>Ingest / Staging / Restore</strong>
              <p>
                Cache supports movement into and out of preservation. It is not
                the long-term active copy.
              </p>
            </div>

            <div className="opt-interface-arrow">↓</div>

            <div className="opt-interface-bottom">
              <div>
                <span>NEARLINE PRESERVATION</span>
                <strong>Online robotic optical</strong>
              </div>

              <div>
                <span>OFFLINE PRESERVATION</span>
                <strong>Physically isolated optical</strong>
              </div>
            </div>
          </div>

          <div className="opt-interface-statement">
            <strong>
              Ingest. Commit to optical. Clear cache. Preserve independently.
            </strong>
          </div>
        </div>
      </section>

      <OnlineOffline />

      <OpticalCharacteristics />

      <ScaleAndResilience />

      <section className="opt-section opt-why">
        <div className="site-container">
          <div className="opt-section-header">
            <p className="opt-eyebrow">DEPLOYMENT OPTIONS</p>

            <h2>
              Preservation can be delivered
              <br />
              the way the information requires.
            </h2>
          </div>

          <div className="opt-feature-grid">
            <article className="opt-feature-card">
              <h3>On-Premises Preservation</h3>
              <p>
                Deploy cache, oRain, and ELS nearline or offline systems within
                the customer environment.
              </p>
            </article>

            <article className="opt-feature-card">
              <h3>Preservation as a Service</h3>
              <p>
                Use Savartus-managed preservation infrastructure when the goal
                is durable retention without owning the storage environment.
              </p>
            </article>

            <article className="opt-feature-card">
              <h3>Hybrid Preservation</h3>
              <p>
                Combine customer-controlled systems, managed services, and
                physically isolated optical retention where appropriate.
              </p>
            </article>
          </div>
        </div>
      </section>

      <OpticalClosingCTA />
    </main>
  );
}
