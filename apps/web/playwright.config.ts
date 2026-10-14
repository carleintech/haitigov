import { defineConfig, devices } from "@playwright/test";

const managedWebServer =
  process.env.PLAYWRIGHT_REUSE_SERVER === "true"
    ? {}
    : {
        webServer: {
          command: "node node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3100",
          port: 3100,
          reuseExistingServer: process.env.CI !== "true",
        },
      };

export default defineConfig({
  ...managedWebServer,
  fullyParallel: true,
  workers: 2,
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
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  testIgnore: "**/*.fixture.spec.ts",
  use: {
    baseURL: "http://127.0.0.1:3100",
    locale: "ht-HT",
    timezoneId: "America/Port-au-Prince",
    trace: "retain-on-failure",
  },
});
