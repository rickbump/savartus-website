"use server";

import { redirect } from "next/navigation";
import { sendInviteEmail, sendSigninEmail } from "@/lib/account/emails";
import { endSession, requireSpace, startSession } from "@/lib/account/session";
import { renewSpaceSecret } from "@/lib/account/setup";
import {
  addMember,
  consumeSigninToken,
  createSigninToken,
  ensureUser,
  logActivity,
  members,
  removeMember,
  setRole,
  spacesForUser,
  userByEmail,
  type Role,
} from "@/lib/account/store";
import { accountName } from "@/lib/preservation/accounts";
import { siteUrl } from "@/lib/preservation/config";
import { stripe } from "@/lib/preservation/stripe";

export type FormState = { ok?: string; error?: string; secret?: string } | undefined;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailFrom(form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  return email.length <= 254 && EMAIL.test(email) ? email : undefined;
}

// --- Sign-in ----------------------------------------------------------------------

export async function requestSignin(_state: FormState, form: FormData): Promise<FormState> {
  const email = emailFrom(form);
  if (!email) return { error: "Please enter a valid email address." };
  const sent = { ok: `If ${email} belongs to a Savartus space, a sign-in link is on its way. Check your inbox.` };

  // The same answer whether or not the address has an account, so the form
  // can't be used to find out who our customers are.
  try {
    const user = await userByEmail(email);
    if (!user || (await spacesForUser(user.id)).length === 0) return sent;
    const token = await createSigninToken(user.id);
    if (!token) return { error: "Too many sign-in links were requested. Please wait an hour, or use the latest email." };
    if (!(await sendSigninEmail(user.email, token))) {
      return { error: "We couldn't send the email just now. Please try again shortly, or contact info@savartus.com." };
    }
    return sent;
  } catch (error) {
    console.error("Account sign-in request failed", { message: error instanceof Error ? error.message : "Unknown" });
    return { error: "Sign-in isn't available right now. Please try again shortly, or contact info@savartus.com." };
  }
}

// The emailed link opens a page with a button that calls this. Email security
// scanners open links automatically; requiring a click keeps them from using
// up the one-time link.
export async function completeSignin(form: FormData) {
  const token = String(form.get("token") ?? "");
  const user = token ? await consumeSigninToken(token) : undefined;
  if (!user) redirect("/account/signin?expired=1");
  await startSession(user.id);
  redirect("/account");
}

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
  const token = await createSigninToken(invitee.id);
  if (token) await sendInviteEmail(email, token, accountName(account), user.name || user.email, role);
  return {
    ok: token
      ? `Invitation sent to ${email}.`
      : `${email} was added. They've requested several links recently, so they should sign in from the sign-in page.`,
  };
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
