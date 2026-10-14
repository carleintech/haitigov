import type { Metadata } from "next";
import { NewsPage } from "../../_components/news-page.js";
import {
  parseAnnouncementSearchQuery,
  searchPublicAnnouncements,
} from "../../_data/public-announcements.js";

export const metadata: Metadata = {
  description: "Prototype d’actualités et d’annonces publiques HaitiGov.",
  title: "Actualités et annonces — HaitiGov",
};

export default async function FrenchNewsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ q?: string | string[] }> }>) {
  const query = parseAnnouncementSearchQuery((await searchParams).q);
  const result =
    query === null
      ? { state: "invalid-query" as const }
      : await searchPublicAnnouncements(query, "fr");
  return <NewsPage locale="fr" query={query ?? ""} result={result} />;
}
