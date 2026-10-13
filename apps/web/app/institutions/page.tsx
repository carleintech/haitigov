import {
  GovernmentFooter,
  GovernmentHeader,
  PublicInformationBanner,
  SearchField,
} from "@haitigov/ui";
import { InstitutionResults } from "../_components/institution-results.js";
import {
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../_data/public-institutions.js";

export default async function InstitutionsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  const query = parseInstitutionSearchQuery((await searchParams).q);
  const result =
    query === null ? { state: "invalid-query" as const } : await searchPublicInstitutions(query);

  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/institutions" aria-current="page">
          Enstitisyon
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Anyè sa a ap tann dosye ki gen sous ak estati verifikasyon apwopriye.
        </PublicInformationBanner>
        <section aria-labelledby="directory-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Anyè piblik</p>
          <h1 id="directory-heading">Enstitisyon piblik yo</h1>
          <p>Chèche non oswa akwonim yon enstitisyon nan done piblik ki verifye.</p>
          <SearchField
            action="/institutions"
            defaultValue={query ?? ""}
            label="Chèche yon enstitisyon"
            maxLength={100}
            placeholder="Egzanp: MEF"
          />
        </section>
        <InstitutionResults locale="ht" result={result} />
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
