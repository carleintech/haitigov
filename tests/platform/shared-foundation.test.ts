import { describe, expect, it, vi } from "vitest";

import { isDeploymentEnvironment } from "../../packages/config/src/index.ts";
import { createJsonLogger } from "../../packages/logging/src/index.ts";
import {
  createCorrelationId,
  normalizeCorrelationId,
} from "../../packages/observability/src/index.ts";
import { redactSensitiveFields } from "../../packages/security/src/index.ts";
import { isDefined } from "../../packages/utils/src/index.ts";
import { InputValidationError, requireNonEmpty } from "../../packages/validation/src/index.ts";

describe("shared platform foundation", () => {
  it("recognizes supported deployment environments", () => {
    expect(isDeploymentEnvironment("production")).toBe(true);
    expect(isDeploymentEnvironment("preview")).toBe(false);
  });

  it("creates and preserves valid correlation IDs", () => {
    const correlationId = createCorrelationId();
    expect(normalizeCorrelationId(correlationId)).toBe(correlationId);
    expect(normalizeCorrelationId("untrusted")).not.toBe("untrusted");
  });

  it("redacts sensitive structured-log fields", () => {
    expect(
      redactSensitiveFields({ authorization: "Bearer secret", office: "Port-au-Prince" }),
    ).toEqual({
      authorization: "[REDACTED]",
      office: "Port-au-Prince",
    });
  });

  it("emits parseable structured logs", () => {
    const write = vi.fn();
    createJsonLogger(write, "request-1").log("info", "request accepted", { token: "secret" });
    expect(JSON.parse(write.mock.calls[0]?.[0] as string)).toMatchObject({
      correlationId: "request-1",
      fields: { token: "[REDACTED]" },
      level: "info",
    });
  });

  it("normalizes required input and reports validation errors", () => {
    expect(requireNonEmpty(" Haiti ", "country")).toBe("Haiti");
    expect(() => requireNonEmpty(" ", "country")).toThrow(InputValidationError);
  });

  it("filters absent values", () => {
    expect(["HT", null, undefined].filter(isDefined)).toEqual(["HT"]);
  });
});
