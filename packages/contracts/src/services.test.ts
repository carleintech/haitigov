import { describe, expect, it } from "vitest";

import { serviceListQuerySchema } from "./services.js";

describe("public service contracts", () => {
  it("defaults the public language to Haitian Creole", () => {
    expect(serviceListQuerySchema.parse({})).toEqual({ locale: "ht" });
  });

  it("rejects empty search terms and invalid languages", () => {
    expect(serviceListQuerySchema.safeParse({ q: "  " }).success).toBe(false);
    expect(serviceListQuerySchema.safeParse({ locale: "xx" }).success).toBe(false);
  });
});
