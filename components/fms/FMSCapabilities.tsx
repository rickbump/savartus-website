const capabilities = [
  {
    title: "Search",
    description:
      "Find information using indexed metadata and searchable attributes rather than storage paths alone.",
  },
  {
    title: "Identification",
    description:
      "Maintain persistent references and identifiers for managed information.",
  },
  {
    title: "Metadata",
    description:
      "Combine source metadata with metadata extracted or generated during processing.",
  },
  {
    title: "Relationships",
    description:
      "Associate information with related objects, workflows, sources and business context.",
  },
  {
    title: "Application Access",
    description:
      "Expose information records to applications and user workflows that need to discover or manage content.",
  },
  {
    title: "Governance Context",
    description:
      "Provide information attributes that can support policy, lifecycle and management decisions.",
  },
];

export function FMSCapabilities() {
  return (
    <section className="fms-section fms-capabilities">
      <div className="site-container">
        <div className="fms-section-header">
          <p className="fms-eyebrow">INFORMATION SERVICES</p>

          <h2>
            Turn stored files
            <br />
            into manageable information.
          </h2>
        </div>

        <div className="fms-capability-grid">
          {capabilities.map((capability, index) => (
            <article key={capability.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>

              <h3>{capability.title}</h3>

              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}