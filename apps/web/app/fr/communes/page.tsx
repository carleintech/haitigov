import type { Metadata } from "next";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype de découverte vérifiée des communes d’Haïti.",
  title: "Communes — HaitiGov",
};

export default function FrenchCommunesPage() {
  return (
    <FrenchSourceGatedPage
      banner="Les relations communales doivent venir d’une codification IHSI vérifiée; le prototype ne devine pas les rattachements."
      currentHref="/fr/communes"
      currentLabel="Communes"
      description="La liste des communes et leurs rattachements seront disponibles après confirmation du registre territorial."
      eyebrow="Découverte territoriale"
      heading="Communes"
      headingId="french-communes-heading"
    />
  );
}
