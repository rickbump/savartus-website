"use client";

import { useActionState } from "react";
import { renewSecret, type FormState } from "@/app/account/actions";

export function RenewSecretForm({ spaceId }: { spaceId: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(renewSecret, undefined);

  if (state?.secret) {
    return (
      <div className="account-notice" role="status">
        <p>
          <strong>Your new secret key:</strong>
        </p>
        <p>
          <code className="account-secret">{state.secret}</code>
        </p>
        <button type="button" className="button button-secondary" onClick={() => navigator.clipboard?.writeText(state.secret!)}>
          Copy
        </button>
        <p className="account-small">
          Copy it into your S3 software now. It won&apos;t be shown again; if you lose it, create a
          new one. Don&apos;t send it by email.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm("Create a new secret key? S3 software using the current one will stop working until you update it.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="spaceId" value={spaceId} />
      <button type="submit" className="button button-primary" disabled={pending}>
        {pending ? "Creating…" : "Create a new secret key"}
      </button>
      {state?.error && <p className="preservation-error" role="alert">{state.error}</p>}
      <p className="account-muted account-small">
        Creating a new secret replaces the current one. The file browser on this site keeps working.
      </p>
    </form>
  );
}
