import { announcementPublicationLabel } from "../_data/announcement-date.js";
import type { AnnouncementSearchResult } from "../_data/public-announcements.js";

const copy = {
  ht: {
    empty: "Pa gen anons piblik verifye pou moman an.",
    heading: "Anons ki verifye",
    invalid: "Antre yon sèl tèm rechèch ki pa depase 100 karaktè.",
    more: "Gen lòt anons. Presize rechèch la pou jwenn sa ou bezwen an.",
    source: "Sous",
    unavailable: "Katalòg anons la pa disponib kounye a. Tanpri eseye ankò pita.",
    unconfigured: "Katalòg anons la poko konekte. Tanpri retounen pita.",
  },
  fr: {
    empty: "Aucune annonce publique vérifiée n’est disponible pour le moment.",
    heading: "Annonces vérifiées",
    invalid: "Saisissez un seul terme de recherche de 100 caractères maximum.",
    more: "D’autres annonces existent. Précisez votre recherche.",
    source: "Source",
    unavailable: "Le catalogue d’annonces est indisponible. Réessayez plus tard.",
    unconfigured: "Le catalogue d’annonces n’est pas encore connecté. Revenez plus tard.",
  },
} as const;

export function AnnouncementResults({
  locale,
  result,
}: Readonly<{ locale: "fr" | "ht"; result: AnnouncementSearchResult }>) {
  const labels = locale === "ht" ? copy.ht : copy.fr;
  const failureMessage =
    result.state === "invalid-query"
      ? labels.invalid
      : result.state === "unavailable"
        ? labels.unavailable
        : result.state === "unconfigured"
          ? labels.unconfigured
          : null;

  return (
    <section aria-labelledby={`${locale}-announcement-results`} className="hg-web-home__section">
      <h2 id={`${locale}-announcement-results`}>{labels.heading}</h2>
      {result.state !== "ready" ? (
        <p role="status">{failureMessage}</p>
      ) : result.items.length === 0 ? (
        <p>{labels.empty}</p>
      ) : (
        <>
          <ul className="hg-web-home__cards">
            {result.items.map((item) => (
              <li className="hg-card" key={item.announcementId}>
                <p className="hg-eyebrow">
                  <time dateTime={item.publishedAt}>
                    {announcementPublicationLabel(item.publishedAt, locale)}
                  </time>
                </p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <p>
                  {labels.source}:{" "}
                  <a href={item.sourceUrl} rel="noreferrer">
                    {item.sourceInstitution}
                  </a>
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
