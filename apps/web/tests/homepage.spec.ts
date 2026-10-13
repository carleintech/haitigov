import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const locale of ["ht", "fr"] as const) {
  const path = locale === "ht" ? "/" : "/fr";

  test(`${locale} homepage search and category links use localized routes`, async ({ page }) => {
    await page.goto(path);
    const search = page.locator("main").getByRole("searchbox");
    await expect(search).toHaveAttribute("maxlength", "100");
    await search.fill(locale === "ht" ? "paspò" : "passeport");
    await search.press("Enter");
    await expect(page).toHaveURL(
      locale === "ht" ? /\/search\?q=pasp%C3%B2$/ : /\/fr\/recherche\?q=passeport$/,
    );
    await page.goto(path);
    await page.locator(".hg-portal-service").nth(1).click();
    await expect(page).toHaveURL(
      locale === "ht" ? /\/services\?q=pasp%C3%B2$/ : /\/fr\/services\?q=passeport$/,
    );
  });

  test(`${locale} department selector uses registry counts`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator(".hg-portal").first()).toHaveAttribute("lang", locale);
    const explorer = page.locator(".hg-portal-department");
    await expect(explorer.getByRole("heading", { name: "Nord", exact: true })).toBeVisible();
    await expect(explorer.locator("option")).toHaveCount(10);
    await explorer.getByRole("combobox").selectOption("HT-DEP-10");
    await expect(explorer.getByRole("heading", { name: "Nippes", exact: true })).toBeVisible();
    await expect(explorer).toContainText("Miragoâne");
    await expect(explorer.locator("dd")).toHaveText(["11", "3", "37"]);
    await expect(page.locator(".hg-portal-stats dd")).toHaveText(["10", "149", "42", "574"]);
  });

  test(`${locale} homepage links target existing anchors and supported public routes`, async ({
    page,
  }) => {
    await page.goto(path);
    const invalidLinks = await page.locator(".hg-portal").evaluate((portal) => {
      const supported = new Set([
        "/",
        "/fr",
        "/services",
        "/institutions",
        "/ministries",
        "/departments",
        "/communes",
        "/history",
        "/search",
        "/news",
        "/documents",
        "/transparency",
        "/fr/services",
        "/fr/institutions",
        "/fr/ministeres",
        "/fr/departements",
        "/fr/communes",
        "/fr/histoire",
        "/fr/recherche",
        "/fr/actualites",
        "/fr/documents",
        "/fr/transparence",
      ]);
      return [...portal.querySelectorAll("a")].flatMap((link) => {
        const href = link.getAttribute("href");
        if (!href) return ["Missing href"];
        if (href.startsWith("#")) return document.getElementById(href.slice(1)) ? [] : [href];
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) return [];
        if (supported.has(url.pathname) || /^\/(?:fr\/)?institutions\/HT-/.test(url.pathname))
          return [];
        return [href];
      });
    });
    expect(invalidLinks).toEqual([]);
    await expect(page.locator("#mon-haiti")).toContainText(
      locale === "ht" ? "okenn dosye pèsonèl pa konekte" : "aucun dossier personnel n’est connecté",
    );
    await expect(page.getByRole("button", { name: /Se connecter|Créer un compte/ })).toHaveCount(0);
  });
}

for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
  test(`homepage reflows and navigation works at ${width.toString()}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    const searchBounds = await page.locator(".hg-portal-search input").boundingBox();
    expect(searchBounds).not.toBeNull();
    expect(searchBounds?.height).toBeLessThanOrEqual(64);
    if (width < 1200) {
      await page.getByText("Meni", { exact: true }).click();
      const menu = page.locator(".hg-portal-mobile-nav");
      await expect(menu.getByRole("link", { name: "Sèvis", exact: true })).toBeVisible();
      await menu.getByRole("link", { name: "Sèvis", exact: true }).click();
      await expect(page).toHaveURL(/\/services$/);
      await page.goto("/");
    }
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}

for (const locale of ["ht", "fr"] as const) {
  test(`${locale} hero gradient is isolated, seamless and keyboard pausable`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.addInitScript(() => {
      sessionStorage.setItem("haitigov.home-intro.seen.v1", "true");
    });
    await page.goto(locale === "ht" ? "/" : "/fr");
    const title = page.locator(".hg-portal-hero-title");
    await expect(title).toHaveCSS("animation-name", "hg-portal-title-flow");
    await expect(title).toHaveCSS("animation-duration", "8s");
    await expect(title).toHaveCSS("animation-timing-function", "linear");
    await expect(title).toHaveCSS("animation-iteration-count", "infinite");
    await expect(page.locator(".hg-portal-hero .hg-portal-kicker")).toHaveCSS(
      "animation-name",
      "none",
    );
    await expect(page.locator(".hg-portal-brand").first()).toHaveCSS("animation-name", "none");
    const loop = await title.evaluate((element) => {
      const animation = element.getAnimations()[0];
      if (!animation) throw new Error("Hero animation is missing");
      const originalTime = animation.currentTime;
      const positions = [0, 4000, 7999, 8000].map((time) => {
        animation.currentTime = time;
        return getComputedStyle(element).backgroundPositionX;
      });
      animation.currentTime = originalTime;
      const image = getComputedStyle(element).backgroundImage;
      return { positions, image };
    });
    expect(loop.positions[0]).toBe(loop.positions[3]);
    expect(loop.positions[0]).not.toBe(loop.positions[1]);
    expect(loop.image).toContain("50%");
    const stops = Array.from(
      loop.image.matchAll(/(color\([^)]*\)|rgba?\([^)]*\)|#[a-f\d]+)\s+(\d+)%/g),
      ([, color, position]) => ({ color, position: Number(position) }),
    );
    expect(stops).toHaveLength(11);
    expect(stops.slice(0, 6)).toEqual(
      stops.slice(5).map(({ color, position }) => ({ color, position: position - 50 })),
    );
    const pause = page.getByRole("checkbox", {
      name: locale === "ht" ? "Kanpe efè vizyèl yo" : "Mettre les effets visuels en pause",
    });
    await pause.focus();
    await pause.press("Space");
    await expect(pause).toBeChecked();
    await expect(title).toHaveCSS("animation-play-state", "paused");
    const pausedPosition = await title.evaluate((el) => getComputedStyle(el).backgroundPositionX);
    await page.waitForTimeout(300);
    expect(await title.evaluate((el) => getComputedStyle(el).backgroundPositionX)).toBe(
      pausedPosition,
    );
    await pause.press("Space");
    await expect(title).toHaveCSS("animation-play-state", "running");
  });

  test(`${locale} reduced motion and forced colors keep a readable static title`, async ({
    page,
  }) => {
    await page.goto(locale === "ht" ? "/" : "/fr");
    const title = page.locator(".hg-portal-hero-title");
    await expect(title).toHaveCSS("animation-name", "none");
    await expect(title).toHaveCSS("background-clip", "text");
    await expect(page.locator(".hg-portal-motion-control")).toBeHidden();
    const minimumContrast = await title.evaluate((element) => {
      const style = getComputedStyle(element);
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Contrast sampling needs a canvas context");
      const gradient = ctx.createLinearGradient(0, 0, 256, 0);
      for (const [stop, name] of [
        [0, "--portal-title-blue"],
        [0.36, "--portal-title-royal"],
        [0.48, "sheen"],
        [0.56, "--portal-title-red"],
        [0.8, "--portal-title-deep-red"],
        [1, "--portal-title-blue"],
      ] as const) {
        gradient.addColorStop(
          stop,
          name === "sheen" ? "#eff5ff" : style.getPropertyValue(name).trim(),
        );
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 1);
      const pixels = ctx.getImageData(0, 0, 256, 1).data;
      const luminance = (red: number, green: number, blue: number) => {
        const linear = (value: number) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
      };
      // The brightest possible white image under the weakest overlay behind the title.
      const background = luminance(41, 55, 76);
      let minimum = Number.POSITIVE_INFINITY;
      for (const [index, red] of pixels.entries()) {
        if (index % 4 !== 0) continue;
        const [, green, blue] = pixels.slice(index, index + 3);
        minimum = Math.min(
          minimum,
          (luminance(red, green ?? 0, blue ?? 0) + 0.05) / (background + 0.05),
        );
      }
      return minimum;
    });
    expect(minimumContrast).toBeGreaterThanOrEqual(3);
    await page.emulateMedia({ forcedColors: "active" });
    await expect(title).toHaveCSS("background-image", "none");
    await expect(title).not.toHaveCSS("color", "rgba(0, 0, 0, 0)");
  });

  test(`${locale} illustrations load in the correct sections with explicit prototype labels`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(locale === "ht" ? "/" : "/fr");
    const expected = [
      [".hg-portal-hero", "citadelle"],
      ["#mon-haiti", "citizen"],
      ["#territories", "explore"],
      [".hg-portal-discover-card:nth-child(2)", "coast"],
      [".hg-portal-discover-card:nth-child(3)", "culture"],
      [".hg-portal-open", "open"],
    ] as const;
    for (const [selector, asset] of expected) {
      const section = page.locator(selector);
      const image = section.locator("img.hg-portal-illustration").first();
      await image.scrollIntoViewIfNeeded();
      expect(await image.getAttribute("src")).toContain(`homepage-${asset}.webp`);
      await expect
        .poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      await expect(image).toHaveAttribute("srcset", /640w/);
      await expect(section).toContainText(
        locale === "ht" ? "Ilistrasyon pwototip" : "Illustration du prototype",
      );
    }
    await expect(page.locator(".hg-portal-hero img")).toHaveAttribute("loading", "eager");
    await expect(page.locator("#mon-haiti img")).toHaveAttribute("loading", "lazy");
    expect(errors).toEqual([]);
  });
}

test("homepage language switch preserves the default Kreyòl entry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Français", exact: true }).click();
  await expect(page).toHaveURL(/\/fr$/);
  await expect(page.locator(".hg-portal main")).toContainText(
    "Accès rapide aux services essentiels",
  );
  await page.getByRole("link", { name: "Kreyòl", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator(".hg-portal main")).toContainText("Aksè rapid pou sèvis esansyèl yo");
});
