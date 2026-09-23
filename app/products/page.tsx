import type { Metadata } from "next";

import { ProductFamilies } from "@/components/products/ProductFamilies";
import { SoftwareProducts } from "@/components/products/SoftwareProducts";
import { ServicesProducts } from "@/components/products/ServicesProducts";
import { ProductArchitecture } from "@/components/products/ProductArchitecture";
import { ProductsClosingCTA } from "@/components/products/ProductsClosingCTA";

export const metadata: Metadata = {
  title: "Products",

  description:
    "Explore Savartus products for enterprise optical storage, storage management, file management, and Data Lifecycle Management, including Enterprise Library Systems, oRain, FMS, and the DLM Platform.",

  alternates: {
    canonical: "/products",
  },

  openGraph: {
    title: "Products | Savartus",
    description:
      "Enterprise technologies for managing, storing, and preserving information, including optical storage systems, storage management, file management, and Data Lifecycle Management.",
    url: "/products",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Products | Savartus",
    description:
      "Enterprise technologies for managing, storing, and preserving information, including optical storage systems, storage management, file management, and Data Lifecycle Management.",
  },
};

export default function ProductsPage() {
  return (
    <main>
      <section className="products-hero">
        <div className="site-container products-hero-inner">
          <p className="products-eyebrow">SAVARTUS PRODUCTS</p>

          <h1>
            Technology for managing,
            <br />
            storing, and preserving information.
          </h1>

          <p className="products-hero-copy">
            Products are the technologies that deliver Savartus solutions:
            storage systems, storage management, and information management.
          </p>

          <div className="products-pillar-grid">
            <a href="#hardware" className="products-pillar">
              <span>STORAGE SYSTEMS</span>
              <strong>Enterprise Library Systems</strong>
              <p>Nearline and offline optical storage infrastructure.</p>
            </a>

            <a href="#software" className="products-pillar">
              <span>STORAGE MANAGEMENT</span>
              <strong>oRain</strong>
              <p>Management across performance and optical environments.</p>
            </a>

            <a href="#services" className="products-pillar">
              <span>INFORMATION MANAGEMENT</span>
              <strong>FMS + DLM Platform</strong>
              <p>Metadata, search, governance, policy, and workflow.</p>
            </a>
          </div>
        </div>
      </section>

      <div id="hardware">
        <ProductFamilies />
      </div>

      <ProductArchitecture />

      <div id="software">
        <SoftwareProducts />
      </div>

      <div id="services">
        <ServicesProducts />
      </div>

      <ProductsClosingCTA />
    </main>
  );
}