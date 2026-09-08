import Link from "next/link";
import { OrainControlPlane } from "@/components/orain/OrainControlPlane";
import { OrainCapabilities } from "@/components/orain/OrainCapabilities";
import { OrainScale } from "@/components/orain/OrainScale";
import { OrainRestore } from "@/components/orain/OrainRestore";
import { OrainClosingCTA } from "@/components/orain/OrainClosingCTA";

export default function OrainPage() {
  return (
    <main>
      <section className="orain-hero">
        <div className="site-container">
          <div className="orain-hero-grid">
            <div>
              <p className="orain-eyebrow">SAVARTUS STORAGE OS</p>

              <h1>
                One view.
                <br />
                Every tier.
              </h1>

              <p className="orain-hero-copy">
                oRain is the storage management and orchestration layer
                behind the Savartus Active Archive architecture. It knows
                where information is stored, manages movement between
                storage tiers, and coordinates retrieval across the
                environment.
              </p>

              <div className="orain-actions">
                <Link href="/contact" className="button button-primary">
                  Talk to Savartus
                </Link>

                <Link
                  href="/products/els"
                  className="button button-secondary"
                >
                  Explore ELS Systems
                </Link>
              </div>
            </div>

            <div className="orain-hero-visual">
              <div className="orain-core">
                <span>SAVARTUS</span>
                <strong>oRain</strong>
                <small>STORAGE OS</small>
              </div>

              <div className="orain-hero-functions">
                <span>Namespace</span>
                <span>Object Location</span>
                <span>Media Location</span>
                <span>System Location</span>
                <span>Orchestration</span>
                <span>Retrieval</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <OrainControlPlane />
      <OrainCapabilities />
      <OrainScale />
      <OrainRestore />
      <OrainClosingCTA />
    </main>
  );
}