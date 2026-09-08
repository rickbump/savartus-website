const benefits = [
  {
    title: "Preservation from day one",
    description:
      "Long-term optical preservation begins when the information enters the environment.",
  },
  {
    title: "Performance without permanent premium",
    description:
      "Maintain SSD/HDD capacity while workload requirements justify it rather than for the full retention period.",
  },
  {
    title: "Policy-driven placement",
    description:
      "Storage placement can respond to the requirements of the information and workload.",
  },
  {
    title: "Online optical access",
    description:
      "Leaving the performance tier does not necessarily mean leaving online storage.",
  },
  {
    title: "Offline preservation option",
    description:
      "Selected optical media can move into physically isolated, air-gapped retention.",
  },
  {
    title: "Managed retrieval",
    description:
      "oRain maintains storage-location awareness and coordinates restore paths when information is requested.",
  },
];

export function ServiceBenefits() {
  return (
    <section className="aaas-section aaas-benefits">
      <div className="site-container">
        <div className="aaas-section-header">
          <p className="aaas-eyebrow">WHY ACTIVE ARCHIVE AS A SERVICE?</p>

          <h2>
            Storage aligned
            <br />
            to the information.
          </h2>
        </div>

        <div className="aaas-benefit-grid">
          {benefits.map((benefit, index) => (
            <article key={benefit.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}