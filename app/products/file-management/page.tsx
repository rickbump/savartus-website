import Link from "next/link";
import { FMSInformationModel } from "@/components/fms/FMSInformationModel";
import { FMSWorkflow } from "@/components/fms/FMSWorkflow";
import { FMSRelationship } from "@/components/fms/FMSRelationship";
import { FMSCapabilities } from "@/components/fms/FMSCapabilities";
import { FMSClosingCTA } from "@/components/fms/FMSClosingCTA";

export default function FileManagementPage() {
  return (
    <main>
      <section className="fms-hero">
        <div className="site-container">
          <div className="fms-hero-grid">
            <div>
              <p className="fms-eyebrow">
                SAVARTUS FILE MANAGEMENT SYSTEM
              </p>

              <h1>
                Know what
                <br />
                you have.
              </h1>

              <p className="fms-hero-copy">
                The Savartus File Management System creates a managed
                information layer across the storage environment — maintaining
                file references, metadata, identifiers, searchable attributes,
                relationships, and information needed by user and application
                workflows.
              </p>

              <div className="fms-actions">
                <Link href="/contact" className="button button-primary">
                  Talk to Savartus
                </Link>

                <Link
                  href="/technology/orain"
                  className="button button-secondary"
                >
                  Explore oRain
                </Link>
              </div>
            </div>

            <div className="fms-hero-visual">
              <div className="fms-object">
                <span>MANAGED INFORMATION</span>
                <strong>File / Object</strong>

                <div className="fms-object-data">
                  <span>Identity</span>
                  <span>Metadata</span>
                  <span>Source</span>
                  <span>Relationships</span>
                  <span>Retention</span>
                  <span>Search Attributes</span>
                </div>
              </div>

              <div className="fms-object-arrow">↓</div>

              <div className="fms-core">
                <span>SAVARTUS</span>
                <strong>FMS</strong>
                <small>FILE MANAGEMENT SYSTEM</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FMSInformationModel />
      <FMSWorkflow />
      <FMSRelationship />
      <FMSCapabilities />
      <FMSClosingCTA />
    </main>
  );
}