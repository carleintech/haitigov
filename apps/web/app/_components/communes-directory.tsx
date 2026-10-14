"use client";

import { useState } from "react";
import {
  arrondissementOptions,
  communePages,
  communeSource,
  filterCommunes,
} from "../_data/communes.js";
import { departmentHref, departmentPages } from "../_data/departments.js";
import { type HomeLocale, homeRoutes } from "../_data/homepage.js";
import { PrototypeNotice, PublicHero, PublicIcon, PublicShell } from "./public-page.js";

const pageSize = 9;

export function CommunesDirectory({ locale }: Readonly<{ locale: HomeLocale }>) {
  const french = locale === "fr";
  const [query, setQuery] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [arrondissementId, setArrondissementId] = useState("");
  const [page, setPage] = useState(1);
  const filtered = filterCommunes(query, departmentId, arrondissementId);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const items = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const arrondissements = arrondissementOptions.filter(
    (item) => !departmentId || item.departmentId === departmentId,
  );
  function reset() {
    setQuery("");
    setDepartmentId("");
    setArrondissementId("");
    setPage(1);
  }

  return (
    <PublicShell locale={locale} page="communes">
      <PublicHero
        eyebrow={french ? "Territoires d’Haïti" : "Teritwa Ayiti"}
        title={french ? "Les Communes d’Haïti" : "Komin Ayiti yo"}
        description={
          french
            ? "Découvrez les 149 communes du registre territorial et leurs rattachements aux départements et arrondissements."
            : "Dekouvri 149 komin nan rejis teritoryal la ak depatman ak awondisman yo fè pati."
        }
        image="/homepage-coast.webp"
      >
        <search>
          <form
            className="hg-public-search"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="hg-sr-only" htmlFor="commune-search">
              {french ? "Rechercher une commune" : "Chèche yon komin"}
            </label>
            <input
              id="commune-search"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={french ? "Nom, identifiant, territoire…" : "Non, idantifyan, teritwa…"}
            />
            <button type="submit">{french ? "Rechercher" : "Chèche"}</button>
          </form>
        </search>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <section className="hg-public-section" aria-labelledby="commune-provenance">
          <div className="hg-public-panel">
            <h2 id="commune-provenance">
              {french ? "Un annuaire fondé sur les sources" : "Yon anyè ki baze sou sous"}
            </h2>
            <p>
              {french
                ? "Registre territorial du projet, version"
                : "Rejis teritoryal pwojè a, vèsyon"}{" "}
              {communeSource.registryVersion} ·{" "}
              {french ? "Vérification des sources" : "Verifikasyon sous"} :{" "}
              {communeSource.verifiedAt}.
            </p>
            <p>
              {french
                ? "Les noms et rattachements reprennent la référence IHSI 2024. Les fiches municipales, élus, services locaux, sections communales nommées et limites SIG ne sont pas encore publiés."
                : "Non ak relasyon teritoryal yo soti nan referans IHSI 2024 la. Fich minisipal, eli, sèvis lokal, non seksyon kominal yo ak limit SIG yo poko pibliye."}
            </p>
            <a href={french ? homeRoutes.fr.departments : homeRoutes.ht.departments}>
              {french ? "Explorer les départements" : "Eksplore depatman yo"} →
            </a>
          </div>
        </section>
        <section className="hg-public-section" aria-labelledby="commune-directory-heading">
          <div className="hg-public-section-heading">
            <h2 id="commune-directory-heading">
              {french ? "Annuaire des communes" : "Anyè komin yo"}
            </h2>
          </div>
          <div className="hg-public-split">
            <div className="hg-public-panel hg-public-filter">
              <h3>{french ? "Filtrer les communes" : "Filtre komin yo"}</h3>
              <label>
                {french ? "Département" : "Depatman"}
                <select
                  value={departmentId}
                  onChange={(event) => {
                    setDepartmentId(event.target.value);
                    setArrondissementId("");
                    setPage(1);
                  }}
                >
                  <option value="">{french ? "Tous les départements" : "Tout depatman yo"}</option>
                  {departmentPages.map((department) => (
                    <option key={department.departmentId} value={department.departmentId}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {french ? "Arrondissement" : "Awondisman"}
                <select
                  value={arrondissementId}
                  onChange={(event) => {
                    setArrondissementId(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">
                    {french ? "Tous les arrondissements" : "Tout awondisman yo"}
                  </option>
                  {arrondissements.map((arrondissement) => (
                    <option
                      key={arrondissement.arrondissementId}
                      value={arrondissement.arrondissementId}
                    >
                      {arrondissement.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={reset}>
                {french ? "Réinitialiser" : "Reyinisyalize"}
              </button>
            </div>
            <div>
              <div className="hg-public-toolbar">
                <p role="status">
                  {filtered.length} / {communePages.length} {french ? "communes" : "komin"}
                  {filtered.length > 0 ? (
                    <>
                      {" "}
                      · {french ? "Page" : "Paj"} {currentPage} / {totalPages}
                    </>
                  ) : null}
                </p>
              </div>
              {filtered.length === 0 ? (
                <p>
                  {french
                    ? "Aucune commune trouvée. Modifiez les filtres ou réinitialisez la recherche."
                    : "Pa gen komin ki koresponn. Chanje filtè yo oswa reyinisyalize rechèch la."}
                </p>
              ) : null}
              <div className="hg-public-grid">
                {items.map((commune) => (
                  <article
                    className="hg-public-card hg-public-commune-card"
                    key={commune.communeId}
                  >
                    <div className="hg-public-card__body">
                      <PublicIcon kind="map" />
                      <h3>{commune.name}</h3>
                      <p>{commune.communeId}</p>
                      <dl className="hg-public-facts">
                        <div>
                          <dt>{french ? "Département" : "Depatman"}</dt>
                          <dd>
                            <a href={departmentHref(locale, commune.departmentSlug)}>
                              {commune.departmentName}
                            </a>
                          </dd>
                        </div>
                        <div>
                          <dt>{french ? "Arrondissement" : "Awondisman"}</dt>
                          <dd>{commune.arrondissementName}</dd>
                        </div>
                      </dl>
                      <p className="hg-public-muted">{commune.sourceVerificationStatus}</p>
                      <a
                        href={commune.sourceUrl}
                        aria-label={`${french ? "Source IHSI pour" : "Sous IHSI pou"} ${commune.name}`}
                      >
                        {french ? "Source IHSI" : "Sous IHSI"} ↗
                      </a>
                    </div>
                  </article>
                ))}
              </div>
              {totalPages > 1 ? (
                <nav
                  className="hg-public-pagination"
                  aria-label={french ? "Pagination des communes" : "Paj komin yo"}
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
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => {
                      setPage(currentPage + 1);
                    }}
                  >
                    {french ? "Suivant" : "Apre"}
                  </button>
                </nav>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
