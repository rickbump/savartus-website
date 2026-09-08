export function OpticalCharacteristics() {
  const characteristics = [
    {
      label: "IMMUTABILITY",
      title: "Write once. Preserve as written.",
      description:
        "WORM optical media provides a physical mechanism for preserving committed information without in-place modification.",
    },
    {
      label: "LONGEVITY",
      title: "Designed for long retention horizons.",
      description:
        "Optical storage is intended for information whose useful life can extend well beyond the refresh cycle of conventional enterprise storage hardware.",
    },
    {
      label: "INTEGRITY",
      title: "Preservation starts with trustworthy media.",
      description:
        "Durable media, object identity, integrity verification, and managed retrieval form part of a broader preservation architecture.",
    },
    {
      label: "PORTABILITY",
      title: "Media can exist independently of the library.",
      description:
        "Removable optical media enables online storage to transition into physically separate retention without rewriting the information onto another technology.",
    },
  ];

  return (
    <section className="opt-section opt-characteristics">
      <div className="site-container">
        <div className="opt-section-header">
          <p className="opt-eyebrow">PHYSICAL CHARACTERISTICS MATTER</p>

          <h2>
            Preservation begins
            <br />
            below the software layer.
          </h2>
        </div>

        <div className="opt-characteristic-list">
          {characteristics.map((item, index) => (
            <article className="opt-characteristic" key={item.label}>
              <div className="opt-characteristic-index">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <p className="opt-card-label">{item.label}</p>
                <h3>{item.title}</h3>
              </div>

              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}