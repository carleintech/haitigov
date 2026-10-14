import { SearchField } from "@haitigov/ui";
import { getImageProps } from "next/image.js";
import { type HomeLocale, homeCopy, homeRoutes } from "../_data/homepage.js";
import { parseSearchQuery, searchPublicServices } from "../_data/public-services.js";
import { ServiceResults } from "./service-results.js";
import "./public-homepage.css";

const { props: brandProps } = getImageProps({
  src: "/haitigov-intro-logo.png",
  alt: "",
  width: 1254,
  height: 1254,
  sizes: "64px",
});

function Illustration() {
  const { props } = getImageProps({
    src: "/homepage-citadelle.webp",
    width: 2004,
    height: 785,
    sizes: "100vw",
    alt: "",
    loading: "eager",
    fetchPriority: "high",
  });
  // biome-ignore lint/performance/noImgElement: getImageProps provides responsive Next image optimization without a client component.
  return <img {...props} alt="" className="hg-portal-illustration" />;
}

const catalogCopy = {
  ht: {
    heroEyebrow: "Katalòg sèvis piblik",
    heading: "Jwenn sèvis piblik yo",
    description: "Yon pwen depa pou chèche enfòmasyon sou sèvis piblik.",
    search: "Ki sèvis oswa enfòmasyon w ap chèche?",
    searchButton: "Chèche",
    searchHint: "Egzanp: batistè, paspò, taks, edikasyon",
    suggestions: "Sijesyon rechèch:",
    categoriesHeading: "Eksplore pa sijè",
    categoriesNote:
      "Sijè sa yo se sijesyon pou rechèch. Yo pa konfime okenn sèvis disponib ni okenn enstitisyon ki ofri l.",
    categoryAction: "Chèche enfòmasyon",
    categories: [
      [
        "identity",
        "Idantite ak eta sivil",
        "Chèche enfòmasyon sou dokiman ak eta sivil.",
        "idantite",
      ],
      ["passport", "Paspò ak vwayaj", "Chèche enfòmasyon sou dokiman vwayaj.", "paspò"],
      ["education", "Edikasyon", "Chèche enfòmasyon sou etid ak fòmasyon.", "edikasyon"],
      ["health", "Sante", "Chèche enfòmasyon piblik sou sante.", "sante"],
      ["business", "Biznis ak komès", "Chèche enfòmasyon sou aktivite komèsyal yo.", "antrepriz"],
      ["tax", "Taks ak finans", "Chèche enfòmasyon sou taks ak obligasyon.", "taks"],
      ["housing", "Lojman", "Chèche enfòmasyon piblik sou lojman.", "lojman"],
      ["justice", "Lajistis", "Chèche enfòmasyon sou sèvis lajistis.", "jistis"],
    ],
    photoLabel: "Imaj ilistratif · se pa yon foto dokimantè",
    footerServices: "Sijè rechèch",
    footerInstitutions: "Enstitisyon ak teritwa",
    footerResources: "Resous",
    top: "Retounen anlè",
  },
  fr: {
    heroEyebrow: "Catalogue des services publics",
    heading: "Trouver un service public",
    description: "Un point de départ pour rechercher des informations sur les services publics.",
    search: "Quel service ou quelle information recherchez-vous ?",
    searchButton: "Rechercher",
    searchHint: "Exemple : acte de naissance, passeport, impôts, éducation",
    suggestions: "Suggestions de recherche :",
    categoriesHeading: "Explorer par thème",
    categoriesNote:
      "Ces thèmes sont des suggestions de recherche. Ils ne confirment ni la disponibilité d’un service ni l’institution qui le propose.",
    categoryAction: "Rechercher des informations",
    categories: [
      [
        "identity",
        "Identité et état civil",
        "Rechercher des informations sur les actes civils.",
        "état civil",
      ],
      [
        "passport",
        "Passeport et voyage",
        "Rechercher des informations sur les documents de voyage.",
        "passeport",
      ],
      [
        "education",
        "Éducation",
        "Rechercher des informations sur les études et la formation.",
        "éducation",
      ],
      ["health", "Santé", "Rechercher des informations publiques sur la santé.", "santé"],
      [
        "business",
        "Entreprises et commerce",
        "Rechercher des informations sur les activités commerciales.",
        "entreprise",
      ],
      [
        "tax",
        "Impôts et finances",
        "Rechercher des informations sur les impôts et obligations.",
        "impôts",
      ],
      ["housing", "Logement", "Rechercher des informations publiques sur le logement.", "logement"],
      ["justice", "Justice", "Rechercher des informations sur les services de justice.", "justice"],
    ],
    photoLabel: "Image illustrative · pas une photographie documentaire",
    footerServices: "Thèmes de recherche",
    footerInstitutions: "Institutions et territoires",
    footerResources: "Ressources",
    top: "Retour en haut",
  },
} as const;

const iconPaths: Readonly<Record<string, string>> = {
  identity: "M3 5h18v14H3z M7 9h3v3H7z M6 16h5 M14 9h4 M14 13h4 M14 16h4",
  passport: "M6 3h12v18H6z M9 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M9 16h6",
  education: "M2 8l10-5l10 5l-10 5z M6 11v6q6 5 12 0v-6 M22 8v9",
  health: "M12 3v18 M3 12h18",
  business: "M3 9l9-6l9 6z M5 10v9 M10 10v9 M14 10v9 M19 10v9 M3 21h18",
  tax: "M4 6q7-4 14 0v12q-7 4-14 0z M4 10q7 4 14 0 M4 14q7 4 14 0",
  housing: "M3 11l9-8l9 8 M5 10v11h14V10 M10 21v-7h4v7",
  justice: "M12 3v18 M5 6h14 M5 6l-3 7h6z M19 6l-3 7h6z M7 21h10",
};

function CategoryIcon({ name }: Readonly<{ name: string }>) {
  const path = new Map(Object.entries(iconPaths)).get(name);
  if (!path) throw new Error(`Unknown service catalogue icon: ${name}`);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export async function ServiceCatalogPage({
  locale,
  searchParams,
}: Readonly<{
  locale: HomeLocale;
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  const text = locale === "ht" ? homeCopy.ht : homeCopy.fr;
  const copy = locale === "ht" ? catalogCopy.ht : catalogCopy.fr;
  const routes = locale === "ht" ? homeRoutes.ht : homeRoutes.fr;
  const query = parseSearchQuery((await searchParams).q);
  const result =
    query === null
      ? { state: "invalid-query" as const }
      : await searchPublicServices(query, locale);
  const suggestions = copy.categories.slice(0, 4);
  const navigation = [
    { label: text.nav[0], href: routes.home },
    { label: text.nav[1], href: routes.services, current: true },
    { label: text.nav[2], href: routes.institutions },
    { label: text.nav[3], href: routes.departments },
    { label: text.nav[4], href: routes.explore },
    { label: text.nav[5], href: routes.transparency },
    { label: text.nav[6], href: routes.news },
  ];
  const serviceHref = (term: string) => `${routes.services}?q=${encodeURIComponent(term)}`;

  return (
    <div className="hg-portal" lang={locale} id="top">
      <div className="hg-portal-utility">
        <div className="hg-container">
          <span>
            <span className="hg-portal-flag" aria-hidden="true" />
            {text.country}
            <span className="hg-portal-utility__status"> · {text.proposed}</span>
          </span>
          <nav aria-label={text.languages}>
            <a
              href="/services"
              hrefLang="ht"
              lang="ht"
              aria-current={locale === "ht" ? "page" : undefined}
            >
              Kreyòl
            </a>
            <a
              href="/fr/services"
              hrefLang="fr"
              lang="fr"
              aria-current={locale === "fr" ? "page" : undefined}
            >
              Français
            </a>
            <a href="#accessibility">{text.accessibility}</a>
          </nav>
        </div>
      </div>
      <header className="hg-portal-header">
        <div className="hg-container">
          <a className="hg-portal-brand" href={routes.home}>
            {/* biome-ignore lint/performance/noImgElement: getImageProps provides responsive Next image optimization without a client component. */}
            <img {...brandProps} alt="" />
            <span>
              <strong>
                HAITI<span>GOV</span>
              </strong>
              <small>{text.proposed}</small>
            </span>
          </a>
          <nav className="hg-portal-desktop-nav" aria-label={text.navigation}>
            {navigation.map(({ current, href, label }) => (
              <a key={label} href={href} aria-current={current ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <details className="hg-portal-mobile-nav">
            <summary>{text.menu}</summary>
            <nav aria-label={text.navigation}>
              {navigation.map(({ current, href, label }) => (
                <a key={label} href={href} aria-current={current ? "page" : undefined}>
                  {label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>
      <main id="main-content">
        <section className="hg-portal-hero" aria-labelledby="service-catalog-heading">
          <Illustration />
          <div className="hg-container">
            <p className="hg-portal-kicker">{copy.heroEyebrow}</p>
            <h1 id="service-catalog-heading">{copy.heading}</h1>
            <p className="hg-portal-tagline">{copy.description}</p>
            <div className="hg-portal-search">
              <SearchField
                action={routes.services}
                buttonLabel={copy.searchButton}
                defaultValue={query ?? ""}
                label={copy.search}
                maxLength={100}
                placeholder={copy.searchHint}
              />
            </div>
            <div className="hg-portal-popular">
              <span>{copy.suggestions}</span>
              <div>
                {suggestions.map(([, label, , term]) => (
                  <a key={term} href={serviceHref(term)}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
            <div className="hg-portal-hero-meta">
              <p className="hg-portal-photo-label">{copy.photoLabel}</p>
            </div>
          </div>
        </section>
        <div className="hg-portal-notice">
          <div className="hg-container">{text.notice}</div>
        </div>
        <section
          className="hg-portal-section hg-portal-essential"
          id="service-themes"
          aria-labelledby="service-themes-heading"
        >
          <div className="hg-container">
            <h2 id="service-themes-heading">{copy.categoriesHeading}</h2>
            <p className="hg-portal-caption">{copy.categoriesNote}</p>
            <div className="hg-portal-service-grid">
              {copy.categories.map(([icon, label, description, term], index) => (
                <a
                  className={`hg-portal-service hg-portal-tone-${(index % 4).toString()}`}
                  href={serviceHref(term)}
                  key={term}
                >
                  <span className="hg-portal-icon">
                    <CategoryIcon name={icon} />
                  </span>
                  <div>
                    <h3>{label}</h3>
                    <p>{description}</p>
                    <span className="hg-portal-card-link">
                      {copy.categoryAction} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          className="hg-portal-section hg-portal-institutions"
          id="catalogue-results"
          aria-label={locale === "ht" ? "Rezilta katalòg sèvis la" : "Résultats du catalogue"}
        >
          <div className="hg-container">
            <ServiceResults locale={locale} result={result} />
          </div>
        </section>
      </main>
      <footer className="hg-portal-footer">
        <div className="hg-container">
          <div className="hg-portal-footer-grid">
            <div>
              <a className="hg-portal-brand" href={routes.home}>
                {/* biome-ignore lint/performance/noImgElement: getImageProps provides responsive Next image optimization without a client component. */}
                <img {...brandProps} alt="" />
                <span>
                  <strong>
                    HAITI<span>GOV</span>
                  </strong>
                  <small>{text.proposed}</small>
                </span>
              </a>
              <p>{text.initiative}</p>
              <span className="hg-portal-footer-badge">{text.footerNotice}</span>
            </div>
            <nav aria-label={copy.footerServices}>
              <h2>{copy.footerServices}</h2>
              {copy.categories.slice(0, 4).map(([, label, , term]) => (
                <a href={serviceHref(term)} key={term}>
                  {label}
                </a>
              ))}
            </nav>
            <nav aria-label={copy.footerInstitutions}>
              <h2>{copy.footerInstitutions}</h2>
              <a href={routes.institutions}>{text.nav[2]}</a>
              <a href={routes.departments}>{text.nav[3]}</a>
              <a href={routes.communes}>{text.communes}</a>
            </nav>
            <nav aria-label={copy.footerResources}>
              <h2>{copy.footerResources}</h2>
              <a href={routes.transparency}>{text.nav[5]}</a>
              <a href={routes.documents}>{text.transparencyCards[1]}</a>
              <a href={routes.news}>{text.nav[6]}</a>
              <a href="#accessibility">{text.accessibility}</a>
            </nav>
          </div>
          <details id="accessibility">
            <summary>
              {text.accessibility} / {text.help}
            </summary>
            <p>{text.accessibilityBody}</p>
          </details>
          <p className="hg-portal-credits">{text.illustrationCredits}</p>
          <div className="hg-portal-footer-bottom">
            <span>HaitiGov · {text.proposed}</span>
            <a href="#top">{copy.top} ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
