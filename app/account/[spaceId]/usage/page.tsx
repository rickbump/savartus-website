import type { Metadata } from "next";
import { formatBytes } from "@/lib/account/format";
import { describeS3Error, s3ErrorMessage, SpaceNotReady, usage } from "@/lib/account/s3";
import { requireSpace } from "@/lib/account/session";

export const metadata: Metadata = { title: "Usage" };
export const dynamic = "force-dynamic";

const TB = 1000 ** 4; // plans are sold in decimal terabytes

export default async function UsagePage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const { account, role } = await requireSpace(spaceId);

  let totals: Awaited<ReturnType<typeof usage>> | undefined;
  let problem: string | undefined;
  try {
    totals = await usage(account);
  } catch (error) {
    if (!(error instanceof SpaceNotReady)) console.error("Account usage failed", describeS3Error(error));
    problem = s3ErrorMessage(error);
  }

  const planBytes = account.included_tb * TB;
  const share = totals ? Math.min(100, (totals.bytes / planBytes) * 100) : 0;

  return (
    <>
      <h2>Space used</h2>
      {problem || !totals ? (
        <p className="preservation-error">{problem}</p>
      ) : (
        <>
          <p className="account-big">
            {formatBytes(totals.bytes)} <span className="account-muted">of {account.included_tb} TB plan</span>
          </p>
          <div className="account-meter" role="img" aria-label={`${share.toFixed(1)}% of the plan used`}>
            <span style={{ width: `${Math.max(share, totals.bytes ? 0.5 : 0)}%` }} />
          </div>
          <dl className="account-facts">
            <div>
              <dt>Files</dt>
              <dd>{totals.files.toLocaleString("en-US")}</dd>
            </div>
            <div>
              <dt>On optical disc</dt>
              <dd>{formatBytes(totals.discBytes)}</dd>
            </div>
            <div>
              <dt>Waiting to be written to disc</dt>
              <dd>{formatBytes(totals.cacheBytes)}</dd>
            </div>
          </dl>
          {!totals.complete && (
            <p className="account-muted account-small">This space is very large; the totals cover the first 100,000 files.</p>
          )}
          <p className="account-muted account-small">
            {totals.bytes > planBytes
              ? "You're above your plan. Each extra terabyte is billed at your plan's per-TB rate, and when you reach the next plan's size the whole space moves to that plan's lower rate."
              : "When you grow past your plan, each extra terabyte is billed at your plan's per-TB rate."}
            {role === "admin" ? " Invoices and plan details are under Billing." : ""}
          </p>
        </>
      )}
    </>
  );
}
