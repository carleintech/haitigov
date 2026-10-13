import type { Metadata } from "next";
import { ServiceResults } from "../../_components/service-results.js";
import { parseSearchQuery, searchPublicServices } from "../../_data/public-services.js";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Recherche source-gated du prototype public HaitiGov.",
  title: "Recherche — HaitiGov",
};

export default async function FrenchSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const query = parseSearchQuery((await searchParams).q);
  const result =
    query === null ? { state: "invalid-query" as const } : await searchPublicServices(query, "fr");
  return (
    <FrenchSourceGatedPage
      banner="Les résultats proviendront uniquement de contenus publics dotés d’une source et d’un statut de vérification."
      currentHref="/fr/recherche"
      currentLabel="Recherche"
      description="Recherchez des institutions et des services lorsque les catalogues vérifiés seront disponibles."
      eyebrow="Recherche publique"
      heading="Rechercher dans HaitiGov"
      headingId="french-search-heading"
      search={{
        defaultValue: query ?? "",
        label: "Termes de recherche",
        placeholder: "Exemple : passeport, MEF, école",
      }}
    >
      <ServiceResults result={result} locale="fr" />
    </FrenchSourceGatedPage>
  );
}
