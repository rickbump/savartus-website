"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type FormState } from "@/app/account/actions";

export function SigninForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, undefined);
  return (
    <form action={action} className="contact-form account-form">
      <div className="contact-field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required defaultValue={state?.email} autoFocus={!state?.email} />
      </div>
      <div className="contact-field">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" maxLength={200} required autoFocus={Boolean(state?.email)} />
      </div>
      {state?.error && (
        <p className="preservation-error" role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="account-small">
        First time here, or forgot your password? <Link href="/account/password">Set or reset your password</Link>.
      </p>
    </form>
  );
}
