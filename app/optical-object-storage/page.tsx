import { WhyOptical } from "@/components/optical-object-storage/WhyOptical";
import { ObjectInterface } from "@/components/optical-object-storage/ObjectInterface";
import { OnlineOffline } from "@/components/optical-object-storage/OnlineOffline";
import { OpticalCharacteristics } from "@/components/optical-object-storage/OpticalCharacteristics";
import { ScaleAndResilience } from "@/components/optical-object-storage/ScaleAndResilience";
import { OpticalClosingCTA } from "@/components/optical-object-storage/OpticalClosingCTA";

export default function OpticalObjectStoragePage() {
  return (
    <main>
      <section className="opt-hero">
        <div className="site-container opt-hero-inner">
          <p className="opt-eyebrow">OPTICAL OBJECT STORAGE</p>

          <h1>
            Built to preserve
            <br />
            information.
          </h1>

          <p className="opt-hero-copy">
            Savartus combines modern object-storage accessibility with the
            physical characteristics of optical media to create storage
            designed for information measured in decades — not hardware refresh
            cycles.
          </p>

          <div className="opt-hero-actions">
            <a href="#architecture" className="button button-primary">
              Explore the Architecture
            </a>

            <a href="/products/els" className="button button-secondary">
              View Enterprise Library Systems
            </a>
          </div>
        </div>
      </section>

      <WhyOptical />

      <div id="architecture">
        <ObjectInterface />
      </div>

      <OnlineOffline />

      <OpticalCharacteristics />

      <ScaleAndResilience />

      <OpticalClosingCTA />
    </main>
  );
}