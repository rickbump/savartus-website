import type { Metadata } from "next";
import { changeRole, removeMemberAction } from "@/app/account/actions";
import { InviteForm } from "@/components/account/InviteForm";
import { formatDate } from "@/lib/account/format";
import { requireSpace } from "@/lib/account/session";
import { members } from "@/lib/account/store";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const { user, account } = await requireSpace(spaceId, "admin");
  const list = await members(account.id);
  const admins = list.filter((member) => member.role === "admin").length;

  return (
    <>
      <h2>Members</h2>
      <p className="account-muted">
        Everyone can upload, browse, search and download files, and see the space used. Administrators
        also manage members, S3 keys and billing. Removing someone takes effect immediately; the files
        they uploaded stay in the space.
      </p>
      <div className="account-table-wrap">
        <table className="account-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Role</th>
              <th>Last signed in</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {list.map((member) => {
              const lastAdmin = member.role === "admin" && admins === 1;
              return (
                <tr key={member.id}>
                  <td>
                    {member.name ? `${member.name} · ` : ""}
                    {member.email}
                    {member.id === user.id && <span className="account-muted"> (you)</span>}
                  </td>
                  <td>{member.role === "admin" ? "Administrator" : "Member"}</td>
                  <td>{member.last_signin_at ? formatDate(member.last_signin_at) : <span className="account-muted">Not yet</span>}</td>
                  <td className="account-row-actions">
                    {!lastAdmin && (
                      <form action={changeRole}>
                        <input type="hidden" name="spaceId" value={spaceId} />
                        <input type="hidden" name="userId" value={member.id} />
                        <input type="hidden" name="role" value={member.role === "admin" ? "member" : "admin"} />
                        <button type="submit" className="account-link-button">
                          {member.role === "admin" ? "Make member" : "Make administrator"}
                        </button>
                      </form>
                    )}
                    {!lastAdmin && (
                      <form action={removeMemberAction}>
                        <input type="hidden" name="spaceId" value={spaceId} />
                        <input type="hidden" name="userId" value={member.id} />
                        <button type="submit" className="account-link-button account-danger">
                          {member.id === user.id ? "Leave space" : "Remove"}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {admins === 1 && (
        <p className="account-muted account-small">A space always keeps at least one administrator.</p>
      )}
      <h3>Invite someone</h3>
      <InviteForm spaceId={spaceId} />
    </>
  );
}
