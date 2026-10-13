import type { Metadata } from "next";
import { InstitutionResults } from "../../_components/institution-results.js";
import {
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../../_data/public-institutions.js";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype d’annuaire vérifié des ministères.",
  title: "Ministères — HaitiGov",
};

export default async function FrenchMinistriesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  const query = parseInstitutionSearchQuery((await searchParams).q);
  const result =
    query === null
      ? { state: "invalid-query" as const }
      : await searchPublicInstitutions(query, { type: "MINISTRY" });

  return (
    <FrenchSourceGatedPage
      banner="Cet annuaire prototype affiche uniquement les fiches ministérielles disposant de sources et d’un statut de vérification public appropriés. Il ne constitue pas un annuaire officiel."
      currentHref="/fr/ministeres"
      currentLabel="Ministères"
      description="Recherchez le nom ou le sigle d’un ministère parmi les fiches publiques vérifiées."
      eyebrow="Annuaire prototype"
      heading="Ministères"
      headingId="french-ministries-heading"
      search={{
        action: "/fr/ministeres",
        defaultValue: query ?? "",
        label: "Rechercher un ministère",
        placeholder: "Exemple : MEF",
      }}
    >
      <InstitutionResults locale="fr" result={result} />
    </FrenchSourceGatedPage>
  );
}
