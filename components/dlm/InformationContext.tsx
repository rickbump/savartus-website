const dimensions = [
  {
    title: "Identity",
    description: "What information object is this?",
  },
  {
    title: "Relationships",
    description: "What other information is connected to it?",
  },
  {
    title: "Business Value",
    description: "How important is it to the organization?",
  },
  {
    title: "Risk",
    description: "What is the consequence of loss, misuse, or exposure?",
  },
  {
    title: "Retention",
    description: "What obligations govern how long it must be kept?",
  },
  {
    title: "Compliance + Legal",
    description: "What regulatory, contractual, or legal requirements apply?",
  },
  {
    title: "Integrity",
    description: "Can authenticity and integrity be demonstrated?",
  },
  {
    title: "Availability",
    description: "How accessible must the information be?",
  },
  {
    title: "Storage",
    description: "Where and how is the information currently stored?",
  },
  {
    title: "Location",
    description: "What physical, logical, or jurisdictional constraints apply?",
  },
  {
    title: "Lineage",
    description: "Where did the information come from and how was it derived?",
  },
  {
    title: "Analytic + AI State",
    description: "What governed intelligence has been derived from it?",
  },
];

export function InformationContext() {
  return (
    <section className="dlm-section dlm-context">
      <div className="site-container">
        <div className="dlm-section-header">
          <p className="dlm-eyebrow">UNDERSTAND THE INFORMATION</p>

          <h2>
            Age is only one
            <br />
            characteristic.
          </h2>

          <p className="dlm-lead">
            Lifecycle decisions become more meaningful when organizations
            understand the information itself — its identity, relationships,
            obligations, value, risk, availability, and operational context.
          </p>
        </div>

        <div className="dlm-dimension-grid">
          {dimensions.map((dimension) => (
            <article className="dlm-dimension-card" key={dimension.title}>
              <h3>{dimension.title}</h3>
              <p>{dimension.description}</p>
            </article>
          ))}
        </div>

        <div className="dlm-context-statement">
          <span>90 DAYS OLD</span>
          <div className="dlm-context-line" />
          <strong>
            tells you how old the information is — not what should happen to it.
          </strong>
        </div>
      </div>
    </section>
  );
}