import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/",
  "/communes",
  "/departments",
  "/documents",
  "/fr",
  "/fr/actualites",
  "/fr/communes",
  "/fr/departements",
  "/fr/documents",
  "/fr/institutions",
  "/fr/institutions/HT-ACCESSIBILITY-TEST",
  "/fr/ministeres",
  "/fr/recherche",
  "/fr/services",
  "/fr/transparence",
  "/institutions",
  "/institutions/HT-ACCESSIBILITY-TEST",
  "/ministries",
  "/news",
  "/search",
  "/services",
  "/transparency",
] as const;

for (const route of publicRoutes) {
  test(`${route} has no automatically detectable WCAG A or AA violations`, async ({ page }) => {
    await page.goto(route);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
}

test("home intro plays once per session and can be skipped", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const intro = page.getByRole("dialog", { name: "HaitiGov — pòtal piblik pwopoze" });
  const skipButton = page.getByRole("button", { name: "Sote entwodiksyon an" });

  await expect(intro).toBeVisible();
  await expect(page.locator(".hg-home-intro__logo")).toHaveAttribute(
    "src",
    /\/haitigov-intro-logo\.png$/,
  );
  await expect(skipButton).toBeFocused();
  await expect(page.locator("video, audio")).toHaveCount(0);

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  await skipButton.click();
  await expect(intro).toBeHidden();

  await page.reload();
  await expect(intro).toBeHidden();
  await expect(page.locator(".hg-home-intro__logo")).toHaveCount(0);
});

test("home intro has a six-second cinematic timeline and dissolves into the homepage", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const intro = page.getByRole("dialog");
  await expect(intro).toBeVisible();
  const timeline = await intro.evaluate((element) => {
    const animation = element.getAnimations()[0];
    if (!animation?.effect) {
      throw new Error("The cinematic timeline is missing.");
    }
    return animation.effect.getTiming().duration;
  });
  expect(timeline).toBe(6000);
  await expect(intro).toBeHidden({ timeout: 8000 });
  await expect(
    page.getByRole("heading", { name: "HaitiGov", exact: true, level: 1 }),
  ).toBeVisible();
  await page.reload();
  await expect(intro).toHaveCount(0);
});

test("home intro can be dismissed with Escape", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 844, height: 390 },
]) {
  test(`home intro keeps its signature and controls separate at ${viewport.width.toString()}x${viewport.height.toString()}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.getByRole("dialog")).toBeVisible();
    const signature = await page.locator(".hg-home-intro__signature").boundingBox();
    const notice = await page.locator(".hg-home-intro__notice").boundingBox();
    const skip = await page.getByRole("button", { name: "Sote entwodiksyon an" }).boundingBox();
    if (!signature || !notice || !skip) {
      throw new Error("The intro signature or controls are missing.");
    }
    expect(signature.y + signature.height).toBeLessThan(notice.y);
    expect(notice.y + notice.height).toBeLessThan(skip.y);
    expect(skip.y + skip.height).toBeLessThanOrEqual(viewport.height);
    await page.getByRole("button", { name: "Sote entwodiksyon an" }).click();
  });
}

test("home intro responds to a changed reduced-motion preference", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("home intro leaves the homepage usable if the logo fails to load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/haitigov-intro-logo.png", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "HaitiGov", exact: true, level: 1 }),
  ).toBeVisible();
});

test("home intro does not play when reduced motion is preferred", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("unknown routes provide an accessible recovery path", async ({ page }) => {
  const response = await page.goto("/route-that-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Nou pa jwenn paj sa a." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Retounen sou paj dakèy" })).toHaveAttribute(
    "href",
    "/",
  );
});

test("unknown French routes provide a localized recovery path", async ({ page }) => {
  const response = await page.goto("/fr/route-inconnue");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Cette page est introuvable." })).toBeVisible();
  await expect(page.getByRole("link", { name: "Retour à l’accueil en français" })).toHaveAttribute(
    "href",
    "/fr",
  );
});
