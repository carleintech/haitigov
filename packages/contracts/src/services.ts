import { z } from "zod";

export const serviceStatuses = ["DRAFT", "PUBLISHED", "RETIRED"] as const;
export const serviceVerificationStatuses = [
  "PENDING_REVIEW",
  "PARTIALLY_VERIFIED",
  "VERIFIED_CURRENT",
  "VERIFIED_LEGACY",
  "REJECTED",
  "SUPERSEDED",
] as const;

export const serviceListQuerySchema = z.object({
  institutionId: z.string().trim().min(5).max(100).optional(),
  locale: z.enum(["ht", "fr", "en", "es"]).default("ht"),
  q: z.string().trim().min(1).max(100).optional(),
  status: z.enum(serviceStatuses).optional(),
  verificationStatus: z.enum(serviceVerificationStatuses).optional(),
});

export type ServiceStatus = (typeof serviceStatuses)[number];
export type ServiceVerificationStatus = (typeof serviceVerificationStatuses)[number];
export type ServiceListQuery = z.infer<typeof serviceListQuerySchema>;

export interface PublicServiceSource {
  readonly retrievedAt: string | null;
  readonly sourceInstitution: string | null;
  readonly sourceName: string;
  readonly sourceUrl: string | null;
}

export interface PublicServiceSummary {
  readonly description: string;
  readonly institutionId: string;
  readonly name: string;
  readonly serviceId: string;
  readonly status: ServiceStatus;
  readonly verificationStatus: ServiceVerificationStatus;
}

export interface PublicServiceDetail extends PublicServiceSummary {
  readonly eligibility: string | null;
  readonly howToApply: readonly string[];
  readonly sources: readonly PublicServiceSource[];
}

export interface PublicServiceListResponse {
  readonly items: readonly PublicServiceSummary[];
  readonly nextCursor: string | null;
}

export const publicServiceListResponseSchema = z.object({
  items: z
    .array(
      z.object({
        description: z.string().max(20000),
        institutionId: z.string().max(100),
        name: z.string().min(1).max(1000),
        serviceId: z.string().min(1).max(100),
        status: z.enum(serviceStatuses),
        verificationStatus: z.enum(serviceVerificationStatuses),
      }),
    )
    .max(100),
  nextCursor: z.string().max(100).nullable(),
});
