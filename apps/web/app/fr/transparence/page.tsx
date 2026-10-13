import type { Metadata } from "next";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype d’accès aux données publiques et à la transparence.",
  title: "Transparence — HaitiGov",
};

export default function FrenchTransparencyPage() {
  return (
    <FrenchSourceGatedPage
      banner="Aucune donnée de transparence n’est présentée comme officielle dans ce prototype."
      currentHref="/fr/transparence"
      currentLabel="Transparence"
      description="Chaque jeu de données doit indiquer son propriétaire, sa source, sa classification, sa date de mise à jour et son statut de révision."
      eyebrow="Transparence"
      heading="Données publiques et responsabilité"
      headingId="french-transparency-heading"
    />
  );
}
