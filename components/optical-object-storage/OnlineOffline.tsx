export function OnlineOffline() {
  return (
    <section className="opt-section opt-online-offline">
      <div className="site-container">
        <div className="opt-section-header">
          <p className="opt-eyebrow">ONE MEDIA TECHNOLOGY. TWO ACCESS MODES.</p>

          <h2>
            Online when you need it.
            <br />
            Offline when you don&apos;t.
          </h2>

          <p className="opt-lead">
            Optical storage can remain online through automated optical libraries 
            for direct retrieval, while additional copies can be maintained in 
            physically isolated optical storage for long-term retention and 
            cyber-resilient preservation. Offline media remains tracked and managed 
            by the Savartus environment while remaining physically isolated from 
            the network.
          </p>
        </div>

        <div className="opt-access-grid">
          <article className="opt-access-card opt-access-online">
            <p className="opt-card-label">ONLINE OPTICAL</p>
            <h3>Preservation without compromise</h3>

            <p>
              Storage policies can maintain accessible optical copies, 
              physically isolated copies, or both—configured according to 
              the requirements of each bucket.
            </p>

            <div className="opt-access-properties">
              <span>Robotic access</span>
              <span>Online retrieval</span>
              <span>Object-aware</span>
              <span>Network accessible</span>
            </div>
          </article>

          <article className="opt-access-card opt-access-offline">
            <p className="opt-card-label">OFFLINE OPTICAL</p>
            <h3>Physical separation when it matters</h3>

            <p>
              Savartus can maintain physical media separation between 
              customers or between designated data buckets, providing 
              a level of physical data isolation that software-defined 
              storage alone cannot provide.
            </p>

            <div className="opt-access-properties">
              <span>Air-gapped</span>
              <span>No online attack path</span>
              <span>Indexed</span>
              <span>Retrievable</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}