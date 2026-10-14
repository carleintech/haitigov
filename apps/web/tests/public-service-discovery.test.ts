import { describe, expect, it, vi } from "vitest";

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
