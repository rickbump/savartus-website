import type { Metadata } from "next";
import Link from "next/link";
import { RenewSecretForm } from "@/components/account/RenewSecretForm";
import { formatDate } from "@/lib/account/format";
import { requireSpace } from "@/lib/account/session";
import { s3Settings } from "@/lib/preservation/config";

export const metadata: Metadata = { title: "S3 keys" };

export default async function KeysPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const { account } = await requireSpace(spaceId, "admin");
  const { endpoint, region } = s3Settings();
  const { hostname, port } = new URL(endpoint);

  return (
    <>
      <h2>S3 keys</h2>
      <p className="account-muted">
        Use these with S3 software such as Cyberduck, rclone or the AWS command line, for bulk uploads
        or files over 5 GB. Everyone in the space can use the browser instead.{" "}
        <Link href="/preservation/getting-started">Setup instructions</Link>.
      </p>
      <dl className="account-facts account-keys">
        <div>
          <dt>Endpoint</dt>
          <dd><code>{endpoint}</code> <span className="account-muted">(server {hostname}, port {port || 443})</span></dd>
        </div>
        <div>
          <dt>Region</dt>
          <dd><code>{region}</code></dd>
        </div>
        <div>
          <dt>Bucket</dt>
          <dd><code>{account.bucket_name ?? "Being set up"}</code></dd>
        </div>
        <div>
          <dt>Access key</dt>
          <dd><code>{account.s3_access_key ?? "Being set up"}</code></dd>
        </div>
        <div>
          <dt>Secret key</dt>
          <dd>
            Shown once, when you create a new one.
            {account.s3_secret_renewed_at && (
              <span className="account-muted"> Last created {formatDate(account.s3_secret_renewed_at)}.</span>
            )}
          </dd>
        </div>
      </dl>
      <p className="account-muted account-small">Use path-style addressing (most S3 software detects it automatically).</p>
      <RenewSecretForm spaceId={spaceId} />
    </>
  );
}
