import type { Metadata } from "next";
import { ServiceCatalogPage } from "../../_components/service-catalog-page.js";

export const metadata: Metadata = {
  description:
    "Explorez les thèmes du catalogue public HaitiGov et recherchez les informations sur les services.",
  title: "Services publics — HaitiGov",
};

export default function FrenchServicesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  return <ServiceCatalogPage locale="fr" searchParams={searchParams} />;
}
