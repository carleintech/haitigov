import { defineConfig } from "vitest/config";

export const sharedVitestConfig = defineConfig({
  test: {
    clearMocks: true,
    passWithNoTests: false,
    restoreMocks: true,
  },
});
