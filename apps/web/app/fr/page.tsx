import type { Metadata } from "next";
import { PublicHomepage } from "../_components/public-homepage.js";

export const metadata: Metadata = {
  description: "Prototype du portail public HaitiGov en français.",
  title: "HaitiGov — Portail public proposé",
};

export default function FrenchHomePage() {
  return <PublicHomepage locale="fr" />;
}
