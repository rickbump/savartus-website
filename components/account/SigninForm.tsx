"use client";

import { useActionState } from "react";
import { requestSignin, type FormState } from "@/app/account/actions";

export function SigninForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestSignin, undefined);
  if (state?.ok) {
    return (
      <p className="account-notice" role="status">
        {state.ok}
      </p>
    );
  }
  return (
    <form action={action} className="contact-form account-form">
      <div className="contact-field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required autoFocus />
      </div>
      {state?.error && (
        <p className="preservation-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Sending…" : "Email me a sign-in link"}
      </button>
    </form>
  );
}
