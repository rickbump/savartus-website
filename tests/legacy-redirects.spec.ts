import { expect, test } from "@playwright/test";

const redirects = [
  ["/about", "/company"],
  ["/solutions/enterprise-laser-storage", "/products/els"],
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
      expect(location.pathname).toBe(destination);
      expect(location.search).toBe(query);
    }

    const target = await request.get(destination, { maxRedirects: 0 });
    expect(target.status()).toBe(200);
  });
}

test("unknown legacy URLs are not redirected to unrelated pages", async ({ request }) => {
  for (const path of [
    "/legal/rimage-software-license-agreement",
    "/legal/technical-support-services-agreement",
    "/this-page-does-not-exist",
  ]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});
