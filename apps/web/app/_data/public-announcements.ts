import {
  type PublicAnnouncementSummary,
  publicAnnouncementListResponseSchema,
} from "@haitigov/contracts";
import { createPublicApiUrl, publicApiRequestOptions } from "./public-api.js";

export type AnnouncementSearchResult =
  | { state: "ready"; items: readonly PublicAnnouncementSummary[]; hasMore: boolean }
  | { state: "invalid-query" | "unavailable" | "unconfigured" };

export function parseAnnouncementSearchQuery(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return null;
  const query = value?.trim() ?? "";
  return query.length > 100 ? null : query;
}

export async function searchPublicAnnouncements(
  query: string,
  locale: "fr" | "ht",
  apiBaseUrl = process.env.HAITIGOV_PUBLIC_API_URL,
  request: typeof fetch = fetch,
): Promise<AnnouncementSearchResult> {
  if (query.length > 100) return { state: "invalid-query" };
  if (!apiBaseUrl) return { state: "unconfigured" };

  try {
    const url = createPublicApiUrl(apiBaseUrl, "announcements");
    if (url === null) return { state: "unavailable" };
    url.searchParams.set("locale", locale);
    if (query) url.searchParams.set("q", query);
    const response = await request(url, {
      ...publicApiRequestOptions,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { state: "unavailable" };
    const result = publicAnnouncementListResponseSchema.safeParse(await response.json());
    if (!result.success) return { state: "unavailable" };
    return {
      state: "ready",
      items: result.data.items,
      hasMore: result.data.nextCursor !== null,
    };
  } catch {
    return { state: "unavailable" };
  }
}
