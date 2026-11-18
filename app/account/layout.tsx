import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Your account", template: "%s | Savartus account" },
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <main className="account">{children}</main>;
}
