#!/usr/bin/env node
// Daily site health check: crawls the live site and reports broken pages,
// links, assets, sitemap/robots problems and basic SEO issues.
//
// Usage:
//   node scripts/site-health-check.mjs [--base-url=https://www.savartus.com]
//     [--max-pages=500] [--no-external] [--out=site-health-report]
//
// Exit code is 1 when any error-level issue is found, 0 otherwise.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.length ? rest.join("=") : true];
  })
);

const BASE_URL = new URL(
  args["base-url"] ?? process.env.SITE_HEALTH_BASE_URL ?? "https://www.savartus.com"
).origin;
const MAX_PAGES = Number(args["max-pages"] ?? 500);
const CHECK_EXTERNAL = !args["no-external"];
const OUT_DIR = args.out ?? "site-health-report";
const CONCURRENCY = 6;
const TIMEOUT_MS = 20_000;
const SLOW_PAGE_MS = 3_000;

const SELF_UA = "SavartusSiteHealth/1.0 (+https://www.savartus.com)";
const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

const SKIP_SCHEMES = /^(mailto:|tel:|javascript:|data:|blob:|sms:)/i;
// Status codes commonly returned to bots by sites that are actually fine.
const BOT_BLOCK_STATUSES = new Set([401, 403, 405, 429, 999]);
const ERROR_MARKERS = [
  "Application error: a client-side exception has occurred",
  "Application error: a server-side exception has occurred",
  "Internal Server Error",
];

const issues = [];
const pages = new Map(); // url -> page info
const resources = new Map(); // url -> { status, sources:Set }
const linkSources = new Map(); // url -> Set(source pages)
const fragmentRefs = []; // { source, target, fragment }

function addIssue(severity, category, url, message, source) {
  issues.push({ severity, category, url, message, source });
}

function addSource(url, source) {
  if (!linkSources.has(url)) linkSources.set(url, new Set());
  if (source) linkSources.get(url).add(source);
}

async function fetchWithTimeout(url, options = {}, attempt = 1) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const started = performance.now();
  try {
    const res = await fetch(url, {
      redirect: "follow",
      ...options,
      signal: controller.signal,
    });
    return { res, ms: Math.round(performance.now() - started) };
  } catch (error) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 1_500));
      return fetchWithTimeout(url, options, attempt + 1);
    }
    return {
      error: error.name === "AbortError" ? `Timeout after ${TIMEOUT_MS}ms` : String(error.cause?.code ?? error.message),
      ms: Math.round(performance.now() - started),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function pool(items, worker, size = CONCURRENCY) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, async () => {
      while (queue.length) await worker(queue.shift());
    })
  );
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseAttrs(tag) {
  const attrs = {};
  const re = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m;
  const body = tag.replace(/^<\w+/, "").replace(/\/?>$/, "");
  while ((m = re.exec(body))) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function parseHtml(html) {
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, "$1</script>")
    .replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, "$1</style>");

  const tags = [...cleaned.matchAll(/<(a|link|img|script|source|iframe|meta|video|audio)\b[^>]*>/gi)].map(
    (m) => ({ name: m[1].toLowerCase(), attrs: parseAttrs(m[0]) })
  );

  const ids = new Set(
    [...cleaned.matchAll(/\s(?:id|name)\s*=\s*["']([^"']+)["']/gi)].map((m) => decodeEntities(m[1]))
  );

  const title = cleaned.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "";
  const h1Count = (cleaned.match(/<h1\b/gi) ?? []).length;

  const links = []; // { url, kind: 'page' | 'asset' }
  const meta = {};
  for (const { name, attrs } of tags) {
    if (name === "a" && attrs.href) links.push({ url: attrs.href, kind: "page" });
    if (name === "link" && attrs.href) {
      const rel = (attrs.rel ?? "").toLowerCase();
      if (rel === "canonical") meta.canonical = attrs.href;
      else if (/stylesheet|icon|manifest|apple-touch-icon/.test(rel)) links.push({ url: attrs.href, kind: "asset" });
    }
    if (["img", "script", "source", "iframe", "video", "audio"].includes(name) && attrs.src) {
      links.push({ url: attrs.src, kind: "asset" });
    }
    if ((name === "img" || name === "source") && attrs.srcset) {
      for (const candidate of attrs.srcset.split(/,\s+/)) {
        const url = candidate.trim().split(/\s+/)[0];
        if (url) links.push({ url, kind: "asset" });
      }
    }
    if (name === "meta") {
      const key = (attrs.name ?? attrs.property ?? "").toLowerCase();
      if (key === "description") meta.description = attrs.content;
      if (key === "robots") meta.robots = attrs.content;
      if (key === "og:image" && attrs.content) links.push({ url: attrs.content, kind: "asset" });
    }
  }

  return { title, h1Count, links, ids, meta };
}

function normalize(raw, base) {
  try {
    const url = new URL(raw.trim(), base);
    if (!/^https?:$/.test(url.protocol)) return null;
    const fragment = url.hash.slice(1);
    url.hash = "";
    return { url: url.href, fragment: fragment ? decodeURIComponent(fragment) : "" };
  } catch {
    return null;
  }
}

const isInternal = (url) => new URL(url).origin === BASE_URL;

function looksLikeDocument(url) {
  return /\.(pdf|docx?|xlsx?|pptx?|zip|png|jpe?g|gif|svg|webp|avif|ico|mp4|webm|css|js|json|xml|txt)$/i.test(
    new URL(url).pathname
  );
}

// ---------------------------------------------------------------------------
// Checks
// ---------------------------------------------------------------------------

async function checkRobots() {
  const { res, error } = await fetchWithTimeout(`${BASE_URL}/robots.txt`, { headers: { "user-agent": SELF_UA } });
  if (error || !res.ok) {
    addIssue("error", "robots", `${BASE_URL}/robots.txt`, `robots.txt unavailable (${error ?? res.status})`);
    return;
  }
  const text = await res.text();
  if (!/sitemap:/i.test(text)) addIssue("warning", "robots", `${BASE_URL}/robots.txt`, "robots.txt has no Sitemap: entry");
  if (/^\s*disallow:\s*\/\s*$/im.test(text)) {
    addIssue("error", "robots", `${BASE_URL}/robots.txt`, "robots.txt disallows the whole site (Disallow: /)");
  }
}

async function loadSitemap() {
  const url = `${BASE_URL}/sitemap.xml`;
  const { res, error } = await fetchWithTimeout(url, { headers: { "user-agent": SELF_UA } });
  if (error || !res.ok) {
    addIssue("error", "sitemap", url, `sitemap.xml unavailable (${error ?? res.status})`);
    return [];
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => decodeEntities(m[1]));
  if (!locs.length) addIssue("error", "sitemap", url, "sitemap.xml contains no <loc> entries");
  return locs.map((loc) => {
    // Sitemap uses the production host; map to BASE_URL so previews can be checked too.
    const u = new URL(loc);
    return `${BASE_URL}${u.pathname}${u.search}`;
  });
}

async function checkNotFoundHandling() {
  const url = `${BASE_URL}/__site-health-${Date.now()}-does-not-exist`;
  const { res, error } = await fetchWithTimeout(url, { headers: { "user-agent": SELF_UA } });
  if (error) addIssue("error", "404-page", url, `Request failed: ${error}`);
  else if (res.status !== 404) {
    addIssue("error", "404-page", url, `Missing page returned HTTP ${res.status} instead of 404 (soft 404)`);
  }
}

async function crawl(seedUrls) {
  const queued = new Set(seedUrls);
  let queue = [...seedUrls];

  while (queue.length && pages.size < MAX_PAGES) {
    const batch = queue.splice(0, Math.min(CONCURRENCY * 2, MAX_PAGES - pages.size));
    const discovered = [];

    await pool(batch, async (url) => {
      const { res, error, ms } = await fetchWithTimeout(url, { headers: { "user-agent": SELF_UA } });
      const info = { url, ms, status: error ?? res.status, finalUrl: res?.url ?? url, ids: new Set() };
      pages.set(url, info);

      if (error || !res.ok) {
        info.ok = false;
        return;
      }
      info.ok = true;
      if (res.url !== url) info.redirectedTo = res.url;

      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/html")) {
        await res.arrayBuffer();
        return;
      }

      const html = await res.text();
      const parsed = parseHtml(html);
      info.ids = parsed.ids;
      info.title = parsed.title;
      info.html = true;

      if (ms > SLOW_PAGE_MS) addIssue("warning", "performance", url, `Slow response: ${ms}ms`);
      for (const marker of ERROR_MARKERS) {
        if (html.includes(marker)) addIssue("error", "page-error", url, `Page contains error text: "${marker}"`);
      }
      if (!parsed.title) addIssue("warning", "seo", url, "Missing <title>");
      if (!parsed.meta.description) addIssue("warning", "seo", url, "Missing meta description");
      if (parsed.h1Count !== 1) addIssue("warning", "seo", url, `Expected 1 <h1>, found ${parsed.h1Count}`);
      if (!parsed.meta.canonical) addIssue("warning", "seo", url, "Missing canonical link");
      else {
        const canonical = new URL(parsed.meta.canonical, url);
        if (canonical.pathname.replace(/\/$/, "") !== new URL(res.url).pathname.replace(/\/$/, "")) {
          addIssue("warning", "seo", url, `Canonical points elsewhere: ${parsed.meta.canonical}`);
        }
      }
      if (/noindex/i.test(parsed.meta.robots ?? "")) addIssue("warning", "seo", url, "Page is marked noindex");

      for (const link of parsed.links) {
        const rawUrl = link.url.trim();
        if (!rawUrl || rawUrl === "#" || SKIP_SCHEMES.test(rawUrl)) continue;
        if (link.url.startsWith("http://") && link.kind === "asset") {
          addIssue("warning", "mixed-content", url, `Insecure asset reference: ${link.url}`);
        }
        const normalized = normalize(link.url, res.url);
        if (!normalized) continue;
        const target = normalized.url;
        addSource(target, url);

        if (normalized.fragment && isInternal(target)) {
          fragmentRefs.push({ source: url, target, fragment: normalized.fragment });
        }

        if (link.kind === "page" && isInternal(target) && !looksLikeDocument(target)) {
          if (!queued.has(target)) {
            queued.add(target);
            discovered.push(target);
          }
        } else if (!resources.has(target)) {
          resources.set(target, { internal: isInternal(target) });
        }
      }
    });

    queue = queue.concat(discovered);
  }

  if (queue.length) {
    addIssue("warning", "crawl", BASE_URL, `Crawl stopped at --max-pages=${MAX_PAGES}; ${queue.length} pages not checked`);
  }
}

async function checkResources() {
  const targets = [...resources.entries()].filter(([, r]) => r.internal || CHECK_EXTERNAL);

  await pool(targets, async ([url, info]) => {
    const headers = { "user-agent": info.internal ? SELF_UA : BROWSER_UA, accept: "*/*" };
    let { res, error } = await fetchWithTimeout(url, { method: "HEAD", headers });
    if (!error && (res.status === 405 || res.status === 403 || res.status === 404 || res.status >= 500)) {
      // Many servers mishandle HEAD; confirm with GET before reporting.
      ({ res, error } = await fetchWithTimeout(url, { method: "GET", headers }));
      if (res) await res.body?.cancel();
    }
    info.status = error ?? res.status;
    info.finalUrl = res?.url;
  }, 10);
}

function evaluateLinks(sitemapUrls) {
  const sitemapSet = new Set(sitemapUrls);

  for (const [url, info] of pages) {
    const sources = [...(linkSources.get(url) ?? [])];
    const from = sources.length ? sources.slice(0, 5).join(", ") : sitemapSet.has(url) ? "sitemap.xml" : "start";
    if (!info.ok) {
      addIssue("error", "broken-page", url, `Page returned ${info.status}`, from);
    } else if (info.redirectedTo && sources.length) {
      addIssue("warning", "redirect", url, `Internal link redirects to ${info.redirectedTo}`, from);
    }
  }

  for (const [url, info] of resources) {
    if (info.status === undefined) continue;
    const from = [...(linkSources.get(url) ?? [])].slice(0, 5).join(", ");
    const ok = typeof info.status === "number" && info.status < 400;
    if (ok) continue;

    if (info.internal) {
      addIssue("error", "broken-asset", url, `Internal resource returned ${info.status}`, from);
    } else if (typeof info.status === "number" && BOT_BLOCK_STATUSES.has(info.status)) {
      addIssue("warning", "external-link", url, `External link returned ${info.status} (may be bot protection)`, from);
    } else {
      addIssue("error", "external-link", url, `External link failed: ${info.status}`, from);
    }
  }

  for (const { source, target, fragment } of fragmentRefs) {
    const page = pages.get(target);
    if (page?.html && !page.ids.has(fragment) && fragment !== "top") {
      addIssue("warning", "anchor", `${target}#${fragment}`, `Anchor #${fragment} not found on page`, source);
    }
  }

  for (const url of sitemapUrls) {
    if (pages.get(url)?.ok && !(linkSources.get(url)?.size)) {
      addIssue("warning", "orphan", url, "In sitemap but not linked from any crawled page");
    }
  }
  for (const [url, info] of pages) {
    if (info.ok && info.html && !info.redirectedTo && !sitemapSet.has(url)) {
      addIssue("warning", "sitemap", url, "Crawled page is missing from sitemap.xml");
    }
  }

  const titles = new Map();
  for (const [url, info] of pages) {
    if (info.title && !info.redirectedTo) titles.set(info.title, [...(titles.get(info.title) ?? []), url]);
  }
  for (const [title, urls] of titles) {
    if (urls.length > 1) addIssue("warning", "seo", urls[0], `Duplicate <title> "${title}" on: ${urls.join(", ")}`);
  }
}

// ---------------------------------------------------------------------------
// Reporting
// ---------------------------------------------------------------------------

function buildMarkdown(summary) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const row = (i) =>
    `| ${i.category} | ${i.url} | ${i.message.replace(/\|/g, "\\|")} | ${(i.source ?? "").replace(/\|/g, "\\|")} |`;
  const table = (list) =>
    list.length
      ? ["| Category | URL | Problem | Linked from |", "|---|---|---|---|", ...list.map(row)].join("\n")
      : "_None_ ✅";

  return [
    `# Site health report — ${BASE_URL}`,
    "",
    `Run: ${summary.finishedAt} (${summary.durationSec}s)`,
    "",
    `| Status | Pages crawled | Resources checked | Sitemap URLs | Errors | Warnings | Avg page ms | Slowest page |`,
    `|---|---|---|---|---|---|---|---|`,
    `| ${errors.length ? "❌ FAIL" : "✅ PASS"} | ${summary.pagesCrawled} | ${summary.resourcesChecked} | ${summary.sitemapUrls} | ${errors.length} | ${warnings.length} | ${summary.avgPageMs} | ${summary.slowestPage} |`,
    "",
    `## Errors (${errors.length})`,
    "",
    table(errors),
    "",
    `## Warnings (${warnings.length})`,
    "",
    table(warnings),
    "",
  ].join("\n");
}

async function main() {
  const startedAt = Date.now();
  console.log(`Site health check: ${BASE_URL} (max ${MAX_PAGES} pages, external=${CHECK_EXTERNAL})`);

  const home = await fetchWithTimeout(BASE_URL + "/", { headers: { "user-agent": SELF_UA } });
  if (home.error || !home.res.ok) {
    addIssue("error", "availability", BASE_URL, `Homepage is DOWN (${home.error ?? home.res.status})`);
  }

  await checkRobots();
  const sitemapUrls = await loadSitemap();
  await checkNotFoundHandling();
  await crawl([`${BASE_URL}/`, ...sitemapUrls]);
  await checkResources();
  evaluateLinks(sitemapUrls);

  const htmlPages = [...pages.values()].filter((p) => p.html);
  const slowest = htmlPages.sort((a, b) => b.ms - a.ms)[0];
  const summary = {
    baseUrl: BASE_URL,
    finishedAt: new Date().toISOString(),
    durationSec: Math.round((Date.now() - startedAt) / 1000),
    pagesCrawled: pages.size,
    resourcesChecked: [...resources.values()].filter((r) => r.status !== undefined).length,
    sitemapUrls: sitemapUrls.length,
    errors: issues.filter((i) => i.severity === "error").length,
    warnings: issues.filter((i) => i.severity === "warning").length,
    avgPageMs: htmlPages.length ? Math.round(htmlPages.reduce((s, p) => s + p.ms, 0) / htmlPages.length) : 0,
    slowestPage: slowest ? `${new URL(slowest.url).pathname} (${slowest.ms}ms)` : "-",
  };

  const markdown = buildMarkdown(summary);
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(join(OUT_DIR, "report.md"), markdown);
  await writeFile(join(OUT_DIR, "report.json"), JSON.stringify({ summary, issues }, null, 2));

  for (const i of issues) {
    console.log(`${i.severity === "error" ? "ERROR" : "warn "} [${i.category}] ${i.url} — ${i.message}${i.source ? ` (from ${i.source})` : ""}`);
  }
  console.log(
    `\n${summary.errors ? "FAIL" : "PASS"}: ${summary.pagesCrawled} pages, ${summary.resourcesChecked} resources, ` +
      `${summary.errors} errors, ${summary.warnings} warnings in ${summary.durationSec}s. Report: ${join(OUT_DIR, "report.md")}`
  );

  process.exitCode = summary.errors ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 2;
});
