import type { Metadata } from "next";
import { FrenchSourceGatedPage } from "../_components/source-gated-page.js";

export const metadata: Metadata = {
  description: "Prototype d’actualités et d’annonces publiques HaitiGov.",
  title: "Actualités et annonces — HaitiGov",
};

export default function FrenchNewsPage() {
  return (
    <FrenchSourceGatedPage
      banner="Aucune annonce n’est publiée sans source et date de révision."
      currentHref="/fr/actualites"
      currentLabel="Actualités"
      description="Le contenu vérifié apparaîtra lorsque ses sources publiques et propriétaires seront confirmés."
      eyebrow="Annonces publiques"
      heading="Actualités et annonces"
      headingId="french-news-heading"
    />
  );
}
