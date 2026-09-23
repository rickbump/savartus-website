import type { NextRequest } from "next/server";

const PRODUCTION_HOST = "www.savartus.com";
const SITE_URL = "https://www.savartus.com";

export function GET(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const hostHeader = forwardedHost ?? request.headers.get("host") ?? "";

  const host = hostHeader.split(":")[0].toLowerCase();

  const isProduction = host === PRODUCTION_HOST;

  if (!isProduction) {
    return new Response(
      `User-agent: *
Disallow: /
`,
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=0, must-revalidate",
        },
      }
    );
  }

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    }
  );
}