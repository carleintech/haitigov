import type { Metadata } from "next";
import { HistoryExperience } from "../../_components/history-experience.js";

export const metadata: Metadata = {
  description: "Quelques repères de l’histoire d’Haïti, avec sources et notes de vérification.",
  title: "Histoire d’Haïti — HaitiGov",
};

export default function FrenchHistoryPage() {
  return <HistoryExperience locale="fr" />;
}
