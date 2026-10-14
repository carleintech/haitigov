import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
import base from "../playwright.config.js";

export default defineConfig(base, {
  testDir: ".",
  testMatch: "public-data.fixture.spec.ts",
  testIgnore: [],
  use: { baseURL: "http://127.0.0.1:3210" },
  webServer: [
    {
      command: "node tests/fixtures/public-api.ts",
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      url: "http://127.0.0.1:3211/health",
      reuseExistingServer: false,
    },
    {
      command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3210",
      cwd: fileURLToPath(new URL("..", import.meta.url)),
      url: "http://127.0.0.1:3210/institutions",
      env: { HAITIGOV_PUBLIC_API_URL: "http://127.0.0.1:3211" },
      reuseExistingServer: false,
    },
  ],
});
