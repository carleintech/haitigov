import { type PublicServiceSummary, publicServiceListResponseSchema } from "@haitigov/contracts";
import { createPublicApiUrl, publicApiRequestOptions } from "./public-api.js";

export type ServiceSearchResult =
  | { state: "ready"; items: readonly PublicServiceSummary[]; hasMore: boolean }
  | { state: "unconfigured" | "unavailable" | "invalid-query" };

export function parseSearchQuery(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return null;
  const query = value?.trim() ?? "";
  return query.length > 100 ? null : query;
}

export async function searchPublicServices(
  query: string,
  locale: "ht" | "fr",
  apiBaseUrl = process.env.HAITIGOV_PUBLIC_API_URL,
  request: typeof fetch = fetch,
): Promise<ServiceSearchResult> {
  if (query.length > 100) return { state: "invalid-query" };
  if (!apiBaseUrl) return { state: "unconfigured" };

  try {
    const url = createPublicApiUrl(apiBaseUrl, "services");
    if (url === null) return { state: "unavailable" };
    url.searchParams.set("locale", locale);
    if (query) url.searchParams.set("q", query);
    const response = await request(url, {
      ...publicApiRequestOptions,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { state: "unavailable" };
    const body: unknown = await response.json();
    const result = publicServiceListResponseSchema.safeParse(body);
    if (!result.success) return { state: "unavailable" };
    return {
      state: "ready",
      items: result.data.items.filter(
        (item) => item.status === "PUBLISHED" && item.verificationStatus === "VERIFIED_CURRENT",
      ),
      hasMore: result.data.nextCursor !== null,
    };
  } catch {
    // An upstream outage is an explicit result; never turn it into an empty catalogue.
    return { state: "unavailable" };
  }
}
