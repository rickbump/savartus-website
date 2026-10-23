import { expect, test } from "@playwright/test";

function meta(html: string, name: string) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const key = tag.match(/\b(?:name|property)="([^"]*)"/i)?.[1];
    if (key === name) {
      return tag.match(/\bcontent="([^"]*)"/i)?.[1]?.replace(/&amp;/g, "&");
    }
  }
}

test("every sitemap page has working social preview images", async ({ request }) => {
  test.setTimeout(120_000);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const locations = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)];
  expect(locations.length).toBeGreaterThan(0);
  const imagePaths = new Set<string>();

  for (const [, location] of locations) {
    const path = new URL(location).pathname;
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    const html = await response.text();

    expect(meta(html, "twitter:card"), path).toBe("summary_large_image");
    for (const prefix of ["og", "twitter"]) {
      const image = meta(html, `${prefix}:image`);
      expect(image, `${path}: ${prefix}:image`).toBeTruthy();
      expect(meta(html, `${prefix}:image:alt`), path).toBe(
        "Savartus | Manage. Store. Preserve."
      );
      if (prefix === "og") {
        expect(meta(html, "og:image:width"), path).toBe("1200");
        expect(meta(html, "og:image:height"), path).toBe("630");
      }
      if (image) {
        const url = new URL(image);
        expect(url.origin, path).toBe("https://www.savartus.com");
        imagePaths.add(`${url.pathname}${url.search}`);
      }
    }
  }

  for (const path of imagePaths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("image/png");
    const png = await response.body();
    expect(png.length, path).toBeGreaterThan(24);
    expect(png.subarray(0, 8).toString("hex"), path).toBe("89504e470d0a1a0a");
    expect(png.readUInt32BE(16), path).toBe(1200);
    expect(png.readUInt32BE(20), path).toBe(630);
  }
});
