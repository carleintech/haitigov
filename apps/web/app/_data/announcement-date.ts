const publicationDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Port-au-Prince",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const haitianMonths = [
  "janvye",
  "fevriye",
  "mas",
  "avril",
  "me",
  "jen",
  "jiyè",
  "out",
  "septanm",
  "oktòb",
  "novanm",
  "desanm",
] as const;

export function announcementPublicationLabel(timestamp: string, locale: "fr" | "ht"): string {
  if (locale === "fr") {
    return new Intl.DateTimeFormat("fr-HT", {
      dateStyle: "long",
      timeZone: "America/Port-au-Prince",
    }).format(new Date(timestamp));
  }
  // ht-HT support and fallback language differ between server and browser ICU builds.
  const [year, month, day] = announcementPublicationDay(timestamp).split("-");
  const monthName = haitianMonths[Number(month) - 1];
  if (!year || !day || !monthName) throw new Error("Invalid announcement publication date");
  return `${String(Number(day))} ${monthName} ${year}`;
}

export function announcementPublicationDay(timestamp: string): string {
  const parts = publicationDate.formatToParts(new Date(timestamp));
  const part = (type: Intl.DateTimeFormatPartTypes): string => {
    const value = parts.find((item) => item.type === type)?.value;
    if (!value) throw new Error(`Missing publication date part: ${type}`);
    return value;
  };
  return `${part("year")}-${part("month")}-${part("day")}`;
}
