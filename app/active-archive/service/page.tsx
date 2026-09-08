import Link from "next/link";
import { ServiceArchitecture } from "@/components/aaas/ServiceArchitecture";
import { ServiceEconomics } from "@/components/aaas/ServiceEconomics";
import { ServiceLifecycle } from "@/components/aaas/ServiceLifecycle";
import { ServiceBenefits } from "@/components/aaas/ServiceBenefits";
import { ServiceClosingCTA } from "@/components/aaas/ServiceClosingCTA";

export default function ActiveArchiveServicePage() {
  return (
    <main>
      <section className="aaas-hero">
        <div className="site-container">
          <div className="aaas-hero-inner">
            <p className="aaas-eyebrow">
              ACTIVE ARCHIVE AS A SERVICE
            </p>

            <h1>
              Pay for performance
              <br />
              only while you need it.
            </h1>

            <p className="aaas-hero-copy">
              Savartus Active Archive as a Service combines high-performance
              storage with immediate optical preservation. As access
              requirements change, the performance copy can be removed while
              the preserved information remains available from the optical
              tier.
            </p>

            <div className="aaas-actions">
              <Link href="/contact" className="button button-primary">
                Talk to Savartus
              </Link>

              <Link
                href="/active-archive"
                className="button button-secondary"
              >
                Explore Active Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ServiceArchitecture />
      <ServiceEconomics />
      <ServiceLifecycle />
      <ServiceBenefits />
      <ServiceClosingCTA />
    </main>
  );
}