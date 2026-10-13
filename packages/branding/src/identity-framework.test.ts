import { describe, expect, it } from "vitest";

import { isMinistryIdentityUsable, type MinistryIdentityProfile } from "./index.js";

describe("ministry identity framework", () => {
  it("keeps unreviewed profiles out of distributable use", () => {
    const profile: MinistryIdentityProfile = {
      institutionId: "HT-EXAMPLE",
      displayName: "Example institution",
      acronym: null,
      primaryColor: null,
      secondaryColor: null,
      markAssetKind: null,
      status: "REVIEW_REQUIRED",
      sourceUrl: null,
      reviewedAt: null,
      notes: "Framework fixture only; not a government identity.",
    };

    expect(isMinistryIdentityUsable(profile)).toBe(false);
  });

  it("requires a source before a profile can be used", () => {
    const profile = {
      institutionId: "HT-EXAMPLE",
      displayName: "Example institution",
      acronym: null,
      primaryColor: "#00209f",
      secondaryColor: "#d21034",
      markAssetKind: null,
      status: "APPROVED_FOR_PROJECT_USE",
      sourceUrl: null,
      reviewedAt: "2026-10-02",
      notes: "Approval status is not a claim of government adoption.",
    } satisfies MinistryIdentityProfile;

    expect(isMinistryIdentityUsable(profile)).toBe(false);
  });
});
