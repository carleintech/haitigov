import type { Metadata } from "next";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype de découverte vérifiée des départements d’Haïti.",
  title: "Départements — HaitiGov",
};

export default function FrenchDepartmentsPage() {
  return (
    <FrenchSourceGatedPage
      banner="Les données territoriales doivent suivre la codification IHSI la plus récente et les sources juridiques applicables."
      currentHref="/fr/departements"
      currentLabel="Départements"
      description="La hiérarchie des départements, arrondissements, communes et sections communales apparaîtra uniquement après vérification."
      eyebrow="Découverte territoriale"
      heading="Départements d’Haïti"
      headingId="french-departments-heading"
    />
  );
}
