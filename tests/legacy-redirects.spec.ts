import { expect, test } from "@playwright/test";

const redirects = [
  ["/about", "/company"],
  ["/solutions/enterprise-laser-storage", "/products/els"],
  ["/learn", "/resources"],
  ["/solutions", "/#solutions"],
  ["/solutions/data-lifecycle-management", "/data-lifecycle-management"],
  ["/blog", "/insights"],
  ["/contact-us/contact-savartus-team", "/contact"],
] as const;

for (const [source, destination] of redirects) {
  test(`${source} permanently redirects to ${destination}`, async ({ request }) => {
    for (const query of ["", "?utm_source=legacy"]) {
      const response = await request.get(`${source}${query}`, {
        maxRedirects: 0,
      });
      expect(response.status()).toBe(308);
      const location = new URL(
        response.headers().location,
        "http://localhost:3000"
      );
      const expected = new URL(destination, "http://localhost:3000");
      expect(location.pathname).toBe(expected.pathname);
      expect(location.hash).toBe(expected.hash);
      expect(location.search).toBe(query);
    }

    const expected = new URL(destination, "http://localhost:3000");
    const target = await request.get(expected.pathname, { maxRedirects: 0 });
    expect(target.status()).toBe(200);
    if (expected.hash) {
      expect(await target.text()).toContain(`id="${expected.hash.slice(1)}"`);
    }
  });
}

test("legacy trailing-slash aliases reach their canonical destinations", async ({ request }) => {
  for (const [source, destination] of [
    ["/about/", "/company"],
    ["/blog/", "/insights"],
    ["/learn/", "/resources"],
    ["/solutions/", "/#solutions"],
    ["/solutions/enterprise-laser-storage/", "/products/els"],
    ["/solutions/data-lifecycle-management/", "/data-lifecycle-management"],
    ["/contact-us/contact-savartus-team/", "/contact"],
  ]) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status(), source).toBe(308);
    const target = await request.get(source);
    expect(target.status(), source).toBe(200);
    expect(new URL(target.url()).pathname, source).toBe(
      new URL(destination, "http://localhost:3000").pathname
    );
  }
});

for (const path of [
  "/insights/media-archives-find-and-reuse-preserved-content",
  "/insights/performance-and-preservation-should-work-together",
  "/insights/the-evidence-must-outlive-the-storage-system",
]) {
  test(`${path} is already a working canonical page`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  });
}

test("unknown legacy URLs are not redirected to unrelated pages", async ({ request }) => {
  for (const path of [
    "/legal/rimage-software-license-agreement",
    "/legal/technical-support-services-agreement",
    "/legal/warranty",
    "/publishing-systems/producer-v-8300n",
    "/cases/mcdonagh-brothers-inc",
    "/pricing",
    "/privacy-policy",
    "/data-backup-and-restore",
    "/data-migration-restoration-services",
    "/solutions/immutable-data-archive-f-a-q",
    "/solutions/sophia",
    "/this-page-does-not-exist",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});
