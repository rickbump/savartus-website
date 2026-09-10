import Link from "next/link";
import { elsProducts } from "@/data/els-products";

const categories = [
  {
    id: "standalone",
    label: "STAND ALONE",
    title: "Compact deployment",
    description:
      "Self-contained Savartus systems for compact optical storage and integrated Active Archive.",
  },
  {
    id: "rack",
    label: "RACK MOUNT",
    title: "Enterprise scale",
    description:
      "Online optical systems that scale from compact rack deployments to multi-petabyte library environments.",
  },
  {
    id: "offline",
    label: "OFF-LINE",
    title: "Deep preservation",
    description:
      "Physically isolated media libraries for information that no longer requires continuous online access.",
  },
];

export function ELSCategories() {
  return (
    <section className="els-section els-categories">
      <div className="site-container">
        <div className="els-section-header">
          <p className="els-eyebrow">THE ELS FAMILY</p>

          <h2>
            One family.
            <br />
            Three deployment classes.
          </h2>
        </div>

        <div className="els-category-list">
          {categories.map((category) => (
            <div className="els-category" key={category.id}>
              <div className="els-category-copy">
                <p className="els-card-label">{category.label}</p>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <div className="els-category-products">
                {elsProducts
                  .filter((product) => product.category === category.id)
                  .map((product) => (
                    <Link href={`/products/${product.slug}`} key={product.name}>
                      <strong>{product.name}</strong>
                      <span>→</span>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}