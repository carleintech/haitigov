"use client";

import { useState } from "react";
import { type HomeLocale, homeRoutes } from "../_data/homepage.js";
import {
  PendingContent,
  PrototypeNotice,
  PublicHero,
  PublicIcon,
  PublicShell,
} from "./public-page.js";

export function TransparencyPage({ locale }: Readonly<{ locale: HomeLocale }>) {
  const french = locale === "fr";
  const routes = french ? homeRoutes.fr : homeRoutes.ht;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const categories = french
    ? [
        "Budgets & finances",
        "Marchés publics",
        "Lois & règlements",
        "Rapports publics",
        "Statistiques",
        "Projets publics",
        "Institutions",
        "Données territoriales",
      ]
    : [
        "Bidjè ak finans",
        "Mache piblik",
        "Lwa ak règleman",
        "Rapò piblik",
        "Estatistik",
        "Pwojè piblik",
        "Enstitisyon",
        "Done teritoryal",
      ];
  const filtered = categories.filter((title) =>
    title.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)),
  );
  return (
    <PublicShell locale={locale} page="transparency">
      <PublicHero
        eyebrow={
          french
            ? "Information · transparence · responsabilité"
            : "Enfòmasyon · transparans · responsabilite"
        }
        title={french ? "Transparence & Données Publiques" : "Transparans ak Done Piblik"}
        description={
          french
            ? "Une information accessible pour mieux comprendre l’action publique. Consultez les ressources disponibles et leur état de vérification."
            : "Enfòmasyon aksesib pou pi byen konprann aksyon piblik. Konsilte resous ki disponib ak estati verifikasyon yo."
        }
        image="/discover/palace.webp"
      >
        <search>
          <form
            className="hg-public-search"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="transparency-search" className="hg-sr-only">
              {french ? "Rechercher une catégorie de données" : "Chèche yon kategori done"}
            </label>
            <input
              id="transparency-search"
              type="search"
              value={query}
              maxLength={100}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder={french ? "Rechercher une catégorie…" : "Chèche yon kategori…"}
            />
            <button type="submit">{french ? "Rechercher" : "Chèche"}</button>
          </form>
        </search>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <div className="hg-public-callout">
          <strong>
            {french
              ? "Des données traçables, pas des chiffres inventés."
              : "Done ki gen tras, pa chif envante."}
          </strong>
          <p>
            {french
              ? "Les totaux budgétaires, contrats et indicateurs officiels ne sont pas connectés. Aucun chiffre des maquettes n’est présenté comme une statistique réelle."
              : "Total bidjè, kontra ak endikatè ofisyèl yo pa konekte. Nou pa prezante chif makèt yo kòm estatistik reyèl."}
          </p>
        </div>
        <section className="hg-public-section" aria-labelledby="data-categories">
          <div className="hg-public-section-heading">
            <h2 id="data-categories">
              {french ? "Explorez les données publiques" : "Eksplore done piblik yo"}
            </h2>
            <p role="status">
              {filtered.length} {french ? "catégories thématiques" : "kategori tematik"}
            </p>
          </div>
          <div className="hg-public-grid hg-public-grid--four">
            {filtered.map((title, index) => (
              <article className="hg-public-card" key={title}>
                <div className="hg-public-card__body">
                  <PublicIcon kind={index % 2 === 0 ? "chart" : "document"} />
                  <h3>{title}</h3>
                  <p>
                    {french
                      ? "Explorez l’état des ressources de cette rubrique."
                      : "Gade estati resous kategori sa a."}
                  </p>
                  <button
                    type="button"
                    aria-pressed={selected === title}
                    onClick={() => {
                      setSelected(title);
                    }}
                  >
                    {french ? "Voir les ressources" : "Gade resous yo"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p>{french ? "Aucune catégorie trouvée." : "Pa gen kategori ki koresponn."}</p>
          ) : null}
        </section>
        <section
          className="hg-public-section hg-public-two-column"
          aria-labelledby="public-documents"
        >
          <div>
            <h2 id="public-documents">
              {french ? "Documents & publications" : "Dokiman ak piblikasyon"}
            </h2>
            <div className="hg-public-callout" aria-live="polite">
              <strong>{selected || (french ? "Toutes les rubriques" : "Tout kategori")}</strong>
              <p>
                {french
                  ? "Chaque publication doit préciser : source, institution responsable, date, version et conditions de réutilisation."
                  : "Chak piblikasyon dwe bay : sous, enstitisyon responsab, dat, vèsyon ak kondisyon reyitilizasyon."}
              </p>
            </div>
            <PendingContent
              locale={locale}
              title={
                french ? "Publications en attente de validation" : "Piblikasyon ap tann validasyon"
              }
            />
          </div>
          <aside className="hg-public-panel">
            <h2>{french ? "Accès rapide" : "Aksè rapid"}</h2>
            <ul className="hg-public-links">
              <li>
                <a href={routes.institutions}>
                  <PublicIcon />
                  {french ? "Annuaire institutionnel" : "Anyè enstitisyon"}
                </a>
              </li>
              <li>
                <a href={routes.departments}>
                  <PublicIcon kind="map" />
                  {french ? "Registre territorial" : "Rejis teritoryal"}
                </a>
              </li>
              <li>
                <a href={routes.documents}>
                  <PublicIcon kind="document" />
                  {french ? "Espace documents" : "Espas dokiman"}
                </a>
              </li>
            </ul>
            <p className="hg-public-muted">
              {french
                ? "Les fiches disponibles conservent leurs sources et statuts de vérification."
                : "Fich ki disponib yo kenbe sous ak estati verifikasyon yo."}
            </p>
          </aside>
        </section>
        <section className="hg-public-section" aria-labelledby="data-visualisations">
          <div className="hg-public-section-heading">
            <h2 id="data-visualisations">
              {french ? "Comprendre par les données" : "Konprann ak done yo"}
            </h2>
          </div>
          <PendingContent
            locale={locale}
            title={french ? "Visualisations en préparation" : "Vizyalizasyon an preparasyon"}
          >
            {french
              ? "Aucun graphique financier ou indicateur de performance sans jeu de données vérifié. Le registre territorial reste consultable avec ses dénombrements IHSI."
              : "Pa gen grafik finansye oswa endikatè pèfòmans san seri done verifye. Ou ka konsilte rejis teritoryal la ak kantite IHSI yo."}
          </PendingContent>
          <p>
            <a className="hg-public-button" href={routes.departments}>
              {french ? "Explorer le registre territorial" : "Eksplore rejis teritoryal la"} →
            </a>
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
