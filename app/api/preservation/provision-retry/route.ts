import { accountsNeedingProvisioning } from "@/lib/preservation/accounts";
import { jobAuthorized } from "@/lib/preservation/job-auth";
import { provisionAccount } from "@/lib/preservation/provision";

export const runtime = "nodejs";
export const maxDuration = 300;

// Runs every 10 minutes from vercel.json (Vercel sends CRON_SECRET), or by hand with
// `Authorization: Bearer $PRESERVATION_JOB_TOKEN`. Picks up accounts whose
// provisioning failed or never ran and resumes them. Signups normally
// provision immediately from the Stripe webhook; this is the safety net.
export async function GET(request: Request) {
  if (!jobAuthorized(request)) return new Response("Unauthorized", { status: 401 });

  const results: Record<string, string> = {};
  for (const id of await accountsNeedingProvisioning()) {
    results[id] = await provisionAccount(id);
  }
  return Response.json({ results });
}
