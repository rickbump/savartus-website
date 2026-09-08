import Link from "next/link";

const software = [
  {
    label: "STORAGE OS",
    name: "oRain",
    description:
      "The storage management and orchestration layer that maintains awareness of objects, media, storage location, and system location across Savartus environments.",
    href: "/technology/orain",
  },
  {
    label: "DATA LIFECYCLE MANAGEMENT",
    name: "Savartus DLM",
    description:
      "Policy-driven information governance that evaluates enterprise information independently of the technologies used to store it.",
    href: "/data-lifecycle-management",
  },
  {
    label: "INFORMATION MANAGEMENT",
    name: "File Management System",
    description:
      "Metadata, file reference, search, and management services used to identify and manage information across the Savartus environment.",
    href: "/products/file-management",
  },
];

export function SoftwareProducts() {
  return (
    <section className="products-section products-software">
      <div className="site-container">
        <div className="products-section-header">
          <p className="products-eyebrow">SOFTWARE</p>

          <h2>
            Know what you have.
            <br />
            Know where it is.
          </h2>

          <p className="products-lead">
            Savartus software separates information management, lifecycle
            intelligence, and storage orchestration from the underlying
            hardware so the environment can evolve without losing control of
            the information.
          </p>
        </div>

        <div className="products-software-grid">
          {software.map((product) => (
            <article className="products-software-card" key={product.name}>
              <p className="products-card-label">{product.label}</p>
              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <Link href={product.href} className="products-card-link">
                Explore →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}