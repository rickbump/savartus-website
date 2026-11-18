import {
  describeS3Error,
  downloadLink,
  fileExists,
  fileInfo,
  listFolder,
  MAX_UPLOAD_BYTES,
  restoreFile,
  s3ErrorMessage,
  searchFiles,
  SpaceNotReady,
  uploadLink,
  validKey,
  validPrefix,
} from "@/lib/account/s3";
import { spaceForApi } from "@/lib/account/session";
import { logActivity } from "@/lib/account/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Context = { params: Promise<{ spaceId: string }> };

function failure(error: unknown, what: string) {
  if (error instanceof SpaceNotReady) return Response.json({ error: error.message }, { status: 409 });
  console.error(`Account files: ${what} failed`, describeS3Error(error));
  return Response.json({ error: s3ErrorMessage(error) }, { status: 502 });
}

// GET ?prefix=folder/&token=…  lists one folder level
// GET ?q=report                 searches file names across the space
export async function GET(request: Request, { params }: Context) {
  const space = await spaceForApi((await params).spaceId);
  if ("error" in space) return space.error;
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  try {
    if (query) {
      if (query.length > 200) return Response.json({ error: "Search is too long." }, { status: 400 });
      return Response.json(await searchFiles(space.account, query));
    }
    const prefix = url.searchParams.get("prefix") ?? "";
    if (!validPrefix(prefix)) return Response.json({ error: "Invalid folder." }, { status: 400 });
    return Response.json(await listFolder(space.account, prefix, url.searchParams.get("token") ?? undefined));
  } catch (error) {
    return failure(error, "list");
  }
}

// POST { action: "download" | "restore" | "upload" | "uploaded", key, size?, contentType? }
export async function POST(request: Request, { params }: Context) {
  const space = await spaceForApi((await params).spaceId);
  if ("error" in space) return space.error;
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Forbidden." }, { status: 403 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const { action, key } = body;
  if (!validKey(key)) return Response.json({ error: "That file name isn't allowed." }, { status: 400 });
  const { account, user } = space;

  try {
    switch (action) {
      case "download": {
        const info = await fileInfo(account, key);
        if (info.status === "disc" || info.status === "restoring") {
          return Response.json(
            {
              error:
                info.status === "restoring"
                  ? "This file is being restored from disc. Try again once it shows as ready."
                  : "This file is on optical disc. Restore it first; it can be downloaded once it's ready.",
            },
            { status: 409 },
          );
        }
        await logActivity(account.id, user.id, "file downloaded", key);
        return Response.json({ url: await downloadLink(account, key) });
      }
      case "restore": {
        const info = await fileInfo(account, key);
        if (info.status === "cache" || info.status === "restored") return Response.json({ status: info.status });
        if (info.status === "disc") {
          await restoreFile(account, key);
          await logActivity(account.id, user.id, "restore requested", key);
        }
        return Response.json({ status: "restoring" });
      }
      case "upload": {
        const size = Number(body.size);
        const contentType = typeof body.contentType === "string" && body.contentType.length < 200 && /^[\w.+-]+\/[\w.+-]+$/.test(body.contentType)
          ? body.contentType
          : "application/octet-stream";
        if (!Number.isFinite(size) || size < 0) return Response.json({ error: "Invalid file size." }, { status: 400 });
        if (size > MAX_UPLOAD_BYTES) {
          return Response.json(
            { error: "Files over 5 GB can't be uploaded in the browser yet. Use S3 software such as Cyberduck or rclone." },
            { status: 413 },
          );
        }
        // Preserved files are write-once: a name can be used only once.
        if (await fileExists(account, key)) {
          return Response.json({ error: "A file with this name already exists. Rename the file, or upload it to another folder." }, { status: 409 });
        }
        return Response.json({ url: await uploadLink(account, key, contentType), contentType });
      }
      case "uploaded": {
        if (await fileExists(account, key)) await logActivity(account.id, user.id, "file uploaded", key);
        return Response.json({ ok: true });
      }
      default:
        return Response.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    return failure(error, String(action));
  }
}
