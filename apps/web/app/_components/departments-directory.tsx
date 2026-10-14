"use client";

import { useState } from "react";
import { departmentHref, departmentPages, normalizeTerritorySearch } from "../_data/departments.js";
import { type HomeLocale, territorySource, territoryTotals } from "../_data/homepage.js";
import { PrototypeNotice, PublicArt, PublicHero, PublicIcon, PublicShell } from "./public-page.js";

export function DepartmentsDirectory({ locale }: Readonly<{ locale: HomeLocale }>) {
  const french = locale === "fr";
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("HT-DEP-03");
  const selected =
    departmentPages.find((department) => department.departmentId === selectedId) ??
    departmentPages[0];
  const normalizedQuery = normalizeTerritorySearch(query);
  const filtered = departmentPages.filter((department) =>
    normalizeTerritorySearch(`${department.name} ${department.capital}`).includes(normalizedQuery),
  );
  if (!selected) throw new Error("Department registry is empty");
  const stats = [
    [territoryTotals.departments, french ? "Départements" : "Depatman"],
    [territoryTotals.arrondissements, french ? "Arrondissements" : "Awondisman"],
    [territoryTotals.communes, french ? "Communes" : "Komin"],
    [territoryTotals.sections, french ? "Sections communales" : "Seksyon kominal"],
  ] as const;
  return (
    <PublicShell locale={locale} page="departments">
      <PublicHero
        eyebrow={french ? "Territoires d’Haïti" : "Teritwa Ayiti"}
        title={french ? "Les Départements d’Haïti" : "Depatman Ayiti yo"}
        description={
          french
            ? "10 départements, 149 communes. Découvrez la richesse de nos territoires, leurs communes et leurs repères."
            : "10 depatman, 149 komin. Dekouvri richès teritwa nou yo, komin yo ak repè yo."
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
            <label className="hg-sr-only" htmlFor="department-search">
              {french ? "Rechercher un département" : "Chèche yon depatman"}
            </label>
            <input
              id="department-search"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder={
                french
                  ? "Rechercher un département, un chef-lieu…"
                  : "Chèche yon depatman, yon chèflye…"
              }
            />
            <button type="submit">{french ? "Rechercher" : "Chèche"}</button>
          </form>
        </search>
      </PublicHero>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <div className="hg-public-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <section className="hg-public-section" aria-labelledby="territory-explorer">
          <div className="hg-public-section-heading">
            <h2 id="territory-explorer">
              {french ? "Explorez les départements" : "Eksplore depatman yo"}
            </h2>
            <p>
              {french
                ? "Sélectionnez un territoire pour découvrir sa fiche."
                : "Chwazi yon teritwa pou dekouvri fich li."}
            </p>
          </div>
          <div className="hg-public-directory-layout">
            <nav
              className="hg-public-panel hg-public-department-list"
              aria-label={french ? "Choisir un département" : "Chwazi yon depatman"}
            >
              {departmentPages.map((department) => (
                <button
                  key={department.departmentId}
                  type="button"
                  aria-pressed={selectedId === department.departmentId}
                  onClick={() => {
                    setSelectedId(department.departmentId);
                  }}
                >
                  {department.name}
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </nav>
            <div className="hg-public-panel hg-public-schematic">
              <PublicIcon kind="map" />
              <h3>{french ? "Un pays, dix territoires" : "Yon peyi, dis teritwa"}</h3>
              <div className="hg-public-schematic-grid">
                {departmentPages.map((department) => (
                  <button
                    type="button"
                    key={department.departmentId}
                    aria-pressed={selectedId === department.departmentId}
                    onClick={() => {
                      setSelectedId(department.departmentId);
                    }}
                  >
                    {department.name}
                  </button>
                ))}
              </div>
              <p className="hg-public-muted">
                {french
                  ? "Navigation schématique, non géographique. Les limites SIG vérifiées ne sont pas encore disponibles."
                  : "Navigasyon chematik, se pa yon kat jewografik. Limit SIG verifye yo poko disponib."}
              </p>
            </div>
            <article className="hg-public-panel hg-public-selected" aria-live="polite">
              <PublicArt src={selected.image} />
              <div>
                <h3>{selected.name}</h3>
                <dl className="hg-public-facts">
                  <div>
                    <dt>{french ? "Chef-lieu" : "Chèflye"}</dt>
                    <dd>{selected.capital}</dd>
                  </div>
                  <div>
                    <dt>{french ? "Arrondissements" : "Awondisman"}</dt>
                    <dd>{selected.arrondissementCount}</dd>
                  </div>
                  <div>
                    <dt>{french ? "Communes" : "Komin"}</dt>
                    <dd>{selected.communeCount}</dd>
                  </div>
                  <div>
                    <dt>{french ? "Sections communales" : "Seksyon kominal"}</dt>
                    <dd>{selected.communalSectionCount}</dd>
                  </div>
                </dl>
                <a className="hg-public-button" href={departmentHref(locale, selected.slug)}>
                  {french ? "Découvrir le département" : "Dekouvri depatman an"} →
                </a>
              </div>
            </article>
          </div>
        </section>
        <section className="hg-public-section" aria-labelledby="all-departments">
          <div className="hg-public-section-heading">
            <h2 id="all-departments">
              {french ? "Découvrez nos départements" : "Dekouvri depatman nou yo"}
            </h2>
            <p role="status">
              {filtered.length} / {departmentPages.length} {french ? "départements" : "depatman"}
            </p>
          </div>
          {filtered.length === 0 ? (
            <p role="status">
              {french ? "Aucun département trouvé." : "Pa gen depatman ki koresponn."}
            </p>
          ) : null}
          <div className="hg-public-grid hg-public-grid--four">
            {filtered.map((department) => (
              <article
                className="hg-public-card hg-public-department-card"
                key={department.departmentId}
              >
                <PublicArt src={department.image} />
                <div className="hg-public-card__body">
                  <h3>
                    <a href={departmentHref(locale, department.slug)}>{department.name}</a>
                  </h3>
                  <p>{department.capital}</p>
                  <p>
                    {department.communeCount} {french ? "communes" : "komin"} ·{" "}
                    {department.communalSectionCount} {french ? "sections" : "seksyon"}
                  </p>
                  <a href={departmentHref(locale, department.slug)}>
                    {french ? "Découvrir" : "Dekouvri"} →
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="hg-public-muted">
            {french ? "Source des dénombrements" : "Sous kantite yo"} :{" "}
            <a href={territorySource.url}>IHSI</a> · {territorySource.verifiedAt}.{" "}
            {french
              ? "Images illustratives, non documentaires."
              : "Imaj ilistrasyon, pa foto dokimantè."}
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
