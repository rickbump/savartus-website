const capabilities = [
  {
    number: "01",
    title: "Location Awareness",
    description:
      "Maintains awareness of where information resides across performance, online optical and offline optical storage.",
  },
  {
    number: "02",
    title: "Write Strategy",
    description:
      "Applies configured storage policies to determine when information moves from the performance tier to optical storage.",
  },
  {
    number: "03",
    title: "Storage Placement",
    description:
      "Coordinates placement across storage systems and optical libraries as the environment grows.",
  },
  {
    number: "04",
    title: "Restore Orchestration",
    description:
      "Determines where requested information resides and coordinates its return to the performance tier.",
  },
  {
    number: "05",
    title: "Online + Offline Awareness",
    description:
      "Maintains location awareness even when optical media has been moved into physically offline preservation.",
  },
  {
    number: "06",
    title: "Deletion Coordination",
    description:
      "Coordinates deletion and storage actions according to the applicable placement and retention controls.",
  },
];

export function OrainCapabilities() {
  return (
    <section className="orain-section">
      <div className="site-container">
        <div className="orain-section-header">
          <p className="orain-eyebrow">STORAGE INTELLIGENCE</p>

          <h2>
            Know what.
            <br />
            Know where.
            <br />
            Know how to get it.
          </h2>
        </div>

        <div className="orain-capability-grid">
          {capabilities.map((capability) => (
            <article key={capability.number}>
              <span>{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}