import type { Metadata } from "next";
import { HistoryExperience } from "../_components/history-experience.js";

export const metadata: Metadata = {
  description: "Kèk etap nan istwa Ayiti, ak sous ak nòt sou verifikasyon.",
  title: "Istwa Ayiti — HaitiGov",
};

export default function HistoryPage() {
  return <HistoryExperience locale="ht" />;
}
