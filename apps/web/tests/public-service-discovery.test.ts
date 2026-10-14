import { describe, expect, it, vi } from "vitest";
import {
  announcementPublicationDay,
  announcementPublicationLabel,
} from "../app/_data/announcement-date.js";
import {
  arrondissementOptions,
  communePages,
  communeSource,
  filterCommunes,
} from "../app/_data/communes.js";
import { departmentHref, departmentPages, findDepartment } from "../app/_data/departments.js";

import {
  parseAnnouncementSearchQuery,
  searchPublicAnnouncements,
} from "../app/_data/public-announcements.js";
import {
  getPublicInstitution,
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../app/_data/public-institutions.js";
import { searchPublicPortal } from "../app/_data/public-search.js";
import { parseSearchQuery, searchPublicServices } from "../app/_data/public-services.js";

const institution = {
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

const announcement = {
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
} as const;

describe("public territorial projections", () => {
  it("preserves all canonical IDs, counts, and commune memberships", () => {
    expect(departmentPages).toHaveLength(10);
    expect(new Set(departmentPages.map((item) => item.departmentId)).size).toBe(10);
    expect(new Set(departmentPages.map((item) => item.slug)).size).toBe(10);
    expect(departmentPages.reduce((sum, item) => sum + item.arrondissementCount, 0)).toBe(42);
    expect(departmentPages.reduce((sum, item) => sum + item.communeCount, 0)).toBe(149);
    expect(departmentPages.reduce((sum, item) => sum + item.communalSectionCount, 0)).toBe(574);
    for (const department of departmentPages) {
      expect(department.communes).toHaveLength(department.communeCount);
      expect(
        department.communes.every((item) => item.departmentId === department.departmentId),
      ).toBe(true);
    }
    expect(
      new Set(departmentPages.flatMap((item) => item.communes.map((commune) => commune.communeId)))
        .size,
    ).toBe(149);
  });

  it("uses canonical slugs and preserves them across language switches", () => {
    expect(findDepartment("grande-anse")?.capital).toBe("Jérémie");
    expect(findDepartment("grand-anse")).toBeUndefined();
    expect(findDepartment("not-a-department")).toBeUndefined();
    expect(departmentHref("ht", "grande-anse")).toBe("/departments/grande-anse");
    expect(departmentHref("fr", "grande-anse")).toBe("/fr/departements/grande-anse");
  });

  it("preserves all 149 communes, 42 arrondissement relationships and source metadata", () => {
    expect(communePages).toHaveLength(149);
    expect(new Set(communePages.map((commune) => commune.communeId)).size).toBe(149);
    expect(arrondissementOptions).toHaveLength(42);
    expect(new Set(arrondissementOptions.map((item) => item.arrondissementId)).size).toBe(42);
    expect(communeSource).toEqual({ registryVersion: "1.1", verifiedAt: "2026-09-26" });
    for (const arrondissement of arrondissementOptions) {
      const communes = filterCommunes(
        "",
        arrondissement.departmentId,
        arrondissement.arrondissementId,
      );
      expect(communes).toHaveLength(arrondissement.communeCount);
      expect(communes.every((commune) => commune.arrondissementName === arrondissement.name)).toBe(
        true,
      );
    }
    for (const commune of communePages) {
      const department = findDepartment(commune.departmentSlug);
      expect(department?.departmentId).toBe(commune.departmentId);
      expect(department?.name).toBe(commune.departmentName);
      expect(commune.sourceVerificationStatus).toBe("VERIFIED_2024_IHSI");
      expect(new URL(commune.sourceUrl).hostname).toBe("ihsi.gouv.ht");
    }
  });

  it("searches commune names, IDs and parent territories without accent or case sensitivity", () => {
    expect(filterCommunes("  PETION-VILLE  ", "", "").map((item) => item.name)).toEqual([
      "Pétion-Ville",
    ]);
    expect(filterCommunes("ht-com-006", "", "").map((item) => item.name)).toEqual(["Pétion-Ville"]);
    expect(filterCommunes("ouest", "", "")).toHaveLength(31);
    expect(new Set(filterCommunes("ouest", "", "").map((item) => item.departmentName))).toEqual(
      new Set(["Ouest", "Nord-Ouest"]),
    );
    expect(filterCommunes("", "HT-DEP-01", "HT-ARR-001")).toHaveLength(8);
    expect(filterCommunes("", "HT-DEP-02", "HT-ARR-001")).toEqual([]);
    expect(filterCommunes("no-match-fixture", "", "")).toEqual([]);
  });
});

describe("announcement publication calendar", () => {
  it("renders Haitian Creole month names without relying on ht-HT ICU support", () => {
    const months = [
      "janvye",
      "fevriye",
      "mas",
      "avril",
      "me",
      "jen",
      "jiyè",
      "out",
      "septanm",
      "oktòb",
      "novanm",
      "desanm",
    ];
    for (const [index, month] of months.entries()) {
      const timestamp = `2026-${String(index + 1).padStart(2, "0")}-14T16:00:00Z`;
      expect(announcementPublicationLabel(timestamp, "ht")).toBe(`14 ${month} 2026`);
    }
  });
  it("renders localized publication labels using the Haiti calendar", () => {
    expect(announcementPublicationLabel("2026-10-14T03:30:00Z", "ht")).toBe("13 oktòb 2026");
    expect(announcementPublicationLabel("2026-10-14T04:30:00Z", "ht")).toBe("14 oktòb 2026");
    expect(announcementPublicationLabel("2026-01-01T04:30:00Z", "ht")).toBe("31 desanm 2025");
    expect(announcementPublicationLabel("2026-10-14T03:30:00Z", "fr")).toBe("13 octobre 2026");
    expect(() => announcementPublicationLabel("not-a-date", "ht")).toThrow();
    expect(() => announcementPublicationLabel("not-a-date", "fr")).toThrow();
  });
  it("compares Haiti calendar days instead of timestamp spellings", () => {
    expect(announcementPublicationDay("2026-07-15T03:30:00Z")).toBe("2026-07-14");
    expect(announcementPublicationDay("2026-07-14T23:30:00-04:00")).toBe("2026-07-14");
    expect(announcementPublicationDay("2026-07-15T04:00:00Z")).toBe("2026-07-15");
  });
  it("observes winter midnight and rejects invalid timestamps", () => {
    expect(announcementPublicationDay("2026-01-15T04:59:59Z")).toBe("2026-01-14");
    expect(announcementPublicationDay("2026-01-15T05:00:00Z")).toBe("2026-01-15");
    expect(() => announcementPublicationDay("not-a-date")).toThrow();
  });
});

describe("public announcement discovery", () => {
  it("normalizes announcement queries and rejects ambiguous input", () => {
    expect(parseAnnouncementSearchQuery("  avi  ")).toBe("avi");
    expect(parseAnnouncementSearchQuery(["avi", "delè"])).toBeNull();
  });

  it("accepts only the source-gated public announcement contract", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () => Promise.resolve({ items: [announcement], nextCursor: null }),
      ok: true,
    } as Response);

    await expect(
      searchPublicAnnouncements("avi", "ht", "https://api.example/v1", request),
    ).resolves.toEqual({ hasMore: false, items: [announcement], state: "ready" });
  });

  it("does not turn malformed provenance into an empty announcement list", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () =>
        Promise.resolve({ items: [{ ...announcement, sourceUrl: "not-a-url" }], nextCursor: null }),
      ok: true,
    } as Response);

    await expect(
      searchPublicAnnouncements("", "ht", "https://api.example/v1", request),
    ).resolves.toEqual({ state: "unavailable" });
  });
});

describe("public institution discovery", () => {
  it("normalizes institution queries and rejects ambiguous input", () => {
    expect(parseInstitutionSearchQuery("  MEF  ")).toBe("MEF");
    expect(parseInstitutionSearchQuery(["MEF", "DGI"])).toBeNull();
  });

  it("combines current and legacy records while excluding pending records", async () => {
    const request = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            items: [
              institution,
              { ...institution, institutionId: "HT-PENDING", verificationStatus: "PENDING_REVIEW" },
            ],
            nextCursor: null,
          }),
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            items: [
              {
                ...institution,
                institutionId: "HT-LEGACY",
                officialName: "Legacy development fixture",
                verificationStatus: "VERIFIED_LEGACY",
              },
            ],
            nextCursor: null,
          }),
        ok: true,
      } as Response);

    const result = await searchPublicInstitutions("MEF", {
      apiBaseUrl: "https://api.example/v1",
      request,
    });

    expect(request).toHaveBeenCalledTimes(2);
    expect(result).toMatchObject({
      hasMore: false,
      state: "ready",
      items: [
        expect.objectContaining({ institutionId: "HT-TEST" }),
        expect.objectContaining({ institutionId: "HT-LEGACY" }),
      ],
    });
  });

  it("returns only contracted public institution detail records", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () =>
        Promise.resolve({
          ...institution,
          jurisdiction: "Development fixture",
          offices: [],
          relationships: [],
          sources: [],
          verificationEvents: [],
        }),
      ok: true,
      status: 200,
    } as Response);

    const result = await getPublicInstitution("HT-TEST", "https://api.example/v1", request);
    expect(result.state).toBe("ready");
    if (result.state === "ready") {
      expect(result.item.institutionId).toBe("HT-TEST");
    }
  });

  it("hides institution detail records that are still pending review", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () =>
        Promise.resolve({
          ...institution,
          jurisdiction: "Development fixture",
          offices: [],
          relationships: [],
          sources: [],
          verificationEvents: [],
          verificationStatus: "PENDING_REVIEW",
        }),
      ok: true,
      status: 200,
    } as Response);

    await expect(
      getPublicInstitution("HT-TEST", "https://api.example/v1", request),
    ).resolves.toEqual({ state: "not-found" });
  });
});

describe("public service discovery", () => {
  it("normalizes a single query and rejects ambiguous or oversized input", () => {
    expect(parseSearchQuery("  paspò  ")).toBe("paspò");
    expect(parseSearchQuery(["tax", "identity"])).toBeNull();
    expect(parseSearchQuery("x".repeat(101))).toBeNull();
  });

  it("keeps the catalogue explicitly unconfigured when no API root exists", async () => {
    await expect(searchPublicServices("", "ht", undefined)).resolves.toEqual({
      state: "unconfigured",
    });
  });

  it("rejects insecure non-loopback API roots before making a request", async () => {
    const request = vi.fn<typeof fetch>();

    await expect(
      searchPublicServices("tax", "ht", "http://public.example/v1", request),
    ).resolves.toEqual({ state: "unavailable" });
    expect(request).not.toHaveBeenCalled();
  });

  it("passes locale and query while filtering non-public records defensively", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () =>
        Promise.resolve({
          items: [
            {
              description: "Verified description",
              institutionId: "HT-MEF-DGI",
              name: "Verified service",
              serviceId: "verified-service",
              status: "PUBLISHED",
              verificationStatus: "VERIFIED_CURRENT",
            },
            {
              description: "Candidate description",
              institutionId: "HT-MEF-DGI",
              name: "Candidate service",
              serviceId: "candidate-service",
              status: "DRAFT",
              verificationStatus: "PENDING_REVIEW",
            },
          ],
          nextCursor: null,
        }),
      ok: true,
    } as Response);

    const result = await searchPublicServices("  tax  ", "fr", "https://api.example/v1", request);

    expect(request).toHaveBeenCalledOnce();
    const requestedUrl = request.mock.calls[0]?.[0];
    expect(requestedUrl).toBeInstanceOf(URL);
    expect(requestedUrl instanceof URL ? requestedUrl.toString() : requestedUrl).toBe(
      "https://api.example/v1/services?locale=fr&q=++tax++",
    );
    expect(result).toEqual({
      hasMore: false,
      items: [expect.objectContaining({ serviceId: "verified-service" })],
      state: "ready",
    });
  });

  it("does not misrepresent malformed upstream data as an empty catalogue", async () => {
    const request = vi.fn<typeof fetch>().mockResolvedValue({
      json: () => Promise.resolve({ items: [] }),
      ok: true,
    } as Response);

    await expect(
      searchPublicServices("", "ht", "https://api.example/v1", request),
    ).resolves.toEqual({ state: "unavailable" });
  });
});

describe("public portal search", () => {
  it("searches institution and service catalogues without weakening either public gate", async () => {
    const request = vi.fn<typeof fetch>().mockImplementation((input) => {
      const url =
        input instanceof URL ? input : new URL(typeof input === "string" ? input : input.url);
      if (url.pathname.endsWith("/services")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              items: [
                {
                  description: "Verified service description",
                  institutionId: institution.institutionId,
                  name: "Verified service",
                  serviceId: "verified-service",
                  status: "PUBLISHED",
                  verificationStatus: "VERIFIED_CURRENT",
                },
              ],
              nextCursor: null,
            }),
          ok: true,
        } as Response);
      }

      const verificationStatus = url.searchParams.get("verificationStatus");
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            items:
              verificationStatus === "VERIFIED_CURRENT"
                ? [institution]
                : [
                    {
                      ...institution,
                      institutionId: "HT-LEGACY",
                      officialName: "Legacy development fixture",
                      verificationStatus: "VERIFIED_LEGACY",
                    },
                  ],
            nextCursor: null,
          }),
        ok: true,
      } as Response);
    });

    const result = await searchPublicPortal("passport", "fr", {
      apiBaseUrl: "https://api.example/v1",
      request,
    });

    expect(request).toHaveBeenCalledTimes(3);
    expect(result.institutions).toMatchObject({ state: "ready", items: { length: 2 } });
    expect(result.services).toMatchObject({ state: "ready", items: { length: 1 } });
  });

  it("rejects oversized queries before any catalogue request", async () => {
    const request = vi.fn<typeof fetch>();

    await expect(searchPublicPortal("x".repeat(101), "ht", { request })).resolves.toEqual({
      institutions: { state: "invalid-query" },
      services: { state: "invalid-query" },
    });
    expect(request).not.toHaveBeenCalled();
  });
});
