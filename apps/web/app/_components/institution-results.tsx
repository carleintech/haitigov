import type { PublicInstitutionSummary } from "@haitigov/contracts";
import type { InstitutionSearchResult } from "../_data/public-institutions.js";
import { institutionDisplayName } from "../_data/public-institutions.js";

const copy = {
  ht: {
    current: "Verifye kòm aktyèl",
    empty: "Pa gen enstitisyon piblik verifye ki koresponn ak rechèch sa a.",
    heading: "Rezilta anyè a",
    invalid: "Antre yon sèl tèm rechèch ki pa depase 100 karaktè.",
    legacy: "Dosye eritaj verifye — li ka pa aktyèl",
    more: "Gen lòt rezilta. Presize rechèch la pou jwenn enstitisyon ou bezwen an.",
    unavailable: "Anyè enstitisyon an pa disponib kounye a. Tanpri eseye ankò pita.",
    unconfigured: "Anyè enstitisyon an poko konekte. Tanpri retounen pita.",
  },
  fr: {
    current: "Vérifiée comme actuelle",
    empty: "Aucune institution publique vérifiée ne correspond à cette recherche.",
    heading: "Résultats de l’annuaire",
    invalid: "Saisissez un seul terme de recherche de 100 caractères maximum.",
    legacy: "Fiche historique vérifiée — elle peut ne plus être actuelle",
    more: "D’autres résultats existent. Précisez la recherche pour trouver l’institution voulue.",
    unavailable: "L’annuaire des institutions est indisponible. Réessayez plus tard.",
    unconfigured: "L’annuaire des institutions n’est pas encore connecté. Revenez plus tard.",
  },
} as const;

function verificationLabel(item: PublicInstitutionSummary, locale: "fr" | "ht"): string {
  const labels = locale === "ht" ? copy.ht : copy.fr;
  return item.verificationStatus === "VERIFIED_CURRENT" ? labels.current : labels.legacy;
}

export function InstitutionResults({
  locale,
  result,
}: Readonly<{
  locale: "fr" | "ht";
  result: InstitutionSearchResult;
}>) {
  const labels = locale === "ht" ? copy.ht : copy.fr;
  const basePath = locale === "fr" ? "/fr/institutions" : "/institutions";
  const failureMessage =
    result.state === "invalid-query"
      ? labels.invalid
      : result.state === "unavailable"
        ? labels.unavailable
        : result.state === "unconfigured"
          ? labels.unconfigured
          : null;

  return (
    <section aria-labelledby={`${locale}-institution-results`} className="hg-web-home__section">
      <h2 id={`${locale}-institution-results`}>{labels.heading}</h2>
      {result.state !== "ready" ? (
        <p role="status">{failureMessage}</p>
      ) : result.items.length === 0 ? (
        <p>{labels.empty}</p>
      ) : (
        <>
          <ul className="hg-web-home__cards hg-web-directory">
            {result.items.map((item) => (
              <li className="hg-card" key={item.institutionId}>
                <p className="hg-eyebrow">{verificationLabel(item, locale)}</p>
                <h3>
                  <a href={`${basePath}/${encodeURIComponent(item.institutionId)}`}>
                    {institutionDisplayName(item, locale)}
                  </a>
                </h3>
                <p>
                  {item.acronym ? `${item.acronym} · ` : ""}
                  {item.institutionId}
                </p>
              </li>
            ))}
          </ul>
          {result.hasMore ? <p>{labels.more}</p> : null}
        </>
      )}
    </section>
  );
}
