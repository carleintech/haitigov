export const brandAssetKinds = ["NATIONAL_SEAL", "NATIONAL_EMBLEM", "SIMPLIFIED_MARK"] as const;

export type BrandAssetKind = (typeof brandAssetKinds)[number];

export const brandAssetReviewStatuses = [
  "REVIEW_REQUIRED",
  "PROPOSED",
  "APPROVED_FOR_PROJECT_USE",
  "RETIRED",
] as const;

export type BrandAssetReviewStatus = (typeof brandAssetReviewStatuses)[number];

export const ministryIdentityReviewStatuses = [
  "REVIEW_REQUIRED",
  "PROPOSED",
  "APPROVED_FOR_PROJECT_USE",
  "RETIRED",
] as const;

export type MinistryIdentityReviewStatus = (typeof ministryIdentityReviewStatuses)[number];

/** Neutral contract for future institution profiles; it contains references, not logo files. */
export interface MinistryIdentityProfile {
  readonly institutionId: string;
  readonly displayName: string;
  readonly acronym: string | null;
  readonly primaryColor: string | null;
  readonly secondaryColor: string | null;
  readonly markAssetKind: BrandAssetKind | null;
  readonly status: MinistryIdentityReviewStatus;
  readonly sourceUrl: string | null;
  readonly reviewedAt: string | null;
  readonly notes: string;
}

export function isMinistryIdentityUsable(profile: MinistryIdentityProfile): boolean {
  return profile.status === "APPROVED_FOR_PROJECT_USE" && profile.sourceUrl !== null;
}

export interface BrandAssetRecord {
  readonly kind: BrandAssetKind;
  readonly status: BrandAssetReviewStatus;
  readonly sourceUrl: string | null;
  readonly sourceInstitution: string | null;
  readonly assetPath: string | null;
  readonly reviewedAt: string | null;
  readonly notes: string;
}

/**
 * Asset slots only. No supplied reference image has been approved as a reusable
 * HaitiGov identity asset, so no binary or vector is exported here.
 */
export const nationalBrandAssets = {
  nationalSeal: {
    kind: "NATIONAL_SEAL",
    status: "REVIEW_REQUIRED",
    sourceUrl: null,
    sourceInstitution: null,
    assetPath: null,
    reviewedAt: null,
    notes: "Awaiting authoritative source and project-use approval.",
  },
  nationalEmblem: {
    kind: "NATIONAL_EMBLEM",
    status: "REVIEW_REQUIRED",
    sourceUrl: null,
    sourceInstitution: null,
    assetPath: null,
    reviewedAt: null,
    notes: "Awaiting authoritative source and project-use approval.",
  },
  simplifiedMark: {
    kind: "SIMPLIFIED_MARK",
    status: "REVIEW_REQUIRED",
    sourceUrl: null,
    sourceInstitution: null,
    assetPath: null,
    reviewedAt: null,
    notes: "Proposed project mark must be reviewed and must not be represented as official.",
  },
} as const satisfies Record<string, BrandAssetRecord>;

export function isBrandAssetUsable(asset: BrandAssetRecord): boolean {
  return asset.status === "APPROVED_FOR_PROJECT_USE" && asset.assetPath !== null;
}
