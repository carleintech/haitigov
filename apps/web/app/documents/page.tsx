import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function DocumentsPage() {
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/documents" aria-current="page">
          Dokiman
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Dokiman yo dwe gen sous, dat, vèsyon, ak estati piblikasyon.
        </PublicInformationBanner>
        <section aria-labelledby="documents-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Dokiman piblik</p>
          <h1 id="documents-heading">Dokiman ak resous</h1>
          <p>Katalòg dokiman an ap tann kontni ki pase revizyon ak klasifikasyon done.</p>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
