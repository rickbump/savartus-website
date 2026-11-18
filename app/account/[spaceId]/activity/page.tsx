import type { Metadata } from "next";
import { formatDate } from "@/lib/account/format";
import { requireSpace } from "@/lib/account/session";
import { activity } from "@/lib/account/store";

export const metadata: Metadata = { title: "Activity" };

export default async function ActivityPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const { account } = await requireSpace(spaceId, "admin");
  const entries = await activity(account.id);

  return (
    <>
      <h2>Activity</h2>
      <p className="account-muted">The latest 200 actions in this space: uploads, downloads, restores, member and key changes.</p>
      {entries.length === 0 ? (
        <p className="account-muted">Nothing yet.</p>
      ) : (
        <div className="account-table-wrap">
          <table className="account-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>What</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={index}>
                  <td>{formatDate(entry.created_at)}</td>
                  <td>{entry.email ?? "Savartus"}</td>
                  <td>
                    {entry.action}
                    {entry.detail && <span className="account-muted"> · {entry.detail}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
