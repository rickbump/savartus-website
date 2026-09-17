import { ActiveArchiveArchitecture } from "@/components/active-archive/ActiveArchiveArchitecture";
import { LifecycleState } from "@/components/active-archive/LifecycleState";
import { Economics } from "@/components/active-archive/Economics";
import { CloudComparison } from "@/components/active-archive/CloudComparison";
import { ServiceCTA } from "@/components/active-archive/ServiceCTA";
import { ClosingCTA } from "@/components/active-archive/ClosingCTA";

export default function ActiveArchivePage() {
  return (
    <main>
      <section className="aa-hero">
        <div className="site-container aa-hero-inner">
          <p className="aa-eyebrow">ACTIVE ARCHIVE</p>

          <h1>
            Active when you need it.
            <br />
            Preserved from the start.
          </h1>

          <p className="aa-hero-copy">
            Active Archive combines performance storage with nearline optical
            preservation. The performance copy remains while usage and
            performance requirements justify it; the preserved optical copy
            exists independently.
          </p>

          <div className="aa-hero-actions">
            <a href="#architecture" className="button button-primary">
              Explore the Architecture
            </a>

            <a
              href="/active-archive/service"
              className="button button-secondary"
            >
              Active Archive as a Service
            </a>
          </div>
        </div>
      </section>

      <div id="architecture">
        <ActiveArchiveArchitecture />
      </div>

      <LifecycleState />

      <Economics />

      <CloudComparison />

      <ServiceCTA />

      <ClosingCTA />
    </main>
  );
}
