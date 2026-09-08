const libraries = [
  "ELS500",
  "ELS1000",
  "ELS3600",
  "ELS4000",
  "ELS8000",
  "ELS10K",
];

export function OrainScale() {
  return (
    <section className="orain-section orain-scale-section">
      <div className="site-container">
        <div className="orain-section-header">
          <p className="orain-eyebrow">SCALE WITHOUT SILOS</p>

          <h2>
            One namespace.
            <br />
            Multiple systems.
          </h2>

          <p>
            Add optical systems as preservation requirements grow while
            oRain maintains the managed view across the environment.
          </p>
        </div>

        <div className="orain-scale-diagram">
          <div className="orain-scale-core">
            <small>MANAGED BY</small>
            <strong>oRain</strong>
          </div>

          <div className="orain-scale-line" />

          <div className="orain-library-grid">
            {libraries.map((library) => (
              <div key={library}>
                <span>OPTICAL LIBRARY</span>
                <strong>{library}</strong>
              </div>
            ))}
          </div>
        </div>

        <p className="orain-scale-note">
          Expand preservation capacity without creating isolated storage
          islands.
        </p>
      </div>
    </section>
  );
}