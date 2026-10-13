import { describe, expect, it } from "vitest";

import { contrastRatio } from "./contrast.js";
import { breakpoints, semanticColors, spacing, zIndex } from "./tokens.js";

describe("design tokens", () => {
  it("meets WCAG AA contrast for core text pairs", () => {
    expect(contrastRatio(semanticColors.text, semanticColors.background)).toBeGreaterThanOrEqual(
      4.5,
    );
    expect(
      contrastRatio(semanticColors.textMuted, semanticColors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(semanticColors.actionText, semanticColors.action)).toBeGreaterThanOrEqual(
      4.5,
    );
    expect(
      contrastRatio(semanticColors.danger, semanticColors.dangerSurface),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps responsive breakpoints in ascending order", () => {
    const values = Object.values(breakpoints).map((value) => Number.parseFloat(value));
    expect(values).toEqual([...values].sort((first, second) => first - second));
  });

  it("keeps spacing and layer scales monotonic", () => {
    const spacingValues = Object.values(spacing).map((value) => Number.parseFloat(value));
    expect(spacingValues).toEqual([...spacingValues].sort((first, second) => first - second));
    expect(Object.values(zIndex)).toEqual([0, 100, 200, 300, 400, 500]);
  });

  it("rejects malformed colors", () => {
    expect(() => contrastRatio("red", "#ffffff")).toThrow(/six-digit hexadecimal color/);
  });
});
