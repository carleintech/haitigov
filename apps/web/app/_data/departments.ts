import communeRegistry from "../../../../data/territories/communes-v1.1.json" with { type: "json" };
import registry from "../../../../data/territories/departments-v1.1.json" with { type: "json" };
import type { HomeLocale } from "./homepage.js";

export const departmentPages = registry.records.map((record) => {
  const slug = record.proposedRoute.split("/").at(-1);
  if (!slug) throw new Error(`Missing department route for ${record.departmentId}`);
  return {
    ...record,
    slug,
    image: `/discover/${slug}-landscape.webp`,
    concept: `/discover/${slug}-concept.webp`,
    communes: communeRegistry.records.filter(
      (commune) => commune.departmentId === record.departmentId,
    ),
  };
});

export type DepartmentPageRecord = (typeof departmentPages)[number];

export function normalizeTerritorySearch(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function departmentHref(locale: HomeLocale, slug: string): string {
  return `${locale === "fr" ? "/fr/departements" : "/departments"}/${encodeURIComponent(slug)}`;
}

export function findDepartment(slug: string): DepartmentPageRecord | undefined {
  return departmentPages.find((department) => department.slug === slug);
}
