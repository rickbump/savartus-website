import type { MetadataRoute } from "next";

const SITE_URL = "https://www.savartus.com";

const routeConfig = [
  { path: "/", priority: 1 },

  { path: "/active-archive", priority: 0.95 },
  { path: "/preservation", priority: 0.95 },
  { path: "/data-lifecycle-management", priority: 0.95 },

  { path: "/products", priority: 0.9 },
  { path: "/products/els", priority: 0.9 },

  { path: "/technology/orain", priority: 0.85 },
  { path: "/products/file-management", priority: 0.85 },

  { path: "/resources", priority: 0.8 },
  { path: "/resources/dlm-specification", priority: 0.85 },
  { path: "/insights", priority: 0.85 },

  { path: "/company", priority: 0.75 },
  { path: "/contact", priority: 0.75 },

  { path: "/active-archive/service", priority: 0.8 },

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

export default function sitemap(): MetadataRoute.Sitemap {
  return routeConfig.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority,
  }));
}