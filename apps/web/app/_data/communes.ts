import arrondissementRegistry from "../../../../data/territories/arrondissements-v1.1.json" with {
  type: "json",
};
import registry from "../../../../data/territories/communes-v1.1.json" with { type: "json" };
import { departmentPages, normalizeTerritorySearch } from "./departments.js";

export const communeSource = {
  registryVersion: registry.registryVersion,
  verifiedAt: registry.sourceVerifiedAt.slice(0, 10),
};

export const arrondissementOptions = arrondissementRegistry.records;

export const communePages = departmentPages
  .flatMap((department) =>
    department.communes.map((commune) => ({
      ...commune,
      departmentSlug: department.slug,
    })),
  )
  .sort((a, b) => a.name.localeCompare(b.name, "fr") || a.communeId.localeCompare(b.communeId));

export function filterCommunes(query: string, departmentId: string, arrondissementId: string) {
  const normalizedQuery = normalizeTerritorySearch(query);
  return communePages.filter(
    (commune) =>
      (!departmentId || commune.departmentId === departmentId) &&
      (!arrondissementId || commune.arrondissementId === arrondissementId) &&
      normalizeTerritorySearch(
        `${commune.name} ${commune.communeId} ${commune.departmentName} ${commune.arrondissementName}`,
      ).includes(normalizedQuery),
  );
}
