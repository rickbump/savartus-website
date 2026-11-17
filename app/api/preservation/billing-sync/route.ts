import { jobAuthorized } from "@/lib/preservation/job-auth";
import { billLatestRun } from "@/lib/preservation/usage-billing";

export const runtime = "nodejs";
export const maxDuration = 120;

// Daily job (vercel.json): bills the newest Cloutility billing run. Doesn't
// depend on Cloutility's Post URL notification reaching the site; customers
// already charged for that run are skipped, so running it again is harmless.
export async function GET(request: Request) {
  if (!jobAuthorized(request)) return new Response("Unauthorized", { status: 401 });
  const run = await billLatestRun();
  if (run.failed) console.error("Preservation billing sync stopped at", run.failed);
  return Response.json(run, { status: run.failed ? 502 : 200, headers: { "Cache-Control": "no-store" } });
}
