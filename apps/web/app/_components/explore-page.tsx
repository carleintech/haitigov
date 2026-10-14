"use client";

import { useState } from "react";
import { departmentHref, departmentPages } from "../_data/departments.js";
import { type HomeLocale, homeRoutes } from "../_data/homepage.js";
import {
  PendingContent,
  PrototypeNotice,
  PublicArt,
  PublicHero,
  PublicIcon,
  PublicShell,
} from "./public-page.js";

export function ExplorePage({ locale }: Readonly<{ locale: HomeLocale }>) {
  const french = locale === "fr";
  const routes = french ? homeRoutes.fr : homeRoutes.ht;
  const [query, setQuery] = useState("");
  const topics = [
    {
      id: "heritage",
      image: "/discover/heritage.webp",
      title: french ? "Un patrimoine à transmettre" : "Yon eritaj pou transmèt",
      body: french
        ? "Le Parc national historique : Citadelle, Sans-Souci, Ramiers. Une référence inscrite au patrimoine mondial."
        : "Pak nasyonal istorik : Sitadèl, Sans-Souci, Ramiers. Yon referans ki sou lis eritaj mondyal.",
      href: "https://whc.unesco.org/en/list/180/",
      link: "UNESCO",
      ready: true,
    },
    {
      id: "culture",
      image: "/discover/culture.webp",
      title: french ? "Culture & traditions" : "Kilti ak tradisyon",
      body: french
        ? "Un espace pour les arts, les expressions et les mémoires d’Haïti. Collection éditoriale à documenter."
        : "Yon espas pou atizay, ekspresyon ak memwa Ayiti. Koleksyon editoryal pou dokimante.",
      href: "#editorial",
      link: french ? "État de la collection" : "Estati koleksyon an",
      ready: false,
    },
    {
      id: "nature",
      image: "/discover/beach.webp",
      title: french ? "Nature & paysages" : "Lanati ak peyizaj",
      body: french
        ? "Explorez les fiches des dix départements. Ces illustrations ne décrivent ni les conditions actuelles ni l’accès aux sites."
        : "Eksplore fich dis depatman yo. Ilistrasyon sa yo pa dekri kondisyon aktyèl ni aksè nan sit yo.",
      href: routes.departments,
      link: french ? "Explorer les territoires" : "Eksplore teritwa yo",
      ready: true,
    },
    {
      id: "food",
      image: "/discover/food.webp",
      title: french ? "Saveurs d’Haïti" : "Gou Ayiti",
      body: french
        ? "Gastronomie et savoir-faire : futurs récits à sourcer et à faire réviser."
        : "Gastronomi ak konesans : istwa pou jwenn sous ak revizyon.",
      href: "#editorial",
      link: french ? "Collection en préparation" : "Koleksyon an preparasyon",
      ready: false,
    },
    {
      id: "jacmel",
      image: "/discover/jacmel.webp",
      title: "Jacmel",
      body: french
        ? "Chef-lieu du Sud-Est dans le registre territorial. Découvrez les communes du département."
        : "Chèflye Sidès nan rejis teritoryal la. Dekouvri komin depatman an.",
      href: departmentHref(locale, "sud-est"),
      link: french ? "Découvrir le Sud-Est" : "Dekouvri Sidès",
      ready: true,
    },
    {
      id: "history",
      image: "/homepage-citadelle.webp",
      title: french ? "Une histoire à découvrir" : "Yon istwa pou dekouvri",
      body: french
        ? "Des repères avant la colonisation jusqu’à l’époque contemporaine, accompagnés de leurs sources."
        : "Repè depi anvan kolonizasyon rive nan epòk kontanporen an, avèk sous yo.",
      href: routes.history,
      link: french ? "Histoire d’Haïti" : "Istwa Ayiti",
      ready: true,
    },
    {
      id: "water",
      image: "/discover/waterfall.webp",
      title: french ? "Eaux & montagnes" : "Dlo ak mòn",
      body: french
        ? "Paysages illustrés : les sites et itinéraires attendent une documentation validée."
        : "Peyizaj ilistre : sit ak wout yo ap tann dokimantasyon valide.",
      href: "#editorial",
      link: french ? "En préparation" : "An preparasyon",
      ready: false,
    },
  ];
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLocaleLowerCase(locale);
  const filtered = topics.filter((topic) =>
    normalize(`${topic.title} ${topic.body}`).includes(normalize(query.trim())),
  );
  return (
    <PublicShell locale={locale} page="explore">
      <PublicHero
        eyebrow={french ? "Patrimoine · culture · territoires" : "Eritaj · kilti · teritwa"}
        title={french ? "Explorez Haïti" : "Dekouvri Ayiti"}
        description={
          french
            ? "Une terre d’histoire, de culture et de beauté. Découvrez les richesses d’Haïti à travers des ressources et des territoires à explorer."
            : "Yon tè ki chaje ak istwa, kilti ak bote. Dekouvri richès Ayiti nan resous ak teritwa pou eksplore."
        }
        image="/homepage-citadelle.webp"
      >
        <search>
          <form
            className="hg-public-search"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label htmlFor="explore-search" className="hg-sr-only">
              {french ? "Rechercher dans les découvertes" : "Chèche nan dekouvèt yo"}
            </label>
            <input
              id="explore-search"
              type="search"
              maxLength={100}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder={
                french
                  ? "Rechercher un lieu, une histoire, une découverte…"
                  : "Chèche yon kote, yon istwa, yon dekouvèt…"
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
          aria-label={french ? "Thèmes de découverte" : "Tèm dekouvèt"}
        >
          {topics.slice(0, 4).map((topic) => (
            <a href={`#${topic.id}`} key={topic.id}>
              {topic.title}
            </a>
          ))}
        </nav>
        <section className="hg-public-section" aria-labelledby="explore-heading">
          <div className="hg-public-section-heading">
            <h2 id="explore-heading">
              {french ? "Découvrez les richesses d’Haïti" : "Dekouvri richès Ayiti"}
            </h2>
            <p>
              {french
                ? "Histoire, patrimoine, culture et territoires."
                : "Istwa, eritaj, kilti ak teritwa."}
            </p>
          </div>
          <p role="status">
            {filtered.length} {french ? "découvertes" : "dekouvèt"}
          </p>
          <div className="hg-public-grid">
            {filtered.map((topic) => (
              <article className="hg-public-card" id={topic.id} key={topic.id}>
                <PublicArt src={topic.image} />
                <div className="hg-public-card__body">
                  <span className="hg-public-tag">
                    {topic.ready
                      ? french
                        ? "Ressource disponible"
                        : "Resous disponib"
                      : french
                        ? "Collection en préparation"
                        : "Koleksyon an preparasyon"}
                  </span>
                  <h3>{topic.title}</h3>
                  <p>{topic.body}</p>
                  <a href={topic.href}>{topic.link} →</a>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p>
              {french
                ? "Aucune découverte ne correspond à votre recherche."
                : "Pa gen dekouvèt ki koresponn ak rechèch ou a."}
            </p>
          ) : null}
        </section>
        <section className="hg-public-section" aria-labelledby="destination-heading">
          <div className="hg-public-section-heading">
            <h2 id="destination-heading">
              {french ? "Destinations à explorer" : "Destinasyon pou eksplore"}
            </h2>
            <p>
              {french
                ? "Parcourez les dix départements du registre."
                : "Gade dis depatman rejis la."}
            </p>
          </div>
          <div className="hg-public-grid hg-public-grid--four">
            {departmentPages.map((department) => (
              <article className="hg-public-card" key={department.departmentId}>
                <PublicArt src={department.image} />
                <div className="hg-public-card__body">
                  <h3>
                    <a href={departmentHref(locale, department.slug)}>{department.name}</a>
                  </h3>
                  <p>
                    {department.capital} · {department.communeCount} {french ? "communes" : "komin"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="hg-public-section" id="editorial" aria-labelledby="editorial-heading">
          <div className="hg-public-section-heading">
            <h2 id="editorial-heading">
              {french
                ? "Un patrimoine vivant, des récits à partager"
                : "Yon eritaj vivan, istwa pou pataje"}
            </h2>
          </div>
          <PendingContent
            locale={locale}
            title={french ? "Vidéos, diaporamas & récits" : "Videyo, dyaporama ak istwa"}
          >
            {french
              ? "Les nouvelles collections attendent des sources, des autorisations de diffusion, des légendes et des traductions révisées. Aucune réservation ni information de sécurité de voyage n’est fournie."
              : "Nouvo koleksyon yo ap tann sous, otorizasyon difizyon, lejann ak tradiksyon revize. Nou pa ofri rezèvasyon ni enfòmasyon sou sekirite vwayaj."}
          </PendingContent>
          <p>
            <a href="https://whc.unesco.org/en/list/180/">
              <PublicIcon kind="document" /> UNESCO · Parc national historique ↗
            </a>
          </p>
        </section>
      </div>
    </PublicShell>
  );
}
