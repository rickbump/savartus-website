const information = [
  {
    title: "File Reference",
    description:
      "A persistent reference used to identify and manage the information object.",
  },
  {
    title: "Object Identifier",
    description:
      "Identifiers that allow applications and services to consistently refer to the object.",
  },
  {
    title: "Source Metadata",
    description:
      "Metadata inherited from the application, device, repository, or workflow that produced the information.",
  },
  {
    title: "Extracted Metadata",
    description:
      "Metadata discovered or derived during ingestion and processing.",
  },
  {
    title: "Relationships",
    description:
      "Connections between files, objects, events, cases, users, applications, or other information.",
  },
  {
    title: "Search Attributes",
    description:
      "Structured attributes that support discovery, filtering, retrieval, and application workflows.",
  },
];

export function FMSInformationModel() {
  return (
    <section className="fms-section fms-information">
      <div className="site-container">
        <div className="fms-section-header">
          <p className="fms-eyebrow">THE INFORMATION LAYER</p>

          <h2>
            Storage holds the bytes.
            <br />
            FMS understands the record.
          </h2>

          <p>
            Enterprise information is more useful when the organization can
            identify it, describe it, search it, connect it to related
            information, and expose that context to applications.
          </p>
        </div>

        <div className="fms-information-grid">
          {information.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}