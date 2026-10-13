import { z } from "zod";

export const institutionTypes = [
  "AUTONOMOUS_BODY",
  "CENTRAL_DIRECTORATE",
  "DECONCENTRATED_SERVICE",
  "EXECUTIVE_COUNCIL",
  "MINISTRY",
  "PRESIDENCY",
  "PRIMATURE",
  "PUBLIC_BODY",
  "PUBLIC_ENTERPRISE",
  "PUBLIC_FINANCIAL_INSTITUTION",
  "REGULATORY_AUTHORITY",
  "OTHER",
] as const;

export const governmentBranches = [
  "EXECUTIVE",
  "JUDICIAL",
  "LEGISLATIVE",
  "INDEPENDENT",
  "TERRITORIAL",
  "OTHER",
] as const;

export const institutionStatuses = [
  "UNKNOWN",
  "ACTIVE",
  "INACTIVE",
  "HISTORICAL",
  "SUPERSEDED",
] as const;

export const verificationStatuses = [
  "PENDING_REVIEW",
  "PARTIALLY_VERIFIED",
  "VERIFIED_CURRENT",
  "VERIFIED_LEGACY",
  "SUPERSEDED",
  "REJECTED",
] as const;

export const publicInstitutionVerificationStatuses = [
  "VERIFIED_CURRENT",
  "VERIFIED_LEGACY",
] as const;

export const institutionAliasTypes = [
  "ACRONYM",
  "FORMER_NAME",
  "SHORT_NAME",
  "TRANSLATION",
  "OTHER",
] as const;

export const institutionRelationshipTypes = [
  "PARENT_OF",
  "OVERSEES",
  "COORDINATES",
  "SUCCESSOR_OF",
  "PREDECESSOR_OF",
  "RELATED_TO",
] as const;

export const institutionOfficeTypes = ["DELEGATION", "VICE_DELEGATION"] as const;

export const institutionOfficeCoverages = ["DEPARTMENT", "ARRONDISSEMENT"] as const;

export const verificationOutcomes = [
  "CONFIRMED",
  "PARTIALLY_CONFIRMED",
  "UNRESOLVED",
  "REJECTED",
  "SUPERSEDED",
] as const;

function isCanonicalInstitutionId(value: string): boolean {
  const segments = value.split("-");
  if (segments.length < 2 || segments[0] !== "HT") {
    return false;
  }

  return segments.slice(1).every((segment) => {
    if (segment.length === 0) {
      return false;
    }

    for (let index = 0; index < segment.length; index += 1) {
      const code = segment.charCodeAt(index);
      if (!((code >= 48 && code <= 57) || (code >= 65 && code <= 90))) {
        return false;
      }
    }
    return true;
  });
}

export const institutionIdSchema = z
  .string()
  .min(5)
  .max(100)
  .refine(
    isCanonicalInstitutionId,
    "Institution IDs must use the canonical uppercase HT-segment format.",
  );

export const institutionListQuerySchema = z.object({
  branch: z.enum(governmentBranches).optional(),
  cursor: institutionIdSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  parent: institutionIdSchema.optional(),
  q: z.string().trim().min(1).max(100).optional(),
  status: z.enum(institutionStatuses).optional(),
  type: z.enum(institutionTypes).optional(),
  verificationStatus: z.enum(publicInstitutionVerificationStatuses).optional(),
});

export type InstitutionType = (typeof institutionTypes)[number];
export type GovernmentBranch = (typeof governmentBranches)[number];
export type InstitutionStatus = (typeof institutionStatuses)[number];
export type VerificationStatus = (typeof verificationStatuses)[number];
export type PublicInstitutionVerificationStatus =
  (typeof publicInstitutionVerificationStatuses)[number];
export type InstitutionAliasType = (typeof institutionAliasTypes)[number];
export type InstitutionRelationshipType = (typeof institutionRelationshipTypes)[number];
export type InstitutionOfficeType = (typeof institutionOfficeTypes)[number];
export type InstitutionOfficeCoverage = (typeof institutionOfficeCoverages)[number];
export type VerificationOutcome = (typeof verificationOutcomes)[number];
export type InstitutionListQuery = z.infer<typeof institutionListQuerySchema>;

export function isPublicInstitutionVerificationStatus(
  status: VerificationStatus,
): status is PublicInstitutionVerificationStatus {
  return status === "VERIFIED_CURRENT" || status === "VERIFIED_LEGACY";
}

export interface PublicInstitutionAlias {
  readonly aliasType: InstitutionAliasType;
  readonly isPreferred: boolean;
  readonly locale: string | null;
  readonly name: string;
  readonly validFrom: string | null;
  readonly validTo: string | null;
}

export interface PublicInstitutionSummary {
  readonly acronym: string | null;
  readonly aliases: readonly PublicInstitutionAlias[];
  readonly branch: GovernmentBranch;
  readonly institutionId: string;
  readonly officialName: string;
  readonly parentInstitutionId: string | null;
  readonly status: InstitutionStatus;
  readonly type: InstitutionType;
  readonly verificationStatus: VerificationStatus;
}

export interface PublicInstitutionRelationship {
  readonly direction: "incoming" | "outgoing";
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly institutionAcronym: string | null;
  readonly institutionId: string;
  readonly institutionName: string;
  readonly relationshipType: InstitutionRelationshipType;
}

export interface PublicInstitutionSource {
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly retrievedAt: string | null;
  readonly sourceInstitution: string | null;
  readonly sourceName: string;
  readonly sourceUrl: string | null;
}

export interface PublicInstitutionOffice {
  readonly arrondissement: {
    readonly arrondissementId: string;
    readonly name: string;
  } | null;
  readonly coverage: InstitutionOfficeCoverage;
  readonly department: {
    readonly departmentId: string;
    readonly name: string;
  };
  readonly locality: string;
  readonly officeId: string;
  readonly officeType: InstitutionOfficeType;
  readonly verificationStatus: VerificationStatus;
}

export interface PublicVerificationEvent {
  readonly outcome: VerificationOutcome;
  readonly verifiedAt: string;
}

export interface PublicInstitutionDetail extends PublicInstitutionSummary {
  readonly jurisdiction: string;
  readonly offices: readonly PublicInstitutionOffice[];
  readonly relationships: readonly PublicInstitutionRelationship[];
  readonly sources: readonly PublicInstitutionSource[];
  readonly verificationEvents: readonly PublicVerificationEvent[];
}

export interface PublicInstitutionListResponse {
  readonly items: readonly PublicInstitutionSummary[];
  readonly nextCursor: string | null;
}

const nullableDateTimeSchema = z.string().max(64).nullable();

export const publicInstitutionAliasSchema = z.object({
  aliasType: z.enum(institutionAliasTypes),
  isPreferred: z.boolean(),
  locale: z.string().min(2).max(35).nullable(),
  name: z.string().min(1).max(1000),
  validFrom: nullableDateTimeSchema,
  validTo: nullableDateTimeSchema,
});

export const publicInstitutionSummarySchema = z.object({
  acronym: z.string().min(1).max(100).nullable(),
  aliases: z.array(publicInstitutionAliasSchema).max(100),
  branch: z.enum(governmentBranches),
  institutionId: institutionIdSchema,
  officialName: z.string().min(1).max(1000),
  parentInstitutionId: institutionIdSchema.nullable(),
  status: z.enum(institutionStatuses),
  type: z.enum(institutionTypes),
  verificationStatus: z.enum(verificationStatuses),
});

export const publicInstitutionRelationshipSchema = z.object({
  direction: z.enum(["incoming", "outgoing"]),
  effectiveFrom: nullableDateTimeSchema,
  effectiveTo: nullableDateTimeSchema,
  institutionAcronym: z.string().min(1).max(100).nullable(),
  institutionId: institutionIdSchema,
  institutionName: z.string().min(1).max(1000),
  relationshipType: z.enum(institutionRelationshipTypes),
});

export const publicInstitutionSourceSchema = z.object({
  effectiveFrom: nullableDateTimeSchema,
  effectiveTo: nullableDateTimeSchema,
  retrievedAt: nullableDateTimeSchema,
  sourceInstitution: z.string().min(1).max(1000).nullable(),
  sourceName: z.string().min(1).max(1000),
  sourceUrl: z.url().max(2048).nullable(),
});

export const publicInstitutionOfficeSchema = z.object({
  arrondissement: z
    .object({
      arrondissementId: z.string().min(1).max(100),
      name: z.string().min(1).max(1000),
    })
    .nullable(),
  coverage: z.enum(institutionOfficeCoverages),
  department: z.object({
    departmentId: z.string().min(1).max(100),
    name: z.string().min(1).max(1000),
  }),
  locality: z.string().min(1).max(1000),
  officeId: z.string().min(1).max(100),
  officeType: z.enum(institutionOfficeTypes),
  verificationStatus: z.enum(verificationStatuses),
});

export const publicVerificationEventSchema = z.object({
  outcome: z.enum(verificationOutcomes),
  verifiedAt: z.string().max(64),
});

export const publicInstitutionDetailSchema = publicInstitutionSummarySchema.extend({
  jurisdiction: z.string().min(1).max(1000),
  offices: z.array(publicInstitutionOfficeSchema).max(1000),
  relationships: z.array(publicInstitutionRelationshipSchema).max(1000),
  sources: z.array(publicInstitutionSourceSchema).max(100),
  verificationEvents: z.array(publicVerificationEventSchema).max(100),
});

export const publicInstitutionListResponseSchema = z.object({
  items: z.array(publicInstitutionSummarySchema).max(100),
  nextCursor: institutionIdSchema.nullable(),
});
