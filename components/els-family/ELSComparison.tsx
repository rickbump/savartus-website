import Link from "next/link";
import { elsProducts } from "@/data/els-products";
import type { ELSProduct } from "@/data/els-products";

function getSpec(product: ELSProduct, label: string) {
  return product.specs.find(
    (spec) => spec.label.toLowerCase() === label.toLowerCase()
  )?.value ?? "—";
}

export function ELSComparison() {
  return (
    <section className="els-section els-comparison">
      <div className="site-container">
        <div className="els-section-header">
          <p className="els-eyebrow">SELECTION GUIDE</p>

          <h2>
            Choose the right
            <br />
            preservation platform.
          </h2>

          <p className="els-lead">
            Capacity, form factor, media configuration, and drive count change
            across the ELS family. The preservation architecture remains
            consistent.
          </p>
        </div>

        <div className="els-comparison-table">
          <div className="els-comparison-row els-comparison-header">
            <div>SYSTEM</div>
            <div>TYPE</div>
            <div>CAPACITY</div>
            <div>MEDIA</div>
            <div>DRIVES</div>
            <div>FORM FACTOR</div>
          </div>

          {elsProducts.map((product) => (
            <Link
              href={`/products/${product.slug}`}
              className="els-comparison-row"
              key={product.name}
            >
              <div>
                <strong>{product.name}</strong>
              </div>

              <div>{product.category}</div>
              <div>{getSpec(product, "Capacity")}</div>
              <div>{getSpec(product, "Storage Media")}</div>
              <div>{getSpec(product, "Drives")}</div>
              <div>{getSpec(product, "Form Factor")}</div>
            </Link>
          ))}
        </div>

        <p className="els-comparison-note">
          ELS100 technical specifications will be added when the final product
          configuration is published.
        </p>
      </div>
    </section>
  );
}