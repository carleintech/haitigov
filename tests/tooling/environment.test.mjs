import { describe, expect, it } from "vitest";

import { parseEnvironmentFile, validateEnvironment } from "../../scripts/lib/environment.mjs";
import { isVersionAtLeast } from "../../scripts/lib/version.mjs";

describe("environment validation", () => {
  it("accepts a valid development environment", () => {
    const values = parseEnvironmentFile(`
      HAITIGOV_ENVIRONMENT=development
      NODE_ENV=development
      LOG_LEVEL=info
    `);

    expect(validateEnvironment(values)).toEqual([]);
  });

  it("requires production Node mode for staging", () => {
    expect(
      validateEnvironment({
        HAITIGOV_ENVIRONMENT: "staging",
        NODE_ENV: "development",
        LOG_LEVEL: "info",
      }),
    ).toContain("Staging and production require NODE_ENV=production.");
  });

  it("rejects malformed assignments", () => {
    expect(() => parseEnvironmentFile("not-an-assignment")).toThrow(
      "Invalid environment assignment on line 1.",
    );
  });
});

describe("runtime version validation", () => {
  it.each([
    ["24.18.1", true],
    ["24.18.2", true],
    ["24.19.0", true],
    ["25.0.0", true],
    ["24.18.0", false],
    ["23.99.99", false],
  ])("evaluates Node.js %s", (version, expected) => {
    expect(isVersionAtLeast(version, "24.18.1")).toBe(expected);
  });
});
