import Link from "next/link";

const software = [
  {
    label: "STORAGE MANAGEMENT",
    name: "oRain Storage Management",
    description:
      "The storage management and orchestration layer that maintains awareness of objects, media, storage location, and system location across Savartus environments.",
    href: "/technology/orain",
  },
  {
    label: "INFORMATION MANAGEMENT",
    name: "Data Lifecycle Management Platform",
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
            Storage management and
            <br />
            information management.
          </h2>

          <p className="products-lead">
            oRain manages storage execution. FMS and the Savartus DLM Platform
            provide metadata, search, governance, policy, information context,
            workflow, and lifecycle management.
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
