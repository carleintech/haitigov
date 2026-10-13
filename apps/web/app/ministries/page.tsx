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

export default async function MinistriesPage({
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
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/ministries" aria-current="page">
          Ministè
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Anyè pwototip sa a montre sèlman dosye ministè ki gen sous ak estati verifikasyon piblik
          apwopriye. Li pa reprezante yon anyè ofisyèl.
        </PublicInformationBanner>
        <section aria-labelledby="ministries-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Anyè pwototip</p>
          <h1 id="ministries-heading">Ministè yo</h1>
          <p>Chèche non oswa akwonim ministè nan dosye piblik ki verifye.</p>
          <SearchField
            action="/ministries"
            defaultValue={query ?? ""}
            label="Chèche yon ministè"
            maxLength={100}
            placeholder="Egzanp: MEF"
          />
        </section>
        <InstitutionResults locale="ht" result={result} />
      </main>
      <GovernmentFooter>
        <a href="/institutions">Gade anyè enstitisyon yo</a>
      </GovernmentFooter>
    </>
  );
}
