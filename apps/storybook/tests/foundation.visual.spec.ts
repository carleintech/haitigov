import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the complete design foundation", async ({ page }) => {
  await page.goto("/iframe.html?id=foundation-design-tokens--foundation&viewMode=story");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Fondasyon dijital ki aksesib epi konsistan",
  );

  const accessibilityResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(accessibilityResults.violations).toEqual([]);
  await expect(page).toHaveScreenshot("design-foundation.png", {
    fullPage: true,
  });
});
