import type { Metadata } from "next";
import Link from "next/link";
import { SetPasswordForm } from "@/components/account/SetPasswordForm";
import { signinTokenIsUsable } from "@/lib/account/store";

export const metadata: Metadata = { title: "Choose a password", referrer: "no-referrer" };

export default async function SetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const usable = typeof token === "string" && token.length > 20 && (await signinTokenIsUsable(token));
  return (
    <section className="account-auth site-container">
      <p className="contact-eyebrow">SAVARTUS ACCOUNT</p>
      {usable ? (
        <>
          <h1>Choose a password</h1>
          <p className="account-muted">You&apos;ll use it with your email address to sign in from now on.</p>
          <SetPasswordForm token={token} />
        </>
      ) : (
        <>
          <h1>This link has expired</h1>
          <p className="account-muted">
            Links work once. <Link href="/account/password">Get a new link</Link>, or{" "}
            <Link href="/account/signin">sign in</Link> if you already have a password.
          </p>
        </>
      )}
    </section>
  );
}
