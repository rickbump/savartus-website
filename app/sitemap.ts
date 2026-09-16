import type { MetadataRoute } from "next";

const routeConfig = [
  { path: "/", priority: 1 },
  { path: "/products", priority: 0.9 },
  { path: "/active-archive", priority: 0.85 },
  { path: "/data-lifecycle-management", priority: 0.85 },
  { path: "/optical-object-storage", priority: 0.85 },
  { path: "/resources", priority: 0.8 },
  { path: "/insights", priority: 0.8 },
  { path: "/company", priority: 0.8 },
  { path: "/contact", priority: 0.8 },
  { path: "/technology/orain", priority: 0.75 },
  { path: "/active-archive/service", priority: 0.75 },
  { path: "/resources/dlm-specification", priority: 0.75 },
  { path: "/products/els", priority: 0.75 },
  { path: "/products/file-management", priority: 0.75 },
  { path: "/products/els100", priority: 0.7 },
  { path: "/products/els150", priority: 0.7 },
  { path: "/products/els300", priority: 0.7 },
  { path: "/products/els500", priority: 0.7 },
  { path: "/products/els1000", priority: 0.7 },
  { path: "/products/els3600", priority: 0.7 },
  { path: "/products/els4000", priority: 0.7 },
  { path: "/products/els8000", priority: 0.7 },
  { path: "/products/els8000-ol", priority: 0.7 },
  { path: "/products/els10k", priority: 0.7 },
  { path: "/products/els10k-ol", priority: 0.7 },
] as const;

function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "https://savartus.com";

  const url = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return url.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return routeConfig.map(({ path, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
