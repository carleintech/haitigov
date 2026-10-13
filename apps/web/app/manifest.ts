import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    description: "Pwototip pòtal piblik HaitiGov; li pa yon platfòm gouvènman adopte.",
    display: "standalone",
    lang: "ht",
    name: "HaitiGov — Pòtal piblik pwopoze",
    short_name: "HaitiGov",
    start_url: "/",
    theme_color: "#00209f",
  };
}
