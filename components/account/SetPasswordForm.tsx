"use client";

import { useActionState } from "react";
import { setPassword, type FormState } from "@/app/account/actions";

export function SetPasswordForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(setPassword, undefined);
  return (
    <form action={action} className="contact-form account-form">
      <input type="hidden" name="token" value={token} />
      <div className="contact-field">
        <label htmlFor="password">New password (at least 10 characters)</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={10} maxLength={200} required autoFocus />
      </div>
      <div className="contact-field">
        <label htmlFor="confirm">Type it again</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={10} maxLength={200} required />
      </div>
      {state?.error && <p className="preservation-error" role="alert">{state.error}</p>}
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Saving…" : "Save password and sign in"}
      </button>
    </form>
  );
}
