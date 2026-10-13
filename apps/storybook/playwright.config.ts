import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      maxDiffPixelRatio: 0.005,
    },
  },
  fullyParallel: true,
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        colorScheme: "light",
        reducedMotion: "reduce",
      },
    },
  ],
  reporter: process.env.CI === "true" ? [["line"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}-{projectName}-{platform}{ext}",
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:6006",
    locale: "fr-HT",
    timezoneId: "America/Port-au-Prince",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/preview.mjs",
    port: 6006,
    reuseExistingServer: process.env.CI !== "true",
  },
});
