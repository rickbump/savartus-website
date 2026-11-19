import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { signupEnabled } from "./config";

// While signup is closed to the public, a private review link opens it for
// one browser: /preservation/review?code=<PRESERVATION_SIGNUP_PREVIEW_CODE>
// sets a cookie, and the signup page and checkout accept that cookie.
export const PREVIEW_COOKIE = "savartus_signup_preview";
export const PREVIEW_COOKIE_DAYS = 30;

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function previewCodeMatches(value: string | undefined | null) {
  const code = process.env.PRESERVATION_SIGNUP_PREVIEW_CODE?.trim();
  if (!code || code.length < 16 || !value) return false;
  return timingSafeEqual(digest(code), digest(value));
}

export async function signupOpen() {
  if (signupEnabled()) return true;
  return previewCodeMatches((await cookies()).get(PREVIEW_COOKIE)?.value);
}
