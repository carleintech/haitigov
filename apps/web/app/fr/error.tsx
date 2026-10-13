"use client";

import { Button } from "@haitigov/ui";
import { useEffect } from "react";
import { FrenchSourceGatedPage } from "./_components/source-gated-page.js";

interface FrenchErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function FrenchErrorPage({ error, retry }: FrenchErrorPageProps) {
  useEffect(() => {
    if (error.digest) {
      console.error("HaitiGov French public page error", { digest: error.digest });
    }
  }, [error.digest]);

  return (
    <FrenchSourceGatedPage
      banner="Ce site est un prototype HaitiGov et ne représente pas une plateforme gouvernementale adoptée."
      currentHref="/fr"
      currentLabel="Erreur technique"
      description="Réessayez. Si le problème persiste, revenez à la page d’accueil."
      eyebrow="Erreur technique"
      heading="Nous ne pouvons pas afficher cette page pour le moment."
      headingId="french-error-heading"
    >
      <div className="hg-web-status__actions">
        <Button onClick={retry}>Réessayer</Button>
        <a className="hg-button hg-button--secondary" href="/fr">
          Page d’accueil
        </a>
      </div>
    </FrenchSourceGatedPage>
  );
}
