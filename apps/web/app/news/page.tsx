import { NewsPage as NewsExperience } from "../_components/news-page.js";
import {
  parseAnnouncementSearchQuery,
  searchPublicAnnouncements,
} from "../_data/public-announcements.js";

export default async function NewsPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ q?: string | string[] }> }>) {
  const query = parseAnnouncementSearchQuery((await searchParams).q);
  const result =
    query === null
      ? { state: "invalid-query" as const }
      : await searchPublicAnnouncements(query, "ht");
  return <NewsExperience locale="ht" query={query ?? ""} result={result} />;
}
