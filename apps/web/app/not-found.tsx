import { GovernmentFooter, GovernmentHeader, PublicInformationBanner } from "@haitigov/ui";

export default function NotFound() {
  return (
    <>
      <GovernmentHeader>
        <a href="/services">Sèvis</a>
        <a href="/institutions">Enstitisyon</a>
      </GovernmentHeader>
      <main className="hg-container hg-web-status" id="main-content">
        <PublicInformationBanner>
          Sa a se yon pwototip HaitiGov. Li pa reprezante yon sèvis oswa yon adopsyon ofisyèl.
        </PublicInformationBanner>
        <section aria-labelledby="not-found-heading" className="hg-web-status__content">
          <p className="hg-eyebrow">Erè 404</p>
          <h1 id="not-found-heading">Nou pa jwenn paj sa a.</h1>
          <p>Adrès la ka pa kòrèk, oswa paj la ka poko disponib nan pwototip la.</p>
          <a className="hg-button hg-button--primary hg-web-status__action" href="/">
            Retounen sou paj dakèy
          </a>
        </section>
        <section
          aria-labelledby="french-not-found-heading"
          className="hg-web-status__content"
          lang="fr"
        >
          <p className="hg-eyebrow">Français</p>
          <h2 id="french-not-found-heading">Cette page est introuvable.</h2>
          <p>L’adresse est peut-être incorrecte ou la page n’est pas encore disponible.</p>
          <a className="hg-button hg-button--secondary hg-web-status__action" href="/fr">
            Retour à l’accueil en français
          </a>
        </section>
      </main>
      <GovernmentFooter>
        <a href="/transparency">Sous ak verifikasyon</a>
      </GovernmentFooter>
    </>
  );
}
