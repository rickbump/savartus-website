"use client";

import { FormEvent, useId, useRef, useState } from "react";

type Props = {
  source: string;
  compact?: boolean;
};

export function FullDocumentRequest({ source, compact = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const formId = useId();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;

    const formData = new FormData(event.currentTarget);
    pending.current = true;
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/specification-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(formData), source }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        setError(
          result && typeof result === "object" && "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "We couldn't email your link. Please try again shortly.",
        );
        return;
      }
      if (!result || typeof result !== "object" || !("success" in result) ||
          result.success !== true) {
        throw new Error("Unexpected submission response.");
      }
      setSubmitted(true);
    } catch {
      setError("We couldn't confirm your request. Please check your connection and try again, or contact info@savartus.com.");
    } finally {
      pending.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className={`full-document-request ${
        compact ? "full-document-request-compact" : ""
      }`}
    >
      {!isOpen ? (
        <button
          type="button"
          className="button button-secondary"
          aria-expanded="false"
          aria-controls={formId}
          onClick={() => setIsOpen(true)}
        >
          Full Document
        </button>
      ) : (
        <div id={formId} className="full-document-panel">
          <div className="full-document-header">
            <p className="dlmspec-eyebrow">FULL DOCUMENT</p>
            <h3>Request the full specification.</h3>
            <p>
              Provide your information and Savartus will email a link to the
              full Enterprise Data Lifecycle™ Specification.
            </p>
          </div>

          {submitted ? (
            <p className="full-document-note" role="status">
              Your download email is on its way. Check your inbox and spam folder
              for a message from Savartus.
            </p>
          ) : (
            <form
              className="full-document-form"
              onSubmit={handleSubmit}
              aria-busy={isSubmitting}
            >
              <div className="contact-field">
                <label htmlFor={`${formId}-name`}>Name</label>
                <input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={150}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor={`${formId}-organization`}>
                  Employer / Institution
                </label>
                <input
                  id={`${formId}-organization`}
                  name="organization"
                  type="text"
                  autoComplete="organization"
                  maxLength={200}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor={`${formId}-title`}>Title</label>
                <input
                  id={`${formId}-title`}
                  name="title"
                  type="text"
                  autoComplete="organization-title"
                  maxLength={150}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="contact-field">
                <label htmlFor={`${formId}-email`}>Email</label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div hidden>
                <label htmlFor={`${formId}-website`}>Leave this field empty</label>
                <input
                  id={`${formId}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <p className="full-document-note">
                We store your name, employer, title, and email to fulfill and keep a
                record of this request. Submitting does not subscribe you to marketing emails.
              </p>

              <div className="full-document-actions">
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Request Link"}
                </button>

                <button
                  type="button"
                  className="button button-secondary"
                  disabled={isSubmitting}
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>

              {error && <p className="full-document-note" role="alert">{error}</p>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
