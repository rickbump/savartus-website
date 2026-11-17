import { timingSafeEqual } from "node:crypto";
import { latestBillingDate } from "@/lib/preservation/cloutility";
import { billingWebhookToken, cloutilityConfig } from "@/lib/preservation/config";
import { billLatestRun, billLines, dryRun, flatLines } from "@/lib/preservation/usage-billing";

export const runtime = "nodejs";
export const maxDuration = 120;

// Cloutility billing-data subscriber ("Post URL" set to
// https://<site>/api/preservation/billing-data?token=<secret>; User's manual §7.1).
// Cloutility posts only a notification, {"trigger":"new billing data available"}
// ("test for ..." from its Verify button), so on a real trigger this bills the
// newest run read from the API (lib/preservation/usage-billing.ts). The daily
// job at /api/preservation/billing-sync does the same, in case a notification
// never arrives.
//
// GET with ?date= is a dry run (see below). Before going live, confirm with a
// dry run that Quantity on the storage line is the number of 1 TB packages.

function tokenMatches(request: Request) {
  const supplied = Buffer.from(new URL(request.url).searchParams.get("token") ?? "");
  const expected = Buffer.from(billingWebhookToken());
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

// Dry run, for checking billing before it happens:
//   GET ?token=...&date=YYYY-MM-DD[&forecast=true]
// A future date returns Cloutility's simulated billing. Nothing is charged.
export async function GET(request: Request) {
  if (!tokenMatches(request)) return new Response("Unauthorized", { status: 401 });
  const params = new URL(request.url).searchParams;
  const date = params.get("date") ?? (await latestBillingDate(cloutilityConfig().parentBunitId));
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Pass date=YYYY-MM-DD (no billing has been generated yet)" }, { status: 400 });
  }
  return Response.json(await dryRun(date, params.get("forecast") === "true"), {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  if (!tokenMatches(request)) return new Response("Unauthorized", { status: 401 });

  let payload: unknown;
  try {
    const text = await request.text();
    payload = text.trim() ? JSON.parse(text) : {};
  } catch {
    return new Response("Expected JSON", { status: 400 });
  }

  const trigger = (payload as { trigger?: unknown } | null)?.trigger;
  // Cloutility's "Verify" button sends a test trigger: acknowledge only.
  if (typeof trigger === "string" && /\btest\b/i.test(trigger)) {
    return Response.json({ ok: true, test: true });
  }

  const run = typeof trigger === "string" ? await billLatestRun() : await billLines(flatLines(payload));
  // 5xx so the sender can retry; already-charged customers are skipped.
  return Response.json(run, { status: run.failed ? 502 : 200 });
}
