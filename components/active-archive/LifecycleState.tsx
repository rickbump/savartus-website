"use client";

import { useState } from "react";

type LifecycleStateName = "active" | "archive" | "deep";

const states = [
  {
    id: "active" as LifecycleStateName,
    label: "ACTIVE USE",
    title: "Performance copy retained",
    description:
      "Information remains on SSD or HDD while usage and performance requirements justify it. The nearline optical preservation copy exists independently.",
  },
  {
    id: "archive" as LifecycleStateName,
    label: "PERFORMANCE COPY REMOVED",
    title: "Nearline preservation remains",
    description:
      "When the performance copy is no longer required, it is removed according to bucket policy. The information remains preserved, discoverable, and retrievable from nearline optical storage.",
  },
  {
    id: "deep" as LifecycleStateName,
    label: "OFFLINE OPTICAL",
    title: "Physically isolated preservation",
    description:
      "Information can reside in offline optical storage for long-term retention, physical isolation, and cyber-resilient preservation. The physical location of offline optical media is tracked in real time by the Savartus management environment.",
  },
];

export function LifecycleState() {
  const [state, setState] = useState<LifecycleStateName>("active");
  const current = states.find((item) => item.id === state)!;

  return (
    <section className="aa-section aa-lifecycle-section">
      <div className="site-container">
        <div className="aa-section-header">
          <p className="aa-eyebrow">STORAGE PLACEMENT CHANGES. PRESERVATION CONTINUES.</p>

          <h2>
            Keep information on the
            <br />
            right tier for the job.
          </h2>

          <p className="aa-lead">
            Information does not require the same storage characteristics throughout
            its lifecycle. Savartus separates lifecycle state from storage placement,
            allowing access tiers to change while the information remains managed,
            preserved, and available according to policy.
          </p>
        </div>

        <div className="lifecycle-panel">
          <div className="lifecycle-tabs">
            {states.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`lifecycle-tab ${
                  state === item.id ? "active" : ""
                }`}
                onClick={() => setState(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="lifecycle-content">
            <div className="lifecycle-copy">
              <p className="lifecycle-stage-label">{current.label}</p>
              <h3>{current.title}</h3>
              <p>{current.description}</p>
            </div>

            <div className="lifecycle-visual">
              <div
                className={`lifecycle-storage-card lifecycle-hot ${
                  state === "active" ? "enabled" : "disabled"
                }`}
              >
                <span className="lifecycle-card-label">PERFORMANCE</span>
                <strong>SSD / HDD</strong>
                <span>Retained while needed</span>
              </div>

              <div className="lifecycle-plus">+</div>

              <div
                className={`lifecycle-storage-card lifecycle-nearline ${
                  state === "active" || state === "archive"
                    ? "enabled"
                    : "disabled"
                }`}
              >
                <span className="lifecycle-card-label">NEARLINE OPTICAL</span>
                <strong>Preservation</strong>
                <span>Accessible + preserved</span>
              </div>

              <div className="lifecycle-arrow">→</div>

              <div
                className={`lifecycle-storage-card lifecycle-offline ${
                  state === "deep" ? "enabled" : "disabled"
                }`}
              >
                <span className="lifecycle-card-label">OFFLINE OPTICAL</span>
                <strong>Deep Preservation</strong>
                <span>Air-gapped retention</span>
              </div>
            </div>
          </div>

          <div className="lifecycle-message">
            <strong>
              Storage placement can change without changing the information&apos;s
              lifecycle state.
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
}
