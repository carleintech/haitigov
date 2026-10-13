# ADR 0002: Use Turborepo for workspace task orchestration

- Status: Accepted
- Date: 2026-09-26
- Owners: Platform engineering

## Context

The target repository contains multiple deployable applications and shared
packages that need a dependency-aware build, test, lint, and development graph.

## Decision

Use Turborepo for task orchestration and caching. Packages define their own
scripts; the root invokes them through a versioned `turbo.json` task graph.

## Consequences

Independent applications can be built and tested selectively. Task inputs,
outputs, environment variables, and boundaries must remain explicit as the
workspace grows.

## Security considerations

Remote caching is disabled until its ownership, authentication, retention, and
sensitive-output policy are approved. Secrets must never be declared as cached
outputs.

## Alternatives considered

Nx provides broader generators and plugins but adds complexity not currently
needed. Handwritten scripts do not provide a reliable dependency graph.
