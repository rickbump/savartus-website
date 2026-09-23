import { test, expect } from "@playwright/test";
import { getPublishedInsights } from "../content/insights/articles";

const BASE_URL = "http://localhost:3000";
const PRODUCTION_URL = "https://www.savartus.com";

type LinkProblem = {
  source: string;
  target: string;
  status: number | string;
};

type SeoProblem = {
  path: string;
  issue: string;
};

type StructuredDataProblem = {
  path: string;
  issue: string;
};

type SitemapProblem = {
  path: string;
  issue: string;
};

const expectedMissingRoutes = new Set<string>();

const documentExtensions = new Set([
  ".doc",
  ".docx",
  ".pdf",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".zip",
]);

function isDocumentPath(path: string) {
  return [...documentExtensions].some((extension) =>
    path.toLowerCase().endsWith(extension)
  );
}

function expectedCanonicalForPath(path: string) {
  const url = new URL(path, PRODUCTION_URL);

  url.hash = "";

  return url.pathname === "/"
    ? PRODUCTION_URL
    : `${PRODUCTION_URL}${url.pathname}${url.search}`;
}

test("crawl Savartus website and find broken internal links", async ({
  page,
  request,
}) => {
  test.setTimeout(120_000);

  const visited = new Set<string>();

  const publishedInsights = getPublishedInsights();

  const publishedInsightRoutes = publishedInsights.map(
    (article) => `/insights/${article.slug}`
  );

  const queue: Array<{
    path: string;
    source: string;
  }> = [
    {
      path: "/",
      source: "START",
    },
    ...publishedInsightRoutes.map((path) => ({
      path,
      source: "PUBLISHED INSIGHT",
    })),
  ];

  const queued = new Set<string>([
    "/",
    ...publishedInsightRoutes,
  ]);

  const unexpectedBroken: LinkProblem[] = [];
  const expectedBroken: LinkProblem[] = [];
  const seoProblems: SeoProblem[] = [];
  const structuredDataProblems: StructuredDataProblem[] = [];
  const sitemapProblems: SitemapProblem[] = [];

  // ---------------------------------------------------------
  // SITEMAP VALIDATION
  // ---------------------------------------------------------

  const sitemapResponse = await request.get(`${BASE_URL}/sitemap.xml`);

  if (!sitemapResponse.ok()) {
    sitemapProblems.push({
      path: "/sitemap.xml",
      issue: `Sitemap returned HTTP ${sitemapResponse.status()}`,
    });
  } else {
    const sitemapXml = await sitemapResponse.text();

    for (const article of publishedInsights) {
      const expectedUrl =
        `${PRODUCTION_URL}/insights/${article.slug}`;

      if (!sitemapXml.includes(`<loc>${expectedUrl}</loc>`)) {
        sitemapProblems.push({
          path: `/insights/${article.slug}`,
          issue: `Published Insight missing from sitemap: ${expectedUrl}`,
        });
      }
    }

    for (const article of publishedInsights) {
      const expectedLastModified =
        article.updatedDate ?? article.publishedDate;

      const articleUrl =
        `${PRODUCTION_URL}/insights/${article.slug}`;

      const escapedUrl = articleUrl.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const articleEntryPattern = new RegExp(
        `<url>[\\s\\S]*?<loc>${escapedUrl}</loc>[\\s\\S]*?</url>`
      );

      const articleEntryMatch = sitemapXml.match(articleEntryPattern);

      if (!articleEntryMatch) {
        continue;
      }

      const articleEntry = articleEntryMatch[0];

      if (!articleEntry.includes("<lastmod>")) {
        sitemapProblems.push({
          path: `/insights/${article.slug}`,
          issue: "Published Insight sitemap entry is missing <lastmod>",
        });
      } else if (
        !articleEntry.includes(expectedLastModified)
      ) {
        sitemapProblems.push({
          path: `/insights/${article.slug}`,
          issue:
            `Published Insight sitemap lastmod does not match ` +
            `${expectedLastModified}`,
        });
      }
    }
  }

  // ---------------------------------------------------------
  // PAGE CRAWL
  // ---------------------------------------------------------

  while (queue.length > 0) {
    const current = queue.shift()!;
    const path = current.path;

    if (visited.has(path)) {
      continue;
    }

    visited.add(path);

    console.log(`\nChecking page: ${path}`);

    const response = await page.goto(path, {
      waitUntil: "domcontentloaded",
    });

    if (!response) {
      const problem = {
        source: current.source,
        target: path,
        status: "NO RESPONSE",
      };

      unexpectedBroken.push(problem);

      console.log("  BROKEN PAGE: NO RESPONSE");

      continue;
    }

    const status = response.status();

    if (status >= 400) {
      const problem = {
        source: current.source,
        target: path,
        status,
      };

      if (expectedMissingRoutes.has(path)) {
        expectedBroken.push(problem);

        console.log(`  EXPECTED MISSING: ${status}`);
      } else {
        unexpectedBroken.push(problem);

        console.log(`  UNEXPECTED BROKEN PAGE: ${status}`);
      }

      continue;
    }

    console.log(`  OK: ${status}`);

    const contentType = response.headers()["content-type"] ?? "";
    const isHtmlPage = contentType.includes("text/html");

    if (isHtmlPage) {
      // -----------------------------------------------------
      // BASIC SEO CHECKS
      // -----------------------------------------------------

      const title = (await page.title()).trim();

      if (!title) {
        seoProblems.push({
          path,
          issue: "Missing or empty <title>",
        });
      }

      const description = (
        await page
          .locator('meta[name="description"]')
          .getAttribute("content")
      )?.trim();

      if (!description) {
        seoProblems.push({
          path,
          issue: 'Missing or empty meta[name="description"]',
        });
      }

      const canonical = (
        await page
          .locator('link[rel="canonical"]')
          .getAttribute("href")
      )?.trim();

      if (!canonical) {
        seoProblems.push({
          path,
          issue: 'Missing link[rel="canonical"]',
        });
      } else {
        const expectedCanonical = expectedCanonicalForPath(path);

        if (!canonical.startsWith(PRODUCTION_URL)) {
          seoProblems.push({
            path,
            issue: `Canonical does not use production domain: ${canonical}`,
          });
        }

        if (canonical !== expectedCanonical) {
          seoProblems.push({
            path,
            issue: `Canonical mismatch. Expected ${expectedCanonical}, found ${canonical}`,
          });
        }
      }

      // -----------------------------------------------------
      // ARTICLE STRUCTURED DATA CHECKS
      // -----------------------------------------------------

      const isPublishedInsightArticle =
        publishedInsightRoutes.includes(path);

      if (isPublishedInsightArticle) {
        const jsonLdScripts = await page
          .locator('script[type="application/ld+json"]')
          .allTextContents();

        if (jsonLdScripts.length === 0) {
          structuredDataProblems.push({
            path,
            issue: "Missing Article JSON-LD",
          });
        } else {
          let articleJsonLd:
            | Record<string, unknown>
            | undefined;

          let sawInvalidJsonLd = false;

          for (const scriptContent of jsonLdScripts) {
            try {
              const parsed = JSON.parse(scriptContent);

              if (
                parsed &&
                typeof parsed === "object" &&
                parsed["@type"] === "Article"
              ) {
                articleJsonLd = parsed;
                break;
              }
            } catch {
              sawInvalidJsonLd = true;
            }
          }

          if (sawInvalidJsonLd) {
            structuredDataProblems.push({
              path,
              issue: "Invalid JSON-LD syntax",
            });
          }

          if (!articleJsonLd) {
            structuredDataProblems.push({
              path,
              issue: 'No JSON-LD object with @type "Article" found',
            });
          } else {
            const requiredFields = [
              "headline",
              "description",
              "datePublished",
              "dateModified",
              "author",
              "publisher",
              "mainEntityOfPage",
            ];

            for (const field of requiredFields) {
              if (!articleJsonLd[field]) {
                structuredDataProblems.push({
                  path,
                  issue: `Article JSON-LD missing required field: ${field}`,
                });
              }
            }

            const mainEntityOfPage =
              articleJsonLd.mainEntityOfPage as
                | Record<string, unknown>
                | undefined;

            if (
              !mainEntityOfPage ||
              mainEntityOfPage["@id"] !==
                `${PRODUCTION_URL}${path}`
            ) {
              structuredDataProblems.push({
                path,
                issue:
                  `Article JSON-LD mainEntityOfPage @id mismatch. ` +
                  `Expected ${PRODUCTION_URL}${path}`,
              });
            }

            const author =
              articleJsonLd.author as
                | Record<string, unknown>
                | undefined;

            if (
              !author ||
              !author["@type"] ||
              !author.name
            ) {
              structuredDataProblems.push({
                path,
                issue:
                  "Article JSON-LD author is missing @type or name",
              });
            }

            const publisher =
              articleJsonLd.publisher as
                | Record<string, unknown>
                | undefined;

            if (
              !publisher ||
              publisher["@type"] !== "Organization" ||
              !publisher.name
            ) {
              structuredDataProblems.push({
                path,
                issue:
                  "Article JSON-LD publisher must be an Organization with a name",
              });
            }
          }
        }
      }
    }

    // -------------------------------------------------------
    // DISCOVER INTERNAL LINKS
    // -------------------------------------------------------

    const hrefs = await page.locator("a[href]").evaluateAll((links) =>
      links
        .map((link) => link.getAttribute("href"))
        .filter((href): href is string => Boolean(href))
    );

    for (const href of hrefs) {
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:")
      ) {
        continue;
      }

      let url: URL;

      try {
        url = new URL(href, BASE_URL);
      } catch {
        continue;
      }

      if (url.origin !== BASE_URL) {
        continue;
      }

      url.hash = "";

      const target =
        url.pathname +
        (url.search ? url.search : "");

      if (isDocumentPath(url.pathname)) {
        continue;
      }

      if (!queued.has(target) && !visited.has(target)) {
        queued.add(target);

        queue.push({
          path: target,
          source: path,
        });
      }
    }
  }

  // ---------------------------------------------------------
  // REPORT
  // ---------------------------------------------------------

  console.log("\n");
  console.log("========================================");
  console.log("SAVARTUS WEBSITE QA REPORT");
  console.log("========================================");
  console.log(`Pages checked: ${visited.size}`);
  console.log(`Expected missing routes: ${expectedBroken.length}`);
  console.log(`Unexpected broken routes: ${unexpectedBroken.length}`);
  console.log(`SEO problems: ${seoProblems.length}`);
  console.log(
    `Structured data problems: ${structuredDataProblems.length}`
  );
  console.log(`Sitemap problems: ${sitemapProblems.length}`);
  console.log("");

  console.log("WORKING PAGES");
  console.log("----------------------------------------");

  for (const path of [...visited].sort()) {
    const expectedProblem = expectedBroken.find(
      (item) => item.target === path
    );

    const unexpectedProblem = unexpectedBroken.find(
      (item) => item.target === path
    );

    if (!expectedProblem && !unexpectedProblem) {
      console.log(`✓ ${path}`);
    }
  }

  if (expectedBroken.length > 0) {
    console.log("");
    console.log("EXPECTED / NOT YET BUILT");
    console.log("----------------------------------------");

    for (const problem of expectedBroken) {
      console.log(
        `○ ${problem.target}  [${problem.status}]  linked from ${problem.source}`
      );
    }
  }

  if (unexpectedBroken.length > 0) {
    console.log("");
    console.log("UNEXPECTED BROKEN LINKS");
    console.log("----------------------------------------");

    for (const problem of unexpectedBroken) {
      console.log(
        `✗ ${problem.target}  [${problem.status}]  linked from ${problem.source}`
      );
    }
  }

  if (seoProblems.length > 0) {
    console.log("");
    console.log("SEO PROBLEMS");
    console.log("----------------------------------------");

    for (const problem of seoProblems) {
      console.log(`✗ ${problem.path}: ${problem.issue}`);
    }
  }

  if (structuredDataProblems.length > 0) {
    console.log("");
    console.log("STRUCTURED DATA PROBLEMS");
    console.log("----------------------------------------");

    for (const problem of structuredDataProblems) {
      console.log(`✗ ${problem.path}: ${problem.issue}`);
    }
  }

  if (sitemapProblems.length > 0) {
    console.log("");
    console.log("SITEMAP PROBLEMS");
    console.log("----------------------------------------");

    for (const problem of sitemapProblems) {
      console.log(`✗ ${problem.path}: ${problem.issue}`);
    }
  }

  // ---------------------------------------------------------
  // ASSERTIONS
  // ---------------------------------------------------------

  expect(
    unexpectedBroken,
    `Found ${unexpectedBroken.length} unexpected broken internal page(s)`
  ).toEqual([]);

  expect(
    seoProblems,
    `Found ${seoProblems.length} SEO metadata problem(s)`
  ).toEqual([]);

  expect(
    structuredDataProblems,
    `Found ${structuredDataProblems.length} structured data problem(s)`
  ).toEqual([]);

  expect(
    sitemapProblems,
    `Found ${sitemapProblems.length} sitemap problem(s)`
  ).toEqual([]);
});