import type { PublicInstitutionDetail } from "@haitigov/contracts";
import { institutionDisplayName } from "../_data/public-institutions.js";

const copy = {
  ht: {
    current: "Verifye kòm aktyèl",
    details: "Detay enstitisyon an",
    jurisdiction: "Jiridiksyon",
    legacy: "Dosye eritaj verifye — enfòmasyon an ka pa aktyèl",
    offices: "Biwo piblik ki nan dosye a",
    relationships: "Relasyon enstitisyonèl",
    sources: "Sous piblik",
    unavailable: "Dosye enstitisyon an pa disponib kounye a. Tanpri eseye ankò pita.",
    unconfigured: "Dosye enstitisyon an poko konekte ak API piblik la.",
    verification: "Istwa verifikasyon",
  },
  fr: {
    current: "Vérifiée comme actuelle",
    details: "Détails de l’institution",
    jurisdiction: "Juridiction",
    legacy: "Fiche historique vérifiée — les informations peuvent ne plus être actuelles",
    offices: "Bureaux publics répertoriés",
    relationships: "Relations institutionnelles",
    sources: "Sources publiques",
    unavailable: "La fiche institutionnelle est indisponible. Réessayez plus tard.",
    unconfigured: "La fiche institutionnelle n’est pas encore connectée à l’API publique.",
    verification: "Historique de vérification",
  },
} as const;

export function InstitutionDetailView({
  institution,
  locale,
}: Readonly<{
  institution: PublicInstitutionDetail;
  locale: "fr" | "ht";
}>) {
  const labels = locale === "ht" ? copy.ht : copy.fr;
  const basePath = locale === "fr" ? "/fr/institutions" : "/institutions";
  const verificationLabel =
    institution.verificationStatus === "VERIFIED_CURRENT" ? labels.current : labels.legacy;

  return (
    <>
      <section aria-labelledby={`${locale}-institution-heading`} className="hg-web-home__hero">
        <p className="hg-eyebrow">{verificationLabel}</p>
        <h1 id={`${locale}-institution-heading`}>{institutionDisplayName(institution, locale)}</h1>
        <p>
          {institution.acronym ? `${institution.acronym} · ` : ""}
          {institution.institutionId}
        </p>
      </section>

      <section aria-labelledby={`${locale}-institution-details`} className="hg-web-home__section">
        <h2 id={`${locale}-institution-details`}>{labels.details}</h2>
        <dl className="hg-web-definition-list">
          <div>
            <dt>{labels.jurisdiction}</dt>
            <dd>{institution.jurisdiction}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{institution.type}</dd>
          </div>
          <div>
            <dt>{locale === "fr" ? "Branche" : "Branch"}</dt>
            <dd>{institution.branch}</dd>
          </div>
        </dl>
      </section>

      {institution.offices.length > 0 ? (
        <section aria-labelledby={`${locale}-institution-offices`} className="hg-web-home__section">
          <h2 id={`${locale}-institution-offices`}>{labels.offices}</h2>
          <ul className="hg-web-list">
            {institution.offices.map((office) => (
              <li key={office.officeId}>
                <strong>{office.locality}</strong> — {office.department.name}
                {office.arrondissement ? `, ${office.arrondissement.name}` : ""}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {institution.relationships.length > 0 ? (
        <section
          aria-labelledby={`${locale}-institution-relationships`}
          className="hg-web-home__section"
        >
          <h2 id={`${locale}-institution-relationships`}>{labels.relationships}</h2>
          <ul className="hg-web-list">
            {institution.relationships.map((relationship) => (
              <li
                key={`${relationship.direction}-${relationship.relationshipType}-${relationship.institutionId}`}
              >
                <a href={`${basePath}/${encodeURIComponent(relationship.institutionId)}`}>
                  {relationship.institutionName}
                </a>{" "}
                — {relationship.relationshipType}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby={`${locale}-institution-sources`} className="hg-web-home__section">
        <h2 id={`${locale}-institution-sources`}>{labels.sources}</h2>
        {institution.sources.length === 0 ? (
          <p>—</p>
        ) : (
          <ul className="hg-web-list">
            {institution.sources.map((source, index) => (
              <li key={`${source.sourceName}-${source.sourceUrl ?? String(index)}`}>
                {source.sourceUrl ? (
                  <a href={source.sourceUrl} rel="noreferrer">
                    {source.sourceName}
                  </a>
                ) : (
                  source.sourceName
                )}
                {source.sourceInstitution ? ` — ${source.sourceInstitution}` : ""}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        aria-labelledby={`${locale}-institution-verification`}
        className="hg-web-home__section"
      >
        <h2 id={`${locale}-institution-verification`}>{labels.verification}</h2>
        <p>{verificationLabel}</p>
      </section>
    </>
  );
}

export function InstitutionDetailUnavailable({
  locale,
  state,
}: Readonly<{
  locale: "fr" | "ht";
  state: "unavailable" | "unconfigured";
}>) {
  const labels = locale === "ht" ? copy.ht : copy.fr;
  return <p role="status">{state === "unconfigured" ? labels.unconfigured : labels.unavailable}</p>;
}
