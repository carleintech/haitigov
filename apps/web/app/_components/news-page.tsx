"use client";

import { useState } from "react";
import { announcementPublicationDay } from "../_data/announcement-date.js";
import { type HomeLocale, homeRoutes } from "../_data/homepage.js";
import type { AnnouncementSearchResult } from "../_data/public-announcements.js";
import { AnnouncementResults } from "./announcement-results.js";
import { PrototypeNotice, PublicHero, PublicIcon, PublicShell } from "./public-page.js";

export function NewsPage({
  locale,
  query,
  result,
}: Readonly<{ locale: HomeLocale; query: string; result: AnnouncementSearchResult }>) {
  const french = locale === "fr";
  const routes = french ? homeRoutes.fr : homeRoutes.ht;
  const [institution, setInstitution] = useState("");
  const [since, setSince] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const sources =
    result.state === "ready"
      ? [...new Set(result.items.map((item) => item.sourceInstitution))].sort()
      : [];
  const items = (result.state === "ready" ? [...result.items] : [])
    .filter(
      (item) =>
        (!institution || item.sourceInstitution === institution) &&
        (!since || announcementPublicationDay(item.publishedAt) >= since),
    )
    .sort(
      (a, b) =>
        (sort === "recent" ? -1 : 1) * (Date.parse(a.publishedAt) - Date.parse(b.publishedAt)),
    );
  const pages = Math.max(1, Math.ceil(items.length / 6));
  const currentPage = Math.min(page, pages);
  const displayed: AnnouncementSearchResult =
    result.state === "ready"
      ? { ...result, items: items.slice((currentPage - 1) * 6, currentPage * 6) }
      : result;
  return (
    <PublicShell locale={locale} page="news">
      <PublicHero
        eyebrow={french ? "Information publique" : "Enfòmasyon piblik"}
        title={french ? "Actualités & Annonces" : "Nouvèl ak Anons"}
        description={
          french
            ? "Restez informé à travers des annonces publiques sourcées et vérifiées. Retrouvez les informations et leurs institutions responsables."
            : "Rete enfòme ak anons piblik ki gen sous ak verifikasyon. Jwenn enfòmasyon ak enstitisyon ki responsab yo."
        }
        image="/discover/palace.webp"
      >
        <search>
          <form className="hg-public-search" action={routes.news}>
            <label htmlFor="news-search" className="hg-sr-only">
              {french ? "Rechercher des annonces" : "Chèche anons"}
            </label>
            <input
              type="search"
              id="news-search"
              name="q"
              maxLength={100}
              defaultValue={query}
              placeholder={
                french ? "Rechercher une actualité, une annonce…" : "Chèche yon nouvèl, yon anons…"
              }
            />
            <button type="submit">{french ? "Rechercher" : "Chèche"}</button>
          </form>
        </search>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <nav
          className="hg-public-pills"
          aria-label={french ? "Suggestions de recherche" : "Sijesyon rechèch"}
        >
          {(french
            ? ["Toutes", "Services", "Éducation", "Santé", "Économie"]
            : ["Tout", "Sèvis", "Edikasyon", "Sante", "Ekonomi"]
          ).map((title, index) => (
            <a
              href={index === 0 ? routes.news : `${routes.news}?q=${encodeURIComponent(title)}`}
              key={title}
              aria-current={(index === 0 && !query) || query === title ? "page" : undefined}
            >
              {title}
            </a>
          ))}
        </nav>
        <section className="hg-public-section hg-public-split" aria-labelledby="news-list-heading">
          <aside className="hg-public-panel hg-public-filter">
            <h2>{french ? "Filtrer les annonces" : "Filtre anons yo"}</h2>
            <label>
              {french ? "Institution source" : "Enstitisyon sous"}
              <select
                value={institution}
                onChange={(event) => {
                  setInstitution(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">{french ? "Toutes les institutions" : "Tout enstitisyon"}</option>
                {sources.map((source) => (
                  <option value={source} key={source}>
                    {source}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {french ? "Publiées depuis" : "Pibliye depi"}
              <input
                type="date"
                value={since}
                onChange={(event) => {
                  setSince(event.target.value);
                  setPage(1);
                }}
              />
            </label>
            <label>
              {french ? "Ordre" : "Lòd"}
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
              >
                <option value="recent">{french ? "Plus récentes" : "Pi resan"}</option>
                <option value="oldest">{french ? "Plus anciennes" : "Pi ansyen"}</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => {
                setInstitution("");
                setSince("");
                setSort("recent");
                setPage(1);
              }}
            >
              {french ? "Réinitialiser" : "Reyinisyalize"}
            </button>
            <p className="hg-public-muted">
              {french
                ? "Les filtres portent sur les résultats chargés. Les thèmes ci-dessus lancent une recherche, pas une classification éditoriale."
                : "Filtè yo aplike sou rezilta ki chaje yo. Tèm anlè yo fè yon rechèch, yo pa yon klasifikasyon editoryal."}
            </p>
          </aside>
          <div>
            <div className="hg-public-toolbar">
              <h2 id="news-list-heading">
                {french ? "À la une & dernières annonces" : "Dènye nouvèl ak anons"}
              </h2>
              {result.state === "ready" ? (
                <p role="status">
                  {items.length} {french ? "résultats chargés" : "rezilta ki chaje"}
                </p>
              ) : null}
            </div>
            <div className="hg-public-news-empty">
              <AnnouncementResults locale={locale} result={displayed} />
            </div>
            {pages > 1 ? (
              <nav
                className="hg-public-pagination"
                aria-label={french ? "Pagination des annonces" : "Paj anons yo"}
              >
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setPage(currentPage - 1);
                  }}
                >
                  {french ? "Précédent" : "Anvan"}
                </button>
                <span>
                  {currentPage} / {pages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === pages}
                  onClick={() => {
                    setPage(currentPage + 1);
                  }}
                >
                  {french ? "Suivant" : "Apre"}
                </button>
              </nav>
            ) : null}
            <div className="hg-public-callout">
              <PublicIcon kind="document" />
              <h3>{french ? "Une information responsable" : "Enfòmasyon responsab"}</h3>
              <p>
                {french
                  ? "Aucune annonce n’est publiée sans source et date de révision. Les récits, photos et chiffres des maquettes ne sont pas des actualités vérifiées."
                  : "Pa gen anons ki pibliye san sous ak dat revizyon. Istwa, foto ak chif makèt yo pa nouvèl verifye."}
              </p>
              <a href={routes.transparency}>
                {french ? "Transparence & sources" : "Transparans ak sous"} →
              </a>
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
