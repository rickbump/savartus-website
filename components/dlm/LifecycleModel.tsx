const lifecycleStates = [
  {
    name: "Created",
    description: "Information enters the enterprise lifecycle.",
  },
  {
    name: "Active",
    description: "Information supports current business activity.",
  },
  {
    name: "Collaborative",
    description: "Information is actively shared, changed, and developed.",
  },
  {
    name: "Managed",
    description: "Information enters governed enterprise management.",
  },
  {
    name: "Protected",
    description: "Additional protection requirements apply.",
  },
  {
    name: "Archived",
    description: "Primary operational activity has decreased.",
  },
  {
    name: "Preserved",
    description: "Long-term authenticity and accessibility become central.",
  },
  {
    name: "Disposed",
    description: "Authorized lifecycle completion has occurred.",
  },
];

export function LifecycleModel() {
  return (
    <section className="dlm-section dlm-lifecycle">
      <div className="site-container">
        <div className="dlm-section-header">
          <p className="dlm-eyebrow">ENTERPRISE DATA LIFECYCLE</p>

          <h2>
            Information has a
            <br />
            business lifecycle.
          </h2>

          <p className="dlm-lead">
            Lifecycle state describes where information exists within its
            business and governance lifecycle. It is not a description of the
            disk, cloud tier, optical library, or other technology currently
            storing it.
          </p>
        </div>

        <div className="dlm-lifecycle-track">
          {lifecycleStates.map((state, index) => (
            <article className="dlm-lifecycle-state" key={state.name}>
              <div className="dlm-lifecycle-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="dlm-lifecycle-dot" />

              <h3>{state.name}</h3>
              <p>{state.description}</p>
            </article>
          ))}
        </div>

        <p className="dlm-lifecycle-note">
          Lifecycle transitions are policy-driven. The appropriate path is
          determined by the information and its requirements — not merely by
          elapsed time.
        </p>
      </div>
    </section>
  );
}