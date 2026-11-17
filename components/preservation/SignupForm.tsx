"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export type TierOption = {
  id: string;
  label: string;
  summary: string;
  price: string | null;
};

export function SignupForm({ tiers, canceled }: { tiers: TierOption[]; canceled: boolean }) {
  const [tier, setTier] = useState(
    tiers.find((option) => option.id === "tb5")?.id ?? tiers[0]?.id ?? "",
  );
  const [error, setError] = useState<string | null>(
    canceled ? "Checkout was canceled. Your card was not charged." : null,
  );
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/preservation/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          name: form.get("name"),
          organization: form.get("organization"),
          email: form.get("email"),
          phone: form.get("phone"),
          acceptTerms: form.get("acceptTerms") === "on",
          website: form.get("website"),
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout could not be started.");
      window.location.assign(data.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Checkout could not be started.");
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <fieldset className="contact-interest">
        <legend>Starting preservation capacity</legend>
        <div className="contact-interest-grid">
          {tiers.map((option) => (
            <label
              key={option.id}
              className={`contact-interest-option preservation-tier ${tier === option.id ? "is-selected" : ""}`}
            >
              <input
                type="radio"
                name="tier"
                value={option.id}
                checked={tier === option.id}
                onChange={() => setTier(option.id)}
              />
              <span className="preservation-tier-label">{option.label}</span>
              {option.price && <span className="preservation-tier-price">{option.price}</span>}
              <span className="preservation-tier-summary">{option.summary}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" maxLength={150} required />
        </div>
        <div className="contact-field">
          <label htmlFor="organization">Organization</label>
          <input id="organization" name="organization" type="text" autoComplete="organization" maxLength={200} required />
        </div>
      </div>

      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required />
        </div>
        <div className="contact-field">
          <label htmlFor="phone">Phone (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={40} />
        </div>
      </div>

      <div className="preservation-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="preservation-terms">
        <input type="checkbox" name="acceptTerms" required />
        <span>
          I accept the{" "}
          <Link href="/preservation/terms" target="_blank">
            service terms
          </Link>
          , and understand that preserved data is written to write-once optical media, that
          capacity can grow but not shrink, and that deleting preserved data requires an approved
          deletion request.
        </span>
      </label>

      {error && (
        <p className="preservation-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="button button-primary" disabled={submitting}>
        {submitting ? "Starting secure checkout…" : "Continue to payment"}
      </button>

      <p className="contact-form-note">
        Payment is handled by Stripe. If you grow past your plan, each additional 1&nbsp;TB is
        billed at your plan&apos;s per-TB rate; for example, 6&nbsp;TB on the 5&nbsp;TB plan is $42/month.
        When you reach the next plan&apos;s size, your whole account moves to that plan&apos;s lower
        rate.
      </p>
    </form>
  );
}
