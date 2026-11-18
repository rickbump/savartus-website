import { randomUUID } from "node:crypto";
import { db, type Account } from "@/lib/preservation/accounts";
import { hashToken, newToken } from "./crypto";

// Database access for the account space: people, their membership of spaces,
// sign-in links, sessions and the activity log.

export type Role = "admin" | "member";
export type User = { id: string; email: string; name: string | null };
export type Membership = { role: Role; account: Account };
export type Member = User & { role: Role; created_at: string; last_signin_at: string | null };

export const SIGNIN_LINK_MINUTES = 30;
export const SESSION_DAYS = 30;
const MAX_LINKS_PER_HOUR = 5;

export async function userByEmail(email: string) {
  const rows = await db()`SELECT id, email, name FROM account_users WHERE lower(email) = lower(${email})`;
  return rows[0] as User | undefined;
}

export async function ensureUser(email: string, name?: string | null) {
  const rows = await db()`
    INSERT INTO account_users (id, email, name)
    VALUES (${randomUUID()}, ${email.toLowerCase()}, ${name ?? null})
    ON CONFLICT ((lower(email))) DO UPDATE SET name = COALESCE(account_users.name, EXCLUDED.name)
    RETURNING id, email, name
  `;
  return rows[0] as User;
}

// --- Sign-in links ------------------------------------------------------------

// Returns a one-time token, or undefined when too many links were requested
// for this person in the last hour.
export async function createSigninToken(userId: string) {
  const recent = await db()`
    SELECT count(*)::int AS n FROM account_signin_tokens
    WHERE user_id = ${userId} AND created_at > NOW() - INTERVAL '1 hour'
  `;
  if (Number(recent[0].n) >= MAX_LINKS_PER_HOUR) return undefined;
  const token = newToken();
  await db()`
    INSERT INTO account_signin_tokens (token_hash, user_id, expires_at)
    VALUES (${hashToken(token)}, ${userId}, NOW() + make_interval(mins => ${SIGNIN_LINK_MINUTES}))
  `;
  return token;
}

// Uses up a sign-in token. Returns the user if it was valid and unused.
export async function consumeSigninToken(token: string) {
  const rows = await db()`
    UPDATE account_signin_tokens SET used_at = NOW()
    WHERE token_hash = ${hashToken(token)} AND used_at IS NULL AND expires_at > NOW()
    RETURNING user_id
  `;
  if (!rows[0]) return undefined;
  const users = await db()`
    UPDATE account_users SET last_signin_at = NOW() WHERE id = ${rows[0].user_id}
    RETURNING id, email, name
  `;
  return users[0] as User | undefined;
}

export async function signinTokenIsUsable(token: string) {
  const rows = await db()`
    SELECT 1 FROM account_signin_tokens
    WHERE token_hash = ${hashToken(token)} AND used_at IS NULL AND expires_at > NOW()
  `;
  return rows.length > 0;
}

// --- Sessions -----------------------------------------------------------------

export async function createSession(userId: string) {
  const id = newToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await db()`
    INSERT INTO account_sessions (id_hash, user_id, expires_at)
    VALUES (${hashToken(id)}, ${userId}, ${expires.toISOString()})
  `;
  return { id, expires };
}

export async function userForSession(id: string) {
  const rows = await db()`
    UPDATE account_sessions s SET last_seen_at = NOW()
    FROM account_users u
    WHERE s.id_hash = ${hashToken(id)} AND s.expires_at > NOW() AND u.id = s.user_id
    RETURNING u.id, u.email, u.name
  `;
  return rows[0] as User | undefined;
}

export async function deleteSession(id: string) {
  await db()`DELETE FROM account_sessions WHERE id_hash = ${hashToken(id)}`;
}

// --- Spaces and members ---------------------------------------------------------

export async function spacesForUser(userId: string) {
  const rows = await db()`
    SELECT m.role, a.* FROM account_members m
    JOIN preservation_accounts a ON a.id = m.account_id
    WHERE m.user_id = ${userId}
    ORDER BY a.created_at
  `;
  return rows.map(({ role, ...account }) => ({ role: role as Role, account: account as Account }));
}

export async function membership(userId: string, accountId: string): Promise<Membership | undefined> {
  const rows = await db()`
    SELECT m.role, a.* FROM account_members m
    JOIN preservation_accounts a ON a.id = m.account_id
    WHERE m.user_id = ${userId} AND m.account_id = ${accountId}
  `;
  if (!rows[0]) return undefined;
  const { role, ...account } = rows[0];
  return { role: role as Role, account: account as Account };
}

export async function members(accountId: string) {
  const rows = await db()`
    SELECT u.id, u.email, u.name, u.last_signin_at, m.role, m.created_at
    FROM account_members m JOIN account_users u ON u.id = m.user_id
    WHERE m.account_id = ${accountId}
    ORDER BY m.role, lower(u.email)
  `;
  return rows as Member[];
}

export async function addMember(accountId: string, userId: string, role: Role, invitedBy: string | null) {
  const rows = await db()`
    INSERT INTO account_members (account_id, user_id, role, invited_by)
    VALUES (${accountId}, ${userId}, ${role}, ${invitedBy})
    ON CONFLICT (account_id, user_id) DO NOTHING
    RETURNING user_id
  `;
  return rows.length > 0;
}

// Role changes and removals never leave a space without an admin.
export async function setRole(accountId: string, userId: string, role: Role) {
  const rows = await db()`
    UPDATE account_members SET role = ${role}
    WHERE account_id = ${accountId} AND user_id = ${userId}
      AND (${role} = 'admin' OR EXISTS (
        SELECT 1 FROM account_members o
        WHERE o.account_id = ${accountId} AND o.role = 'admin' AND o.user_id <> ${userId}))
    RETURNING user_id
  `;
  return rows.length > 0;
}

export async function removeMember(accountId: string, userId: string) {
  const rows = await db()`
    DELETE FROM account_members
    WHERE account_id = ${accountId} AND user_id = ${userId}
      AND (role = 'member' OR EXISTS (
        SELECT 1 FROM account_members o
        WHERE o.account_id = ${accountId} AND o.role = 'admin' AND o.user_id <> ${userId}))
    RETURNING user_id
  `;
  return rows.length > 0;
}

// --- Activity ---------------------------------------------------------------------

export async function logActivity(accountId: string, userId: string | null, action: string, detail?: string) {
  await db()`
    INSERT INTO account_activity (account_id, user_id, action, detail)
    VALUES (${accountId}, ${userId}, ${action}, ${detail?.slice(0, 1000) ?? null})
  `;
}

export async function activity(accountId: string, limit = 200) {
  const rows = await db()`
    SELECT a.action, a.detail, a.created_at, u.email
    FROM account_activity a LEFT JOIN account_users u ON u.id = a.user_id
    WHERE a.account_id = ${accountId}
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `;
  return rows as { action: string; detail: string | null; created_at: string; email: string | null }[];
}

// --- S3 details -------------------------------------------------------------------

export async function saveS3Details(
  accountId: string,
  details: { bucketName?: string; accessKey?: string; secretSealed?: string },
) {
  await db()`
    UPDATE preservation_accounts SET
      bucket_name = COALESCE(${details.bucketName ?? null}, bucket_name),
      s3_access_key = COALESCE(${details.accessKey ?? null}, s3_access_key),
      s3_secret_enc = COALESCE(${details.secretSealed ?? null}, s3_secret_enc),
      s3_secret_renewed_at = CASE WHEN ${details.secretSealed ?? null}::text IS NULL THEN s3_secret_renewed_at ELSE NOW() END,
      updated_at = NOW()
    WHERE id = ${accountId}
  `;
}
