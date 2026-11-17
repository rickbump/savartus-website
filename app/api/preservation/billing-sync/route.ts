import { jobAuthorized } from "@/lib/preservation/job-auth";
import { billLatestRun } from "@/lib/preservation/usage-billing";

export const runtime = "nodejs";
export const maxDuration = 120;

// Hourly Vercel Schedule (vercel.json): bills the newest Cloutility billing run. Doesn't
// depend on Cloutility's Post URL notification reaching the site; customers
// already charged for that run are skipped, so running it again is harmless.
export async function GET(request: Request) {
  if (!jobAuthorized(request)) return new Response("Unauthorized", { status: 401 });
  // Runs hourly; only the 9 AM (New York) run may email staff about a billing
  // run with no preservation lines, so the alert arrives at most once a day.
  const hour = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hourCycle: "h23" }).format(new Date());
  const run = await billLatestRun({ alertStaff: Number(hour) === 9 });
  if (run.failed) console.error("Preservation billing sync stopped at", run.failed);
  return Response.json(run, { status: run.failed ? 502 : 200, headers: { "Cache-Control": "no-store" } });
}
