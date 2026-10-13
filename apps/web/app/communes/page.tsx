import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function CommunesPage() {
  return (
    <>
      <GovernmentHeader>
        <a href="/">Akèy</a>
        <a href="/communes" aria-current="page">
          Komin
        </a>
      </GovernmentHeader>
      <main className="hg-container hg-web-home" id="main-content">
        <PublicInformationBanner>
          Relasyon komin yo dwe soti nan kodifikasyon IHSI verifye; pwototip la pa devine parentaj.
        </PublicInformationBanner>
        <section aria-labelledby="communes-heading" className="hg-web-home__hero">
          <p className="hg-eyebrow">Dekouvèt teritoryal</p>
          <h1 id="communes-heading">Komin yo</h1>
          <p>Lis komin yo ak parentaj yo ap disponib apre dosye teritoryal la fin konfime.</p>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/departments">Gade depatman yo</a>
      </GovernmentFooter>
    </>
  );
}
