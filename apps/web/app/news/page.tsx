import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function NewsPage() {
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/news" aria-current="page">
          Anons
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Pa gen anons ki pibliye san sous ak dat revizyon.
        </PublicInformationBanner>
        <section aria-labelledby="news-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Anons piblik</p>
          <h1 id="news-heading">Nouvèl ak anons</h1>
          <p>Kontni verifye ap parèt isit la lè sous piblik ak pwopriyetè kontni yo konfime.</p>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
