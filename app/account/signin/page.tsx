import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SigninForm } from "@/components/account/SigninForm";
import { currentUser } from "@/lib/account/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function SigninPage({ searchParams }: { searchParams: Promise<{ expired?: string }> }) {
  if (await currentUser()) redirect("/account");
  const { expired } = await searchParams;
  return (
    <section className="account-auth site-container">
      <p className="contact-eyebrow">SAVARTUS ACCOUNT</p>
      <h1>Sign in</h1>
      <p className="account-muted">
        Enter the email address you signed up or were invited with. We&apos;ll email you a link
        to sign in; there&apos;s no password to remember.
      </p>
      {expired && (
        <p className="preservation-error" role="alert">
          That sign-in link has expired or was already used. Enter your email for a new one.
        </p>
      )}
      <SigninForm />
    </section>
  );
}
