# Data Foundation

## Scope

The Phase 2 database is a development-only PostgreSQL 17 and PostGIS 3.5
environment. It validates the HaitiGov data model without claiming access to an
authoritative government database.

## Ownership boundary

The registry stores public institution and territorial reference information,
provenance, verification history, classifications, and security audit events.
It does not consolidate citizen, tax, health, education, immigration, or other
authoritative institutional records.

## Registry baseline

The schema follows the supplied HaitiGov National Institution Registry v1.1:

- stable string identifiers for institutions and territorial units;
- aliases and time-bounded institution relationships;
- Department → Arrondissement → Commune → Communal Section hierarchy;
- explicit source records and verification events;
- proposed routes and classifications kept distinct from verified status.

The workbook verifies 10 departments, 42 arrondissements, and 149 communes.
It verifies aggregate communal-section counts but does not supply verified
communal-section names, so Phase 2 defines that model without inventing rows.

## Migration strategy

- Development schema changes use `pnpm --filter @haitigov/database db:migrate:dev -- --name <descriptive-name>`.
- Staging and production use `db:migrate:deploy` against reviewed, immutable
  migration files.
- `prisma db push` is not part of the normal HaitiGov workflow.
- Applied migration files are never rewritten. Corrections use a new migration.
- PostGIS is enabled by the first migration so shadow and target databases share
  the same extension dependency.

## Seed strategy

Seeds are explicit, deterministic, and repeatable. Phase 2 introduced platform
classifications and a foundation-version marker. Phase 3 adds reviewed registry
v1.1 manifests through deterministic upserts while retaining source-sheet rows,
upstream URLs, payload hashes, source verification labels, and verification
events. This includes source-backed MICT territorial offices linked to the
reviewed hierarchy. Re-running the seed updates the same records rather than
duplicating them.

Run seeds with `pnpm --filter @haitigov/database db:seed`.

## Local inspection

The Docker database is exposed only on the loopback interface at port `55433`.
The local pgAdmin installation has a development connection named
`HaitiGov Local`; it does not store the password and prompts for the local-only
credential on first connection. Prisma Studio starts at `http://localhost:5555`
with `pnpm --filter @haitigov/database db:studio`.
