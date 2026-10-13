import { FrenchSourceGatedPage } from "./_components/source-gated-page.js";

export default function FrenchNotFound() {
  return (
    <FrenchSourceGatedPage
      banner="Ce site est un prototype HaitiGov et ne représente pas une plateforme gouvernementale adoptée."
      currentHref="/fr"
      currentLabel="Erreur 404"
      description="L’adresse est peut-être incorrecte ou la page n’est pas encore disponible dans le prototype."
      eyebrow="Erreur 404"
      heading="Cette page est introuvable."
      headingId="french-not-found-heading"
    >
      <a className="hg-button hg-button--primary hg-web-status__action" href="/fr">
        Retour à l’accueil
      </a>
    </FrenchSourceGatedPage>
  );
}
