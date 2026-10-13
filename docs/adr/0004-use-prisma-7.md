# Use Prisma ORM 7 for the Initial Data Foundation

Status: Accepted

## Context

Prisma ORM 8 is a release candidate while Prisma ORM 7 remains supported. The
project needs a stable schema, migration, generated-client, and Studio workflow
for PostgreSQL during Phase 2.

## Decision

Pin Prisma CLI, Client, and PostgreSQL adapter to 7.10.0. Use
`prisma.config.ts`, the `prisma-client` generator, explicit client generation,
and the PostgreSQL driver adapter.

## Consequences

The project receives a stable, documented Prisma 7 workflow. A future Prisma 8
upgrade requires its own reviewed ADR and migration plan.

## Security considerations

The database URL remains in ignored local environment files or managed secret
storage. No connection credentials are committed.

## Alternatives considered

- Prisma ORM 8 release candidate: rejected for the initial foundation.
- Prisma ORM 6: rejected because Prisma 7 is supported and matches the current
  Node.js baseline.
