"use client";

import { useActionState } from "react";
import { inviteMember, type FormState } from "@/app/account/actions";

export function InviteForm({ spaceId }: { spaceId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(inviteMember, undefined);
  return (
    <form action={action} className="contact-form account-form account-inline-form" key={state?.ok}>
      <input type="hidden" name="spaceId" value={spaceId} />
      <div className="contact-field">
        <label htmlFor="invite-email">Email address</label>
        <input id="invite-email" name="email" type="email" maxLength={254} required />
      </div>
      <div className="contact-field">
        <label htmlFor="invite-role">Role</label>
        <select id="invite-role" name="role" defaultValue="member">
          <option value="member">Member</option>
          <option value="admin">Administrator</option>
        </select>
      </div>
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Sending…" : "Send invitation"}
      </button>
      {state?.ok && <p className="account-notice" role="status">{state.ok}</p>}
      {state?.error && <p className="preservation-error" role="alert">{state.error}</p>}
    </form>
  );
}
