export const primitiveColors = {
  blue: {
    50: "#eef5ff",
    100: "#d9e8ff",
    200: "#bcd7ff",
    300: "#8ebcff",
    400: "#5997ff",
    500: "#2f70f5",
    600: "#174fd1",
    700: "#123fa8",
    800: "#103782",
    900: "#0e2e68",
    950: "#071a3d",
  },
  red: {
    50: "#fff0f3",
    100: "#ffe0e6",
    200: "#ffc6d1",
    300: "#ff97ab",
    400: "#ff5c7c",
    500: "#ee224e",
    600: "#c90f3b",
    700: "#a80f35",
    800: "#8c1233",
    900: "#781330",
    950: "#430617",
  },
  gold: {
    50: "#fff9e8",
    100: "#ffefbd",
    200: "#ffe080",
    300: "#f7c948",
    400: "#e5ad22",
    500: "#c88b12",
    600: "#a9680b",
    700: "#884d0c",
    800: "#713e10",
    900: "#603411",
    950: "#371a05",
  },
  neutral: {
    0: "#ffffff",
    50: "#f7f9fc",
    100: "#edf1f7",
    200: "#d9e0ea",
    300: "#b8c3d1",
    400: "#8998aa",
    500: "#647386",
    600: "#48576a",
    700: "#344255",
    800: "#202c3c",
    900: "#111b29",
    950: "#09101a",
  },
  green: {
    50: "#edfdf4",
    500: "#168a4b",
    700: "#0b6335",
    900: "#063e22",
  },
  amber: {
    50: "#fff8e6",
    500: "#b86e00",
    700: "#824900",
    900: "#4d2900",
  },
} as const;

/**
 * Proposed digital approximations for HaitiGov interfaces. These tokens do not
 * claim to be an official Government of Haiti colorimetric specification.
 */
export const nationalPalette = {
  blue: "#00209f",
  red: "#d21034",
  white: "#ffffff",
} as const;

export const semanticColors = {
  background: primitiveColors.neutral[0],
  surface: primitiveColors.neutral[50],
  surfaceStrong: primitiveColors.neutral[100],
  text: primitiveColors.neutral[950],
  textMuted: primitiveColors.neutral[600],
  border: primitiveColors.neutral[300],
  borderStrong: primitiveColors.neutral[500],
  action: primitiveColors.blue[800],
  actionHover: primitiveColors.blue[900],
  actionText: primitiveColors.neutral[0],
  focus: primitiveColors.gold[400],
  focusInner: primitiveColors.neutral[950],
  danger: primitiveColors.red[700],
  dangerSurface: primitiveColors.red[50],
  success: primitiveColors.green[700],
  successSurface: primitiveColors.green[50],
  warning: primitiveColors.amber[700],
  warningSurface: primitiveColors.amber[50],
  information: primitiveColors.blue[700],
  informationSurface: primitiveColors.blue[50],
} as const;

export const typography = {
  fontFamily: {
    sans: '"Noto Sans", "Segoe UI", Arial, sans-serif',
    display: '"Noto Sans", "Segoe UI", Arial, sans-serif',
    mono: '"Noto Sans Mono", "Cascadia Mono", Consolas, monospace',
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeight: {
    compact: 1.2,
    heading: 1.25,
    body: 1.5,
    relaxed: 1.65,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
} as const;

export const radii = {
  none: "0",
  xs: "0.125rem",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  full: "9999px",
} as const;

export const elevations = {
  none: "none",
  low: "0 1px 2px rgb(9 16 26 / 10%)",
  medium: "0 6px 18px rgb(9 16 26 / 14%)",
  high: "0 16px 40px rgb(9 16 26 / 18%)",
} as const;

export const breakpoints = {
  compact: "30rem",
  medium: "48rem",
  wide: "64rem",
  expansive: "80rem",
} as const;

export const grid = {
  maxWidth: "75rem",
  compactColumns: 4,
  mediumColumns: 8,
  wideColumns: 12,
  compactGutter: spacing[4],
  mediumGutter: spacing[6],
  wideGutter: spacing[8],
} as const;

export const motion = {
  duration: {
    instant: "0ms",
    fast: "120ms",
    normal: "200ms",
    slow: "320ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    enter: "cubic-bezier(0, 0, 0, 1)",
    exit: "cubic-bezier(0.3, 0, 1, 1)",
  },
} as const;

export const zIndex = {
  base: 0,
  dropdown: 100,
  overlay: 200,
  modal: 300,
  toast: 400,
  skipLink: 500,
} as const;

export const designTokens = {
  breakpoints,
  elevations,
  grid,
  motion,
  nationalPalette,
  primitiveColors,
  radii,
  semanticColors,
  spacing,
  typography,
  zIndex,
} as const;

export type DesignTokens = typeof designTokens;
