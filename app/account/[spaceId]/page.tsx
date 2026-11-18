import type { Metadata } from "next";
import { FileBrowser } from "@/components/account/FileBrowser";
import { requireSpace } from "@/lib/account/session";

export const metadata: Metadata = { title: "Files" };

export default async function FilesPage({ params }: { params: Promise<{ spaceId: string }> }) {
  const { spaceId } = await params;
  const { account } = await requireSpace(spaceId);
  if (!account.s3_secret_enc || !account.bucket_name) {
    return (
      <p className="account-notice">
        This space is still being set up. Files will appear here in a few minutes; if it takes
        longer, contact info@savartus.com.
      </p>
    );
  }
  return <FileBrowser spaceId={spaceId} />;
}
