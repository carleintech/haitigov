import { SearchField } from "@haitigov/ui";
import { getImageProps } from "next/image.js";
import {
  type HomeLocale,
  homeCopy,
  homeRoutes,
  territorySource,
  territoryTotals,
} from "../_data/homepage.js";
import { searchPublicInstitutions } from "../_data/public-institutions.js";
import { DepartmentExplorer } from "./department-explorer.js";
import { InstitutionResults } from "./institution-results.js";
import "./public-homepage.css";

const { props: brandProps } = getImageProps({
  src: "/haitigov-intro-logo.png",
  alt: "",
  width: 1254,
  height: 1254,
  sizes: "64px",
});

function Illustration({
  src,
  width,
  height,
  sizes,
  eager = false,
}: Readonly<{ src: string; width: number; height: number; sizes: string; eager?: boolean }>) {
  const { props } = getImageProps({
    src,
    width,
    height,
    sizes,
    alt: "",
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });
  // biome-ignore lint/performance/noImgElement: getImageProps provides responsive Next image optimization without an additional client component.
  return <img {...props} alt="" className="hg-portal-illustration" />;
}

const iconPaths: Readonly<Record<string, string>> = {
  id: "M3 5h18v14H3z M7 9h3v3H7z M6 16h5 M14 9h4 M14 13h4 M14 16h4",
  passport: "M6 3h12v18H6z M9 8a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M9 16h6",
  document: "M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6",
  building: "M3 9l9-6l9 6z M5 10v9 M10 10v9 M14 10v9 M19 10v9 M3 21h18",
  birth: "M12 3v3 M9 4h6 M5 13a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M9 13h.01 M15 13h.01 M9 16q3 3 6 0",
  education: "M2 8l10-5l10 5l-10 5z M6 11v6q6 5 12 0v-6 M22 8v9",
  work: "M3 8h18v12H3z M8 8V4h8v4 M3 13h18 M10 13v3h4v-3",
  home: "M3 11l9-8l9 8 M5 10v11h14V10 M10 21v-7h4v7",
  car: "M4 10l2-6h12l2 6 M3 10h18v8H3z M5 18v3 M19 18v3 M6 14h2 M16 14h2",
  travel: "M3 11l8-1V4l2-1l1 7l7 2v2l-7-1l-1 6l3 2v1l-5-1l-4 1v-1l3-2v-6l-7 1z",
  money: "M4 6q7-4 14 0v12q-7 4-14 0z M4 10q7 4 14 0 M4 14q7 4 14 0",
  family:
    "M8 4a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M17 6a2 2 0 1 0 0 4a2 2 0 1 0 0-4 M3 21v-5a5 5 0 0 1 10 0v5 M15 14h3l3 7h-6",
  justice: "M12 3v18 M5 6h14 M5 6l-3 7h6z M19 6l-3 7h6z M7 21h10",
};

function Icon({ name }: Readonly<{ name: string }>) {
  const path = new Map(Object.entries(iconPaths)).get(name);
  if (!path) throw new Error(`Unknown homepage icon: ${name}`);
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

function Brand({ locale }: Readonly<{ locale: HomeLocale }>) {
  const routes = locale === "ht" ? homeRoutes.ht : homeRoutes.fr;
  const text = locale === "ht" ? homeCopy.ht : homeCopy.fr;
  return (
    <a className="hg-portal-brand" href={routes.home}>
      {/* biome-ignore lint/performance/noImgElement: getImageProps supplies Next optimized image props with NodeNext-compatible imports. */}
      <img {...brandProps} alt="" />
      <span>
        <strong>
          HAITI<span>GOV</span>
        </strong>
        <small>{text.proposed}</small>
      </span>
    </a>
  );
}

export async function PublicHomepage({ locale }: Readonly<{ locale: HomeLocale }>) {
  const text = locale === "ht" ? homeCopy.ht : homeCopy.fr;
  const routes = locale === "ht" ? homeRoutes.ht : homeRoutes.fr;
  const institutionResult = await searchPublicInstitutions("");
  const previewResult =
    institutionResult.state === "ready"
      ? {
          ...institutionResult,
          items: institutionResult.items.slice(0, 4),
          hasMore: institutionResult.hasMore || institutionResult.items.length > 4,
        }
      : institutionResult;
  const navigation = [
    { label: text.nav[0], href: routes.home },
    { label: text.nav[1], href: routes.services },
    { label: text.nav[2], href: routes.institutions },
    { label: text.nav[3], href: routes.departments },
    { label: text.nav[4], href: routes.explore },
    { label: text.nav[5], href: routes.transparency },
    { label: text.nav[6], href: routes.news },
  ];
  const serviceHref = (query: string) => `${routes.services}?q=${encodeURIComponent(query)}`;

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
            <a href="/" hrefLang="ht" lang="ht" aria-current={locale === "ht" ? "page" : undefined}>
              Kreyòl
            </a>
            <a
              href="/fr"
              hrefLang="fr"
              lang="fr"
              aria-current={locale === "fr" ? "page" : undefined}
            >
              Français
            </a>
            <a href="#accessibility">{text.accessibility}</a>
            <a href="#accessibility">{text.help}</a>
          </nav>
        </div>
      </div>
      <header className="hg-portal-header">
        <div className="hg-container">
          <Brand locale={locale} />
          <nav className="hg-portal-desktop-nav" aria-label={text.navigation}>
            {navigation.map(({ label, href }, index) => (
              <a key={label} href={href} aria-current={index === 0 ? "page" : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <a className="hg-portal-account" href="#mon-haiti">
            <Icon name="id" />
            {text.myHaiti}
            <small>{text.planned}</small>
          </a>
          <details className="hg-portal-mobile-nav">
            <summary>{text.menu}</summary>
            <nav aria-label={text.navigation}>
              {navigation.map(({ label, href }) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </header>
      <main id="main-content">
        <section className="hg-portal-hero" aria-labelledby="welcome-heading">
          <Illustration
            src="/homepage-citadelle.webp"
            width={2004}
            height={785}
            sizes="100vw"
            eager
          />
          <div className="hg-container">
            <p className="hg-portal-kicker">{text.welcome}</p>
            <h1 id="welcome-heading" className="hg-portal-hero-title">
              HaitiGov
            </h1>
            <p className="hg-portal-tagline">{text.tagline}</p>
            <div className="hg-portal-search">
              <SearchField
                action={routes.search}
                buttonLabel={text.searchButton}
                label={text.search}
                placeholder={text.searchHint}
                maxLength={100}
              />
            </div>
            <div className="hg-portal-popular">
              <span>{text.popular}</span>
              <div>
                {text.serviceCards.map(([, title, , query]) => (
                  <a key={query} href={serviceHref(query)}>
                    {title}
                  </a>
                ))}
              </div>
            </div>
            <div className="hg-portal-hero-meta">
              <label className="hg-portal-motion-control">
                <input type="checkbox" id="home-motion" />
                {text.pauseEffects}
              </label>
              <p className="hg-portal-photo-label">{text.illustration}</p>
            </div>
          </div>
        </section>
        <div className="hg-portal-notice">
          <div className="hg-container">{text.notice}</div>
        </div>
        <section
          className="hg-portal-section hg-portal-essential"
          id="services"
          aria-labelledby="essential-heading"
        >
          <div className="hg-container">
            <div className="hg-portal-section-heading">
              <h2 id="essential-heading">{text.essential}</h2>
              <a href={routes.services}>
                {text.allServices} <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hg-portal-caption">{text.catalogue}</p>
            <div className="hg-portal-service-grid">
              {text.serviceCards.map(([icon, title, description, query], index) => (
                <a
                  className={`hg-portal-service hg-portal-tone-${index.toString()}`}
                  href={serviceHref(query)}
                  key={query}
                >
                  <span className="hg-portal-icon">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="hg-portal-card-link">
                      {text.searchButton} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="hg-portal-personal" id="mon-haiti" aria-labelledby="personal-heading">
          <Illustration src="/homepage-citizen.webp" width={1931} height={814} sizes="100vw" />
          <div className="hg-container">
            <div className="hg-portal-personal__copy">
              <p className="hg-portal-kicker">{text.personal}</p>
              <h2 id="personal-heading">{text.myHaiti}</h2>
              <h3>{text.personalTitle}</h3>
              <p>{text.personalBody}</p>
              <a className="hg-button" href={routes.services}>
                {text.learn} <span aria-hidden="true">→</span>
              </a>
              <ul className="hg-portal-principles">
                {text.principles.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="hg-portal-dashboard">
              <span className="hg-portal-dashboard__badge">{text.preview}</span>
              <h3>{text.myHaiti}</h3>
              {text.previewRows.map((label, index) => (
                <div className="hg-portal-dashboard__row" key={label}>
                  <Icon name={index === 1 ? "document" : "id"} />
                  <span>{label}</span>
                  <small>{text.planned}</small>
                </div>
              ))}
              <p>{text.footerNotice}</p>
            </div>
            <p className="hg-portal-visual-note">{text.illustration}</p>
          </div>
        </section>
        <section className="hg-portal-section" aria-labelledby="life-heading">
          <div className="hg-container">
            <h2 id="life-heading">{text.life}</h2>
            <p className="hg-portal-caption">{text.lifeBody}</p>
            <div className="hg-portal-life-grid">
              {text.lifeEvents.map(([icon, label, query]) => (
                <a href={serviceHref(query)} key={label}>
                  <Icon name={icon} />
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </div>
        </section>
        <section
          className="hg-portal-section hg-portal-institutions"
          id="institutions"
          aria-labelledby="institutions-heading"
        >
          <div className="hg-container">
            <div className="hg-portal-section-heading">
              <h2 id="institutions-heading">{text.institutions}</h2>
              <a href={routes.institutions}>
                {text.allInstitutions} <span aria-hidden="true">→</span>
              </a>
            </div>
            <p className="hg-portal-caption">{text.institutionsBody}</p>
            <InstitutionResults locale={locale} result={previewResult} />
          </div>
        </section>
        <section
          className="hg-portal-territory"
          id="territories"
          aria-labelledby="territory-heading"
        >
          <Illustration src="/homepage-explore.webp" width={1983} height={793} sizes="100vw" />
          <div className="hg-container">
            <div>
              <p className="hg-portal-kicker">{text.country}</p>
              <h2 id="territory-heading">{text.territory}</h2>
              <p className="hg-portal-tagline">{text.territoryBody}</p>
              <a className="hg-button" href={routes.departments}>
                {text.territoryLink} <span aria-hidden="true">→</span>
              </a>
              <p className="hg-portal-source-note">{text.sourceNote}</p>
            </div>
            <DepartmentExplorer locale={locale} />
            <p className="hg-portal-visual-note">{text.illustration}</p>
          </div>
        </section>
        <section className="hg-portal-section" id="explore" aria-labelledby="discover-heading">
          <div className="hg-container">
            <h2 id="discover-heading">{text.discover}</h2>
            <p className="hg-portal-caption">{text.discoverBody}</p>
            <div className="hg-portal-discover-grid">
              <article className="hg-portal-discover-card">
                <Illustration
                  src="/homepage-citadelle.webp"
                  width={2004}
                  height={785}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div>
                  <span className="hg-portal-image-caption">{text.illustration}</span>
                  <h3>{text.heritage}</h3>
                  <p>{text.heritageBody}</p>
                  <a href="https://whc.unesco.org/en/list/180/">
                    {text.unesco} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
              <article className="hg-portal-discover-card">
                <Illustration
                  src="/homepage-coast.webp"
                  width={1983}
                  height={793}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div>
                  <span className="hg-portal-image-caption">{text.illustration}</span>
                  <h3>{text.destination}</h3>
                  <p>{text.destinationBody}</p>
                  <a href={routes.departments}>
                    {text.territoryLink} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
              <article className="hg-portal-discover-card">
                <Illustration
                  src="/homepage-culture.webp"
                  width={1983}
                  height={793}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div>
                  <span className="hg-portal-image-caption">{text.illustration}</span>
                  <h3>{text.culture}</h3>
                  <p>{text.cultureBody}</p>
                  <a href={routes.history}>
                    {text.readHistory} <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
        <section className="hg-portal-section hg-portal-data" aria-labelledby="numbers-heading">
          <div className="hg-container hg-portal-data-grid">
            <div>
              <h2 id="numbers-heading">{text.numbers}</h2>
              <p className="hg-portal-caption">{text.numbersBody}</p>
              <dl className="hg-portal-stats">
                {[
                  [territoryTotals.departments, text.nav[3]],
                  [territoryTotals.communes, text.communes],
                  [territoryTotals.arrondissements, text.arrondissements],
                  [territoryTotals.sections, text.sections],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="hg-portal-caption">
                <a href={territorySource.url}>{text.source} ↗</a> · {text.verified} :{" "}
                {territorySource.verifiedAt}
              </p>
            </div>
            <div className="hg-portal-open">
              <Illustration
                src="/homepage-open.webp"
                width={1983}
                height={793}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <span className="hg-portal-image-caption">{text.illustration}</span>
              <h2>{text.open}</h2>
              <p className="hg-portal-caption">{text.openBody}</p>
              <div className="hg-portal-open-grid">
                {text.transparencyCards.map((label, index) => (
                  <a key={label} href={index === 1 ? routes.documents : routes.transparency}>
                    <Icon name={index === 1 ? "document" : "building"} />
                    {label}
                    <span aria-hidden="true">→</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="hg-portal-section" aria-labelledby="news-heading">
          <div className="hg-container hg-portal-news">
            <div>
              <h2 id="news-heading">{text.news}</h2>
              <p>{text.newsBody}</p>
            </div>
            <a href={routes.news}>
              {text.newsLink} <span aria-hidden="true">→</span>
            </a>
            <a href={routes.documents}>
              {text.documentsLink} <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      </main>
      <footer className="hg-portal-footer">
        <div className="hg-container">
          <div className="hg-portal-footer-grid">
            <div>
              <Brand locale={locale} />
              <p>{text.initiative}</p>
              <span className="hg-portal-footer-badge">{text.footerNotice}</span>
            </div>
            <nav aria-label={text.nav[1]}>
              <h2>{text.nav[1]}</h2>
              {text.serviceCards.map(([, title, , query]) => (
                <a href={serviceHref(query)} key={query}>
                  {title}
                </a>
              ))}
            </nav>
            <nav aria-label={text.nav[2]}>
              <h2>{text.nav[2]}</h2>
              <a href={routes.institutions}>{text.nav[2]}</a>
              <a href={routes.ministries}>{locale === "fr" ? "Ministères" : "Ministè"}</a>
              <a href={routes.departments}>{text.nav[3]}</a>
              <a href={routes.communes}>{text.communes}</a>
            </nav>
            <nav aria-label={text.resources}>
              <h2>{text.resources}</h2>
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
            <p id="help">{text.accessibilityBody}</p>
          </details>
          <p className="hg-portal-credits">{text.illustrationCredits}</p>
          <div className="hg-portal-footer-bottom">
            <span>HaitiGov · {text.proposed}</span>
            <a href="#top">{text.top} ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
