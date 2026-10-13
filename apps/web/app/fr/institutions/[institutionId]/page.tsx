import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation.js";
import {
  InstitutionDetailUnavailable,
  InstitutionDetailView,
} from "../../../_components/institution-detail.js";
import { getPublicInstitution } from "../../../_data/public-institutions.js";

export const metadata: Metadata = {
  description: "Prototype de fiche institutionnelle publique HaitiGov.",
  title: "Fiche institutionnelle — HaitiGov",
};

export default async function FrenchInstitutionPage({
  params,
}: Readonly<{ params: Promise<{ institutionId: string }> }>) {
  const { institutionId } = await params;
  const result = await getPublicInstitution(institutionId);
  if (result.state === "invalid-id" || result.state === "not-found") notFound();

  return (
    <>
      <GovernmentHeader>
        <a href="/fr/institutions">← Annuaire des institutions</a>
        <a href="/">Kreyòl</a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content" lang="fr">
        <PublicInformationBanner>
          Cette page affichera uniquement les institutions ayant passé la revue des sources et la
          vérification.
        </PublicInformationBanner>
        {result.state === "ready" ? (
          <InstitutionDetailView institution={result.item} locale="fr" />
        ) : (
          <section aria-labelledby="french-institution-heading" className="hg-web-home__hero">
            <p className="hg-eyebrow">Identifiant institutionnel</p>
            <h1 id="french-institution-heading">{institutionId}</h1>
            <InstitutionDetailUnavailable locale="fr" state={result.state} />
          </section>
        )}
      </main>
      <GovernmentFooter>
        <a href="/fr/institutions">Retour à l’annuaire</a>
      </GovernmentFooter>
    </>
  );
}
