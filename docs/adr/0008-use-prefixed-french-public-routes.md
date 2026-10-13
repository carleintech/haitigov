# Use Prefixed French Public Routes

Status: Accepted

## Context

HaitiGov must support Haitian Creole and French from the beginning. The public
prototype already uses Haitian Creole at unprefixed routes and `/fr` as its
French entry point. Changing every existing URL to a mandatory locale prefix
would break the current public route contract without delivering verified
content.

## Decision

Haitian Creole remains the default, unprefixed public experience. French pages
use the `/fr` prefix and localized route names where the label is naturally
translated, including `/fr/recherche`, `/fr/actualites`,
`/fr/transparence`, and `/fr/ministeres`.

Each French content landmark declares `lang="fr"` while the current shared root
layout continues to declare Haitian Creole as the document default. The
language switch is an explicit link and is never inferred from identity,
location, or other personal data.

This decision covers the source-gated public prototype. A future migration to a
fully dynamic locale segment requires its own compatibility plan, redirect
matrix, and verified translation workflow.

## Consequences

- Existing Haitian Creole URLs remain stable.
- French URLs are direct, bookmarkable, and testable without locale cookies.
- French and Haitian Creole routes can progress independently while sharing the
  same design-system components.
- The root document language remains Haitian Creole; French content landmarks
  override it until a future locale-root architecture is justified.

## Security considerations

Locale selection is not authorization and must never change access rights or
data visibility. Translated pages retain the same source, publication, and
verification gates as the default-language pages.

## Alternatives considered

- Mandatory prefixes for every language: deferred because it would change all
  existing public URLs.
- Browser-language redirects: deferred because they can surprise users and
  complicate caching, testing, and recovery links.
- Duplicate unrelated page implementations: rejected in favor of a shared
  French source-gated page composition.
