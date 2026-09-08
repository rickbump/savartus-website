type ArchitectureTier = {
  label: string;
  title: string;
  description: string;
  variant?: "performance" | "optical" | "offline";
};

type ProductArchitectureProps = {
  eyebrow?: string;
  headline: string;
  description: string;
  tiers: ArchitectureTier[];
};

export function ProductArchitecture({
  eyebrow = "SYSTEM ARCHITECTURE",
  headline,
  description,
  tiers,
}: ProductArchitectureProps) {
  return (
    <section className="product-detail-section product-detail-architecture">
      <div className="site-container">
        <div className="product-detail-section-header">
          <p className="product-detail-eyebrow">{eyebrow}</p>

          <h2>{headline}</h2>

          <p>{description}</p>
        </div>

        <div className="product-architecture-flow">
          {tiers.map((tier, index) => (
            <div className="product-architecture-item" key={tier.title}>
              <article
                className={`product-architecture-card product-architecture-${
                  tier.variant ?? "performance"
                }`}
              >
                <p className="product-detail-card-label">
                  {tier.label}
                </p>

                <h3>{tier.title}</h3>

                <p>{tier.description}</p>
              </article>

              {index < tiers.length - 1 && (
                <div className="product-architecture-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}