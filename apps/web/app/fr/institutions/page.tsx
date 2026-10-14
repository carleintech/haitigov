import type { Metadata } from "next";
import { InstitutionDirectory } from "../../_components/institution-directory.js";
import {
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../../_data/public-institutions.js";

export const metadata: Metadata = {
  description: "Prototype d’annuaire public des institutions avec provenance et vérification.",
  title: "Institutions — HaitiGov",
};

export default async function FrenchInstitutionsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  const query = parseInstitutionSearchQuery((await searchParams).q);
  const result =
    query === null ? { state: "invalid-query" as const } : await searchPublicInstitutions(query);

  return <InstitutionDirectory locale="fr" query={query ?? ""} result={result} />;
}
