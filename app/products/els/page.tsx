import type { Metadata } from "next";

import { ELSCategories } from "@/components/els-family/ELSCategories";
import { ELSArchitecture } from "@/components/els-family/ELSArchitecture";
import { ELSComparison } from "@/components/els-family/ELSComparison";
import { ELSScale } from "@/components/els-family/ELSScale";
import { ELSClosingCTA } from "@/components/els-family/ELSClosingCTA";

export const metadata: Metadata = {
  title: "Enterprise Optical Storage Systems",

  description:
    "Explore Savartus Enterprise Library Systems for scalable nearline and offline optical storage, long-term preservation, and S3-compatible optical object storage.",

  alternates: {
    canonical: "/products/els",
  },

  openGraph: {
    title: "Enterprise Optical Storage Systems | Savartus",
    description:
      "Scalable nearline and offline optical storage systems for enterprise preservation, Active Archive, and long-term information retention.",
    url: "/products/els",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Enterprise Optical Storage Systems | Savartus",
    description:
      "Scalable nearline and offline optical storage systems for enterprise preservation, Active Archive, and long-term information retention.",
  },
};

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
            rack-mounted optical libraries, and physically isolated
            offline preservation—all managed through oRain Storage
            Management and a unified storage architecture.
          </p>

          <div className="els-hero-actions">
            <a href="#compact-deployment" className="button button-primary">
              Compare ELS Systems
            </a>

            <a
              href="/preservation"
              className="button button-secondary"
            >
              Explore Preservation
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