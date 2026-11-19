import type { Metadata } from "next";
import { socialImages } from "@/lib/social-images";
import Link from "next/link";
import { signupEnabled } from "@/lib/preservation/config";

export const metadata: Metadata = {
  title: {
    absolute: "Immutable Optical Storage, Online or On-Premises | Savartus",
  },

  description:
    "Preserve data on write-once optical media. Start online in minutes with Savartus preservation as a service, or run an Enterprise Library System in your own facility.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    images: socialImages.openGraph,
    title: "Immutable Optical Storage, Online or On-Premises | Savartus",
    description:
      "Preserve data on write-once optical media. Start online in minutes with Savartus preservation as a service, or run an Enterprise Library System in your own facility.",
    url: "/",
    type: "website",
  },

  twitter: {
    images: socialImages.twitter,
    card: "summary_large_image",
    title: "Immutable Optical Storage, Online or On-Premises | Savartus",
    description:
      "Preserve data on write-once optical media. Start online in minutes with Savartus preservation as a service, or run an Enterprise Library System in your own facility.",
  },
};

export default function HomePage() {
  // Signup may still be closed to the public; then "Start online" goes to the
  // preservation overview instead of the signup form.
  const startOnline = signupEnabled() ? "/preservation/signup" : "/preservation";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.savartus.com/#organization",
        name: "Savartus",
        url: "https://www.savartus.com",
        logo: "https://www.savartus.com/images/brand/savartus-shield.jpeg",
      },
      {
        "@type": "WebSite",
        "@id": "https://www.savartus.com/#website",
        name: "Savartus",
        url: "https://www.savartus.com",
        publisher: { "@id": "https://www.savartus.com/#organization" },
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="aa-hero">
        <div className="site-container aa-hero-inner">
          <p className="aa-eyebrow">SAVARTUS OPTICAL PRESERVATION</p>

          <h1>
            Immutable storage.
            <br />
            Online or
            <br />
            on-premises.
          </h1>

          <p className="aa-hero-copy">
            Keep the records you can&rsquo;t afford to lose on write-once optical
            media that can&rsquo;t be overwritten, altered or encrypted. Start
            online in minutes, or run a Savartus library in your own facility.
          </p>

          <div className="aa-hero-actions">
            <Link href={startOnline} className="button button-primary">
              Start Preserving Online
            </Link>
            <Link href="#on-premises" className="button button-secondary">
              On-Premises Systems
            </Link>
          </div>

          <p className="home-hero-note">
            <span className="home-badge">New</span>
            Online preservation is available now. Online Active Archive is
            coming soon.
          </p>
        </div>
      </section>

      <section id="choose" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">TWO WAYS TO PRESERVE</p>
            <h2>
              Same optical technology.
              <br />
              Your choice of delivery.
            </h2>
            <p className="products-lead">
              Use our optical library as an online service, or buy a library
              and run it in your own data center. Either way, your data lands
              on write-once media built to last for decades.
            </p>
          </div>

          <div className="home-paths">
            <article id="online" className="home-path home-path-online">
              <p className="home-path-label">ONLINE SERVICE &middot; AVAILABLE NOW</p>
              <h3>Preservation as a service</h3>
              <p>
                An S3 bucket on Savartus optical libraries, with nothing to
                buy, install or maintain. Choose a plan, pay online, and start
                uploading the same day.
              </p>
              <ul className="home-checks">
                <li>Ready within minutes of payment</li>
                <li>Standard S3 access for Cyberduck, rclone, backup software and your own apps</li>
                <li>A browser account space to upload, search, download and invite your team</li>
                <li>Monthly plans that grow in 1&nbsp;TB steps</li>
                <li>Deletion only by approved request</li>
              </ul>
              <div className="home-path-actions">
                <Link href={startOnline} className="button button-light">
                  See Plans and Sign Up
                </Link>
                <Link href="/preservation/getting-started" className="button button-outline-light">
                  How It Works
                </Link>
              </div>
            </article>

            <article id="on-premises" className="home-path">
              <p className="home-path-label home-path-label-muted">ON-PREMISES &middot; PURCHASE</p>
              <h3>A Savartus library in your facility</h3>
              <p>
                Enterprise Library Systems run inside your environment when
                physical custody, data locality or network isolation is a
                requirement.
              </p>
              <ul className="home-checks home-checks-dark">
                <li>Your data never leaves your building</li>
                <li>Nearline and offline optical media, including physically isolated copies</li>
                <li>Systems from compact libraries to petabyte scale</li>
                <li>oRain storage management and FMS information management</li>
                <li>Purchased outright, with Savartus support and services</li>
              </ul>
              <div className="home-path-actions">
                <Link href="/products/els" className="button button-primary">
                  Explore ELS Systems
                </Link>
                <Link href="/contact" className="button button-secondary">
                  Talk to Savartus
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="compare" className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">COMPARE</p>
            <h2>Online or on-premises?</h2>
            <p className="products-lead">
              Both keep your data on immutable optical media. The difference is
              who runs the library and where it lives.
            </p>
          </div>

          <div className="home-compare" role="table" aria-label="Online service compared with on-premises systems">
            <div className="home-compare-row home-compare-head" role="row">
              <span role="columnheader"></span>
              <span role="columnheader">Online service</span>
              <span role="columnheader">On-premises</span>
            </div>
            {[
              ["Who runs it", "Savartus operates the library", "Your team, with Savartus support"],
              ["Where data lives", "Savartus optical libraries", "Your own data center"],
              ["Time to start", "Minutes, signup online", "Delivery and installation"],
              ["How you pay", "Monthly plan, 1 TB steps", "Purchase with support"],
              ["Access", "S3 and a browser account space", "Your network, with oRain and FMS"],
              ["Best for", "Starting fast, without hardware", "Physical custody and isolation"],
            ].map(([label, online, onPrem]) => (
              <div className="home-compare-row" role="row" key={label}>
                <span role="rowheader">{label}</span>
                <span role="cell" data-label="Online service">{online}</span>
                <span role="cell" data-label="On-premises">{onPrem}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">SOLUTIONS</p>
            <h2>
              Every solution,
              <br />
              delivered your way.
            </h2>
            <p className="products-lead">
              Preservation is online today. Active Archive and Data Lifecycle
              Management follow the same model.
            </p>
          </div>

          <div className="home-solutions">
            <Link href="/preservation" className="home-solution">
              <strong>Preservation</strong>
              <p>Preserve it. Keep it available. Isolate it when required.</p>
              <div className="home-availability">
                <span className="home-status home-status-live">Online &middot; Available now</span>
                <span className="home-status">On-premises &middot; Available</span>
              </div>
            </Link>

            <Link href="/active-archive" className="home-solution">
              <strong>Active Archive</strong>
              <p>Active when you need it. Preserved from the start.</p>
              <div className="home-availability">
                <span className="home-status home-status-soon">Online &middot; Coming soon</span>
                <span className="home-status">On-premises &middot; Available</span>
              </div>
            </Link>

            <Link href="/data-lifecycle-management" className="home-solution">
              <strong>Data Lifecycle Management</strong>
              <p>Govern information according to what it requires.</p>
              <div className="home-availability">
                <span className="home-status">Managed service &middot; Talk to us</span>
                <span className="home-status">On-premises &middot; Available</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="why-optical" className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">WHY OPTICAL</p>
            <h2>
              Built so your record
              <br />
              can&rsquo;t be rewritten.
            </h2>
          </div>

          <div className="home-reasons">
            <article>
              <h3>Immutable by design</h3>
              <p>
                Write-once (WORM) discs physically can&rsquo;t be overwritten,
                altered or encrypted. Once a file is on disc, no software,
                ransomware or mistyped command can change it.
              </p>
            </article>
            <article>
              <h3>Built to last decades</h3>
              <p>
                Optical media doesn&rsquo;t need the refresh and migration
                cycles of disk and tape, so your record stays intact without
                constant upkeep.
              </p>
            </article>
            <article>
              <h3>Write-once from the first upload</h3>
              <p>
                A file name can be used only once, so a preserved file is never
                silently replaced by a newer copy.
              </p>
            </article>
            <article>
              <h3>Deletion only by approval</h3>
              <p>
                Nothing is lost by accident. Removing preserved data takes an
                approved request, and activity is logged.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="technology" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">TECHNOLOGY</p>
            <h2>
              The same technology,
              <br />
              whichever way you buy.
            </h2>
            <p className="products-lead">
              The online service runs on the same Enterprise Library Systems,
              oRain and FMS that customers install on-premises.
            </p>
          </div>

          <div className="products-software-grid">
            <Link href="/products/els" className="products-software-card">
              <p className="products-card-label">STORAGE SYSTEMS</p>
              <h3>Enterprise Library Systems</h3>
              <p>
                Nearline and offline optical infrastructure from compact
                systems through petabyte-scale enterprise libraries.
              </p>
              <span className="products-card-link">Explore ELS Systems →</span>
            </Link>

            <Link href="/technology/orain" className="products-software-card">
              <p className="products-card-label">STORAGE MANAGEMENT</p>
              <h3>oRain</h3>
              <p>
                Storage management across performance, nearline optical, and
                offline optical environments.
              </p>
              <span className="products-card-link">Explore oRain →</span>
            </Link>

            <Link href="/products/file-management" className="products-software-card">
              <p className="products-card-label">INFORMATION MANAGEMENT</p>
              <h3>FMS + DLM Platform</h3>
              <p>
                Metadata, search, governance, policy, information context,
                workflow, and lifecycle management.
              </p>
              <span className="products-card-link">Explore Information Management →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">PLANNING YOUR ARCHIVE</p>
            <h2>Start with the information requirements.</h2>
            <p className="products-lead">
              Access, retention, protection, and governance are different
              requirements. Understand each before choosing where information
              should live or how it should move between storage environments.
            </p>
          </div>
          <div className="products-software-grid">
            <article className="products-software-card">
              <h3>How is Active Archive different from backup?</h3>
              <p>
                Active Archive combines performance storage for current use
                with an independent optical preservation copy. Backup and
                recovery still require a defined scope, verified copies, and
                a tested path back into service. A preserved file repository
                is not automatically a full-system recovery plan.
              </p>
              <Link
                href="/insights/enterprise-backup-test-the-copy-not-the-job"
                className="products-card-link"
              >
                Read about testing recovery copies
              </Link>
            </article>
            <article className="products-software-card">
              <h3>When should information move?</h3>
              <p>
                Age alone does not determine business value or retention.
                Savartus Data Lifecycle Management considers information
                identity, context, risk, policy, and protection requirements.
                Information state and storage state are separate: retained
                information can need faster access again without losing its
                governance context.
              </p>
              <Link href="/data-lifecycle-management" className="products-card-link">
                Explore information lifecycle governance
              </Link>
            </article>
            <article className="products-software-card">
              <h3>What does offline preservation require?</h3>
              <p>
                Physically isolated media separates a retained copy from
                ordinary network access. The inventory, location information,
                and recovery workflow must remain usable when the copy is
                needed. Plan how teams will locate, mount, verify, and restore
                information, not just how they will write it.
              </p>
              <Link
                href="/insights/offline-preservation-isolate-and-test-the-restore"
                className="products-card-link"
              >
                Explore isolated copies and restore testing
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="products-closing">
        <div className="site-container products-closing-inner">
          <p className="products-eyebrow products-eyebrow-light">SAVARTUS</p>

          <h2>
            Technology changes.
            <br />
            Your record shouldn&rsquo;t.
          </h2>

          <p>
            Start preserving online today, or talk to us about a library for
            your own facility.
          </p>

          <div className="products-closing-actions">
            <Link href={startOnline} className="button button-light">
              Start Preserving Online
            </Link>
            <Link href="/contact" className="button button-outline-light">
              Talk to Savartus
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
