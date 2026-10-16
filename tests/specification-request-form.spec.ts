import { expect, test, type Page } from "@playwright/test";

async function fillRequest(page: Page, path = "/resources/dlm-specification") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Full Document", exact: true }).first().click();
  const form = page.locator(".full-document-form").first();
  await form.getByLabel("Name", { exact: true }).fill("Alex Example");
  await form.getByLabel("Employer / Institution").fill("Example Company");
  await form.getByLabel("Title", { exact: true }).fill("IT Director");
  await form.getByLabel("Email", { exact: true }).fill("alex@example.com");
  return form;
}

for (const path of ["/resources/dlm-specification", "/company"]) {
  test(`submits a request and shows confirmation without opening email on ${path}`, async ({ page }) => {
    let submissions = 0;
    await page.route("**/api/specification-requests", async (route) => {
      submissions += 1;
      const body = route.request().postDataJSON();
      expect(body).toMatchObject({
        name: "Alex Example", organization: "Example Company",
        title: "IT Director", email: "alex@example.com", website: "",
      });
      expect(body.source).toBeTruthy();
      await route.fulfill({ status: 202, json: { success: true } });
    });
    const form = await fillRequest(page, path);
    await form.getByRole("button", { name: "Request Link", exact: true }).click();
    await expect(page.getByRole("status")).toContainText("Your download email is on its way");
    expect(submissions).toBe(1);
    await expect(form).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`${path}$`));
  });
}

test("shows server errors, keeps entered fields, and permits retry", async ({ page }) => {
  let submissions = 0;
  await page.route("**/api/specification-requests", async (route) => {
    submissions += 1;
    await route.fulfill(submissions === 1
      ? { status: 503, json: { error: "Email temporarily unavailable. Please try again." } }
      : { status: 202, json: { success: true } });
  });
  const form = await fillRequest(page);
  await form.getByRole("button", { name: "Request Link", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("Email temporarily unavailable");
  await expect(form.getByLabel("Email", { exact: true })).toHaveValue("alex@example.com");
  await expect(page.getByRole("status")).toHaveCount(0);
  await form.getByRole("button", { name: "Request Link", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Your download email is on its way");
});

test("prevents duplicate submissions while sending", async ({ page }) => {
  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => { release = resolve; });
  let submissions = 0;
  await page.route("**/api/specification-requests", async (route) => {
    submissions += 1;
    await gate;
    await route.fulfill({ status: 202, json: { success: true } });
  });
  const form = await fillRequest(page);
  await form.getByRole("button", { name: "Request Link", exact: true }).click();
  await expect(form.getByRole("button", { name: "Sending..." })).toBeDisabled();
  await expect(form.getByRole("button", { name: "Cancel", exact: true })).toBeDisabled();
  await form.evaluate((element) => {
    element.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  release();
  await expect(page.getByRole("status")).toBeVisible();
  expect(submissions).toBe(1);
});

test("shows a failure rather than confirmation for a network error", async ({ page }) => {
  await page.route("**/api/specification-requests", (route) => route.abort("failed"));
  const form = await fillRequest(page);
  await form.getByRole("button", { name: "Request Link", exact: true }).click();
  await expect(form.getByRole("alert")).toContainText("We couldn't confirm your request");
  await expect(page.getByRole("status")).toHaveCount(0);
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`document panel form uses the full width below the overview at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/resources/dlm-specification", { waitUntil: "domcontentloaded" });
    const panel = page.locator(".dlmspec-download-panel");
    await panel.getByRole("button", { name: "Full Document", exact: true }).click();
    const form = panel.locator(".full-document-form");
    await expect(form).toBeVisible();

    const layout = await panel.evaluate((element) => {
      const copy = element.querySelector(".dlmspec-download-copy")!;
      const actions = element.querySelector(".dlmspec-download-actions")!;
      const request = element.querySelector(".full-document-request")!;
      const inputs = [...element.querySelectorAll<HTMLInputElement>('input:not([name="website"])')];
      const rect = (item: Element) => {
        const { x, y, width, bottom } = item.getBoundingClientRect();
        return { x, y, width, bottom };
      };
      return {
        copy: rect(copy),
        actions: rect(actions),
        request: rect(request),
        inputs: inputs.map(rect),
        borders: inputs.map((input) => getComputedStyle(input).borderTopWidth),
        overflows: document.documentElement.scrollWidth > window.innerWidth,
      };
    });

    expect(layout.request.y).toBeGreaterThanOrEqual(Math.max(layout.copy.bottom, layout.actions.bottom));
    expect(layout.request.x).toBeCloseTo(layout.copy.x, 0);
    expect(layout.request.width).toBeGreaterThanOrEqual(layout.copy.width);
    expect(layout.borders).toEqual(["1px", "1px", "1px", "1px"]);
    expect(layout.overflows).toBe(false);

    if (viewport.width > 700) {
      expect(layout.request.width).toBeGreaterThan(1000);
      expect(layout.inputs[0].width).toBeGreaterThan(450);
      expect(layout.inputs[0].y).toBeCloseTo(layout.inputs[1].y, 0);
      expect(layout.inputs[2].y).toBeCloseTo(layout.inputs[3].y, 0);
    } else {
      expect(layout.inputs[0].width).toBeGreaterThan(240);
      for (let index = 1; index < layout.inputs.length; index += 1) {
        expect(layout.inputs[index].y).toBeGreaterThan(layout.inputs[index - 1].bottom);
      }
    }

    await form.getByLabel("Name", { exact: true }).fill("Alex Example");
    await expect(form.getByLabel("Name", { exact: true })).toHaveValue("Alex Example");
    await form.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(form).toHaveCount(0);
  });
}
