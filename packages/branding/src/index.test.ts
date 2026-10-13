import { describe, expect, it } from "vitest";

import { isBrandAssetUsable, nationalBrandAssets } from "./index.js";

describe("national brand asset registry", () => {
  it("does not expose unreviewed references as usable assets", () => {
    expect(Object.values(nationalBrandAssets).every((asset) => !isBrandAssetUsable(asset))).toBe(
      true,
    );
  });

  it("requires every unreviewed slot to omit a distributable path", () => {
    for (const asset of Object.values(nationalBrandAssets)) {
      expect(asset.status).toBe("REVIEW_REQUIRED");
      expect(asset.assetPath).toBeNull();
    }
  });
});
