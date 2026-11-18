import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// Secrets at rest (the space's S3 secret) are sealed with AES-256-GCM under
// PRESERVATION_ENCRYPTION_KEY: 32 random bytes, base64. Local and Vercel must
// use the same key because they share the database.
function key() {
  const value = process.env.PRESERVATION_ENCRYPTION_KEY?.trim();
  const bytes = value ? Buffer.from(value, "base64") : undefined;
  if (!bytes || bytes.length !== 32) throw new Error("PRESERVATION_ENCRYPTION_KEY must be 32 bytes, base64");
  return bytes;
}

export function seal(plain: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), data.toString("base64url")].join(".");
}

export function unseal(sealed: string) {
  const [version, iv, tag, data] = sealed.split(".");
  if (version !== "v1" || !iv || !tag || !data) throw new Error("Unrecognized sealed value");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
  decipher.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(data, "base64url")), decipher.final()]).toString("utf8");
}

// Random tokens for sign-in links and session cookies; only their hashes are stored.
export function newToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
