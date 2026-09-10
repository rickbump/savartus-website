import Link from "next/link";
import { elsProducts } from "@/data/els-products";

const groups = [
  {
    id: "standalone",
    label: "STAND ALONE SYSTEMS",
    title: "Compact systems",
    description:
      "Standalone Savartus systems for environments that need optical storage or integrated Active Archive in a self-contained platform.",
  },
  {
    id: "rack",
    label: "RACK MOUNT SYSTEMS",
    title: "Scale from rack to petabytes",
    description:
      "Rack-mounted and enterprise library systems designed to scale optical preservation capacity across an oRain-managed environment.",
  },
  {
    id: "offline",
    label: "OFF-LINE SYSTEMS",
    title: "Physical isolation",
    description:
      "Media-only preservation systems that keep optical media physically offline while oRain retains knowledge of what is stored and where it resides.",
  },
];

export function ProductFamilies() {
  return (
    <section className="products-section products-hardware">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">HARDWARE</p>

          <h2>
            Enterprise optical systems
            <br />
            for every scale.
          </h2>

          <p className="products-lead">
            Savartus hardware spans compact standalone systems, scalable
            rack-mounted optical libraries, and physically isolated off-line
            preservation systems.
          </p>
        </div>

        <div className="hardware-groups">
          {groups.map((group) => {
            const products = elsProducts.filter(
              (product) => product.category === group.id
            );

            return (
              <section className="hardware-group" key={group.id}>
                <div className="hardware-group-heading">
                  <p className="products-card-label">{group.label}</p>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>

                <div className="products-system-grid">
                  {products.map((product) => (
                    <article
                      className="products-system-card"
                      key={product.name}
                    >
                      <div>
                        <p className="products-card-label">
                          {product.category}
                        </p>

                        <h3>{product.name}</h3>

                        <p>{product.description}</p>
                      </div>

                      <Link
                        href={`/products/${product.slug}`}
                        className="products-card-link"
                      >
                        Explore {product.name} →
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="products-family-link">
          <Link href="/products/els" className="button button-primary">
            Compare All ELS Systems
          </Link>
        </div>
      </div>
    </section>
  );
}