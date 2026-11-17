import { timingSafeEqual } from "node:crypto";
import { accountsNeedingProvisioning } from "@/lib/preservation/accounts";
import { jobToken } from "@/lib/preservation/config";
import { provisionAccount } from "@/lib/preservation/provision";

export const runtime = "nodejs";
export const maxDuration = 300;

function authorized(request: Request) {
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${jobToken()}`);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

// Run on a schedule (e.g. every 10 minutes) with
// `Authorization: Bearer $PRESERVATION_JOB_TOKEN`. Picks up accounts whose
// provisioning failed or never ran and resumes them.
export async function GET(request: Request) {
  if (!authorized(request)) return new Response("Unauthorized", { status: 401 });

  const results: Record<string, string> = {};
  for (const id of await accountsNeedingProvisioning()) {
    results[id] = await provisionAccount(id);
  }
  return Response.json({ results });
}
