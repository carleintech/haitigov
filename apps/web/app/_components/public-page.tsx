import { getImageProps } from "next/image.js";
import type { ReactNode } from "react";
import { type HomeLocale, homeCopy, homeRoutes } from "../_data/homepage.js";
import "./public-homepage.css";
import "./public-pages.css";

export type PublicPageKey =
  | "institutions"
  | "departments"
  | "communes"
  | "explore"
  | "history"
  | "transparency"
  | "news";

export function publicPageHref(locale: HomeLocale, page: PublicPageKey): string {
  const routes = locale === "fr" ? homeRoutes.fr : homeRoutes.ht;
  switch (page) {
    case "explore":
      return routes.explore;
    case "institutions":
      return routes.institutions;
    case "departments":
      return routes.departments;
    case "communes":
      return routes.communes;
    case "history":
      return routes.history;
    case "transparency":
      return routes.transparency;
    case "news":
      return routes.news;
  }
}

export function PublicArt({
  src,
  className = "",
  eager = false,
}: Readonly<{ src: string; className?: string; eager?: boolean }>) {
  const { props } = getImageProps({
    src,
    width: 1200,
    height: 700,
    alt: "",
    sizes: "(max-width: 700px) 100vw, 70vw",
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });
  // biome-ignore lint/performance/noImgElement: getImageProps supplies responsive Next image optimization.
  return <img {...props} alt="" className={className} />;
}

export function PublicIcon({
  kind = "building",
}: Readonly<{ kind?: "building" | "map" | "document" | "people" | "chart" | "star" }>) {
  const paths = new Map([
    ["building", "M3 9l9-6l9 6z M5 10v10 M10 10v10 M14 10v10 M19 10v10 M3 21h18"],
    ["map", "M3 5l6-2l6 2l6-2v16l-6 2l-6-2l-6 2z M9 3v16 M15 5v16"],
    ["document", "M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6"],
    [
      "people",
      "M8 3a3 3 0 1 0 0 6a3 3 0 1 0 0-6 M17 5a2 2 0 1 0 0 4a2 2 0 1 0 0-4 M2 21v-5a6 6 0 0 1 12 0v5 M16 13q6 0 6 8",
    ],
    ["chart", "M4 21V12h3v9 M10 21V7h3v14 M16 21V3h3v18"],
    ["star", "M12 2l3 6l7 1l-5 5l1 7l-6-3l-6 3l1-7l-5-5l7-1z"],
  ]);
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths.get(kind)} />
    </svg>
  );
}

export function PublicShell({
  locale,
  page,
  children,
  languageLinks,
}: Readonly<{
  locale: HomeLocale;
  page: PublicPageKey;
  children: ReactNode;
  languageLinks?: Readonly<{ ht: string; fr: string }>;
}>) {
  const text = locale === "fr" ? homeCopy.fr : homeCopy.ht;
  const routes = locale === "fr" ? homeRoutes.fr : homeRoutes.ht;
  const links = languageLinks ?? { ht: publicPageHref("ht", page), fr: publicPageHref("fr", page) };
  const navigation = [
    [text.nav[0], routes.home],
    [text.nav[1], routes.services],
    [text.nav[2], routes.institutions],
    [text.nav[3], routes.departments],
    [text.nav[4], routes.explore],
    [text.nav[5], routes.transparency],
    [text.nav[6], routes.news],
  ] as const;
  const brand = (
    <a className="hg-portal-brand" href={routes.home}>
      <PublicArt src="/haitigov-intro-logo.png" />
      <span>
        <strong>
          Haiti<span>Gov</span>
        </strong>
        <small>{text.proposed}</small>
      </span>
    </a>
  );
  return (
    <div className={`hg-portal hg-public hg-public--${page}`} lang={locale} id="top">
      <div className="hg-portal-utility">
        <div className="hg-container">
          <span>
            <span className="hg-portal-flag" aria-hidden="true" />
            {text.country}
            <span className="hg-portal-utility__status"> · {text.proposed}</span>
          </span>
          <nav aria-label={text.languages}>
            <a
              href={links.ht}
              hrefLang="ht"
              lang="ht"
              aria-current={locale === "ht" ? "page" : undefined}
            >
              Kreyòl
            </a>
            <a
              href={links.fr}
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
          {brand}
          <nav className="hg-portal-desktop-nav" aria-label={text.navigation}>
            {navigation.map(([label, href]) => (
              <a
                key={href}
                href={href}
                aria-current={href === publicPageHref(locale, page) ? "page" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="hg-portal-account" href="#account-notice">
            <PublicIcon kind="people" />
            {text.myHaiti}
            <small>{text.planned}</small>
          </a>
          <details className="hg-portal-mobile-nav">
            <summary>{text.menu}</summary>
            <nav aria-label={text.navigation}>
              {navigation.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
              <a href={routes.history}>{locale === "fr" ? "Histoire d’Haïti" : "Istwa Ayiti"}</a>
            </nav>
          </details>
        </div>
      </header>
      <main id="main-content" lang={locale}>
        {children}
      </main>
      <footer className="hg-portal-footer">
        <div className="hg-container">
          <div className="hg-portal-footer-grid">
            <div>
              {brand}
              <p>{text.initiative}</p>
              <span className="hg-portal-footer-badge">{text.footerNotice}</span>
            </div>
            <nav aria-label={text.nav[1]}>
              <h2>{text.nav[1]}</h2>
              {text.serviceCards.map(([, title, , query]) => (
                <a key={query} href={`${routes.services}?q=${encodeURIComponent(query)}`}>
                  {title}
                </a>
              ))}
            </nav>
            <nav aria-label={text.nav[4]}>
              <h2>{text.nav[4]}</h2>
              <a href={routes.explore}>{text.discover}</a>
              <a href={routes.history}>{locale === "fr" ? "Histoire d’Haïti" : "Istwa Ayiti"}</a>
              <a href={routes.departments}>{text.nav[3]}</a>
              <a href={routes.communes}>{text.communes}</a>
            </nav>
            <nav aria-label={text.resources}>
              <h2>{text.resources}</h2>
              <a href={routes.institutions}>{text.nav[2]}</a>
              <a href={routes.documents}>{text.transparencyCards[1]}</a>
              <a href={routes.transparency}>{text.nav[5]}</a>
              <a href={routes.news}>{text.nav[6]}</a>
              <a href="#accessibility">{text.accessibility}</a>
            </nav>
          </div>
          <details id="account-notice">
            <summary>
              {text.myHaiti} · {text.planned}
            </summary>
            <p>{text.personalBody}</p>
          </details>
          <details id="accessibility">
            <summary>
              {text.accessibility} / {text.help}
            </summary>
            <p>{text.accessibilityBody}</p>
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

export function PublicHero({
  eyebrow,
  title,
  description,
  image,
  children,
}: Readonly<{
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  children?: ReactNode;
}>) {
  return (
    <section className="hg-public-hero" aria-labelledby="public-page-heading">
      <PublicArt src={image} eager className="hg-public-hero__art" />
      <div className="hg-container">
        <p className="hg-portal-kicker">{eyebrow}</p>
        <h1 id="public-page-heading">{title}</h1>
        <p className="hg-public-hero__description">{description}</p>
        {children}
        <p className="hg-public-art-label">Illustration · HaitiGov</p>
      </div>
    </section>
  );
}

export function PrototypeNotice({ locale }: Readonly<{ locale: HomeLocale }>) {
  return (
    <div className="hg-portal-notice">
      <div className="hg-container">
        {locale === "fr" ? homeCopy.fr.notice : homeCopy.ht.notice}
      </div>
    </div>
  );
}

export function PendingContent({
  locale,
  title,
  children,
}: Readonly<{ locale: HomeLocale; title: string; children?: ReactNode }>) {
  return (
    <div className="hg-public-pending">
      <PublicIcon kind="document" />
      <div>
        <h3>{title}</h3>
        <p>
          {children ??
            (locale === "fr"
              ? "Aucun contenu vérifié publié. Les sources, dates et responsables éditoriaux doivent être confirmés avant publication."
              : "Pa gen kontni verifye ki pibliye. Fòk sous, dat ak responsab kontni yo konfime anvan piblikasyon.")}
        </p>
      </div>
    </div>
  );
}
