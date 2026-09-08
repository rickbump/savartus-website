import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

type LinkProblem = {
  source: string;
  target: string;
  status: number | string;
};

const expectedMissingRoutes = new Set([
  "/insights",
  "/resources",
  "/company",
  "/contact",
  "/active-archive/service",
  "/technology/orain",
  "/products/file-management",
  "/resources/dlm-specification",

  "/products/els100",
  "/products/els150",
  "/products/els300",
  "/products/els500",
  "/products/els1000",
  "/products/els3600",
  "/products/els4000",
  "/products/els8000",
  "/products/els10k",
  "/products/els8000-ol",
  "/products/els10k-ol",
]);

test("crawl Savartus website and find broken internal links", async ({
  page,
}) => {
  test.setTimeout(120_000);

  const visited = new Set<string>();

  const queue: Array<{
    path: string;
    source: string;
  }> = [
    {
      path: "/",
      source: "START",
    },
  ];

  const queued = new Set<string>(["/"]);

  const unexpectedBroken: LinkProblem[] = [];
  const expectedBroken: LinkProblem[] = [];

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

      if (!queued.has(target) && !visited.has(target)) {
        queued.add(target);

        queue.push({
          path: target,
          source: path,
        });
      }
    }
  }

  console.log("\n");
  console.log("========================================");
  console.log("SAVARTUS WEBSITE LINK REPORT");
  console.log("========================================");
  console.log(`Pages checked: ${visited.size}`);
  console.log(`Expected missing routes: ${expectedBroken.length}`);
  console.log(`Unexpected broken routes: ${unexpectedBroken.length}`);
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

  expect(
    unexpectedBroken,
    `Found ${unexpectedBroken.length} unexpected broken internal page(s)`
  ).toEqual([]);
});