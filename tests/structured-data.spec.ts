import { expect, test } from "@playwright/test";

import { getPublishedInsights } from "../content/insights/articles";
import { elsProducts } from "../data/els-products";

const SITE = "https://www.savartus.com";

function schemas(html: string): Record<string, unknown>[] {
  const nodes: Record<string, unknown>[] = [];
  for (const [, raw] of html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  )) {
    expect(raw).not.toContain("<");
    const data: Record<string, unknown> = JSON.parse(raw);
    if (Array.isArray(data["@graph"])) {
      nodes.push(...data["@graph"]);
    } else {
      nodes.push(data);
    }
  }
  return nodes;
}

function checkBreadcrumbs(
  html: string,
  items: { name: string; href: string }[]
) {
  const lists = schemas(html).filter((node) => node["@type"] === "BreadcrumbList");
  expect(lists).toHaveLength(1);
  expect(lists[0]).toEqual({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.href, SITE).href,
    })),
  });
  const nav = html.match(/<nav aria-label="Breadcrumb"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  expect(nav).toBeTruthy();
  expect(nav?.match(/<li>/g)).toHaveLength(items.length);
  const currentName = items[items.length - 1].name
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  expect(nav).toContain(`<span aria-current="page">${currentName}</span>`);
  expect([...(nav ?? "").matchAll(/<a\b[^>]*href="([^"]+)"/g)].map((m) => m[1]))
    .toEqual(items.slice(0, -1).map((item) => item.href));
}

test("homepage identifies Savartus and its website without invented details", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  expect(schemas(await response.text())).toEqual([
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Savartus",
      url: SITE,
      logo: `${SITE}/images/brand/savartus-shield.jpeg`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Savartus",
      url: SITE,
      publisher: { "@id": `${SITE}/#organization` },
    },
  ]);
  const logo = await request.get("/images/brand/savartus-shield.jpeg");
  expect(logo.status()).toBe(200);
  expect(logo.headers()["content-type"]).toMatch(/^image\//);
});

for (const product of elsProducts) {
  test(`${product.name} schema matches published product facts and breadcrumbs`, async ({ request }) => {
    const response = await request.get(product.href);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const products = schemas(html).filter((node) => node["@type"] === "Product");
    expect(products).toHaveLength(1);
    expect(products[0]).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${SITE}${product.href}#product`,
      url: `${SITE}${product.href}`,
      name: product.name,
      model: product.name,
      description: product.description,
      ...(product.image ? { image: `${SITE}${product.image}` } : {}),
      brand: { "@type": "Brand", name: "Savartus" },
      category: product.categoryLabel,
      additionalProperty: [
        ...product.specs,
        {
          label: "Dimensions",
          value: `${product.technicalSpecs.dimensionsInches} / ${product.technicalSpecs.dimensionsCm}`,
        },
        {
          label: "Weight",
          value: `${product.technicalSpecs.weightLbs} / ${product.technicalSpecs.weightKg}`,
        },
      ].map((spec) => ({
        "@type": "PropertyValue",
        name: spec.label,
        value: spec.value,
      })),
    });
    for (const field of ["offers", "review", "aggregateRating", "availability"]) {
      expect(products[0]).not.toHaveProperty(field);
    }
    if (product.image) {
      const image = await request.get(product.image);
      expect(image.status()).toBe(200);
      expect(image.headers()["content-type"]).toMatch(/^image\//);
    }
    checkBreadcrumbs(html, [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "ELS Libraries", href: "/products/els" },
      { name: product.name, href: product.href },
    ]);
  });
}

for (const article of getPublishedInsights()) {
  test(`${article.slug} retains Article schema and adds matching breadcrumbs`, async ({ request }) => {
    const path = `/insights/${article.slug}`;
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    const html = await response.text();
    const articles = schemas(html).filter((node) => node["@type"] === "Article");
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      headline: article.title,
      description: article.description,
      datePublished: article.publishedDate,
      dateModified: article.updatedDate ?? article.publishedDate,
      mainEntityOfPage: { "@id": `${SITE}${path}` },
    });
    checkBreadcrumbs(html, [
      { name: "Home", href: "/" },
      { name: "Insights", href: "/insights" },
      { name: article.title, href: path },
    ]);
  });
}
