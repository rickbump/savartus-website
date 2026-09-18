import Link from "next/link";

const categories = [
  {
    href: "#compact-deployment",
    label: "STAND ALONE",
    title: "Compact deployment",
    description:
      "Compare compact optical storage, integrated Active Archive, and small-footprint nearline preservation systems.",
  },
  {
    href: "#enterprise-scale",
    label: "RACK MOUNT",
    title: "Enterprise scale",
    description:
      "Compare scalable nearline optical systems for enterprise preservation capacity.",
  },
  {
    href: "#deep-preservation",
    label: "OFF-LINE",
    title: "Deep preservation",
    description:
      "Compare physically isolated optical systems for deep preservation.",
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
            <Link
              className="els-category"
              href={category.href}
              key={category.href}
            >
              <div className="els-category-copy">
                <p className="els-card-label">{category.label}</p>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </div>

              <span className="els-category-link">Compare systems →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
