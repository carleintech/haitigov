import type { Metadata } from "next";
import { CommunesDirectory } from "../_components/communes-directory.js";

export const metadata: Metadata = {
  description: "Anyè 149 komin Ayiti yo, ak sous IHSI ak relasyon teritoryal nan rejis pwojè a.",
  title: "Komin — HaitiGov",
};

export default function CommunesPage() {
  return <CommunesDirectory locale="ht" />;
}
