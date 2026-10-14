import { createServer } from "node:http";
import {
  announcementListQuerySchema,
  institutionListQuerySchema,
  type PublicAnnouncementSummary,
  type PublicInstitutionSummary,
  publicAnnouncementListResponseSchema,
  publicInstitutionListResponseSchema,
} from "@haitigov/contracts";

// Synthetic browser-test data only; never import into application code or seeds.
const institutions: PublicInstitutionSummary[] = Array.from({ length: 12 }, (_, offset) => {
  const index = offset + 1;
  return {
    acronym: `TEST${String(index)}`,
    aliases: (["fr", "ht"] as const).map((locale) => ({
      aliasType: "TRANSLATION",
      isPreferred: true,
      locale,
      name: `Fixture ${locale.toUpperCase()} ${String(locale === "fr" ? index : 13 - index).padStart(2, "0")}`,
      validFrom: null,
      validTo: null,
    })),
    branch: index <= 9 ? "EXECUTIVE" : "INDEPENDENT",
    institutionId: `HT-TEST-${String(index).padStart(2, "0")}`,
    officialName: `Development fixture institution ${String(index)}`,
    parentInstitutionId: null,
    status: index <= 9 ? "ACTIVE" : "HISTORICAL",
    type: index <= 6 ? "MINISTRY" : index <= 10 ? "AUTONOMOUS_BODY" : "PUBLIC_ENTERPRISE",
    verificationStatus: index <= 9 ? "VERIFIED_CURRENT" : "VERIFIED_LEGACY",
  };
});

const announcements: PublicAnnouncementSummary[] = (["fr", "ht"] as const).flatMap((locale) =>
  Array.from({ length: 8 }, (_, offset) => {
    const index = offset + 1;
    const publishedAt =
      index === 7
        ? "2026-10-14T03:30:00.000Z"
        : index === 8
          ? "2026-10-14T04:30:00.000Z"
          : `2026-10-${String(index).padStart(2, "0")}T16:00:00.000Z`;
    return {
      announcementId: `test-${locale}-${String(index)}`,
      expiresAt: null,
      institutionId: null,
      locale,
      publicationStatus: "PUBLISHED",
      publishedAt,
      slug: `test-${locale}-${String(index)}`,
      sourceInstitution: index % 2 === 0 ? "Development fixture Alpha" : "Development fixture Beta",
      sourceUrl: `https://example.test/${locale}/${String(index)}`,
      sourceVerifiedAt: publishedAt,
      summary: "Synthetic development fixture, not a government announcement.",
      title: `Fixture ${locale.toUpperCase()} announcement ${String(index).padStart(2, "0")}`,
      verificationStatus: "VERIFIED_CURRENT",
    };
  }),
);

publicInstitutionListResponseSchema.parse({ items: institutions, nextCursor: null });
publicAnnouncementListResponseSchema.parse({
  items: announcements.filter((item) => item.locale === "fr"),
  nextCursor: null,
});
publicAnnouncementListResponseSchema.parse({
  items: announcements.filter((item) => item.locale === "ht"),
  nextCursor: null,
});

const server = createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1:3211");
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  if (request.method === "GET" && url.pathname === "/health") {
    response.end(JSON.stringify({ status: "test-fixture-only" }));
    return;
  }
  if (request.method !== "GET" || !["/institutions", "/announcements"].includes(url.pathname)) {
    console.error("Unexpected test-fixture request:", request.method, url.pathname);
    response.writeHead(404).end(JSON.stringify({ error: "Unknown test-fixture endpoint" }));
    return;
  }
  const query = url.searchParams.get("q") ?? "";
  if (query === "unavailable") {
    response.writeHead(503).end(JSON.stringify({ error: "Intentional test outage" }));
    return;
  }
  if (url.pathname === "/institutions") {
    const filter = institutionListQuerySchema.parse(Object.fromEntries(url.searchParams));
    const items = institutions.filter(
      (item) =>
        item.verificationStatus === filter.verificationStatus &&
        (!filter.type || item.type === filter.type) &&
        (!query ||
          query === "partial" ||
          item.institutionId === query ||
          item.aliases.some((alias) => alias.name.toLowerCase().includes(query.toLowerCase()))),
    );
    response.end(
      JSON.stringify({ items, nextCursor: query === "partial" ? "HT-TEST-NEXT" : null }),
    );
    return;
  }
  const filter = announcementListQuerySchema.parse(Object.fromEntries(url.searchParams));
  const items = announcements.filter(
    (item) =>
      item.locale === filter.locale &&
      (!query || query === "partial" || item.title.toLowerCase().includes(query.toLowerCase())),
  );
  response.end(JSON.stringify({ items, nextCursor: query === "partial" ? "test-next" : null }));
});

server.listen(3211, "127.0.0.1", () => {
  console.info("Synthetic public API fixtures listening on http://127.0.0.1:3211");
});
server.on("error", (error) => {
  console.error("Public API fixture server failed:", error);
  process.exitCode = 1;
});
