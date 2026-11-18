import { redirect } from "next/navigation";

// Older emails linked here; the link now sets a password.
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  redirect(token ? `/account/set-password?token=${encodeURIComponent(token)}` : "/account/signin");
}
