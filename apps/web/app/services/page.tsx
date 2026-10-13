import type { Metadata } from "next";
import { ServiceCatalogPage } from "../_components/service-catalog-page.js";

export const metadata: Metadata = {
  description: "Eksplore sijè nan katalòg piblik HaitiGov la epi chèche enfòmasyon sou sèvis.",
  title: "Sèvis piblik — HaitiGov",
};

export default function ServicesPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ q?: string | string[] }>;
}>) {
  return <ServiceCatalogPage locale="ht" searchParams={searchParams} />;
}
