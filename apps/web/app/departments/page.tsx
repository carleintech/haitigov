import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function DepartmentsPage() {
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/departments" aria-current="page">
          Depatman
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Done teritoryal yo dwe swiv kodifikasyon IHSI ki pi resan ak sous legal yo.
        </PublicInformationBanner>
        <section aria-labelledby="departments-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Dekouvèt teritoryal</p>
          <h1 id="departments-heading">Depatman Ayiti</h1>
          <p>
            Hierachi depatman, awondisman, komin, ak seksyon kominal la ap parèt sèlman apre
            verifikasyon.
          </p>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/">Retounen nan akèy</a>
      </GovernmentFooter>
    </>
  );
}
