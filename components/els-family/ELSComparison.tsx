import Link from "next/link";
import { elsProducts } from "@/data/els-products";
import type { ELSProduct } from "@/data/els-products";

function getSpec(product: ELSProduct, label: string) {
  return product.specs.find(
    (spec) => spec.label.toLowerCase() === label.toLowerCase()
  )?.value ?? "—";
}

const comparisonGroups = [
  {
    id: "compact-deployment",
    eyebrow: "COMPACT DEPLOYMENT",
    title: "ELS100, ELS150, and ELS300",
    description:
      "Compact systems for distributed preservation, standalone Active Archive, and small-footprint nearline optical deployments.",
    products: ["ELS100", "ELS150", "ELS300"],
  },
  {
    id: "enterprise-scale",
    eyebrow: "ENTERPRISE SCALE",
    title: "Scalable nearline optical systems",
    description:
      "Enterprise systems for larger preserved data estates, excluding physically isolated offline systems.",
    products: ["ELS500", "ELS1000", "ELS3600", "ELS4000", "ELS8000", "ELS10K"],
  },
  {
    id: "deep-preservation",
    eyebrow: "DEEP PRESERVATION",
    title: "Physically isolated optical systems",
    description:
      "Offline optical systems for deep preservation where physical isolation is required.",
    products: ["ELS8000-OL", "ELS10K-OL"],
  },
];

function getProducts(productNames: string[]) {
  return productNames
    .map((name) => elsProducts.find((product) => product.name === name))
    .filter((product): product is ELSProduct => Boolean(product));
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

        <div className="els-comparison-groups">
          {comparisonGroups.map((group) => (
            <section
              className="els-comparison-group"
              id={group.id}
              key={group.id}
            >
              <div className="els-comparison-group-header">
                <p className="els-card-label">{group.eyebrow}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>

              <div className="els-comparison-table">
                <div className="els-comparison-row els-comparison-header">
                  <div>SYSTEM</div>
                  <div>TYPE</div>
                  <div>MAX DISKS</div>
                  <div>MEDIA</div>
                  <div>DRIVES</div>
                  <div>FORM FACTOR</div>
                </div>

                {getProducts(group.products).map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    className="els-comparison-row"
                    key={product.name}
                  >
                    <div>
                      <strong>{product.name}</strong>
                    </div>

                    <div>{product.categoryLabel}</div>
                    <div>{getSpec(product, "Maximum Media")}</div>
                    <div>{getSpec(product, "Storage Media")}</div>
                    <div>{getSpec(product, "Drives")}</div>
                    <div>{getSpec(product, "Form Factor")}</div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
