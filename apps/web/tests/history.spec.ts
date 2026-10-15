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
  for (const width of [320, 390, 1201, 1440]) {
    test(`${historyPage.locale} history navigation works across public headers at ${width.toString()}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const french = historyPage.locale === "fr";
      const label = french ? "Histoire" : "Istwa";
      const paths = french
        ? ["/fr", "/fr/services", "/fr/institutions", historyPage.path]
        : ["/", "/services", "/institutions", historyPage.path];
      for (const path of paths) {
        await page.goto(path);
        const mobile = width <= 1200;
        if (mobile) {
          await page.locator(".hg-portal-mobile-nav summary").click();
        }
        const navigation = page.locator(
          mobile ? ".hg-portal-mobile-nav nav" : ".hg-portal-desktop-nav",
        );
        const history = navigation.getByRole("link", { name: label, exact: true });
        await expect(history).toHaveCount(1);
        await expect(history).toBeVisible();
        await expect(history).toHaveAttribute("href", historyPage.path);
        if (path === historyPage.path) {
          await expect(history).toHaveAttribute("aria-current", "page");
        }
        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
        await history.focus();
        await expect(history).toBeFocused();
        await history.press("Enter");
        await expect(page).toHaveURL(historyPage.path);
        await expect(
          page.getByRole("heading", { level: 1, name: historyPage.heading }),
        ).toBeVisible();
      }
      expect(errors).toEqual([]);
    });
  }

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

  test(`${historyPage.locale} history film plays with captions and an accessible transcript`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${historyPage.path}#media`);
    const video = page.locator("#media video");
    await expect(video).toBeVisible();
    await expect(video).toHaveAttribute("controls", "");
    await expect(video).toHaveAttribute("preload", "none");
    await expect(video).not.toHaveAttribute("autoplay");
    await expect(video.locator("track[default]")).toHaveAttribute("srclang", historyPage.locale);
    await expect(page.locator("#history-video-notice")).toContainText(
      historyPage.locale === "fr" ? "non documentaire" : "pa dokimantè",
    );
    const transcript = page.locator(".hg-history-transcript");
    await transcript.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(transcript).toHaveAttribute("open", "");
    await expect(transcript.locator("li")).toHaveCount(43);
    await expect(transcript).toContainText(historyPage.locale === "fr" ? "Sud" : "Sid");
    await expect(page.locator("#media a[download]").first()).toHaveAttribute(
      "href",
      "/history-media/ayiti-nan-imaj.mp4",
    );
    await video.evaluate((element: HTMLVideoElement) => {
      element.load();
    });
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.readyState))
      .toBeGreaterThanOrEqual(2);
    expect(await video.evaluate((element: HTMLVideoElement) => element.duration)).toBeCloseTo(
      211,
      1,
    );
    expect(await video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => {
          const track = Array.from(element.textTracks).find((item) => item.mode === "showing");
          return { language: track?.language, cues: track?.cues?.length };
        }),
      )
      .toEqual({ language: historyPage.locale, cues: 43 });
    await video.evaluate(async (element: HTMLVideoElement) => {
      element.muted = true;
      await element.play();
    });
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime))
      .toBeGreaterThan(0);
    await video.evaluate((element: HTMLVideoElement) => {
      element.pause();
      element.currentTime = 205;
    });
    await expect
      .poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime))
      .toBe(205);
    expect(await video.evaluate((element: HTMLVideoElement) => element.error)).toBeNull();
    await expect
      .poll(() =>
        video.evaluate((element: HTMLVideoElement) => {
          const track = Array.from(element.textTracks).find((item) => item.mode === "showing");
          return track?.activeCues?.[0]?.startTime;
        }),
      )
      .toBe(203);
    const cues = await page.request.get(`/history-media/${historyPage.locale}.vtt`);
    expect(cues.ok()).toBe(true);
    expect((await cues.text()).match(/ --> /g)).toHaveLength(43);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      390,
    );
  });

  test(`${historyPage.locale} history film reports a media failure`, async ({ page }) => {
    await page.route("**/history-media/ayiti-nan-imaj.mp4", (route) => route.abort());
    await page.goto(historyPage.path);
    await page.locator("#media video").evaluate((element: HTMLVideoElement) => {
      element.load();
    });
    await expect(page.locator("#media [role=alert]")).toBeVisible();
  });
}
