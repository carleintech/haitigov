import type { ServiceSearchResult } from "../_data/public-services.js";

const messages = {
  ht: {
    heading: "Rezilta nan katalòg sèvis la",
    empty: "Pa gen sèvis piblik verifye ki koresponn ak rechèch sa a.",
    unconfigured: "Katalòg sèvis la poko konekte. Tanpri retounen pita.",
    unavailable: "Katalòg sèvis la pa disponib kounye a. Tanpri eseye ankò pita.",
    "invalid-query": "Antre yon sèl tèm rechèch ki pa depase 100 karaktè.",
    more: "Gen lòt rezilta. Presize rechèch ou pou jwenn sèvis ou bezwen an.",
    institution: "Enstitisyon",
  },
  fr: {
    heading: "Résultats dans le catalogue",
    empty: "Aucun service public vérifié ne correspond à cette recherche.",
    unconfigured: "Le catalogue de services n’est pas encore connecté. Revenez plus tard.",
    unavailable: "Le catalogue de services est indisponible. Réessayez plus tard.",
    "invalid-query": "Saisissez un seul terme de recherche de 100 caractères maximum.",
    more: "D’autres résultats sont disponibles. Précisez votre recherche.",
    institution: "Institution",
  },
};

export function ServiceResults({
  result,
  locale,
}: {
  result: ServiceSearchResult;
  locale: "ht" | "fr";
}) {
  const copy = locale === "ht" ? messages.ht : messages.fr;
  const failureMessage =
    result.state === "unconfigured"
      ? copy.unconfigured
      : result.state === "unavailable"
        ? copy.unavailable
        : result.state === "invalid-query"
          ? copy["invalid-query"]
          : null;
  return (
    <section aria-labelledby="service-results-heading" className="hg-web-home__section">
      <h2 id="service-results-heading">{copy.heading}</h2>
      {result.state !== "ready" ? (
        <p role="status">{failureMessage}</p>
      ) : (
        <>
          {result.items.length === 0 ? (
            <p>{copy.empty}</p>
          ) : (
            <ul className="hg-web-home__cards">
              {result.items.map((item) => (
                <li className="hg-card" key={item.serviceId}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p>
                    {copy.institution}: {item.institutionId}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {result.hasMore ? <p>{copy.more}</p> : null}
        </>
      )}
    </section>
  );
}
