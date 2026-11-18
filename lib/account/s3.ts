import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  RestoreObjectCommand,
  S3Client,
  type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Account } from "@/lib/preservation/accounts";
import { s3Settings } from "@/lib/preservation/config";
import { unseal } from "./crypto";

// File access for a space, using the space's own S3 user, which can only reach
// its own bucket. Uploads and downloads go straight between the browser and
// the library through short-lived signed links; file data never passes
// through this site.
//
// oRain storage classes: STANDARD = in the library's cache, not yet written to
// disc; GLACIER = written to optical disc. A disc file must be restored to the
// cache (like S3 Glacier) before it can be downloaded.

export const LINK_SECONDS = 15 * 60;
export const MAX_UPLOAD_BYTES = 5 * 1024 ** 3; // single signed PUT limit

export class SpaceNotReady extends Error {}

// Describes a failure reaching the library for logs and messages, without
// secrets: missing server configuration, network, or an S3 error code.
export function describeS3Error(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/PRESERVATION_ENCRYPTION_KEY|Unsupported state|unable to authenticate/i.test(message)) {
    return { kind: "config" as const, detail: message.slice(0, 200) };
  }
  const name = error instanceof Error ? error.name : "Unknown";
  const code = (error as { code?: string; cause?: { code?: string } }).code ?? (error as { cause?: { code?: string } }).cause?.code;
  if (/fetch failed|ECONN|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|socket|TimeoutError/i.test(`${name} ${message} ${code ?? ""}`)) {
    return { kind: "network" as const, detail: `${name}: ${code ?? message}`.slice(0, 200) };
  }
  return { kind: "s3" as const, detail: `${name}: ${message}`.slice(0, 200) };
}

export function s3ErrorMessage(error: unknown) {
  if (error instanceof SpaceNotReady) return error.message;
  const { kind } = describeS3Error(error);
  if (kind === "config") return "File access isn't set up on the server yet (missing encryption key). Please contact info@savartus.com.";
  if (kind === "network") return "The site couldn't connect to the optical library. Please try again shortly.";
  return "The optical library returned an error. Please try again shortly.";
}

export function spaceS3(account: Account) {
  if (!account.bucket_name || !account.s3_access_key || !account.s3_secret_enc) {
    throw new SpaceNotReady("This space's storage keys aren't set up yet.");
  }
  const { endpoint, region } = s3Settings();
  const client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId: account.s3_access_key, secretAccessKey: unseal(account.s3_secret_enc) },
    // MinIO doesn't need the newer checksum headers, and a browser PUT to a
    // signed link can't add them.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return { client, bucket: account.bucket_name };
}

export type FileStatus = "cache" | "disc" | "restoring" | "restored";

export type FileEntry = {
  key: string;
  name: string;
  size: number;
  modified: string | null;
  status: FileStatus;
  restoredUntil?: string | null;
};

// Restore state of a disc file, from the Restore header of HEAD.
async function restoreState(s3: ReturnType<typeof spaceS3>, key: string) {
  try {
    const head = await s3.client.send(new HeadObjectCommand({ Bucket: s3.bucket, Key: key }));
    const restore = head.Restore ?? "";
    if (/ongoing-request="true"/.test(restore)) return { status: "restoring" as const };
    const expiry = restore.match(/expiry-date="([^"]+)"/)?.[1];
    if (/ongoing-request="false"/.test(restore)) {
      return { status: "restored" as const, restoredUntil: expiry ? new Date(expiry).toISOString() : null };
    }
  } catch {
    // Unknown restore state: show it as on disc.
  }
  return { status: "disc" as const };
}

function baseName(key: string) {
  const trimmed = key.endsWith("/") ? key.slice(0, -1) : key;
  return trimmed.slice(trimmed.lastIndexOf("/") + 1);
}

async function withStatuses(s3: ReturnType<typeof spaceS3>, objects: _Object[]) {
  const files: FileEntry[] = objects
    .filter((object) => object.Key && !object.Key.endsWith("/"))
    .map((object) => ({
      key: object.Key!,
      name: baseName(object.Key!),
      size: object.Size ?? 0,
      modified: object.LastModified?.toISOString() ?? null,
      status: object.StorageClass === "GLACIER" || object.StorageClass === "DEEP_ARCHIVE" ? "disc" : "cache",
    }));
  // Restore state needs a HEAD per disc file; done 10 at a time.
  const onDisc = files.filter((file) => file.status === "disc");
  for (let index = 0; index < onDisc.length; index += 10) {
    await Promise.all(onDisc.slice(index, index + 10).map(async (file) => Object.assign(file, await restoreState(s3, file.key))));
  }
  return files;
}

// One folder level: sub-folders and files directly in `prefix`.
export async function listFolder(account: Account, prefix: string, continuationToken?: string) {
  const s3 = spaceS3(account);
  const page = await s3.client.send(
    new ListObjectsV2Command({
      Bucket: s3.bucket,
      Prefix: prefix,
      Delimiter: "/",
      MaxKeys: 500,
      ContinuationToken: continuationToken,
    }),
  );
  return {
    folders: (page.CommonPrefixes ?? []).map((item) => item.Prefix!).filter(Boolean).map((key) => ({ key, name: baseName(key) })),
    files: await withStatuses(s3, page.Contents ?? []),
    nextToken: page.IsTruncated ? page.NextContinuationToken : undefined,
  };
}

// Walks the whole bucket. S3 can't search, so search and usage scan the
// listing; capped so a very large space stays responsive.
async function walk(account: Account, visit: (object: _Object) => void, maxObjects = 100_000) {
  const s3 = spaceS3(account);
  let token: string | undefined;
  let seen = 0;
  do {
    const page = await s3.client.send(
      new ListObjectsV2Command({ Bucket: s3.bucket, MaxKeys: 1000, ContinuationToken: token }),
    );
    for (const object of page.Contents ?? []) visit(object);
    seen += page.Contents?.length ?? 0;
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token && seen < maxObjects);
  return { complete: !token };
}

export async function searchFiles(account: Account, query: string, limit = 200) {
  const needle = query.toLowerCase();
  const matches: _Object[] = [];
  const { complete } = await walk(account, (object) => {
    if (matches.length < limit && object.Key && object.Key.toLowerCase().includes(needle)) matches.push(object);
  });
  return { files: await withStatuses(spaceS3(account), matches), complete, limited: matches.length >= limit };
}

export async function usage(account: Account) {
  const totals = { files: 0, bytes: 0, cacheBytes: 0, discBytes: 0 };
  const { complete } = await walk(account, (object) => {
    if (!object.Key || object.Key.endsWith("/")) return;
    totals.files += 1;
    totals.bytes += object.Size ?? 0;
    if (object.StorageClass === "GLACIER" || object.StorageClass === "DEEP_ARCHIVE") totals.discBytes += object.Size ?? 0;
    else totals.cacheBytes += object.Size ?? 0;
  });
  return { ...totals, complete };
}

export async function fileExists(account: Account, key: string) {
  const s3 = spaceS3(account);
  try {
    await s3.client.send(new HeadObjectCommand({ Bucket: s3.bucket, Key: key }));
    return true;
  } catch (error) {
    const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
    if (status === 404) return false;
    throw error;
  }
}

export async function fileInfo(account: Account, key: string) {
  const s3 = spaceS3(account);
  const head = await s3.client.send(new HeadObjectCommand({ Bucket: s3.bucket, Key: key }));
  const onDisc = head.StorageClass === "GLACIER" || head.StorageClass === "DEEP_ARCHIVE";
  const state = onDisc ? await restoreState(s3, key) : { status: "cache" as const };
  return { size: head.ContentLength ?? 0, ...state };
}

export async function downloadLink(account: Account, key: string) {
  const s3 = spaceS3(account);
  const filename = baseName(key).replace(/["\\\r\n]/g, "_");
  return getSignedUrl(
    s3.client,
    new GetObjectCommand({
      Bucket: s3.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(baseName(key))}`,
    }),
    { expiresIn: LINK_SECONDS },
  );
}

export async function uploadLink(account: Account, key: string, contentType: string) {
  const s3 = spaceS3(account);
  return getSignedUrl(s3.client, new PutObjectCommand({ Bucket: s3.bucket, Key: key, ContentType: contentType }), {
    expiresIn: LINK_SECONDS,
  });
}

export async function restoreFile(account: Account, key: string, days = 7) {
  const s3 = spaceS3(account);
  await s3.client.send(
    new RestoreObjectCommand({
      Bucket: s3.bucket,
      Key: key,
      RestoreRequest: { Days: days, GlacierJobParameters: { Tier: "Standard" } },
    }),
  );
}

// File names: no leading slash, no "." or ".." segments, no control characters.
export function validKey(key: unknown): key is string {
  if (typeof key !== "string" || !key || key.length > 1024 || key.startsWith("/") || key.endsWith("/")) return false;
  if (Array.from(key).some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return false;
  return key.split("/").every((part) => part !== "" && part !== "." && part !== "..");
}

export function validPrefix(prefix: unknown): prefix is string {
  return prefix === "" || (typeof prefix === "string" && prefix.endsWith("/") && validKey(prefix.slice(0, -1)));
}
