export function DecisionFlow() {
  return (
    <section className="dlm-section dlm-decision">
      <div className="site-container">
        <div className="dlm-section-header">
          <p className="dlm-eyebrow">POLICY-DRIVEN GOVERNANCE</p>

          <h2>
            Understand.
            <br />
            Evaluate. Decide.
          </h2>

          <p className="dlm-lead">
            Savartus DLM separates observation, policy evaluation, lifecycle
            decisions, and execution so that information can be governed
            consistently across applications, repositories, and storage
            technologies.
          </p>
        </div>

        <div className="dlm-decision-flow">
          <article className="dlm-flow-card">
            <span>01</span>
            <p className="dlm-flow-label">OBSERVE</p>
            <h3>Understand the information</h3>
            <p>
              Gather authoritative metadata, identity, relationships, state,
              context, and governance-relevant observations.
            </p>
          </article>

          <div className="dlm-flow-arrow">→</div>

          <article className="dlm-flow-card dlm-flow-policy">
            <span>02</span>
            <p className="dlm-flow-label">EVALUATE</p>
            <h3>Apply enterprise policy</h3>
            <p>
              Evaluate the conditions relevant to retention, protection,
              availability, preservation, compliance, value, and risk.
            </p>
          </article>

          <div className="dlm-flow-arrow">→</div>

          <article className="dlm-flow-card dlm-flow-decision">
            <span>03</span>
            <p className="dlm-flow-label">DECIDE</p>
            <h3>Determine what should happen</h3>
            <p>
              Produce an explainable lifecycle decision based on current
              information state and applicable policy.
            </p>
          </article>

          <div className="dlm-flow-arrow">→</div>

          <article className="dlm-flow-card dlm-flow-execute">
            <span>04</span>
            <p className="dlm-flow-label">EXECUTE</p>
            <h3>Carry out the authorized action</h3>
            <p>
              Protect, preserve, move, recall, retain, restrict, or dispose
              through the appropriate enterprise service.
            </p>
          </article>
        </div>

        <div className="dlm-loop">
          <span>↻</span>
          <div>
            <strong>Then evaluate again.</strong>
            <p>
              Information, business requirements, risk, policy, and technology
              change. Lifecycle governance should respond when they do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}