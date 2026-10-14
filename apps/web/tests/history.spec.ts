import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const historyPages = [
  {
    path: "/history",
    locale: "ht",
    heading: "Istwa Ayiti",
    independence: "Endepandans",
    faq: "Èske Ayiti te gen ekipman militè?",
    otherLanguage: "Français",
    languagePath: "/fr/histoire",
    latestDate: "14 jiyè 2026",
    navigationLabel: "Navigasyon prensipal",
  },
  {
    path: "/fr/histoire",
    locale: "fr",
    heading: "Histoire d’Haïti",
    independence: "Indépendance",
    faq: "Haïti a-t-il déjà eu du matériel militaire?",
    otherLanguage: "Kreyòl",
    languagePath: "/history",
    latestDate: "14 juillet 2026",
    navigationLabel: "Navigation principale",
  },
] as const;

for (const historyPage of historyPages) {
  test(`${historyPage.locale} history page is bilingual, sourced, and bookmarkable`, async ({
    page,
  }) => {
    await page.goto(historyPage.path);
    const main = page.getByRole("main");
    await expect(main).toHaveAttribute("lang", historyPage.locale);
    await expect(main.getByRole("heading", { level: 1, name: historyPage.heading })).toBeVisible();
    const independence = main.getByRole("heading", { name: historyPage.independence });
    await independence.scrollIntoViewIfNeeded();
    await expect(independence).toBeVisible();
    await expect(page.getByRole("navigation", { name: historyPage.navigationLabel })).toBeVisible();
    await expect(main.locator("#chronology")).toBeVisible();
    await expect(main.locator("#figures")).toBeVisible();
    await expect(main.locator("#questions")).toBeVisible();
    await expect(main.getByText(historyPage.faq, { exact: true })).toBeVisible();
    await expect(main.locator("#source-taino a")).toHaveAttribute("href", /smithsonianmag\.com/);
    await main.getByText("2024", { exact: true }).scrollIntoViewIfNeeded();
    await expect(main.getByText("2024", { exact: true })).toBeVisible();
    await main.getByText(historyPage.latestDate, { exact: true }).scrollIntoViewIfNeeded();
    await expect(main.getByText(historyPage.latestDate, { exact: true })).toBeVisible();
    await expect(
      page.locator(".hg-portal-utility nav").getByRole("link", { name: historyPage.otherLanguage }),
    ).toHaveAttribute("href", historyPage.languagePath);
    await expect(main).toContainText(
      historyPage.locale === "ht"
        ? "yo pa nesesèman dekri sitiyasyon jodi a"
        : "elles ne décrivent pas nécessairement la situation actuelle",
    );

    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}
