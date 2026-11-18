"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SpaceTabs({ spaceId, admin }: { spaceId: string; admin: boolean }) {
  const pathname = usePathname();
  const base = `/account/${spaceId}`;
  const tabs = [
    { href: base, label: "Files" },
    { href: `${base}/usage`, label: "Usage" },
    ...(admin
      ? [
          { href: `${base}/members`, label: "Members" },
          { href: `${base}/keys`, label: "S3 keys" },
          { href: `${base}/billing`, label: "Billing" },
          { href: `${base}/activity`, label: "Activity" },
        ]
      : []),
  ];
  return (
    <nav className="account-tabs" aria-label="Space sections">
      {tabs.map((tab) => (
        <Link key={tab.href} href={tab.href} className={pathname === tab.href ? "is-active" : undefined}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
