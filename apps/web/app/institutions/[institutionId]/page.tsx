import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";
import { notFound } from "next/navigation.js";
import {
  InstitutionDetailUnavailable,
  InstitutionDetailView,
} from "../../_components/institution-detail.js";
import { getPublicInstitution } from "../../_data/public-institutions.js";

export default async function InstitutionPage({
  params,
}: Readonly<{ params: Promise<{ institutionId: string }> }>) {
  const { institutionId } = await params;
  const result = await getPublicInstitution(institutionId);
  if (result.state === "invalid-id" || result.state === "not-found") notFound();

  return (
    <>
      <GovernmentHeader>
        <a href="/institutions">← Anyè enstitisyon yo</a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Paj sa a ap montre sèlman enstitisyon ki pase revizyon sous ak verifikasyon.
        </PublicInformationBanner>
        {result.state === "ready" ? (
          <InstitutionDetailView institution={result.item} locale="ht" />
        ) : (
          <section aria-labelledby="institution-heading" className="hg-web-home__hero">
            <p className="hg-eyebrow">ID enstitisyon</p>
            <h1 id="institution-heading">{institutionId}</h1>
            <InstitutionDetailUnavailable locale="ht" state={result.state} />
          </section>
        )}
      </main>
      <GovernmentFooter>
        <a href="/institutions">Retounen nan anyè a</a>
      </GovernmentFooter>
    </>
  );
}
