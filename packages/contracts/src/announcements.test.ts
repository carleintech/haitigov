import { describe, expect, it } from "vitest";

import {
  announcementListQuerySchema,
  publicAnnouncementListResponseSchema,
} from "./announcements.js";

describe("public announcement contracts", () => {
  it("normalizes a source-gated public query", () => {
    expect(announcementListQuerySchema.parse({ locale: "fr", q: "  budget  " })).toEqual({
      locale: "fr",
      q: "budget",
    });
  });

  it("requires publication and provenance timestamps in public responses", () => {
    expect(
      publicAnnouncementListResponseSchema.safeParse({
        items: [
          {
            announcementId: "announcement-fixture",
            expiresAt: null,
            institutionId: null,
            locale: "ht",
            publicationStatus: "PUBLISHED",
            publishedAt: "2026-10-13T20:30:00.000Z",
            slug: "announcement-fixture",
            sourceInstitution: "Development fixture",
            sourceUrl: "https://example.test/source",
            sourceVerifiedAt: "2026-10-13T20:30:00.000Z",
            summary: "Development fixture summary",
            title: "Development fixture title",
            verificationStatus: "VERIFIED_CURRENT",
          },
        ],
        nextCursor: null,
      }).success,
    ).toBe(true);
  });
});
