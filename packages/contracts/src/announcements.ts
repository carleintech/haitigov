import { z } from "zod";

export const announcementListQuerySchema = z.object({
  locale: z.enum(["ht", "fr", "en", "es"]).default("ht"),
  q: z.string().trim().min(1).max(100).optional(),
});

export type AnnouncementListQuery = z.infer<typeof announcementListQuerySchema>;

export interface PublicAnnouncementSummary {
  readonly announcementId: string;
  readonly expiresAt: string | null;
  readonly institutionId: string | null;
  readonly locale: "en" | "es" | "fr" | "ht";
  readonly publicationStatus: "PUBLISHED";
  readonly publishedAt: string;
  readonly slug: string;
  readonly sourceInstitution: string;
  readonly sourceUrl: string;
  readonly sourceVerifiedAt: string;
  readonly summary: string;
  readonly title: string;
  readonly verificationStatus: "VERIFIED_CURRENT";
}

export interface PublicAnnouncementListResponse {
  readonly items: readonly PublicAnnouncementSummary[];
  readonly nextCursor: string | null;
}

const isoDateTimeSchema = z.iso.datetime({ offset: true });

export const publicAnnouncementListResponseSchema = z.object({
  items: z
    .array(
      z.object({
        announcementId: z.string().min(1).max(100),
        expiresAt: isoDateTimeSchema.nullable(),
        institutionId: z.string().min(1).max(100).nullable(),
        locale: z.enum(["ht", "fr", "en", "es"]),
        publicationStatus: z.literal("PUBLISHED"),
        publishedAt: isoDateTimeSchema,
        slug: z.string().min(1).max(200),
        sourceInstitution: z.string().min(1).max(500),
        sourceUrl: z.url(),
        sourceVerifiedAt: isoDateTimeSchema,
        summary: z.string().min(1).max(5000),
        title: z.string().min(1).max(1000),
        verificationStatus: z.literal("VERIFIED_CURRENT"),
      }),
    )
    .max(100),
  nextCursor: z.string().max(100).nullable(),
});
