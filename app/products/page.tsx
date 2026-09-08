import { ProductFamilies } from "@/components/products/ProductFamilies";
import { SoftwareProducts } from "@/components/products/SoftwareProducts";
import { ServicesProducts } from "@/components/products/ServicesProducts";
import { ProductArchitecture } from "@/components/products/ProductArchitecture";
import { ProductsClosingCTA } from "@/components/products/ProductsClosingCTA";

export default function ProductsPage() {
  return (
    <main>
      <section className="products-hero">
        <div className="site-container products-hero-inner">
          <p className="products-eyebrow">SAVARTUS PRODUCTS</p>

          <h1>
            Infrastructure for the
            <br />
            information lifecycle.
          </h1>

          <p className="products-hero-copy">
            Savartus combines enterprise optical storage, software
            orchestration, data lifecycle management, and managed services to
            help organizations manage, store, and preserve information
            throughout its lifecycle.
          </p>

          <div className="products-pillar-grid">
            <a href="#hardware" className="products-pillar">
              <span>STORE</span>
              <strong>Enterprise Library Systems</strong>
              <p>Online and offline optical object storage.</p>
            </a>

            <a href="#software" className="products-pillar">
              <span>MANAGE</span>
              <strong>Savartus Software</strong>
              <p>Lifecycle intelligence and storage orchestration.</p>
            </a>

            <a href="#services" className="products-pillar">
              <span>PRESERVE</span>
              <strong>Managed Services</strong>
              <p>Active Archive and preservation as a service.</p>
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