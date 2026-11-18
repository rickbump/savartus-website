"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/account/crypto";
import { sendInviteEmail, sendPasswordEmail } from "@/lib/account/emails";
import { endSession, requireSpace, startSession } from "@/lib/account/session";
import { renewSpaceSecret } from "@/lib/account/setup";
import {
  addMember,
  consumeSigninToken,
  createSigninToken,
  ensureUser,
  hasPassword,
  logActivity,
  members,
  removeMember,
  recordSignin,
  setPasswordHash,
  setRole,
  spacesForUser,
  userByEmail,
  userForPasswordSignin,
  WELCOME_LINK_MINUTES,
  type Role,
} from "@/lib/account/store";
import { accountName } from "@/lib/preservation/accounts";
import { siteUrl } from "@/lib/preservation/config";
import { stripe } from "@/lib/preservation/stripe";

export type FormState = { ok?: string; error?: string; secret?: string; email?: string } | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailFrom(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : undefined;
}

// --- Sign-in ----------------------------------------------------------------------

const MIN_PASSWORD = 10;

export async function signIn(_state: FormState, form: FormData): Promise<FormState> {
  const email = emailFrom(form);
  const password = String(form.get("password") ?? "");
  const wrong = { error: "That email and password don't match. Check them, or set a new password below.", email };
  if (!email || !password || password.length > 200) return wrong;
  let userId: string | undefined;
  try {
    const user = await userForPasswordSignin(email);
    if (!user?.password_hash) {
      // Spend similar time either way, so response times don't reveal accounts.
      await verifyPassword(password, DUMMY_HASH);
      return user ? { error: "You haven't set a password yet. Use “Set or reset your password” below.", email } : wrong;
    }
    if (user.locked) return { error: "Too many attempts. Wait 15 minutes, or set a new password below.", email };
    const ok = await verifyPassword(password, user.password_hash);
    await recordSignin(user.id, ok);
    if (!ok) return wrong;
    userId = user.id;
  } catch (error) {
    console.error("Account sign-in failed", { message: error instanceof Error ? error.message : "Unknown" });
    return { error: "Sign-in isn't available right now. Please try again shortly, or contact info@savartus.com." };
  }
  await startSession(userId);
  redirect("/account");
}

// Emails a link to set or reset the password. The same answer whether or not
// the address has an account, so the form can't reveal who our customers are.
export async function requestPasswordLink(_state: FormState, form: FormData): Promise<FormState> {
  const email = emailFrom(form);
  if (!email) return { error: "Please enter a valid email address." };
  const sent = { ok: `If ${email} has a Savartus account, we've emailed it a link to set your password. It expires in an hour.` };
  try {
    const user = await userByEmail(email);
    if (!user || (await spacesForUser(user.id)).length === 0) return sent;
    const token = await createSigninToken(user.id);
    if (!token) return { error: "Too many links were requested. Please wait an hour, or use the latest email." };
    if (!(await sendPasswordEmail(user.email, token))) {
      return { error: "We couldn't send the email just now. Please try again shortly, or contact info@savartus.com." };
    }
    return sent;
  } catch (error) {
    console.error("Password link request failed", { message: error instanceof Error ? error.message : "Unknown" });
    return { error: "This isn't available right now. Please try again shortly, or contact info@savartus.com." };
  }
}

export async function setPassword(_state: FormState, form: FormData): Promise<FormState> {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD) return { error: `Use at least ${MIN_PASSWORD} characters.` };
  if (password.length > 200) return { error: "That password is too long." };
  if (password !== String(form.get("confirm") ?? "")) return { error: "The two passwords don't match." };
  const user = token ? await consumeSigninToken(token) : undefined;
  if (!user) redirect("/account/signin?expired=1");
  await setPasswordHash(user.id, await hashPassword(password));
  await startSession(user.id);
  redirect("/account");
}

// Precomputed so a sign-in for an unknown email takes as long as a real one.
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);

export async function signOut() {
  await endSession();
  redirect("/account/signin");
}

// --- Members (admins) ---------------------------------------------------------------

export async function inviteMember(_state: FormState, form: FormData): Promise<FormState> {
  const spaceId = String(form.get("spaceId"));
  const { user, account } = await requireSpace(spaceId, "admin");
  const email = emailFrom(form);
  if (!email) return { error: "Please enter a valid email address." };
  const role: Role = form.get("role") === "admin" ? "admin" : "member";

  const invitee = await ensureUser(email);
  if (!(await addMember(account.id, invitee.id, role, user.id))) {
    return { error: `${email} is already a member of this space.` };
  }
  await logActivity(account.id, user.id, "member invited", `${email} as ${role}`);
  // Someone new gets a link to choose a password; someone with a password
  // just signs in.
  const token = (await hasPassword(invitee.id)) ? undefined : await createSigninToken(invitee.id, WELCOME_LINK_MINUTES);
  const sent = await sendInviteEmail(email, token, accountName(account), user.name || user.email, role);
  return sent
    ? { ok: `Invitation sent to ${email}.` }
    : { ok: `${email} was added, but the email couldn't be sent. Ask them to use “Set or reset your password” on the sign-in page.` };
}

export async function changeRole(form: FormData) {
  const spaceId = String(form.get("spaceId"));
  const { user, account } = await requireSpace(spaceId, "admin");
  const memberId = String(form.get("userId"));
  const role: Role = form.get("role") === "admin" ? "admin" : "member";
  const target = (await members(account.id)).find((member) => member.id === memberId);
  if (target && (await setRole(account.id, memberId, role))) {
    await logActivity(account.id, user.id, "role changed", `${target.email} is now ${role}`);
  }
  redirect(`/account/${spaceId}/members`);
}

export async function removeMemberAction(form: FormData) {
  const spaceId = String(form.get("spaceId"));
  const { user, account } = await requireSpace(spaceId, "admin");
  const memberId = String(form.get("userId"));
  const target = (await members(account.id)).find((member) => member.id === memberId);
  if (target && (await removeMember(account.id, memberId))) {
    await logActivity(account.id, user.id, "member removed", target.email);
  }
  redirect(memberId === user.id ? "/account" : `/account/${spaceId}/members`);
}

// --- S3 keys and billing (admins) ------------------------------------------------------

export async function renewSecret(_state: FormState, form: FormData): Promise<FormState> {
  const spaceId = String(form.get("spaceId"));
  const { user, account } = await requireSpace(spaceId, "admin");
  try {
    return { secret: await renewSpaceSecret(account, user.id) };
  } catch (error) {
    console.error("S3 secret renewal failed", { spaceId, type: error instanceof Error ? error.message : "Unknown" });
    return { error: "The secret couldn't be renewed right now. Please try again, or contact info@savartus.com." };
  }
}

export async function openBillingPortal(form: FormData) {
  const spaceId = String(form.get("spaceId"));
  const { account } = await requireSpace(spaceId, "admin");
  if (!account.stripe_customer_id) redirect(`/account/${spaceId}/billing?error=1`);
  const configurations = await stripe().billingPortal.configurations.list({ limit: 100 });
  const ours = configurations.data.find((item) => item.metadata?.managedBy === "corp_web/scripts/stripe-setup.mjs");
  const session = await stripe().billingPortal.sessions.create({
    customer: account.stripe_customer_id,
    configuration: ours?.id,
    return_url: `${siteUrl()}/account/${spaceId}/billing`,
  });
  redirect(session.url);
}
