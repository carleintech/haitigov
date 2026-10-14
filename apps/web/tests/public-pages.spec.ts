import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { communePages } from "../app/_data/communes.js";
import { departmentPages } from "../app/_data/departments.js";

const routes = [
  "/institutions",
  "/fr/institutions",
  "/departments",
  "/fr/departements",
  "/communes",
  "/fr/communes",
  "/explore",
  "/fr/decouvrir",
  "/transparency",
  "/fr/transparence",
  "/news",
  "/fr/actualites",
  "/history",
  "/fr/histoire",
];

test("commune pagination exposes all 149 canonical IDs exactly once", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/fr/communes");
  const ids: string[] = [];
  const next = page.getByRole("button", { name: "Suivant", exact: true });
  for (let index = 0; index < 17; index += 1) {
    await expect(page.getByRole("status")).toHaveText(
      `149 / 149 communes · Page ${String(index + 1)} / 17`,
    );
    ids.push(
      ...(await page
        .locator(".hg-public-commune-card")
        .evaluateAll((cards) => cards.map((card) => card.querySelector("p")?.textContent ?? ""))),
    );
    if (index < 16) await next.click();
  }
  await expect(next).toBeDisabled();
  expect(ids).toEqual(communePages.map((commune) => commune.communeId));
  expect(new Set(ids).size).toBe(149);
  expect(errors).toEqual([]);
});

for (const locale of ["fr", "ht"] as const) {
  test(`${locale} commune search, parent filters, reset and language navigation`, async ({
    page,
  }) => {
    const french = locale === "fr";
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(french ? "/fr/communes" : "/communes");
    const cards = page.locator(".hg-public-commune-card");
    const search = page.getByRole("searchbox");
    const department = page.getByRole("combobox", {
      name: french ? "Département" : "Depatman",
      exact: true,
    });
    const arrondissement = page.getByRole("combobox", {
      name: french ? "Arrondissement" : "Awondisman",
      exact: true,
    });
    const reset = page.getByRole("button", {
      name: french ? "Réinitialiser" : "Reyinisyalize",
      exact: true,
    });
    const next = page.getByRole("button", { name: french ? "Suivant" : "Apre", exact: true });
    const status = page.getByRole("status");
    await expect(cards).toHaveCount(9);
    await expect(arrondissement.locator("option")).toHaveCount(43);
    await next.click();
    await expect(status).toContainText(french ? "Page 2 / 17" : "Paj 2 / 17");
    await search.fill("petion-ville");
    await expect(cards).toHaveCount(1);
    await expect(cards).toContainText("Pétion-Ville");
    await expect(cards).toContainText("HT-COM-006");
    await expect(status).toContainText(french ? "Page 1 / 1" : "Paj 1 / 1");
    await search.press("Enter");
    await expect(search).toHaveValue("petion-ville");
    await expect(cards.getByRole("link", { name: "Ouest", exact: true })).toHaveAttribute(
      "href",
      french ? "/fr/departements/ouest" : "/departments/ouest",
    );
    await expect(
      cards.getByRole("link", {
        name: french ? "Source IHSI pour Pétion-Ville" : "Sous IHSI pou Pétion-Ville",
      }),
    ).toHaveAttribute(
      "href",
      communePages.find((item) => item.communeId === "HT-COM-006")?.sourceUrl ?? "",
    );
    await search.fill("HT-COM-006");
    await expect(cards).toHaveCount(1);
    await reset.click();
    await next.click();
    await department.selectOption("HT-DEP-01");
    await expect(status).toContainText(
      french ? "20 / 149 communes · Page 1 / 3" : "20 / 149 komin · Paj 1 / 3",
    );
    await expect(arrondissement.locator("option")).toHaveCount(6);
    await arrondissement.selectOption("HT-ARR-001");
    await expect(cards).toHaveCount(8);
    await expect(status).toContainText(french ? "8 / 149 communes" : "8 / 149 komin");
    await department.selectOption("HT-DEP-02");
    await expect(arrondissement).toHaveValue("");
    await expect(arrondissement.locator("option[value='HT-ARR-001']")).toHaveCount(0);
    await expect(status).toContainText(
      french ? "10 / 149 communes · Page 1 / 2" : "10 / 149 komin · Paj 1 / 2",
    );
    await search.fill("no-match-fixture");
    await expect(cards).toHaveCount(0);
    await expect(
      page.getByText(french ? "Aucune commune trouvée." : "Pa gen komin ki koresponn.", {
        exact: false,
      }),
    ).toBeVisible();
    await reset.click();
    await expect(search).toHaveValue("");
    await expect(department).toHaveValue("");
    await expect(arrondissement).toHaveValue("");
    await expect(cards).toHaveCount(9);
    await expect(status).toContainText(french ? "Page 1 / 17" : "Paj 1 / 17");
    const switchLink = page
      .locator(".hg-portal-utility")
      .getByRole("link", { name: french ? "Kreyòl" : "Français", exact: true });
    await expect(switchLink).toHaveAttribute("href", french ? "/communes" : "/fr/communes");
    await switchLink.click();
    await expect(page.getByRole("main")).toHaveAttribute("lang", french ? "ht" : "fr");
    expect(errors).toEqual([]);
  });
}

for (const route of routes) {
  test(`${route} renders accessible artwork without mobile overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("main")).toHaveAttribute(
      "lang",
      route.startsWith("/fr/") ? "fr" : "ht",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const heroImage = page.locator(".hg-public-hero__art");
    await expect(heroImage).toBeVisible();
    await expect
      .poll(() =>
        heroImage.evaluate(
          (image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const department of departmentPages) {
  test(`${department.slug} preserves canonical facts and bilingual navigation`, async ({
    page,
  }) => {
    await page.goto(`/fr/departements/${department.slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(department.name);
    await expect(page.locator(".hg-public-facts")).toContainText(department.departmentId);
    await expect(page.locator(".hg-department-communes li")).toHaveCount(department.communeCount);
    await expect(
      page.locator(".hg-portal-utility").getByRole("link", { name: "Kreyòl" }),
    ).toHaveAttribute("href", `/departments/${department.slug}`);
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}

test("department search, selection, and unknown routes", async ({ page }) => {
  await page.goto("/fr/departements");
  await page.getByRole("searchbox").fill("jeremie");
  await expect(page.locator(".hg-public-department-card")).toHaveCount(1);
  await expect(page.locator(".hg-public-department-card")).toContainText("Grande-Anse");
  await page
    .getByRole("navigation", { name: "Choisir un département" })
    .getByRole("button", { name: "Nippes" })
    .click();
  await expect(page.locator(".hg-public-selected")).toContainText("Miragoâne");
  await expect(page.locator(".hg-public-selected a")).toHaveAttribute(
    "href",
    "/fr/departements/nippes",
  );
  const response = await page.goto("/fr/departements/not-a-department");
  expect(response?.status()).toBe(404);
});

test("department communes can be scrolled with the keyboard", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/fr/departements/ouest");
  const communes = page.locator(".hg-department-communes-scroll");
  await communes.focus();
  await expect(communes).toBeFocused();
  await page.keyboard.press("End");
  await expect.poll(() => communes.evaluate((region) => region.scrollTop)).toBeGreaterThan(0);
});

test("Explore search and transparency category selection", async ({ page }) => {
  await page.goto("/fr/decouvrir");
  await page.getByRole("searchbox").fill("Jacmel");
  await expect(
    page.locator("#explore-heading").locator("..").locator("..").getByRole("article"),
  ).toHaveCount(1);
  await expect(
    page.getByRole("main").getByRole("link", { name: "Découvrir le Sud-Est" }),
  ).toHaveAttribute("href", "/fr/departements/sud-est");
  await page.goto("/fr/transparence");
  await page.getByRole("searchbox").fill("Budgets");
  await page.getByRole("button", { name: "Voir les ressources" }).click();
  await expect(page.locator("[aria-live=polite]")).toContainText("Budgets & finances");
  await page.getByRole("searchbox").fill("no-match-fixture");
  await expect(page.getByText("Aucune catégorie trouvée.")).toBeVisible();
});
