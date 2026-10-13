import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function TransparencyPage() {
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/transparency" aria-current="page">
          Transparans
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Pa gen done transparans ki pibliye kòm ofisyèl nan pwototip sa a.
        </PublicInformationBanner>
        <section aria-labelledby="transparency-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Transparans</p>
          <h1 id="transparency-heading">Done piblik ak responsabilite</h1>
          <p>
            Chak seri done dwe gen yon pwopriyetè, sous, klasifikasyon, dat mizajou, ak estati
            revizyon.
          </p>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
