import { expect, test } from "@playwright/test";

import { getPublishedInsights } from "../content/insights/articles";

function decode(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 10))
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function meta(html: string, name: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (tag.match(/\b(?:name|property)="([^"]*)"/i)?.[1] === name) {
      return decode(tag.match(/\bcontent="([^"]*)"/i)?.[1] ?? "");
    }
  }
  return "";
}

test("sitemap metadata meets title and description requirements", async ({ request }) => {
  test.setTimeout(120_000);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)];
  expect(locations.length).toBeGreaterThan(0);
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const articles = new Map(
    getPublishedInsights().map((article) => [`/insights/${article.slug}`, article])
  );

  for (const [, location] of locations) {
    const path = new URL(location).pathname;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const description = meta(html, "description");

    expect(title.length, path).toBeGreaterThan(0);
    expect(title.length, path).toBeLessThanOrEqual(65);
    expect(title, path).toMatch(/ \| Savartus$/);
    expect(titles.has(title), `${path}: duplicate title`).toBe(false);
    titles.add(title);
    expect(description.length, path).toBeGreaterThanOrEqual(70);
    expect(description.length, path).toBeLessThanOrEqual(165);
    expect(descriptions.has(description), `${path}: duplicate description`).toBe(false);
    descriptions.add(description);

    if (!["/company", "/contact"].includes(path)) {
      expect(title.replace(/ \| Savartus$/, "").split(/\s+/).length, path)
        .toBeGreaterThanOrEqual(3);
    }
    for (const prefix of ["og", "twitter"]) {
      expect(meta(html, `${prefix}:title`), path).toBe(title);
      expect(meta(html, `${prefix}:description`), path).not.toBe("");
      expect(meta(html, `${prefix}:image`), path).not.toBe("");
    }
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    expect(canonical?.replace(/\/$/, ""), path).toBe(
      `https://www.savartus.com${path === "/" ? "" : path}`
    );

    if (path === "/") {
      expect(title).toBe("Enterprise Optical Storage & Data Lifecycle | Savartus");
      const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
      expect(h1.replace(/<[^>]+>/g, "").replace(/\s+/g, "")).toBe("Manage.Store.Preserve.");
    }
    const article = articles.get(path);
    if (article) {
      expect(title, path).toBe(`${article.seoTitle ?? article.title} | Savartus`);
      expect(description, path).toBe(article.seoDescription ?? article.description);
      expect(meta(html, "og:description"), path).toBe(description);
      expect(meta(html, "twitter:description"), path).toBe(description);
      const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
      expect(decode(h1), path).toBe(article.title);
      const deck = html.match(/<p class="insight-article-deck">([\s\S]*?)<\/p>/i)?.[1] ?? "";
      expect(decode(deck), path).toBe(article.description);
      const jsonLd = html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
      )?.[1];
      expect(jsonLd, path).toBeTruthy();
      const structuredData = JSON.parse(jsonLd ?? "{}");
      expect(structuredData.headline, path).toBe(article.title);
      expect(structuredData.description, path).toBe(article.description);
    }
  }
});
