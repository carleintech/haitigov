import { InstitutionDirectory } from "../_components/institution-directory.js";
import {
  parseInstitutionSearchQuery,
  searchPublicInstitutions,
} from "../_data/public-institutions.js";

export default async function InstitutionsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  const query = parseInstitutionSearchQuery((await searchParams).q);
  const result =
    query === null ? { state: "invalid-query" as const } : await searchPublicInstitutions(query);

  return <InstitutionDirectory locale="ht" query={query ?? ""} result={result} />;
}
