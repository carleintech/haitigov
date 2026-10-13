# ADR 0001: Use pnpm for JavaScript package management

- Status: Accepted
- Date: 2026-09-26
- Owners: Platform engineering

## Context

HaitiGov requires deterministic installs, efficient monorepo dependency storage,
workspace protocols, and strict peer-dependency handling.

## Decision

Use pnpm with an exact repository `packageManager` version, a committed lockfile,
and strict peer dependency checks. Use Corepack to select the pinned version.

## Consequences

Installs are reproducible and workspace-aware. Contributors must use Corepack
or a compatible pnpm installation. Package-manager upgrades require review.

## Security considerations

The lockfile is committed and CI uses frozen installs. Install-script policy and
dependency provenance require continued review as packages are introduced.

## Alternatives considered

npm has wider default availability but less efficient monorepo storage. Yarn
would add another tool without a concrete advantage for this repository.
