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
            Optical storage can remain connected through robotic libraries for
            direct retrieval or move into physically isolated storage when
            long-term retention and cyber isolation become more important than
            immediate access.
          </p>
        </div>

        <div className="opt-access-grid">
          <article className="opt-access-card opt-access-online">
            <p className="opt-card-label">ONLINE OPTICAL</p>
            <h3>Accessible preservation</h3>

            <p>
              Media remains mounted within robotic library infrastructure.
              Objects remain indexed, discoverable, and retrievable through the
              Savartus storage environment.
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
            <h3>Physical isolation</h3>

            <p>
              Media can be removed from the online library while remaining
              indexed and managed, providing physical separation from the
              production environment.
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