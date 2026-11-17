"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Status = {
  state: "awaiting_payment" | "working" | "ready" | "delayed" | "canceled";
  steps: { payment: boolean; account: boolean; login: boolean; s3User: boolean; bucket: boolean };
};

const STEPS: { key: keyof Status["steps"]; label: string }[] = [
  { key: "payment", label: "Payment confirmed" },
  { key: "account", label: "Account and contract created" },
  { key: "login", label: "Portal login created (activation email sent)" },
  { key: "s3User", label: "S3 user created" },
  { key: "bucket", label: "Optical preservation bucket created" },
];

// Polls provisioning progress for a few minutes after checkout.
export function ProvisioningProgress({ sessionId, email }: { sessionId: string; email: string }) {
  const [status, setStatus] = useState<Status | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    async function poll() {
      try {
        const response = await fetch(`/api/preservation/status?session_id=${encodeURIComponent(sessionId)}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const next = (await response.json()) as Status;
          if (stopped) return;
          setStatus(next);
          if (next.state === "ready" || next.state === "canceled") return;
        }
      } catch {
        // Network hiccup; try again on the next tick.
      }
      if (Date.now() - startedAt > 10 * 60_000) {
        setGaveUp(true);
        return;
      }
      timer = setTimeout(poll, 4000);
    }

    poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  const ready = status?.state === "ready";
  const delayed = status?.state === "delayed" || gaveUp;

  return (
    <div className="preservation-progress" aria-live="polite">
      <ol className="preservation-progress-steps">
        {STEPS.map((step) => {
          const done = status?.steps[step.key] ?? false;
          return (
            <li key={step.key} className={done ? "is-done" : ""}>
              <span className="preservation-progress-mark" aria-hidden="true">
                {done ? "✓" : "…"}
              </span>
              {step.label}
              <span className="visually-hidden">{done ? " (done)" : " (in progress)"}</span>
            </li>
          );
        })}
      </ol>

      {ready ? (
        <div className="preservation-progress-note">
          <p>
            <strong>Your preservation space is ready.</strong> Check <strong>{email}</strong> for two
            emails: the portal activation link, and a welcome email with your bucket name and
            connection details.
          </p>
          <p>
            <Link className="button button-primary" href="/preservation/getting-started">
              Getting started guide
            </Link>
          </p>
        </div>
      ) : delayed ? (
        <p className="preservation-progress-note">
          Setup is taking longer than usual. Our team has been notified and will finish it for you;
          you don&apos;t need to do anything, and we&apos;ll email you when it&apos;s ready. Questions:{" "}
          <a href="mailto:info@savartus.com">info@savartus.com</a>.
        </p>
      ) : (
        <p className="preservation-progress-note">This usually takes a minute or two. You can keep this page open.</p>
      )}
    </div>
  );
}
