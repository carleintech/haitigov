import { describe, expect, it } from "vitest";

import {
  publicInstitutionDetailSchema,
  publicInstitutionListResponseSchema,
} from "./institutions.js";

const summary = {
  acronym: "TST",
  aliases: [],
  branch: "EXECUTIVE",
  institutionId: "HT-TEST",
  officialName: "Development fixture institution",
  parentInstitutionId: null,
  status: "ACTIVE",
  type: "OTHER",
  verificationStatus: "VERIFIED_CURRENT",
} as const;

describe("public institution response contracts", () => {
  it("accepts a bounded public institution list", () => {
    expect(
      publicInstitutionListResponseSchema.safeParse({ items: [summary], nextCursor: null }).success,
    ).toBe(true);
  });

  it("rejects malformed source URLs", () => {
    const result = publicInstitutionDetailSchema.safeParse({
      ...summary,
      jurisdiction: "Development fixture",
      offices: [],
      relationships: [],
      sources: [
        {
          effectiveFrom: null,
          effectiveTo: null,
          retrievedAt: null,
          sourceInstitution: null,
          sourceName: "Fixture source",
          sourceUrl: "not-a-url",
        },
      ],
      verificationEvents: [],
    });

    expect(result.success).toBe(false);
  });
});
