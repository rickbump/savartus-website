import Link from "next/link";
import { signOut } from "@/app/account/actions";
import { SpaceTabs } from "@/components/account/SpaceTabs";
import { requireSpace } from "@/lib/account/session";
import { spacesForUser } from "@/lib/account/store";
import { accountName } from "@/lib/preservation/accounts";
import { findTier } from "@/lib/preservation/tiers";

export default async function SpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ spaceId: string }>;
}) {
  const { spaceId } = await params;
  const { user, role, account } = await requireSpace(spaceId);
  const otherSpaces = (await spacesForUser(user.id)).length > 1;

  return (
    <div className="account-space site-container">
      <header className="account-space-header">
        <div>
          <p className="contact-eyebrow">OPTICAL PRESERVATION</p>
          <h1>{accountName(account)}</h1>
          <p className="account-muted">
            {findTier(account.tier)?.label ?? account.tier} plan · {role === "admin" ? "Administrator" : "Member"}
            {account.status === "past_due" && <strong className="account-warning"> · Payment overdue</strong>}
          </p>
        </div>
        <div className="account-space-user">
          <span>{user.email}</span>
          {otherSpaces && <Link href="/account">Switch space</Link>}
          <form action={signOut}>
            <button type="submit" className="account-link-button">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <SpaceTabs spaceId={spaceId} admin={role === "admin"} />
      <div className="account-panel">{children}</div>
    </div>
  );
}
