import type { Metadata } from "next";
import { InstitutionResults } from "../../_components/institution-results.js";
import {
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../../_data/public-institutions.js";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

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

  return (
    <FrenchSourceGatedPage
      banner="Cet annuaire attend des données disposant de sources et d’un statut de vérification approprié."
      currentHref="/fr/institutions"
      currentLabel="Institutions"
      description="Recherchez le nom ou le sigle d’une institution parmi les données publiques vérifiées."
      eyebrow="Annuaire public"
      heading="Institutions publiques"
      headingId="french-institutions-heading"
      search={{
        action: "/fr/institutions",
        defaultValue: query ?? "",
        label: "Rechercher une institution",
        placeholder: "Exemple : MEF",
      }}
    >
      <InstitutionResults locale="fr" result={result} />
    </FrenchSourceGatedPage>
  );
}
