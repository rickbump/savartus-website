import { DualWrite } from "@/components/active-archive/DualWrite";
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
            Active today.
            <br />
            Preserved from day one.
          </h1>

          <p className="aa-hero-copy">
            Savartus combines high-performance SSD or HDD storage with optical
            object storage to provide immediate access and long-term
            preservation from the moment information arrives.
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
        <DualWrite />
      </div>

      <LifecycleState />

      <Economics />

      <CloudComparison />

      <ServiceCTA />

      <ClosingCTA />
    </main>
  );
}