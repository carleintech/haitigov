import type { Metadata } from "next";
import { CommunesDirectory } from "../../_components/communes-directory.js";

export const metadata: Metadata = {
  description:
    "Annuaire des 149 communes d’Haïti, avec sources IHSI et rattachements du registre du projet.",
  title: "Communes — HaitiGov",
};

export default function FrenchCommunesPage() {
  return <CommunesDirectory locale="fr" />;
}
