# Establish Design-System Boundaries

Status: Accepted

## Context

HaitiGov applications need a consistent, accessible, multilingual interface
without duplicating styles or coupling national identity assets to individual
applications. Visual references in the repository have mixed provenance and
cannot be treated as approved product assets merely because they exist.

The component-development environment must support reusable React components,
automated accessibility checks, and deterministic visual regression without
requiring an external visual-testing account.

## Decision

The design foundation uses four boundaries:

- `@haitigov/design-system` owns framework-neutral tokens, global CSS,
  accessibility primitives, and contrast utilities;
- `@haitigov/ui` owns reusable React composition primitives and components;
- `@haitigov/branding` owns reviewed brand-asset records and usage status;
- `@haitigov/storybook` documents and exercises shared foundations and
  components in isolation.

Applications may depend on these shared packages. Shared packages must not
depend on applications. UI components consume semantic tokens rather than raw
national-palette values.

Storybook uses its accessibility addon for interactive review. Playwright runs
the CI-enforced axe scan and compares screenshots in a pinned Linux/Chromium
environment. Baseline changes require human review.

National seal, national emblem, and simplified-mark records begin in
`REVIEW_REQUIRED`. No visual reference becomes a product asset without source,
usage-rights, status, and accessibility review.

## Consequences

- Public and protected applications can share one token and component system.
- Framework-neutral tokens remain usable outside React.
- Storybook output participates in Turborepo caching.
- Visual regressions can be tested without a cloud account.
- The Playwright browser must be installed in CI.
- National identity assets remain unavailable until their review gate passes.

## Security considerations

No branding asset is executable or remotely loaded by default. Asset metadata
must not contain credentials or private source locations. Storybook is a
development artifact and is not an administrative interface. Accessibility
automation supplements manual keyboard, screen-reader, contrast, and zoom
validation.

## Alternatives considered

- Application-local CSS: rejected because it encourages inconsistent behavior
  and duplicated accessibility fixes.
- A React-only token package: rejected because tokens must remain
  framework-neutral.
- Automatically promote images from `docs/`: rejected because provenance and
  project-use status are not established.
- Cloud-only visual regression: deferred because it requires an external
  account and credential before the local foundation can be validated.
