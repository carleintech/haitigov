import {
  type InstitutionType,
  institutionIdSchema,
  isPublicInstitutionVerificationStatus,
  type PublicInstitutionDetail,
  type PublicInstitutionSummary,
  publicInstitutionDetailSchema,
  publicInstitutionListResponseSchema,
  publicInstitutionVerificationStatuses,
} from "@haitigov/contracts";
import { createPublicApiUrl, publicApiRequestOptions } from "./public-api.js";

export type InstitutionSearchResult =
  | {
      state: "ready";
      items: readonly PublicInstitutionSummary[];
      hasMore: boolean;
    }
  | { state: "invalid-query" | "unavailable" | "unconfigured" };

export type InstitutionDetailResult =
  | { state: "ready"; item: PublicInstitutionDetail }
  | { state: "invalid-id" | "not-found" | "unavailable" | "unconfigured" };

export function parseInstitutionSearchQuery(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return null;
  const query = value?.trim() ?? "";
  return query.length > 100 ? null : query;
}

async function fetchInstitutionPage(
  apiBaseUrl: string,
  query: string,
  verificationStatus: (typeof publicInstitutionVerificationStatuses)[number],
  type: InstitutionType | undefined,
  request: typeof fetch,
) {
  const url = createPublicApiUrl(apiBaseUrl, "institutions");
  if (url === null) return null;
  url.searchParams.set("limit", "100");
  url.searchParams.set("verificationStatus", verificationStatus);
  if (query) url.searchParams.set("q", query);
  if (type) url.searchParams.set("type", type);

  const response = await request(url, {
    ...publicApiRequestOptions,
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;
  const body: unknown = await response.json();
  const result = publicInstitutionListResponseSchema.safeParse(body);
  return result.success ? result.data : null;
}

export async function searchPublicInstitutions(
  query: string,
  options: Readonly<{
    apiBaseUrl?: string;
    request?: typeof fetch;
    type?: InstitutionType;
  }> = {},
): Promise<InstitutionSearchResult> {
  if (query.length > 100) return { state: "invalid-query" };
  const apiBaseUrl = options.apiBaseUrl ?? process.env.HAITIGOV_PUBLIC_API_URL;
  if (!apiBaseUrl) return { state: "unconfigured" };
  const request = options.request ?? fetch;

  try {
    const pages = await Promise.all(
      publicInstitutionVerificationStatuses.map((verificationStatus) =>
        fetchInstitutionPage(apiBaseUrl, query, verificationStatus, options.type, request),
      ),
    );
    if (pages.some((page) => page === null)) return { state: "unavailable" };

    const records = new Map<string, PublicInstitutionSummary>();
    for (const page of pages) {
      if (page === null) continue;
      for (const item of page.items) {
        if (isPublicInstitutionVerificationStatus(item.verificationStatus)) {
          records.set(item.institutionId, item);
        }
      }
    }

    return {
      state: "ready",
      items: [...records.values()].sort((first, second) =>
        first.officialName.localeCompare(second.officialName, "fr"),
      ),
      hasMore: pages.some((page) => page?.nextCursor !== null),
    };
  } catch {
    return { state: "unavailable" };
  }
}

export async function getPublicInstitution(
  institutionId: string,
  apiBaseUrl = process.env.HAITIGOV_PUBLIC_API_URL,
  request: typeof fetch = fetch,
): Promise<InstitutionDetailResult> {
  const parsedId = institutionIdSchema.safeParse(institutionId);
  if (!parsedId.success) return { state: "invalid-id" };
  if (!apiBaseUrl) return { state: "unconfigured" };

  try {
    const url = createPublicApiUrl(apiBaseUrl, `institutions/${encodeURIComponent(parsedId.data)}`);
    if (url === null) return { state: "unavailable" };
    const response = await request(url, {
      ...publicApiRequestOptions,
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) return { state: "not-found" };
    if (!response.ok) return { state: "unavailable" };

    const body: unknown = await response.json();
    const result = publicInstitutionDetailSchema.safeParse(body);
    if (!result.success || !isPublicInstitutionVerificationStatus(result.data.verificationStatus)) {
      return { state: "not-found" };
    }
    return { state: "ready", item: result.data };
  } catch {
    return { state: "unavailable" };
  }
}

export function institutionDisplayName(
  institution: PublicInstitutionSummary,
  locale: "fr" | "ht",
): string {
  return (
    institution.aliases.find((alias) => alias.isPreferred && alias.locale === locale)?.name ??
    institution.officialName
  );
}
