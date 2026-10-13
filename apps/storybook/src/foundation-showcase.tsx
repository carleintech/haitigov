import { nationalBrandAssets } from "@haitigov/branding";
import {
  nationalPalette,
  radii,
  semanticColors,
  spacing,
  typography,
} from "@haitigov/design-system";
import { DesignSystemProvider } from "@haitigov/ui";

const semanticSwatches = [
  ["Background", semanticColors.background],
  ["Surface", semanticColors.surface],
  ["Text", semanticColors.text],
  ["Action", semanticColors.action],
  ["Danger", semanticColors.danger],
  ["Success", semanticColors.success],
  ["Warning", semanticColors.warning],
  ["Information", semanticColors.information],
] as const;

const nationalSwatches = [
  ["National blue", nationalPalette.blue],
  ["National red", nationalPalette.red],
  ["National white", nationalPalette.white],
] as const;

interface ColorSwatchProps {
  readonly color: string;
  readonly name: string;
}

function ColorSwatch({ color, name }: ColorSwatchProps) {
  return (
    <li className="foundation-swatch">
      <span
        aria-hidden="true"
        className="foundation-swatch__color"
        style={{ backgroundColor: color }}
      />
      <span className="foundation-swatch__details">
        <strong>{name}</strong>
        <code>{color}</code>
      </span>
    </li>
  );
}

export function FoundationShowcase() {
  return (
    <DesignSystemProvider className="foundation" language="ht">
      <a className="hg-skip-link" href="#main-content">
        Ale nan kontni prensipal la
      </a>

      <header className="foundation-hero">
        <div className="hg-container">
          <p className="foundation-eyebrow">HaitiGov Design System</p>
          <h1>Fondasyon dijital ki aksesib epi konsistan</h1>
          <p>
            Token sa yo fèt pou sèvis piblik pwopoze yo. Yo pa reprezante yon estanda ofisyèl
            Gouvènman Ayiti.
          </p>
        </div>
      </header>

      <main className="hg-container foundation-main" id="main-content">
        <section aria-labelledby="national-palette-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Koulè</p>
            <h2 id="national-palette-title">Palèt nasyonal pwopoze</h2>
            <p>
              Valè dijital sa yo se referans konsepsyon HaitiGov. Yo pa pretann yo se yon
              spesifikasyon kolorimetrik ofisyèl.
            </p>
          </div>
          <ul className="foundation-swatches">
            {nationalSwatches.map(([name, color]) => (
              <ColorSwatch color={color} key={name} name={name} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="semantic-colors-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Semantik</p>
            <h2 id="semantic-colors-title">Koulè ki gen yon fonksyon</h2>
          </div>
          <ul className="foundation-swatches foundation-swatches--compact">
            {semanticSwatches.map(([name, color]) => (
              <ColorSwatch color={color} key={name} name={name} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="type-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Tipografi</p>
            <h2 id="type-title">Klè sou tout kalite ekran</h2>
          </div>
          <div className="foundation-type-scale">
            {Object.entries(typography.fontSize).map(([name, value]) => (
              <p key={name} style={{ fontSize: value }}>
                <span>{name}</span> Sèvis piblik pou tout moun
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="spacing-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Espas ak fòm</p>
            <h2 id="spacing-title">Yon ritm previzib</h2>
          </div>
          <div className="foundation-scale-list">
            {Object.entries(spacing).map(([name, value]) => (
              <div className="foundation-scale" key={name}>
                <code>{name}</code>
                <span style={{ width: value }}>
                  <span className="hg-visually-hidden">{`${name}: ${value}`}</span>
                </span>
              </div>
            ))}
          </div>
          <ul className="foundation-radius-list" aria-label="Echèl reyon kwen">
            {Object.entries(radii).map(([name, value]) => (
              <li key={name} style={{ borderRadius: value }}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="accessibility-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Aksesibilite</p>
            <h2 id="accessibility-title">WCAG 2.2 AA depi nan fondasyon an</h2>
            <p>
              Sèvi ak klavye a pou teste lyen sote a ak sistèm konsantrasyon an. Preferans pou
              diminye mouvman ak mòd koulè fòse yo respekte otomatikman.
            </p>
          </div>
          <div className="foundation-focus-demo">
            <button type="button">Teste konsantrasyon</button>
            <a href="#branding-title">Ale nan estati mak yo</a>
          </div>
        </section>

        <section aria-labelledby="branding-title" className="foundation-section">
          <div>
            <p className="foundation-kicker">Idantite vizyèl</p>
            <h2 id="branding-title">Revizyon obligatwa anvan itilizasyon</h2>
          </div>
          <ul className="foundation-assets">
            {Object.values(nationalBrandAssets).map((asset) => (
              <li key={asset.kind}>
                <strong>{asset.kind.replaceAll("_", " ")}</strong>
                <span>{asset.status.replaceAll("_", " ")}</span>
                <p>{asset.notes}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </DesignSystemProvider>
  );
}
