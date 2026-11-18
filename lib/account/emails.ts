import { siteUrl } from "@/lib/preservation/config";
import { send } from "@/lib/preservation/notify";
import { SIGNIN_LINK_MINUTES } from "./store";

export function signinUrl(token: string) {
  return `${siteUrl()}/account/verify?token=${encodeURIComponent(token)}`;
}

export function sendSigninEmail(email: string, token: string) {
  return send({
    to: email,
    subject: "Your Savartus sign-in link",
    lines: [
      "Hello,",
      "",
      "Use this link to sign in to your Savartus account:",
      `   ${signinUrl(token)}`,
      "",
      `The link works once and expires in ${SIGNIN_LINK_MINUTES} minutes. If you didn't ask to sign in, you can`,
      "ignore this email; nobody can sign in without the link.",
      "",
      "The Savartus team",
    ],
  });
}

export function sendInviteEmail(email: string, token: string, spaceName: string, inviter: string, role: "admin" | "member") {
  return send({
    to: email,
    subject: `You've been invited to ${spaceName} on Savartus`,
    lines: [
      "Hello,",
      "",
      `${inviter} has invited you to the Savartus optical preservation space for ${spaceName}${role === "admin" ? ", as an administrator" : ""}.`,
      "",
      role === "admin"
        ? "You can upload, browse, search and download files, and manage members, billing and storage keys."
        : "You can upload, browse, search and download files, and see how much space is used.",
      "",
      "Accept the invitation and sign in here:",
      `   ${signinUrl(token)}`,
      "",
      `The link works once and expires in ${SIGNIN_LINK_MINUTES} minutes. Later, sign in any time at`,
      `   ${siteUrl()}/account`,
      "with this email address; we'll email you a new link each time.",
      "",
      "The Savartus team",
    ],
  });
}
