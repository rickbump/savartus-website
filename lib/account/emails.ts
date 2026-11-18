import { siteUrl } from "@/lib/preservation/config";
import { send } from "@/lib/preservation/notify";
import { SIGNIN_LINK_MINUTES } from "./store";

// Link to set (or reset) a password. Used once per person, or after "Forgot
// password"; everyday sign-in is email and password.
export function setPasswordUrl(token: string) {
  return `${siteUrl()}/account/set-password?token=${encodeURIComponent(token)}`;
}

export function signinPageUrl() {
  return `${siteUrl()}/account/signin`;
}

export function sendPasswordEmail(email: string, token: string) {
  return send({
    to: email,
    subject: "Set your Savartus password",
    lines: [
      "Hello,",
      "",
      "Use this link to set a new password for your Savartus account:",
      `   ${setPasswordUrl(token)}`,
      "",
      `The link works once and expires in ${SIGNIN_LINK_MINUTES} minutes. If you didn't ask for it, you can`,
      "ignore this email; your current password keeps working.",
      "",
      "The Savartus team",
    ],
  });
}

// `token` is set when the person has no password yet.
export function sendInviteEmail(
  email: string,
  token: string | undefined,
  spaceName: string,
  inviter: string,
  role: "admin" | "member",
) {
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
      ...(token
        ? [
            "Choose your password to accept the invitation:",
            `   ${setPasswordUrl(token)}`,
            "",
            "The link works once and expires in 7 days. After that, sign in any time at",
            `   ${signinPageUrl()}`,
            "with this email address and your password.",
          ]
        : [
            "Sign in with your existing Savartus email and password; the space is already in your list:",
            `   ${signinPageUrl()}`,
          ]),
      "",
      "The Savartus team",
    ],
  });
}
