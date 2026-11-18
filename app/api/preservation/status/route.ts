import { accountByCheckoutSession } from "@/lib/preservation/accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Provisioning progress for the signup confirmation page. The Stripe Checkout
// session ID (only known to the buyer's browser) is the lookup key, and only
// step flags are returned: no names, emails, or Cloutility IDs.
export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!/^cs_[A-Za-z0-9_]{10,200}$/.test(sessionId)) {
    return Response.json({ error: "Unknown session" }, { status: 404 });
  }

  const account = await accountByCheckoutSession(sessionId).catch(() => undefined);
  if (!account) return Response.json({ error: "Unknown session" }, { status: 404 });

  const state =
    account.status === "active" || account.status === "past_due"
      ? "ready"
      : account.status === "pending_payment"
        ? "awaiting_payment"
        : account.status === "failed"
          ? "delayed"
          : account.status === "canceled"
            ? "canceled"
            : "working";

  return Response.json(
    {
      state,
      steps: {
        payment: account.status !== "pending_payment",
        account: account.cloutility_bunit_id !== null && account.cloutility_contract_erp_reference !== null,
        s3User: account.cloutility_orain_user_id !== null,
        bucket: account.cloutility_bucket_created,
        space: account.s3_secret_enc !== null,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
