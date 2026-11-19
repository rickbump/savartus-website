import { PREVIEW_COOKIE, PREVIEW_COOKIE_DAYS, previewCodeMatches } from "@/lib/preservation/signup-access";

export const dynamic = "force-dynamic";

// Private review link for signup while it is closed to the public.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const headers = new Headers({ Location: "/preservation/signup", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" });
  if (previewCodeMatches(code)) {
    headers.append(
      "Set-Cookie",
      `${PREVIEW_COOKIE}=${encodeURIComponent(code!)}; Path=/; Max-Age=${PREVIEW_COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`,
    );
  }
  return new Response(null, { status: 303, headers });
}
