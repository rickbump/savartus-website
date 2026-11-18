import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/account/actions";
import { requireUser } from "@/lib/account/session";
import { spacesForUser } from "@/lib/account/store";
import { accountName } from "@/lib/preservation/accounts";
import { findTier } from "@/lib/preservation/tiers";

export const metadata: Metadata = { title: "Your spaces" };

export default async function AccountHome() {
  const user = await requireUser();
  const spaces = await spacesForUser(user.id);
  if (spaces.length === 1) redirect(`/account/${spaces[0].account.id}`);

  return (
    <section className="account-auth site-container">
      <p className="contact-eyebrow">SAVARTUS ACCOUNT</p>
      <h1>Your preservation spaces</h1>
      {spaces.length === 0 ? (
        <p className="account-muted">
          You&apos;re signed in as {user.email}, but you aren&apos;t a member of any space. Ask a space
          administrator to invite you, or <Link href="/preservation/signup">start a new space</Link>.
        </p>
      ) : (
        <ul className="account-space-list">
          {spaces.map(({ account, role }) => (
            <li key={account.id}>
              <Link href={`/account/${account.id}`}>
                <strong>{accountName(account)}</strong>
                <span>
                  {findTier(account.tier)?.label ?? account.tier} plan · {role === "admin" ? "Administrator" : "Member"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <form action={signOut}>
        <button type="submit" className="account-link-button">
          Sign out of {user.email}
        </button>
      </form>
    </section>
  );
}
