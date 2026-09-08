import { ELSCategories } from "@/components/els-family/ELSCategories";
import { ELSArchitecture } from "@/components/els-family/ELSArchitecture";
import { ELSComparison } from "@/components/els-family/ELSComparison";
import { ELSScale } from "@/components/els-family/ELSScale";
import { ELSClosingCTA } from "@/components/els-family/ELSClosingCTA";

export default function ELSFamilyPage() {
  return (
    <main>
      <section className="els-hero">
        <div className="site-container els-hero-inner">
          <p className="els-eyebrow">ENTERPRISE LIBRARY SYSTEMS</p>

          <h1>
            Optical object storage
            <br />
            built to scale.
          </h1>

          <p className="els-hero-copy">
            The Savartus ELS family spans standalone systems, scalable
            rack-mounted optical libraries, and physically isolated off-line
            preservation — all designed to operate within a managed
            information architecture.
          </p>

          <div className="els-hero-actions">
            <a href="#compare" className="button button-primary">
              Compare ELS Systems
            </a>

            <a
              href="/optical-object-storage"
              className="button button-secondary"
            >
              Explore the Technology
            </a>
          </div>
        </div>
      </section>

      <ELSCategories />

      <ELSArchitecture />

      <div id="compare">
        <ELSComparison />
      </div>

      <ELSScale />

      <ELSClosingCTA />
    </main>
  );
}