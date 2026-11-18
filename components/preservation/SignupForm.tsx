"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CERTIFICATE_ACCEPT, CERTIFICATE_MAX_BYTES, exemptionTypes, usStates } from "@/lib/preservation/tax-exemption";
import { useCases } from "@/lib/preservation/tiers";

export type TierOption = {
  id: string;
  label: string;
  summary: string;
  price: string | null;
};

export function SignupForm({ tiers, notice }: { tiers: TierOption[]; notice: string | null }) {
  const [tier, setTier] = useState(
    tiers.find((option) => option.id === "tb5")?.id ?? tiers[0]?.id ?? "",
  );
  const [taxExempt, setTaxExempt] = useState(false);
  const [exemptionType, setExemptionType] = useState("");
  const [error, setError] = useState<string | null>(notice);
  const [submitting, setSubmitting] = useState(false);

  const numberOptional = exemptionTypes.find((option) => option.id === exemptionType)?.numberRequired === false;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const certificate = form.get("certificate");
    if (taxExempt && certificate instanceof File && certificate.size > CERTIFICATE_MAX_BYTES) {
      setError("The certificate file is too large. Please upload a file under 4 MB.");
      setSubmitting(false);
      return;
    }
    const upload = new FormData();
    if (taxExempt && certificate instanceof File && certificate.size > 0) upload.set("certificate", certificate);
    upload.set(
      "data",
      JSON.stringify({
          tier,
          useCase: form.get("useCase"),
          name: form.get("name"),
          organization: form.get("organization"),
          email: form.get("email"),
          phone: form.get("phone"),
          taxExempt,
          exemptionType: taxExempt ? form.get("exemptionType") : undefined,
          exemptionState: taxExempt ? form.get("exemptionState") : undefined,
          exemptionNumber: taxExempt ? form.get("exemptionNumber") : undefined,
          acceptTerms: form.get("acceptTerms") === "on",
          website: form.get("website"),
        }),
    );
    try {
      const response = await fetch("/api/preservation/checkout", { method: "POST", body: upload });
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

      <div className="contact-field">
        <label htmlFor="useCase">What will you mainly store?</label>
        <select id="useCase" name="useCase" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {useCases.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

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

      <div className="preservation-exempt">
        <label className="preservation-terms">
          <input type="checkbox" checked={taxExempt} onChange={(event) => setTaxExempt(event.target.checked)} />
          <span>My organization is exempt from US sales tax (for example a government agency or nonprofit).</span>
        </label>

        {taxExempt && (
          <>
            <p className="preservation-exempt-hint">
              Checkout won&apos;t add sales tax. We review your certificate after signup; if we
              can&apos;t confirm it, we&apos;ll contact you before any tax is charged.
            </p>
            <div className="contact-field">
              <label htmlFor="exemptionType">Type of exemption</label>
              <select
                id="exemptionType"
                name="exemptionType"
                required
                value={exemptionType}
                onChange={(event) => setExemptionType(event.target.value)}
              >
                <option value="" disabled>
                  Choose one
                </option>
                {exemptionTypes.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="contact-field-row">
              <div className="contact-field">
                <label htmlFor="exemptionState">Issuing state</label>
                <select id="exemptionState" name="exemptionState" required defaultValue="">
                  <option value="" disabled>
                    Choose a state
                  </option>
                  {Object.entries(usStates).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contact-field">
                <label htmlFor="exemptionNumber">
                  Exemption or certificate number{numberOptional ? " (if any)" : ""}
                </label>
                <input
                  id="exemptionNumber"
                  name="exemptionNumber"
                  type="text"
                  maxLength={40}
                  autoComplete="off"
                  required={!numberOptional}
                />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="certificate">Exemption certificate (PDF, JPEG or PNG, under 4 MB)</label>
              <input id="certificate" name="certificate" type="file" accept={CERTIFICATE_ACCEPT} required />
            </div>
          </>
        )}
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
        rate. Prices exclude sales tax or VAT; any tax due is calculated from your billing
        address and shown at checkout and on each invoice.
      </p>
    </form>
  );
}
