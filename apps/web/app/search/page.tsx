import {
  GovernmentFooter,
  GovernmentHeader,
  PublicInformationBanner,
  SearchField,
} from "@haitigov/ui";
import { ServiceResults } from "../_components/service-results.js";
import { parseSearchQuery, searchPublicServices } from "../_data/public-services.js";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const query = parseSearchQuery((await searchParams).q);
  const result =
    query === null ? { state: "invalid-query" as const } : await searchPublicServices(query, "ht");
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/search" aria-current="page">
          Rechèch
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Rezilta yo ap sòti sèlman nan kontni piblik ki gen sous ak estati verifikasyon.
        </PublicInformationBanner>
        <section aria-labelledby="search-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Rechèch piblik</p>
          <h1 id="search-heading">Chèche nan HaitiGov</h1>
          <p>Chèche enstitisyon ak sèvis lè katalòg ki verifye yo disponib.</p>
          <SearchField
            defaultValue={query ?? ""}
            maxLength={100}
            label="Tèm rechèch"
            placeholder="Egzanp: paspò, MEF, lekòl"
          />
        </section>
        <ServiceResults result={result} locale="ht" />
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
