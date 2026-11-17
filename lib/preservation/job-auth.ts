import { timingSafeEqual } from "node:crypto";

// Scheduled jobs accept `Authorization: Bearer <secret>` with either
// CRON_SECRET (sent automatically by Vercel Cron when that variable is set) or
// PRESERVATION_JOB_TOKEN (for running a job by hand or from another scheduler).
export function jobAuthorized(request: Request) {
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  return [process.env.CRON_SECRET, process.env.PRESERVATION_JOB_TOKEN]
    .map((secret) => secret?.trim())
    .filter((secret): secret is string => Boolean(secret))
    .some((secret) => {
      const expected = Buffer.from(`Bearer ${secret}`);
      return supplied.length === expected.length && timingSafeEqual(supplied, expected);
    });
}
