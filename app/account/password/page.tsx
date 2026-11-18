import type { Metadata } from "next";
import Link from "next/link";
import { PasswordLinkForm } from "@/components/account/PasswordLinkForm";

export const metadata: Metadata = { title: "Set or reset your password" };

export default function PasswordPage() {
  return (
    <section className="account-auth site-container">
      <p className="contact-eyebrow">SAVARTUS ACCOUNT</p>
      <h1>Set or reset your password</h1>
      <p className="account-muted">
        Enter the email address you signed up or were invited with. We&apos;ll email you a link to
        choose a password. You only need this the first time, or if you forget it.
      </p>
      <PasswordLinkForm />
      <p className="account-small">
        <Link href="/account/signin">Back to sign in</Link>
      </p>
    </section>
  );
}
