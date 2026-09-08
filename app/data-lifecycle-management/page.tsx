import { InformationContext } from "@/components/dlm/InformationContext";
import { DecisionFlow } from "@/components/dlm/DecisionFlow";
import { LifecycleModel } from "@/components/dlm/LifecycleModel";
import { StateSeparation } from "@/components/dlm/StateSeparation";
import { DLMClosingCTA } from "@/components/dlm/DLMClosingCTA";

export default function DataLifecycleManagementPage() {
  return (
    <main>
      <section className="dlm-hero">
        <div className="site-container dlm-hero-inner">
          <p className="dlm-eyebrow">DATA LIFECYCLE MANAGEMENT</p>

          <h1>
            Your data has
            <br />
            more than a birthday.
          </h1>

          <p className="dlm-hero-copy">
            Savartus Data Lifecycle Management evaluates information based on
            what it is, what it means, what obligations apply to it, what it is
            worth, and what the organization needs from it — not simply how
            long it has existed.
          </p>

          <div className="dlm-hero-statement">
            <span>90 DAYS</span>
            <strong>A file turning 90 days old isn&apos;t a business event.</strong>
          </div>

          <div className="dlm-hero-actions">
            <a href="#how-it-works" className="button button-primary">
              See How DLM Works
            </a>

            <a
              href="/resources/dlm-specification"
              className="button button-secondary"
            >
              Explore the Specification
            </a>
          </div>
        </div>
      </section>

      <InformationContext />

      <div id="how-it-works">
        <DecisionFlow />
      </div>

      <LifecycleModel />

      <StateSeparation />

      <DLMClosingCTA />
    </main>
  );
}