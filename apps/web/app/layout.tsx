import type { Metadata } from "next";
import "@haitigov/design-system/styles.css";
import "@haitigov/ui/styles.css";
import "./web.css";

export const metadata: Metadata = {
  description: "Pwototip pòtal piblik HaitiGov; li pa yon platfòm gouvènman adopte.",
  title: "HaitiGov — Pòtal piblik pwopoze",
};

export const viewport = { colorScheme: "light", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ht">
      <body>
        <a className="hg-skip-link" href="#main-content">
          Ale nan kontni prensipal
        </a>
        {children}
      </body>
    </html>
  );
}
