import { AxeBuilder } from "@axe-core/playwright";
import { test as base, expect } from "@playwright/test";

const test = base.extend<{ runtimeErrors: undefined }>({
  runtimeErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await use(undefined);
      expect(errors, "Public pages must not produce hydration or runtime errors").toEqual([]);
    },
    { auto: true },
  ],
});

for (const locale of ["fr", "ht"] as const) {
  const french = locale === "fr";
  const directory = french ? "/fr/institutions" : "/institutions";
  const news = french ? "/fr/actualites" : "/news";
  const next = french ? "Suivant" : "Apre";
  const previous = french ? "Précédent" : "Anvan";
  const prefix = `Fixture ${locale.toUpperCase()}`;

  test(`${locale}: institution pagination and localized sorting`, async ({ page }) => {
    await page.goto(directory);
    const cards = page.locator("article.hg-public-card");
    const pagination = page.getByRole("navigation", {
      name: french ? "Pagination des institutions" : "Paj enstitisyon yo",
    });
    await expect(cards).toHaveCount(9);
    await expect(cards.first().getByRole("heading")).toHaveText(`${prefix} 01`);
    await expect(cards.first()).toContainText(french ? "HT-TEST-01" : "HT-TEST-12");
    await expect(pagination.getByRole("button", { name: previous, exact: true })).toBeDisabled();
    await pagination.getByRole("button", { name: next, exact: true }).click();
    await expect(cards).toHaveCount(3);
    await expect(cards.first().getByRole("heading")).toHaveText(`${prefix} 10`);
    await expect(pagination.getByRole("button", { name: next, exact: true })).toBeDisabled();
    await pagination.getByRole("button", { name: previous, exact: true }).click();
    await expect(cards).toHaveCount(9);
    await pagination.getByRole("button", { name: next, exact: true }).click();
    await page.getByLabel(french ? "Trier par nom" : "Triye pa non").selectOption("desc");
    await expect(pagination).toContainText("1 / 2");
    await expect(cards).toHaveCount(9);
    await expect(cards.first().getByRole("heading")).toHaveText(`${prefix} 12`);
  });

  test(`${locale}: institution filters, category synchronization and reset`, async ({ page }) => {
    await page.goto(directory);
    const cards = page.locator("article.hg-public-card");
    const type = page.getByRole("combobox", {
      name: french ? "Type d’institution" : "Kalite enstitisyon",
      exact: true,
    });
    const branch = page.getByRole("combobox", { name: french ? "Branche" : "Branch", exact: true });
    const verification = page.getByRole("combobox", {
      name: french ? "Vérification" : "Verifikasyon",
      exact: true,
    });
    await page.getByRole("button", { name: next, exact: true }).click();
    await branch.selectOption("INDEPENDENT");
    await expect(cards).toHaveCount(3);
    await verification.selectOption("VERIFIED_LEGACY");
    await expect(cards).toHaveCount(3);
    await page
      .getByRole("button", { name: french ? "Ministères" : "Ministè", exact: true })
      .click();
    await expect(type).toHaveValue("MINISTRY");
    await expect(cards).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText("0 ");
    await expect(
      page.getByText(
        french
          ? "Aucune institution publique vérifiée ne correspond à cette recherche."
          : "Pa gen enstitisyon piblik verifye ki koresponn ak rechèch sa a.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.getByLabel(french ? "Trier par nom" : "Triye pa non").selectOption("desc");
    await page
      .getByRole("button", {
        name: french ? "Réinitialiser les filtres" : "Reyinisyalize filtè yo",
      })
      .click();
    await expect(type).toHaveValue("");
    await expect(branch).toHaveValue("");
    await expect(verification).toHaveValue("");
    await expect(cards).toHaveCount(9);
    await expect(cards.first().getByRole("heading")).toHaveText(`${prefix} 01`);
    await type.selectOption("PUBLIC_ENTERPRISE");
    await expect(cards).toHaveCount(2);
    await expect(
      page.getByRole("button", {
        name: french ? "Entreprises publiques" : "Antrepriz piblik",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "true");
    await type.selectOption("");
    await verification.selectOption("VERIFIED_CURRENT");
    await expect(cards).toHaveCount(9);
    await expect(page.getByRole("status")).toContainText("9 ");
    await verification.selectOption("VERIFIED_LEGACY");
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toContainText(
      french ? "Fiche historique vérifiée" : "Fich eritaj verifye",
    );
  });

  test(`${locale}: institution search, empty, partial and outage responses`, async ({ page }) => {
    await page.goto(directory);
    await page
      .getByRole("searchbox", {
        name: french ? "Rechercher une institution" : "Chèche yon enstitisyon",
      })
      .fill("HT-TEST-02");
    await page.getByRole("button", { name: french ? "Rechercher" : "Chèche", exact: true }).click();
    await expect(page).toHaveURL(`${directory}?q=HT-TEST-02`);
    await expect(page.locator("article.hg-public-card")).toHaveCount(1);
    await expect(page.locator("article.hg-public-card")).toContainText("HT-TEST-02");
    await page.goto(`${directory}?q=no-match`);
    await expect(page.getByRole("status")).toContainText("0 ");
    await expect(page.locator("article.hg-public-card")).toHaveCount(0);
    await page.goto(`${directory}?q=partial`);
    await expect(page.getByText(french ? /Résultats partiels/ : /Rezilta pasyèl/)).toBeVisible();
    await page.goto(`${directory}?q=unavailable`);
    await expect(page.getByRole("status")).toContainText(french ? /indisponible/ : /pa disponib/);
    await expect(page.locator("article.hg-public-card")).toHaveCount(0);
  });

  test(`${locale}: news pagination, chronology and sorting reset`, async ({ page }) => {
    await page.goto(news);
    const headings = page.locator(".hg-web-home__cards h3");
    const pagination = page.getByRole("navigation", {
      name: french ? "Pagination des annonces" : "Paj anons yo",
    });
    await expect(headings).toHaveCount(6);
    await expect(headings.first()).toHaveText(`${prefix} announcement 08`);
    await expect(pagination.getByRole("button", { name: previous, exact: true })).toBeDisabled();
    await pagination.getByRole("button", { name: next, exact: true }).click();
    await expect(headings).toHaveText([`${prefix} announcement 02`, `${prefix} announcement 01`]);
    await expect(pagination.getByRole("button", { name: next, exact: true })).toBeDisabled();
    await pagination.getByRole("button", { name: previous, exact: true }).click();
    await expect(headings).toHaveCount(6);
    await pagination.getByRole("button", { name: next, exact: true }).click();
    await page
      .getByRole("combobox", { name: french ? "Ordre" : "Lòd", exact: true })
      .selectOption("oldest");
    await expect(pagination).toContainText("1 / 2");
    await expect(headings.first()).toHaveText(`${prefix} announcement 01`);
    await pagination.getByRole("button", { name: next, exact: true }).click();
    await expect(headings).toHaveText([`${prefix} announcement 07`, `${prefix} announcement 08`]);
  });

  test(`${locale}: news source, Haiti-local date boundary, empty and reset`, async ({ page }) => {
    await page.goto(news);
    const headings = page.locator(".hg-web-home__cards h3");
    const source = page.getByRole("combobox", {
      name: french ? "Institution source" : "Enstitisyon sous",
    });
    const since = page.getByLabel(french ? "Publiées depuis" : "Pibliye depi");
    await page.getByRole("button", { name: next, exact: true }).click();
    await source.selectOption("Development fixture Alpha");
    await expect(headings).toHaveText(
      [8, 6, 4, 2].map((index) => `${prefix} announcement 0${String(index)}`),
    );
    await source.selectOption("");
    await page.getByRole("button", { name: next, exact: true }).click();
    await since.fill("2026-10-14");
    await expect(headings).toHaveText([`${prefix} announcement 08`]);
    await since.fill("2026-10-13");
    await expect(headings).toHaveText([`${prefix} announcement 08`, `${prefix} announcement 07`]);
    await expect(page.locator(".hg-web-home__cards time")).toHaveText(
      french ? ["14 octobre 2026", "13 octobre 2026"] : ["14 oktòb 2026", "13 oktòb 2026"],
    );
    await source.selectOption("Development fixture Beta");
    await expect(headings).toHaveText([`${prefix} announcement 07`]);
    await since.fill("2026-10-15");
    await expect(headings).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText("0 ");
    await expect(
      page.getByText(
        french
          ? "Aucune annonce publique vérifiée n’est disponible pour le moment."
          : "Pa gen anons piblik verifye pou moman an.",
        { exact: true },
      ),
    ).toBeVisible();
    await page
      .getByRole("combobox", { name: french ? "Ordre" : "Lòd", exact: true })
      .selectOption("oldest");
    await page
      .getByRole("button", { name: french ? "Réinitialiser" : "Reyinisyalize", exact: true })
      .click();
    await expect(source).toHaveValue("");
    await expect(since).toHaveValue("");
    await expect(
      page.getByRole("combobox", { name: french ? "Ordre" : "Lòd", exact: true }),
    ).toHaveValue("recent");
    await expect(headings).toHaveCount(6);
    await expect(headings.first()).toHaveText(`${prefix} announcement 08`);
  });

  test(`${locale}: news search, empty, partial and outage responses`, async ({ page }) => {
    await page.goto(news);
    await page
      .getByRole("searchbox", {
        name: french ? "Rechercher des annonces" : "Chèche anons",
        exact: true,
      })
      .fill("announcement 03");
    await page.getByRole("button", { name: french ? "Rechercher" : "Chèche", exact: true }).click();
    await expect(page).toHaveURL(`${news}?q=announcement+03`);
    await expect(page.locator(".hg-web-home__cards h3")).toHaveText([`${prefix} announcement 03`]);
    await page.goto(`${news}?q=no-match`);
    await expect(page.getByRole("status")).toContainText("0 ");
    await expect(page.locator(".hg-web-home__cards h3")).toHaveCount(0);
    await page.goto(`${news}?q=partial`);
    await expect(
      page.getByText(
        french
          ? "D’autres annonces existent. Précisez votre recherche."
          : "Gen lòt anons. Presize rechèch la pou jwenn sa ou bezwen an.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.goto(`${news}?q=unavailable`);
    await expect(page.getByRole("status")).toContainText(french ? /indisponible/ : /pa disponib/);
    await expect(page.locator(".hg-web-home__cards h3")).toHaveCount(0);
  });

  test(`${locale}: populated mobile pages retain accessible, non-overflowing layouts`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const route of [directory, news]) {
      await page.goto(route);
      await expect(page.getByRole("status")).toContainText(route === directory ? "12 " : "8 ");
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
        .toBe(true);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    }
  });
}
