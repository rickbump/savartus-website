import type { Metadata } from "next";
import Link from "next/link";
import { PreservationFaq } from "@/components/preservation/PreservationFaq";
import { onlineStart } from "@/lib/preservation/config";
import { tierOptions } from "@/lib/preservation/pricing";
import { socialImages } from "@/lib/social-images";

const title = "Immutable Online Storage on Optical Media";
const description =
  "S3-compatible immutable storage on write-once optical media, run by Savartus. Choose a plan, pay online, and start uploading within minutes.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/online-storage" },
  openGraph: { images: socialImages.openGraph, title: `${title} | Savartus`, description, url: "/online-storage", type: "website" },
  twitter: { images: socialImages.twitter, card: "summary_large_image", title: `${title} | Savartus`, description },
};

export const revalidate = 3600;

const steps = [
  {
    title: "Choose a plan",
    text: "Pick a starting capacity and pay online. Plans grow in 1 TB steps as your collection grows.",
  },
  {
    title: "Get your space",
    text: "Your S3 bucket and account space are ready within minutes, and you set your password from the welcome email.",
  },
  {
    title: "Upload and preserve",
    text: "Drop files in the browser or connect S3 tools. Files are written to write-once optical discs that can't be changed.",
  },
];

const reasons = [
  {
    title: "Immutable by design",
    text: "Write-once (WORM) optical discs physically can't be overwritten, altered or encrypted. Once a file is on disc, no software, ransomware or mistyped command can change it.",
  },
  {
    title: "Write-once from the first upload",
    text: "A file name can be used only once, so a preserved file is never silently replaced by a newer copy.",
  },
  {
    title: "Deletion only by approval",
    text: "Nothing is lost by accident. Removing preserved data takes an approved request, and activity in your space is logged.",
  },
  {
    title: "Built to last decades",
    text: "Optical media doesn't need the refresh and migration cycles of disk and tape, so your record stays intact without constant upkeep.",
  },
  {
    title: "Standard S3 access",
    text: "Works with Cyberduck, rclone, backup software and your own applications, using your space's own keys.",
  },
  {
    title: "A space for your team",
    text: "Upload, search, download and restore in the browser, and invite colleagues as admins or members.",
  },
];

const audiences = [
  "Evidence for law enforcement and legal teams",
  "Records and archives",
  "Media and creative assets",
  "Research and scientific data",
  "Backups that must not be altered",
];

export default async function OnlineStoragePage() {
  const start = onlineStart();
  const plans = await tierOptions();
  const priced = plans.every((plan) => plan.price);

  return (
    <main>
      <section className="aa-hero">
        <div className="site-container aa-hero-inner">
          <p className="aa-eyebrow">ONLINE IMMUTABLE STORAGE</p>
          <h1>
            Immutable storage.
            <br />
            Online in minutes.
          </h1>
          <p className="aa-hero-copy">
            An S3 bucket on write-once optical media, run by Savartus. Nothing
            to buy or install: choose a plan, pay online, and start preserving
            the files you can&rsquo;t afford to lose.
          </p>
          <div className="aa-hero-actions">
            <Link href={start.href} className="button button-primary">
              {start.label}
            </Link>
            <a href="#plans" className="button button-secondary">
              See Plans
            </a>
          </div>
        </div>
      </section>

      <section className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">HOW IT WORKS</p>
            <h2>Three steps to an immutable record.</h2>
          </div>
          <ol className="home-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="products-section">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">WHAT YOU GET</p>
            <h2>
              Built so your record
              <br />
              can&rsquo;t be rewritten.
            </h2>
          </div>
          <div className="home-reasons home-reasons-3">
            {reasons.map((reason) => (
              <article key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plans" className="products-section products-hardware">
        <div className="site-container">
          <div className="products-section-header">
            <p className="products-eyebrow">PLANS</p>
            <h2>Pay for the capacity you use.</h2>
            <p className="products-lead">
              Monthly plans by capacity. Grow past your plan and each extra
              terabyte is billed at your plan&rsquo;s rate. Need more than the
              largest plan, or your own library? Talk to us.
            </p>
          </div>
          <div className="home-plans">
            {plans.map((plan) => (
              <article key={plan.id}>
                <strong>{plan.label}</strong>
                {priced && <p className="home-plan-price">{plan.price}</p>}
                <p>{plan.summary}</p>
              </article>
            ))}
          </div>
          <div className="home-path-actions">
            <Link href={start.href} className="button button-primary">
              {start.label}
            </Link>
            <Link href="/contact" className="button button-secondary">
              Talk to Savartus
            </Link>
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="site-container home-split">
          <div>
            <p className="products-eyebrow">WHO IT&rsquo;S FOR</p>
            <h2 className="home-split-title">For files that must stay exactly as they are.</h2>
            <ul className="home-checks home-checks-dark">
              {audiences.map((audience) => (
                <li key={audience}>{audience}</li>
              ))}
            </ul>
            <p className="home-split-note">
              Prefer to keep the library in your own building?{" "}
              <Link href="/products/els">See on-premises systems →</Link>
            </p>
          </div>
          <div>
            <PreservationFaq />
          </div>
        </div>
      </section>

      <section className="products-closing">
        <div className="site-container products-closing-inner">
          <p className="products-eyebrow products-eyebrow-light">SAVARTUS ONLINE STORAGE</p>
          <h2>
            Preserve it once.
            <br />
            Keep it for decades.
          </h2>
          <div className="products-closing-actions">
            <Link href={start.href} className="button button-light">
              {start.label}
            </Link>
            <Link href="/preservation/getting-started" className="button button-outline-light">
              Read the Guide
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
