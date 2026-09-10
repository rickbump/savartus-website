"use client";

import { useState } from "react";

const inquiryTypes = [
  "Active Archive",
  "ELS Systems",
  "Data Lifecycle Management",
  "Managed Services",
  "Partnerships",
  "General Inquiry",
];

export function ContactForm() {
  const [selectedInquiry, setSelectedInquiry] = useState("Active Archive");

  return (
    <form className="contact-form">
      <div className="contact-field-row">
        <div className="contact-field">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
          />
        </div>

        <div className="contact-field">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div className="contact-field">
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="contact-field">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
        />
      </div>

      <fieldset className="contact-interest">
        <legend>What can we help with?</legend>

        <div className="contact-interest-grid">
          {inquiryTypes.map((item) => (
            <label
              key={item}
              className={`contact-interest-option ${
                selectedInquiry === item ? "is-selected" : ""
              }`}
            >
              <input
                type="radio"
                name="inquiryType"
                value={item}
                checked={selectedInquiry === item}
                onChange={() => setSelectedInquiry(item)}
              />

              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="contact-field">
        <label htmlFor="message">How can we help?</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
        />
      </div>

      <button type="submit" className="button button-primary">
        Send inquiry
      </button>

      <p className="contact-form-note">
        A member of the Savartus team will follow up with you directly.
      </p>
    </form>
  );
}