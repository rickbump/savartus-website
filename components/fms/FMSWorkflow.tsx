export function FMSWorkflow() {
  return (
    <section className="fms-section">
      <div className="site-container">
        <div className="fms-section-header">
          <p className="fms-eyebrow">FROM INGEST TO DISCOVERY</p>

          <h2>
            Register the information
            <br />
            as it enters the environment.
          </h2>

          <p>
            FMS becomes part of the information workflow at ingest, capturing
            references and metadata so files do not become anonymous objects
            buried inside storage infrastructure.
          </p>
        </div>

        <div className="fms-workflow">
          <article>
            <span>01</span>
            <h3>Ingest</h3>
            <p>
              Information enters through an application, API, endpoint, or
              other supported workflow.
            </p>
          </article>

          <div className="fms-workflow-arrow">→</div>

          <article>
            <span>02</span>
            <h3>Extract</h3>
            <p>
              Source and derived metadata can be collected during processing.
            </p>
          </article>

          <div className="fms-workflow-arrow">→</div>

          <article className="fms-workflow-featured">
            <span>03</span>
            <h3>Register</h3>
            <p>
              FMS records identifiers, references, metadata and searchable
              attributes for the managed information.
            </p>
          </article>

          <div className="fms-workflow-arrow">→</div>

          <article>
            <span>04</span>
            <h3>Use</h3>
            <p>
              Applications and users query the information layer for search,
              management and workflow activity.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}