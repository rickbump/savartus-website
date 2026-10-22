#!/usr/bin/env node
// SEO audit of the live site. Every check reports pass / fail / unknown plus the
// pages that fail it, so the daily SEO workflow can verify fixes automatically.
//
// Usage: node scripts/seo-audit.mjs [--out=seo-report] [--no-psi]

import { resolveTxt } from "node:dns/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const SITE = "https://www.savartus.com";
const UA = "SavartusSEOAudit/1.0 (+https://www.savartus.com)";
const TIMEOUT_MS = 20_000;

const LIMITS = {
  titleMax: 65,
  descriptionMin: 70,
  descriptionMax: 165,
  productInlinks: 4,
  insightInlinks: 3,
  minWords: 400,
};

const KEY_LANDING_PAGES = [
  "/",
  "/products",
  "/resources",
  "/technology/orain",
  "/active-archive/service",
  "/products/file-management",
  "/resources/dlm-specification",
];
const BRAND_PAGES = new Set(["/company", "/contact"]);
const LEGACY_REDIRECTS = ["/optical-object-storage"];
const PSI_PAGES = ["/", "/products/els", "/insights/the-evidence-must-outlive-the-storage-system"];

const isProductPage = (path) => /^\/products\/els\d/.test(path);
const isInsightPage = (path) => path.startsWith("/insights/");

async function request(url, options = {}, attempt = 1) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeout ?? TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...options,
      headers: { "user-agent": UA, ...options.headers },
      signal: controller.signal,
    });
  } catch (error) {
    if (attempt < 2) return request(url, options, attempt + 1);
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function decode(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function metaContent(html, key) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const name = tag.match(/\b(?:name|property)="([^"]+)"/i)?.[1];
    if (name?.toLowerCase() === key) return decode(tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? "");
  }
  return null;
}

function collectTypes(node, types) {
  if (Array.isArray(node)) return node.forEach((item) => collectTypes(item, types));
  if (!node || typeof node !== "object") return;
  const type = node["@type"];
  if (type) (Array.isArray(type) ? type : [type]).forEach((t) => types.add(t));
  Object.values(node).forEach((value) => collectTypes(value, types));
}

function toPath(href, base) {
  try {
    const url = new URL(decode(href), base);
    if (url.origin !== SITE) return null;
    const path = url.pathname.replace(/\/$/, "") || "/";
    return /\.[a-z0-9]{2,5}$/i.test(path) ? null : path;
  } catch {
    return null;
  }
}

function parsePage(html, url) {
  const ldBlocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLdTypes = new Set();
  let jsonLdErrors = 0;
  for (const [, raw] of ldBlocks) {
    try {
      collectTypes(JSON.parse(raw), jsonLdTypes);
    } catch {
      jsonLdErrors += 1;
    }
  }

  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const main = stripped.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? stripped;
  const text = (fragment) => decode(fragment.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

  const images = (main.match(/<img\b[^>]*>/gi) ?? []).map((tag) => ({
    src: decode(tag.match(/\bsrc="([^"]*)"/i)?.[1] ?? ""),
    hasAlt: /\balt="/i.test(tag),
  }));

  const links = new Set();
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const path = toPath(href, url);
    if (path) links.add(path);
  }

  return {
    title: text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ""),
    description: metaContent(html, "description"),
    canonical: decode(html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ?? ""),
    robots: metaContent(html, "robots") ?? "",
    ogImage: metaContent(html, "og:image"),
    twitterImage: metaContent(html, "twitter:image"),
    h1s: [...stripped.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(([, inner]) => text(inner)),
    jsonLdTypes: [...jsonLdTypes],
    jsonLdErrors,
    images,
    links: [...links],
    words: text(main).split(" ").filter(Boolean).length,
  };
}

async function runPsi(path) {
  const params = new URLSearchParams({ url: `${SITE}${path}`, strategy: "mobile", category: "performance" });
  if (process.env.PSI_API_KEY) params.set("key", process.env.PSI_API_KEY);
  const res = await request(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, {
    timeout: 90_000,
  });
  if (!res.ok) throw new Error(`PageSpeed Insights HTTP ${res.status}`);
  const data = await res.json();
  const audits = data.lighthouseResult.audits;
  return {
    path,
    score: Math.round(data.lighthouseResult.categories.performance.score * 100),
    lcpMs: Math.round(audits["largest-contentful-paint"].numericValue),
    cls: Number(audits["cumulative-layout-shift"].numericValue.toFixed(3)),
    tbtMs: Math.round(audits["total-blocking-time"].numericValue),
  };
}

function check(id, title, category, failing, options = {}) {
  const status = options.status ?? (failing.length ? "fail" : "pass");
  return {
    id,
    title,
    category,
    status,
    summary: options.summary ?? (status === "pass" ? "All pages pass" : `${failing.length} failing`),
    failing,
  };
}

export async function runAudit({ psi = true } = {}) {
  const sitemapRes = await request(`${SITE}/sitemap.xml`);
  const sitemapXml = sitemapRes.ok ? await sitemapRes.text() : "";
  const paths = [...sitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(
    ([, loc]) => new URL(decode(loc)).pathname.replace(/\/$/, "") || "/"
  );

  const pages = new Map();
  const queue = [...paths];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (queue.length) {
        const path = queue.shift();
        try {
          const res = await request(`${SITE}${path}`);
          const html = await res.text();
          pages.set(path, { path, status: res.status, ...parsePage(html, `${SITE}${path}`) });
        } catch (error) {
          pages.set(path, { path, status: String(error.cause?.code ?? error.message), links: [] });
        }
      }
    })
  );

  const ok = [...pages.values()].filter((p) => p.status === 200);
  const inlinks = new Map(paths.map((p) => [p, new Set()]));
  for (const page of ok) {
    for (const target of page.links) {
      if (target !== page.path && inlinks.has(target)) inlinks.get(target).add(page.path);
    }
  }

  const stem = (title) => title.replace(/\s*\|\s*Savartus\s*$/i, "").trim();
  const checks = [];

  checks.push(
    check(
      "pages-reachable",
      "Every sitemap page returns HTTP 200",
      "Technical",
      [...pages.values()].filter((p) => p.status !== 200).map((p) => ({ url: p.path, detail: `HTTP ${p.status}` })),
      { status: !sitemapRes.ok ? "fail" : undefined, summary: !sitemapRes.ok ? `sitemap.xml HTTP ${sitemapRes.status}` : undefined }
    )
  );

  checks.push(
    check(
      "indexable",
      "No page is blocked with noindex",
      "Technical",
      ok.filter((p) => /noindex/i.test(p.robots)).map((p) => ({ url: p.path, detail: `robots: ${p.robots}` }))
    )
  );

  checks.push(
    check(
      "canonical",
      "Canonical URL matches the page",
      "Technical",
      ok
        .filter((p) => p.canonical.replace(/\/$/, "") !== `${SITE}${p.path === "/" ? "" : p.path}`)
        .map((p) => ({ url: p.path, detail: p.canonical ? `canonical → ${p.canonical}` : "missing canonical" }))
    )
  );

  const redirectFailures = [];
  for (const path of LEGACY_REDIRECTS) {
    try {
      const res = await request(`${SITE}${path}`, { redirect: "manual" });
      if (![301, 308].includes(res.status)) {
        redirectFailures.push({ url: path, detail: `HTTP ${res.status} (should be a permanent 308/301 redirect)` });
      }
    } catch (error) {
      redirectFailures.push({ url: path, detail: error.message });
    }
  }
  checks.push(check("permanent-redirects", "Moved pages use permanent redirects", "Technical", redirectFailures));

  checks.push(
    check(
      "single-h1",
      "Each page has exactly one H1",
      "On-page",
      ok.filter((p) => p.h1s.length !== 1).map((p) => ({ url: p.path, detail: `${p.h1s.length} H1 tags` }))
    )
  );

  checks.push(
    check(
      "image-alt",
      "Images have alt attributes",
      "On-page",
      ok
        .filter((p) => p.images.some((img) => !img.hasAlt))
        .map((p) => ({ url: p.path, detail: `${p.images.filter((img) => !img.hasAlt).length} image(s) missing alt` }))
    )
  );

  const home = pages.get("/");
  checks.push(
    check(
      "home-title-category",
      "Homepage title names what Savartus offers",
      "On-page",
      home?.title && /archive|storage|preservation|lifecycle/i.test(home.title)
        ? []
        : [{ url: "/", detail: `title: "${home?.title ?? ""}"` }]
    )
  );

  checks.push(
    check(
      "descriptive-titles",
      "Page titles are descriptive (3+ words before the brand)",
      "On-page",
      ok
        .filter((p) => !BRAND_PAGES.has(p.path) && p.path !== "/" && stem(p.title).split(/\s+/).length < 3)
        .map((p) => ({ url: p.path, detail: `title: "${p.title}"` }))
    )
  );

  checks.push(
    check(
      "title-length",
      `Titles are ${LIMITS.titleMax} characters or fewer`,
      "On-page",
      ok
        .filter((p) => p.title.length > LIMITS.titleMax)
        .map((p) => ({ url: p.path, detail: `${p.title.length} chars: "${p.title}"` }))
    )
  );

  checks.push(
    check(
      "description-length",
      `Meta descriptions are ${LIMITS.descriptionMin}–${LIMITS.descriptionMax} characters`,
      "On-page",
      ok
        .filter((p) => !p.description || p.description.length < LIMITS.descriptionMin || p.description.length > LIMITS.descriptionMax)
        .map((p) => ({ url: p.path, detail: p.description ? `${p.description.length} chars` : "missing" }))
    )
  );

  const duplicates = (key) => {
    const groups = new Map();
    for (const p of ok) if (p[key]) groups.set(p[key], [...(groups.get(p[key]) ?? []), p.path]);
    return [...groups.values()].filter((g) => g.length > 1).map((g) => ({ url: g[0], detail: `same as ${g.slice(1).join(", ")}` }));
  };
  checks.push(check("unique-titles", "Titles are unique", "On-page", duplicates("title")));
  checks.push(check("unique-descriptions", "Meta descriptions are unique", "On-page", duplicates("description")));

  checks.push(
    check(
      "content-depth",
      `Key landing pages have ${LIMITS.minWords}+ words of content`,
      "Content",
      ok
        .filter((p) => KEY_LANDING_PAGES.includes(p.path) && p.words < LIMITS.minWords)
        .map((p) => ({ url: p.path, detail: `${p.words} words` }))
    )
  );

  checks.push(
    check(
      "product-inlinks",
      `Each ELS product page is linked from ${LIMITS.productInlinks}+ other pages`,
      "Internal links",
      paths
        .filter((p) => isProductPage(p) && inlinks.get(p).size < LIMITS.productInlinks)
        .map((p) => ({ url: p, detail: `linked from ${inlinks.get(p).size} page(s)` }))
    )
  );

  checks.push(
    check(
      "insight-inlinks",
      `Each Insight is linked from ${LIMITS.insightInlinks}+ other pages`,
      "Internal links",
      paths
        .filter((p) => isInsightPage(p) && inlinks.get(p).size < LIMITS.insightInlinks)
        .map((p) => ({ url: p, detail: `linked from ${inlinks.get(p).size} page(s)` }))
    )
  );

  const imageUrls = new Set(ok.flatMap((p) => [p.ogImage, p.twitterImage]).filter(Boolean));
  const brokenImages = new Set();
  for (const url of imageUrls) {
    try {
      const res = await request(new URL(url, SITE).href, { method: "GET" });
      await res.body?.cancel();
      if (!res.ok || !(res.headers.get("content-type") ?? "").startsWith("image/")) brokenImages.add(url);
    } catch {
      brokenImages.add(url);
    }
  }
  checks.push(
    check(
      "social-image",
      "Every page has a working social share image (og:image + twitter:image)",
      "Social",
      ok
        .filter((p) => !p.ogImage || !p.twitterImage || brokenImages.has(p.ogImage))
        .map((p) => ({
          url: p.path,
          detail: !p.ogImage ? "no og:image" : !p.twitterImage ? "no twitter:image" : `broken image ${p.ogImage}`,
        }))
    )
  );

  const missingTypes = (filter, types) =>
    ok
      .filter((p) => filter(p.path))
      .filter((p) => types.some((t) => !p.jsonLdTypes.includes(t)))
      .map((p) => ({ url: p.path, detail: `missing ${types.filter((t) => !p.jsonLdTypes.includes(t)).join(", ")}` }));

  checks.push(
    check("organization-schema", "Homepage has Organization + WebSite structured data", "Structured data", missingTypes((p) => p === "/", ["Organization", "WebSite"]))
  );
  checks.push(check("product-schema", "ELS product pages have Product structured data", "Structured data", missingTypes(isProductPage, ["Product"])));
  checks.push(
    check(
      "breadcrumb-schema",
      "Product and Insight pages have BreadcrumbList structured data",
      "Structured data",
      missingTypes((p) => isProductPage(p) || isInsightPage(p), ["BreadcrumbList"])
    )
  );
  checks.push(
    check(
      "structured-data-valid",
      "Structured data parses as valid JSON",
      "Structured data",
      ok.filter((p) => p.jsonLdErrors).map((p) => ({ url: p.path, detail: `${p.jsonLdErrors} invalid JSON-LD block(s)` }))
    )
  );

  let verified = /google-site-verification/i.test(JSON.stringify(home ?? {}));
  try {
    const records = (await resolveTxt("savartus.com")).flat().join(" ");
    verified ||= /google-site-verification=/i.test(records);
  } catch {
    // DNS lookup failures leave the status as unknown.
  }
  checks.push(
    check("search-console", "Google Search Console ownership detected", "Measurement", [], {
      status: verified ? "pass" : "unknown",
      summary: verified
        ? "Verification record found"
        : "No DNS/meta verification found (may be verified another way — confirm in Search Console)",
    })
  );

  const psiResults = [];
  if (psi) {
    for (const path of PSI_PAGES) {
      try {
        psiResults.push(await runPsi(path));
      } catch (error) {
        psiResults.push({ path, error: error.message });
      }
    }
  }
  const measured = psiResults.filter((r) => !r.error);
  checks.push(
    check(
      "mobile-performance",
      "Mobile lab performance ≥ 90, LCP ≤ 2.5 s, CLS ≤ 0.1 (PageSpeed Insights)",
      "Performance",
      measured
        .filter((r) => r.score < 90 || r.lcpMs > 2500 || r.cls > 0.1)
        .map((r) => ({ url: r.path, detail: `score ${r.score}, LCP ${(r.lcpMs / 1000).toFixed(1)} s, CLS ${r.cls}` })),
      measured.length
        ? { summary: undefined }
        : { status: "unknown", summary: psi ? "PageSpeed Insights unavailable (add PSI_API_KEY secret)" : "Skipped" }
    )
  );

  return {
    generatedAt: new Date().toISOString(),
    site: SITE,
    pagesAudited: pages.size,
    psi: psiResults,
    checks,
    pages: [...pages.values()].map(({ path, status, title, description, words, jsonLdTypes }) => ({
      path,
      status,
      title,
      descriptionLength: description?.length ?? 0,
      words,
      inlinks: inlinks.get(path)?.size ?? 0,
      jsonLdTypes,
    })),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, value] = arg.replace(/^--/, "").split("=");
      return [key, value ?? true];
    })
  );
  const audit = await runAudit({ psi: !args["no-psi"] });
  const outDir = args.out ?? "seo-report";
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, "audit.json"), JSON.stringify(audit, null, 2));

  const icon = { pass: "✅", fail: "❌", unknown: "⚪" };
  for (const c of audit.checks) {
    console.log(`${icon[c.status]} ${c.id.padEnd(22)} ${c.summary}`);
    for (const f of c.failing.slice(0, 5)) console.log(`     ${f.url} — ${f.detail}`);
    if (c.failing.length > 5) console.log(`     …and ${c.failing.length - 5} more`);
  }
  const passed = audit.checks.filter((c) => c.status === "pass").length;
  console.log(`\n${passed}/${audit.checks.length} checks passing across ${audit.pagesAudited} pages. Report: ${join(outDir, "audit.json")}`);
}
