"use client";

import { useState } from "react";

const ttlOptions = [30, 90, 180, 365];

export function HotStorageTTL() {
  const [ttl, setTtl] = useState(90);

  return (
    <section className="aa-section">
      <div className="site-container">
        <div className="aa-section-header">
          <p className="aa-eyebrow">CUSTOMER-DEFINED ACCESS</p>

          <h2>
            Keep hot storage only
            <br />
            as long as you need it.
          </h2>

          <p className="aa-lead">
            The customer defines how long the high-performance SSD or HDD copy
            remains available. When that period expires, the hot copy can be
            removed automatically while the preserved optical object remains
            accessible.
          </p>
        </div>

        <div className="ttl-panel">
          <div className="ttl-controls">
            <div>
              <p className="ttl-label">HOT STORAGE TIME TO LIVE</p>
              <div className="ttl-value">{ttl} days</div>
            </div>

            <div className="ttl-options">
              {ttlOptions.map((days) => (
                <button
                  key={days}
                  type="button"
                  className={`ttl-button ${ttl === days ? "active" : ""}`}
                  onClick={() => setTtl(days)}
                >
                  {days}
                </button>
              ))}
            </div>
          </div>

          <div className="ttl-timeline">
            <div className="ttl-stage">
              <div className="ttl-stage-heading">
                <span>DAY 0</span>
                <strong>Information arrives</strong>
              </div>

              <div className="ttl-storage-row">
                <div className="ttl-storage-card hot">
                  <span className="ttl-card-label">HOT STORAGE</span>
                  <h3>SSD / HDD</h3>
                  <p>Immediate access</p>
                </div>

                <div className="ttl-plus">+</div>

                <div className="ttl-storage-card optical">
                  <span className="ttl-card-label">OPTICAL OBJECT STORAGE</span>
                  <h3>Preserved</h3>
                  <p>Retention begins immediately</p>
                </div>
              </div>
            </div>

            <div className="ttl-transition">
              <div className="ttl-transition-line" />
              <div className="ttl-transition-copy">
                Customer-defined TTL: <strong>{ttl} days</strong>
              </div>
            </div>

            <div className="ttl-stage">
              <div className="ttl-stage-heading">
                <span>DAY {ttl}</span>
                <strong>Hot copy expires</strong>
              </div>

              <div className="ttl-storage-row">
                <div className="ttl-storage-card hot expired">
                  <span className="ttl-card-label">HOT STORAGE</span>
                  <h3>SSD / HDD</h3>
                  <p>Removed from hot tier</p>
                </div>

                <div className="ttl-arrow">→</div>

                <div className="ttl-storage-card optical persistent">
                  <span className="ttl-card-label">ONLINE OPTICAL</span>
                  <h3>Still accessible</h3>
                  <p>Preserved and retrievable</p>
                </div>
              </div>
            </div>
          </div>

          <div className="ttl-message">
            <strong>The hot copy expires. The information does not.</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
