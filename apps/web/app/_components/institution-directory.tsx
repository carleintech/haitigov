"use client";

import { useState } from "react";
import type { HomeLocale } from "../_data/homepage.js";
import {
  type InstitutionSearchResult,
  institutionDisplayName,
} from "../_data/public-institutions.js";
import { InstitutionResults } from "./institution-results.js";
import { PrototypeNotice, PublicHero, PublicIcon, PublicShell } from "./public-page.js";

const typeLabels = [
  ["MINISTRY", "Ministères", "Ministè"],
  ["PRESIDENCY", "Présidence", "Prezidans"],
  ["PRIMATURE", "Primature", "Primati"],
  ["AUTONOMOUS_BODY", "Organismes autonomes", "Òganis otonòm"],
  ["CENTRAL_DIRECTORATE", "Directions centrales", "Direksyon santral"],
  ["DECONCENTRATED_SERVICE", "Services déconcentrés", "Sèvis dekonsantre"],
  ["EXECUTIVE_COUNCIL", "Conseils exécutifs", "Konsèy egzekitif"],
  ["PUBLIC_BODY", "Organismes publics", "Òganis piblik"],
  ["PUBLIC_ENTERPRISE", "Entreprises publiques", "Antrepriz piblik"],
  [
    "PUBLIC_FINANCIAL_INSTITUTION",
    "Institutions financières publiques",
    "Enstitisyon finansye piblik",
  ],
  ["REGULATORY_AUTHORITY", "Autorités de régulation", "Otorite regilasyon"],
  ["OTHER", "Autres institutions", "Lòt enstitisyon"],
] as const;
const branchLabels = [
  ["EXECUTIVE", "Exécutif", "Egzekitif"],
  ["LEGISLATIVE", "Législatif", "Lejislatif"],
  ["JUDICIAL", "Judiciaire", "Jidisyè"],
  ["INDEPENDENT", "Indépendant", "Endepandan"],
  ["TERRITORIAL", "Territorial", "Teritoryal"],
  ["OTHER", "Autre", "Lòt"],
] as const;

export function InstitutionDirectory({
  locale,
  query,
  result,
}: Readonly<{ locale: HomeLocale; query: string; result: InstitutionSearchResult }>) {
  const french = locale === "fr";
  const [type, setType] = useState("");
  const [branch, setBranch] = useState("");
  const [verification, setVerification] = useState("");
  const [sort, setSort] = useState("asc");
  const [page, setPage] = useState(1);
  const base = french ? "/fr/institutions" : "/institutions";
  const filtered = (result.state === "ready" ? [...result.items] : [])
    .filter(
      (item) =>
        (!type || item.type === type) &&
        (!branch || item.branch === branch) &&
        (!verification || item.verificationStatus === verification),
    )
    .sort(
      (a, b) =>
        (sort === "asc" ? 1 : -1) *
        institutionDisplayName(a, locale).localeCompare(institutionDisplayName(b, locale), locale),
    );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 9));
  const currentPage = Math.min(page, totalPages);
  const items = filtered.slice((currentPage - 1) * 9, currentPage * 9);
  function reset() {
    setType("");
    setBranch("");
    setVerification("");
    setSort("asc");
    setPage(1);
  }
  return (
    <PublicShell locale={locale} page="institutions">
      <PublicHero
        eyebrow={french ? "Annuaire public" : "Anyè piblik"}
        title={french ? "Institutions Publiques" : "Enstitisyon Piblik yo"}
        description={
          french
            ? "Découvrez les institutions, leurs missions et leurs coordonnées à travers un annuaire fondé sur des sources vérifiées."
            : "Dekouvri enstitisyon yo ak fich yo nan yon anyè ki baze sou sous verifye."
        }
        image="/discover/palace.webp"
      >
        <search>
          <form className="hg-public-search" action={base}>
            <label className="hg-sr-only" htmlFor="institution-search">
              {french ? "Rechercher une institution" : "Chèche yon enstitisyon"}
            </label>
            <input
              id="institution-search"
              type="search"
              name="q"
              maxLength={100}
              defaultValue={query}
              placeholder={french ? "Nom, sigle ou mot-clé…" : "Non, akwonim oswa mo kle…"}
            />
            <button type="submit">{french ? "Rechercher" : "Chèche"}</button>
          </form>
        </search>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <fieldset
          className="hg-public-pills"
          aria-label={french ? "Catégories d’institutions" : "Kategori enstitisyon"}
        >
          <button
            type="button"
            aria-pressed={type === ""}
            onClick={() => {
              setType("");
              setPage(1);
            }}
          >
            {french ? "Toutes" : "Tout"}
          </button>
          {typeLabels
            .filter(([value]) =>
              ["MINISTRY", "AUTONOMOUS_BODY", "PUBLIC_ENTERPRISE"].includes(value),
            )
            .map(([value, fr, ht]) => (
              <button
                type="button"
                key={value}
                aria-pressed={type === value}
                onClick={() => {
                  setType(value);
                  setPage(1);
                }}
              >
                {french ? fr : ht}
              </button>
            ))}
        </fieldset>
        <section
          className="hg-public-section hg-public-split"
          aria-labelledby="institution-directory-heading"
        >
          <aside
            className="hg-public-panel hg-public-filter"
            aria-label={french ? "Filtres de l’annuaire" : "Filtè anyè a"}
          >
            <h2>{french ? "Filtrer" : "Filtre"}</h2>
            <label>
              {french ? "Type d’institution" : "Kalite enstitisyon"}
              <select
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">{french ? "Tous les types" : "Tout kalite"}</option>
                {typeLabels.map(([value, fr, ht]) => (
                  <option value={value} key={value}>
                    {french ? fr : ht}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {french ? "Branche" : "Branch"}
              <select
                value={branch}
                onChange={(event) => {
                  setBranch(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">{french ? "Toutes les branches" : "Tout branch"}</option>
                {branchLabels.map(([value, fr, ht]) => (
                  <option key={value} value={value}>
                    {french ? fr : ht}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {french ? "Vérification" : "Verifikasyon"}
              <select
                value={verification}
                onChange={(event) => {
                  setVerification(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">
                  {french ? "Tous les dossiers publics" : "Tout dosye piblik"}
                </option>
                <option value="VERIFIED_CURRENT">
                  {french ? "Actuelles vérifiées" : "Aktyèl verifye"}
                </option>
                <option value="VERIFIED_LEGACY">
                  {french ? "Historiques vérifiées" : "Eritaj verifye"}
                </option>
              </select>
            </label>
            <button type="button" onClick={reset}>
              {french ? "Réinitialiser les filtres" : "Reyinisyalize filtè yo"}
            </button>
            <p className="hg-public-muted">
              {french
                ? "Seules les fiches publiques vérifiées sont affichées. Les fiches historiques ne sont pas des institutions actuelles."
                : "Se sèlman fich piblik verifye ki parèt. Fich eritaj yo pa reprezante enstitisyon aktyèl."}
            </p>
          </aside>
          <div>
            <div className="hg-public-toolbar">
              <h2 id="institution-directory-heading">
                {french ? "L’annuaire des institutions" : "Anyè enstitisyon yo"}
              </h2>
              <label>
                {french ? "Trier par nom" : "Triye pa non"}
                <select
                  value={sort}
                  onChange={(event) => {
                    setSort(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="asc">A → Z</option>
                  <option value="desc">Z → A</option>
                </select>
              </label>
            </div>
            {result.state !== "ready" ? (
              <InstitutionResults locale={locale} result={result} />
            ) : (
              <>
                <p role="status">
                  {filtered.length}{" "}
                  {french
                    ? "institutions dans les résultats chargés"
                    : "enstitisyon nan rezilta ki chaje yo"}
                </p>
                {items.length === 0 ? (
                  <p>
                    {french
                      ? "Aucune institution publique vérifiée ne correspond à cette recherche."
                      : "Pa gen enstitisyon piblik verifye ki koresponn ak rechèch sa a."}
                  </p>
                ) : null}
                <div className="hg-public-grid">
                  {items.map((item) => (
                    <article className="hg-public-card" key={item.institutionId}>
                      <div className="hg-public-card__body">
                        <PublicIcon />
                        <p className="hg-public-tag">
                          {item.verificationStatus === "VERIFIED_CURRENT"
                            ? french
                              ? "Actuelle vérifiée"
                              : "Aktyèl verifye"
                            : french
                              ? "Fiche historique vérifiée"
                              : "Fich eritaj verifye"}
                        </p>
                        <h3>
                          <a href={`${base}/${encodeURIComponent(item.institutionId)}`}>
                            {institutionDisplayName(item, locale)}
                          </a>
                        </h3>
                        <p>
                          {item.acronym} · {item.institutionId}
                        </p>
                        <p>{typeLabels.find(([value]) => value === item.type)?.[french ? 1 : 2]}</p>
                        <a href={`${base}/${encodeURIComponent(item.institutionId)}`}>
                          {french ? "Consulter la fiche" : "Konsilte fich la"} →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
                {totalPages > 1 ? (
                  <nav
                    className="hg-public-pagination"
                    aria-label={french ? "Pagination des institutions" : "Paj enstitisyon yo"}
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
                {result.hasMore ? (
                  <p className="hg-public-muted">
                    {french
                      ? "Résultats partiels : précisez la recherche pour charger d’autres fiches."
                      : "Rezilta pasyèl : presize rechèch la pou chaje lòt fich."}
                  </p>
                ) : null}
              </>
            )}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
