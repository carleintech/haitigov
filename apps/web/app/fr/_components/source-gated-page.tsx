import {
  GovernmentFooter,
  GovernmentHeader,
  PublicInformationBanner,
  SearchField,
} from "@haitigov/ui";
import type { ReactNode } from "react";

interface FrenchSourceGatedPageProps {
  banner: ReactNode;
  children?: ReactNode;
  currentHref: string;
  currentLabel: string;
  description: ReactNode;
  eyebrow: string;
  heading: string;
  headingId: string;
  search?: Readonly<{
    action?: string;
    defaultValue?: string;
    label: string;
    placeholder: string;
  }>;
}

export function FrenchSourceGatedPage({
  banner,
  children,
  currentHref,
  currentLabel,
  description,
  eyebrow,
  heading,
  headingId,
  search,
}: FrenchSourceGatedPageProps) {
  return (
    <>
      <GovernmentHeader>
        <a href="/fr">Accueil</a>
        <a aria-current="page" href={currentHref}>
          {currentLabel}
        </a>
        <a href="/">Kreyòl</a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content" lang="fr">
        <PublicInformationBanner>{banner}</PublicInformationBanner>
        <section aria-labelledby={headingId} className="hg-web-home__hero">
          <p className="hg-eyebrow">{eyebrow}</p>
          <h1 id={headingId}>{heading}</h1>
          <p>{description}</p>
          {search ? (
            <SearchField
              action={search.action ?? "/fr/recherche"}
              buttonLabel="Rechercher"
              defaultValue={search.defaultValue}
              maxLength={100}
              label={search.label}
              placeholder={search.placeholder}
            />
          ) : null}
        </section>
        {children}
      </main>
      <GovernmentFooter>
        <a href="/fr">Retour à l’accueil</a>
      </GovernmentFooter>
    </>
  );
}
