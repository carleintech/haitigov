# HaitiGov Design System Standard

Status: Phase 4A foundation

HaitiGov's design system supports the proposed platform's public and protected
applications without claiming official Government of Haiti adoption. It targets
WCAG 2.2 AA and treats Haitian Creole and French as primary languages.

## Package boundaries

- `@haitigov/design-system` owns framework-neutral tokens, CSS custom
  properties, layout primitives, focus treatment, reduced-motion behavior, and
  contrast utilities.
- `@haitigov/ui` owns reusable React composition primitives and Phase 4B
  components. It consumes the design system and must not redefine tokens.
- `@haitigov/branding` owns reviewed asset records, source metadata, and usage
  status. Unreviewed files in `docs/` are not product assets.
- `@haitigov/storybook` is the component-development and documentation
  environment. Accessibility checks are configured as errors.

Shared packages must not import from applications. Applications may consume
shared packages through their documented exports.

## Token policy

Components consume semantic tokens such as `--hg-color-action` and
`--hg-color-text`, not raw palette values. Primitive and national-palette tokens
exist to define themes and documentation.

The digital blue, red, and white values are proposed HaitiGov interface tokens.
They are not represented as an official colorimetric specification for the
Republic of Haiti.

Token changes require:

1. contrast and scale tests;
2. Storybook review in compact and wide viewports;
3. visual-regression review;
4. accessibility review for focus, forced colors, zoom, and reduced motion;
5. a Changeset when the package is versioned for external consumption.

## Accessibility baseline

- Text and interactive controls target WCAG 2.2 AA contrast.
- All interactive elements require a visible `:focus-visible` treatment.
- A reusable skip-link class is available for application shells.
- Motion tokens collapse when `prefers-reduced-motion: reduce` is active.
- Focus remains visible in Windows forced-colors mode.
- Text must remain usable at 200% browser zoom and with long Haitian Creole or
  French labels.
- Automated Storybook checks supplement, but do not replace, keyboard,
  screen-reader, high-contrast, and zoom testing.

## Branding asset gate

National seal, national emblem, and simplified-mark slots begin as
`REVIEW_REQUIRED`. An asset cannot be consumed until it has an authoritative or
approved project source, usage-rights review, review date, accessible
alternative guidance, and `APPROVED_FOR_PROJECT_USE` status.

Proposed identity work must always be labeled proposed. Unrelated seals,
AI-generated references, screenshots, and mockups must never be promoted into
the branding package by filename or visual similarity.

## Development

Run Storybook:

```powershell
pnpm run storybook
```

Build and run deterministic visual regression tests:

```powershell
pnpm run test:visual
```

Screenshot baselines are generated and reviewed in the pinned Chromium/Linux
environment used by CI. Baseline changes require human visual review.
