import { type DepartmentPageRecord, departmentHref } from "../_data/departments.js";
import { type HomeLocale, homeRoutes, territorySource } from "../_data/homepage.js";
import {
  PendingContent,
  PrototypeNotice,
  PublicArt,
  PublicIcon,
  PublicShell,
} from "./public-page.js";

export function DepartmentPage({
  locale,
  department,
}: Readonly<{ locale: HomeLocale; department: DepartmentPageRecord }>) {
  const french = locale === "fr";
  const routes = french ? homeRoutes.fr : homeRoutes.ht;
  const sections = [
    ["overview", french ? "Présentation" : "Prezantasyon"],
    ["communes", french ? "Communes" : "Komin"],
    ["services", french ? "Services" : "Sèvis"],
    ["institutions", french ? "Institutions" : "Enstitisyon"],
    ["heritage", french ? "Patrimoine" : "Eritaj"],
    ["news", french ? "Actualités" : "Nouvèl"],
    ["projects", french ? "Projets" : "Pwojè"],
    ["documents", french ? "Documents" : "Dokiman"],
    ["media", french ? "Médiathèque" : "Medya"],
  ] as const;
  const facts = [
    [french ? "Chef-lieu" : "Chèflye", department.capital],
    [french ? "Arrondissements" : "Awondisman", department.arrondissementCount],
    [french ? "Communes" : "Komin", department.communeCount],
    [french ? "Sections communales" : "Seksyon kominal", department.communalSectionCount],
    [french ? "Quartiers" : "Katye", department.quartierCount],
    [french ? "Identifiant stable" : "Idantifyan estab", department.departmentId],
  ] as const;
  return (
    <PublicShell
      locale={locale}
      page="departments"
      languageLinks={{
        ht: departmentHref("ht", department.slug),
        fr: departmentHref("fr", department.slug),
      }}
    >
      <section className="hg-public-hero hg-department-hero" aria-labelledby="department-heading">
        <PublicArt src={department.image} className="hg-public-hero__art" eager />
        <div className="hg-container">
          <nav
            className="hg-department-breadcrumb"
            aria-label={french ? "Fil d’Ariane" : "Chemen navigasyon"}
          >
            <a href={routes.home}>{french ? "Accueil" : "Akèy"}</a> /{" "}
            <a href={routes.departments}>{french ? "Départements" : "Depatman"}</a> /{" "}
            {department.name}
          </nav>
          <div className="hg-department-heading">
            <figure className="hg-department-concept">
              <PublicArt src={department.concept} />
              <figcaption>
                {french ? "Emblème conceptuel · non officiel" : "Anblèm konseptyèl · pa ofisyèl"}
              </figcaption>
            </figure>
            <div>
              <p className="hg-portal-kicker">
                {french ? "Département d’Haïti" : "Depatman Ayiti"}
              </p>
              <h1 id="department-heading">{department.name}</h1>
              <p>
                {french ? "Chef-lieu" : "Chèflye"} : {department.capital} ·{" "}
                {department.communeCount} {french ? "communes" : "komin"}
              </p>
              <a className="hg-public-button hg-public-gold" href="#overview">
                {french ? "Découvrir le département" : "Dekouvri depatman an"} →
              </a>
            </div>
          </div>
          <p className="hg-public-art-label">
            {french
              ? "Paysage et emblème illustratifs, sans valeur documentaire ou officielle."
              : "Peyizaj ak anblèm se ilistrasyon, yo pa dokiman ni ofisyèl."}
          </p>
        </div>
      </section>
      <PrototypeNotice locale={locale} />
      <div className="hg-container">
        <nav
          className="hg-department-shortcuts"
          aria-label={french ? "Explorer cette fiche" : "Eksplore fich la"}
        >
          {sections.map(([id, name]) => (
            <a href={`#${id}`} key={id}>
              {name}
            </a>
          ))}
        </nav>
        <section className="hg-public-section" id="overview" aria-labelledby="overview-heading">
          <div className="hg-public-section-heading">
            <h2 id="overview-heading">
              {french ? "Le département en un coup d’œil" : "Depatman an nan yon kout je"}
            </h2>
          </div>
          <div className="hg-department-overview">
            <article className="hg-public-panel">
              <h3>{french ? "Repères territoriaux" : "Repè teritoryal"}</h3>
              <div className="hg-department-map-placeholder">
                <PublicIcon kind="map" />
                <p>{department.name}</p>
                <p className="hg-public-muted">
                  {french
                    ? "Carte SIG non disponible : limites géographiques à sourcer et valider."
                    : "Kat SIG pa disponib : fòk limit jewografik yo gen sous epi valide."}
                </p>
              </div>
              <p className="hg-public-muted">
                {french ? "Aucune géolocalisation collectée." : "Nou pa kolekte jeolokalizasyon."}
              </p>
            </article>
            <article className="hg-public-panel">
              <h3>{french ? "Informations clés" : "Enfòmasyon kle"}</h3>
              <dl className="hg-public-facts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <a href={department.sourceUrl}>
                {french ? "Consulter la source IHSI" : "Konsilte sous IHSI a"} ↗
              </a>
              <p className="hg-public-muted">
                {french ? "Vérification du registre" : "Verifikasyon rejis la"} :{" "}
                {territorySource.verifiedAt}.{" "}
                {french
                  ? "Population et superficie non publiées sans source validée."
                  : "Popilasyon ak sipèfisi pa pibliye san sous valide."}
              </p>
            </article>
            <article className="hg-public-panel" id="communes">
              <h3 id="communes-heading">
                {french ? "Les communes" : "Komin yo"} ({department.communeCount})
              </h3>
              <section
                className="hg-department-communes-scroll"
                aria-labelledby="communes-heading"
                // biome-ignore lint/a11y/noNoninteractiveTabindex: A scrollable region needs keyboard focus, including in Safari.
                tabIndex={0}
              >
                <ul className="hg-department-communes">
                  {department.communes.map((commune) => (
                    <li key={commune.communeId}>
                      <strong>{commune.name}</strong>
                      <small>
                        {commune.arrondissementName} · {commune.communeId}
                      </small>
                    </li>
                  ))}
                </ul>
              </section>
            </article>
          </div>
        </section>
        <section className="hg-public-section" id="heritage" aria-labelledby="heritage-heading">
          <div className="hg-public-section-heading">
            <h2 id="heritage-heading">
              {french ? "Un territoire à découvrir" : "Yon teritwa pou dekouvri"}
            </h2>
          </div>
          <div className="hg-public-grid">
            {[
              [
                "/discover/heritage.webp",
                french ? "Histoire & patrimoine" : "Istwa ak eritaj",
                routes.history,
              ],
              [
                department.image,
                french ? "Nature & paysages" : "Lanati ak peyizaj",
                routes.explore,
              ],
              [
                "/discover/culture.webp",
                french ? "Culture & traditions" : "Kilti ak tradisyon",
                `${routes.explore}#culture`,
              ],
            ].map(([image, title, href]) => (
              <article className="hg-public-card hg-public-feature" key={title}>
                <PublicArt src={image ?? department.image} />
                <h3>{title}</h3>
                <p>
                  {french
                    ? "Illustration thématique, non documentaire."
                    : "Ilistrasyon tematik, pa dokimantè."}
                </p>
                <a href={href}>{french ? "Explorer les ressources" : "Eksplore resous yo"} →</a>
              </article>
            ))}
          </div>
        </section>
        <div className="hg-public-two-column hg-public-section">
          <section id="news" aria-labelledby="department-news">
            <h2 id="department-news">
              {french ? "Actualités du département" : "Nouvèl depatman an"}
            </h2>
            <PendingContent
              locale={locale}
              title={french ? "Aucune actualité vérifiée" : "Pa gen nouvèl verifye"}
            />
            <p>
              <a href={routes.news}>
                {french ? "Consulter l’espace actualités" : "Gade espas nouvèl la"} →
              </a>
            </p>
          </section>
          <section id="media" aria-labelledby="department-media">
            <h2 id="department-media">
              {french ? "Le département en images" : "Depatman an nan imaj"}
            </h2>
            <div className="hg-public-video">
              <span aria-hidden="true">▷</span>
              <strong>{french ? "Vidéo à venir" : "Videyo ap vini"}</strong>
              <p>
                {french
                  ? "En attente d’une vidéo autorisée, sous-titrée et sourcée."
                  : "N ap tann yon videyo ki otorize, ki gen soutit ak sous."}
              </p>
            </div>
          </section>
        </div>
        <section className="hg-public-section" id="projects" aria-labelledby="projects-heading">
          <div className="hg-public-section-heading">
            <h2 id="projects-heading">
              {french ? "Projets & développement" : "Pwojè ak devlopman"}
            </h2>
          </div>
          <PendingContent
            locale={locale}
            title={french ? "Projets en attente de sources" : "Pwojè ap tann sous"}
          >
            {french
              ? "Aucun projet, budget ou taux d’avancement officiel n’est publié dans ce prototype."
              : "Pa gen pwojè, bidjè oswa pousantaj avansman ofisyèl ki pibliye nan pwototip sa a."}
          </PendingContent>
        </section>
        <section className="hg-public-section" aria-labelledby="department-access">
          <div className="hg-public-section-heading">
            <h2 id="department-access">{french ? "Accès utiles" : "Aksè itil"}</h2>
          </div>
          <div className="hg-public-grid">
            {[
              ["services", french ? "Services publics" : "Sèvis piblik", routes.services],
              [
                "institutions",
                french ? "Annuaire des institutions" : "Anyè enstitisyon yo",
                routes.institutions,
              ],
              [
                "documents",
                french ? "Documents & transparence" : "Dokiman ak transparans",
                routes.transparency,
              ],
            ].map(([id, title, href]) => (
              <article className="hg-public-card" id={id} key={id}>
                <div className="hg-public-card__body">
                  <PublicIcon />
                  <h3>{title}</h3>
                  <p>
                    {french
                      ? "Accès au répertoire national du prototype, sans prétendre à une disponibilité locale vérifiée."
                      : "Aksè nan anyè nasyonal pwototip la, san nou pa pretann gen disponiblite lokal verifye."}
                  </p>
                  <a href={href}>{french ? "Consulter" : "Konsilte"} →</a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PublicShell>
  );
}
