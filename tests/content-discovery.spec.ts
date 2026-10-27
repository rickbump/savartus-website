import { expect, test } from "@playwright/test";

import {
  getPublishedInsights,
  getRelatedInsights,
} from "../content/insights/articles";
import { elsProducts } from "../data/els-products";

const SITE = "https://www.savartus.com";

test("related Insights resolve to distinct published articles", () => {
  const published = new Set(getPublishedInsights().map((article) => article.slug));
  for (const article of getPublishedInsights()) {
    expect(new Set(article.relatedArticleSlugs).size, article.slug)
      .toBe(article.relatedArticleSlugs.length);
    for (const slug of article.relatedArticleSlugs) {
      expect(published.has(slug), `${article.slug} -> ${slug}`).toBe(true);
      expect(slug, article.slug).not.toBe(article.slug);
    }
    expect(getRelatedInsights(article).map((related) => related.slug))
      .toEqual(article.relatedArticleSlugs);
  }
});

test("rendered pages provide product and Insight discovery without orphaned targets", async ({ request }) => {
  test.setTimeout(120_000);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const paths = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, location]) => new URL(location).pathname);
  expect(paths.length).toBeGreaterThan(0);
  const inlinks = new Map(paths.map((path) => [path, new Set<string>()]));
  const pages = new Map<string, string>();

  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();
    pages.set(path, html);
    const targets = new Set<string>();
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      const target = new URL(href.replace(/&amp;/g, "&"), SITE);
      if (target.origin === SITE && target.pathname !== path) {
        targets.add(target.pathname);
      }
    }
    for (const target of targets) {
      inlinks.get(target)?.add(path);
    }
  }

  for (const product of elsProducts) {
    expect(inlinks.get(product.href)?.size, product.href).toBeGreaterThanOrEqual(4);
    const html = pages.get(product.href) ?? "";
    for (const other of elsProducts.filter((item) => item.slug !== product.slug)) {
      expect(html, `${product.slug} -> ${other.slug}`)
        .toContain(`href="${other.href}"`);
    }
    expect(pages.get("/products/els"), product.slug)
      .toContain(`href="${product.href}"`);
  }
  for (const article of getPublishedInsights()) {
    const path = `/insights/${article.slug}`;
    expect(inlinks.get(path)?.size, path).toBeGreaterThanOrEqual(3);
    for (const related of getRelatedInsights(article)) {
      expect(pages.get(path), `${article.slug} -> ${related.slug}`)
        .toContain(`href="/insights/${related.slug}"`);
    }
  }
  for (const path of ["/", "/resources"]) {
    const html = pages.get(path) ?? "";
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
    const text = main
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, " ")
      .trim();
    expect(text.split(/\s+/).length, path).toBeGreaterThanOrEqual(400);
  }
});
