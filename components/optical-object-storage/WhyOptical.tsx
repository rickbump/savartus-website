export function WhyOptical() {
  const points = [
    {
      title: "Built for retention",
      text: "Optical media is designed for long-term information preservation rather than continuous mechanical operation.",
    },
    {
      title: "Immutable by design",
      text: "Write-once optical media provides a physical foundation for information that must not be altered after it is committed.",
    },
    {
      title: "No power to maintain data",
      text: "Once written, optical media does not require power to preserve the information stored on it.",
    },
    {
      title: "Online or offline",
      text: "The same media technology can support robotic online access or physically isolated offline preservation.",
    },
  ];

  return (
    <section className="opt-section opt-why">
      <div className="site-container">
        <div className="opt-section-header">
          <p className="opt-eyebrow">WHY OPTICAL?</p>

          <h2>
            Storage designed for
            <br />
            information that persists.
          </h2>

          <p className="opt-lead">
            Most enterprise storage infrastructure is optimized around
            performance, not decades of retention. Optical storage introduces a
            different set of physical characteristics for information that must
            remain authentic, durable, and recoverable over long periods.
          </p>
        </div>

        <div className="opt-feature-grid">
          {points.map((point) => (
            <article className="opt-feature-card" key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}