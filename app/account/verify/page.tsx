import type { Metadata } from "next";
import Link from "next/link";
import { completeSignin } from "@/app/account/actions";
import { signinTokenIsUsable } from "@/lib/account/store";

export const metadata: Metadata = { title: "Sign in", referrer: "no-referrer" };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  const usable = typeof token === "string" && token.length > 20 && (await signinTokenIsUsable(token));

  return (
    <section className="account-auth site-container">
      <p className="contact-eyebrow">SAVARTUS ACCOUNT</p>
      {usable ? (
        <>
          <h1>Finish signing in</h1>
          <p className="account-muted">Click the button to sign in on this device.</p>
          <form action={completeSignin}>
            <input type="hidden" name="token" value={token} />
            <button type="submit" className="button button-primary">
              Sign in to Savartus
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>This link has expired</h1>
          <p className="account-muted">
            Sign-in links work once and expire after 30 minutes.{" "}
            <Link href="/account/signin">Get a new link</Link>.
          </p>
        </>
      )}
    </section>
  );
}
