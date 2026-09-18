"use client";

import { FormEvent, useId, useState } from "react";

type Props = {
  source: string;
  compact?: boolean;
};

const requestRecipient = "info@savartus.com";

export function FullDocumentRequest({ source, compact = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "");
    const organization = String(formData.get("organization") ?? "");
    const title = String(formData.get("title") ?? "");
    const email = String(formData.get("email") ?? "");

    const subject = "Full Enterprise Data Lifecycle Specification request";
    const body = [
      "Please send the full Enterprise Data Lifecycle Specification download link.",
      "",
      `Name: ${name}`,
      `Employer / Institution: ${organization}`,
      `Title: ${title}`,
      `Email: ${email}`,
      `Request source: ${source}`,
    ].join("\n");

    window.location.href = `mailto:${requestRecipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setSubmitted(true);
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

          <form className="full-document-form" onSubmit={handleSubmit}>
            <div className="contact-field">
              <label htmlFor={`${formId}-name`}>Name</label>
              <input
                id={`${formId}-name`}
                name="name"
                type="text"
                autoComplete="name"
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
                required
              />
            </div>

            <div className="full-document-actions">
              <button type="submit" className="button button-primary">
                Request Link
              </button>

              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
            </div>

            {submitted && (
              <p className="full-document-note">
                Your email client should open with the request. Send that email
                and Savartus will reply with the full-document link.
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
