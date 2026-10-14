import { type InstitutionSearchResult, searchPublicInstitutions } from "./public-institutions.js";
import { type ServiceSearchResult, searchPublicServices } from "./public-services.js";

export type PublicPortalSearchResult = Readonly<{
  institutions: InstitutionSearchResult;
  services: ServiceSearchResult;
}>;

export async function searchPublicPortal(
  query: string,
  locale: "fr" | "ht",
  options: Readonly<{
    apiBaseUrl?: string;
    request?: typeof fetch;
  }> = {},
): Promise<PublicPortalSearchResult> {
  if (query.length > 100) {
    return {
      institutions: { state: "invalid-query" },
      services: { state: "invalid-query" },
    };
  }

  const [institutions, services] = await Promise.all([
    searchPublicInstitutions(query, options),
    searchPublicServices(query, locale, options.apiBaseUrl, options.request),
  ]);

  return { institutions, services };
}
