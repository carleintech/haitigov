import type { Metadata } from "next";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype de catalogue de documents publics HaitiGov.",
  title: "Documents publics — HaitiGov",
};

export default function FrenchDocumentsPage() {
  return (
    <FrenchSourceGatedPage
      banner="Les documents doivent indiquer leur source, date, version et statut de publication."
      currentHref="/fr/documents"
      currentLabel="Documents"
      description="Le catalogue attend des contenus ayant passé la revue et la classification des données."
      eyebrow="Documents publics"
      heading="Documents et ressources"
      headingId="french-documents-heading"
    />
  );
}
