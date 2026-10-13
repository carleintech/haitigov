import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of ["ht", "fr"] as const) {
  const path = locale === "ht" ? "/services" : "/fr/services";
  const searchTerm = locale === "ht" ? "paspò" : "passeport";

  test(`${locale} service catalogue presents verified-search safeguards and localized topics`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(page.locator(".hg-portal")).toHaveAttribute("lang", locale);
    await expect(page.locator("main").getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".hg-portal-desktop-nav a[aria-current='page']")).toHaveAttribute(
      "href",
      path,
    );
    await expect(page.getByRole("searchbox")).toHaveAttribute("maxlength", "100");
    await expect(page.locator("#service-themes")).toContainText(
      locale === "ht"
        ? "Yo pa konfime okenn sèvis disponib"
        : "Ils ne confirment ni la disponibilité d’un service",
    );
    await expect(page.locator(".hg-portal-notice")).toContainText(
      locale === "ht" ? "pwototip TechKlein" : "prototype TechKlein",
    );
    await expect(page.locator("#service-themes .hg-portal-service")).toHaveCount(8);
    await expect(page.locator("#service-themes .hg-portal-service").nth(1)).toHaveAttribute(
      "href",
      `${path}?q=${encodeURIComponent(locale === "ht" ? "paspò" : "passeport")}`,
    );
    await expect(page.locator("#catalogue-results")).toContainText(
      locale === "ht" ? "Rezilta nan katalòg sèvis la" : "Résultats dans le catalogue",
    );

    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });

  test(`${locale} service catalogue search and mobile navigation use localized routes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);

    const menu = page.locator(".hg-portal-mobile-nav");
    await menu.locator("summary").click();
    await expect(
      menu.getByRole("link", { name: locale === "ht" ? "Sèvis" : "Services" }),
    ).toBeVisible();

    const search = page.getByRole("searchbox");
    await search.fill(searchTerm);
    await search.press("Enter");
    await expect(page).toHaveURL(
      (url) => url.pathname === path && url.searchParams.get("q") === searchTerm,
    );
    await expect(page.getByRole("searchbox")).toHaveValue(searchTerm);
  });
}
