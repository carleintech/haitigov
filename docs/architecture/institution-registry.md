# Institution Registry Foundation

The Institution Registry is a source-backed project dataset for the proposed
HaitiGov platform. It is not an official Government of Haiti registry unless an
authoritative source explicitly establishes that status for a record.

## Domain model

Each institution has a canonical ID, official name, type, government branch,
jurisdiction, lifecycle status, and verification status. Lifecycle status and
verification status answer different questions:

- lifecycle status describes whether the institution is active, inactive,
  historical, superseded, or not yet determined;
- verification status records the strength and currency of the supporting
  evidence.

New records default to `UNKNOWN` lifecycle status and `PENDING_REVIEW`
verification status. Import code must never upgrade either value without
source-backed evidence.

The initial type taxonomy supports ministries, central directorates,
deconcentrated services, autonomous bodies, public bodies, public enterprises,
public financial institutions, regulatory authorities, the presidency,
primature, executive councils, and a guarded `OTHER` value. Government branches
are executive, judicial, legislative, independent, territorial, or other.

## Names, history, and relationships

Aliases carry their own type, locale, preference flag, and effective dates.
Former names are aliases; a legally distinct successor is a separate
institution connected through an explicit relationship.

For `PARENT_OF`, the source is the parent and the target is the child. Domain
validation rejects self-references and cycles. The database independently
rejects every self-referential relationship, including non-parent relationship
types. Relationship writes are intentionally not exposed in the Phase 3 public
API.

## Provenance and verification

Sources and source records remain separate from institution records. The public
detail response provides only the source name, source institution, URL,
retrieval time, and effective dates. Verification history exposes the outcome
and verification time. Internal verifier identity, hashes, classifications,
notes, and external integration identifiers remain private.

## Application boundary

The first implementation is a cohesive `institutions` module inside
`apps/api`, consistent with the modular-monolith-first architecture. Repository
queries return persistence records internally. A mapper produces explicit
public contracts; Prisma models are never returned directly from controllers.

The foundation is read-only. It includes no frontend, authentication, admin
mutation endpoint, or external government integration. Dataset imports remain a
separate, source-reviewable step.

## Registry v1.1 development import

The deterministic development seed imports the canonical workbook
`Institutions` sheet and the named Department → Arrondissement → Commune
hierarchy. Every row receives deterministic source and verification records,
including the workbook sheet/row reference, upstream URL, fixed source review
date, and payload hash.

The seed is deliberately conservative:

- institution lifecycle status remains `UNKNOWN`;
- institution verification labels are preserved exactly;
- departments and arrondissements without row-level workbook statuses remain
  `PENDING_REVIEW`;
- `VERIFIED_2024_IHSI` communes normalize to `PARTIALLY_VERIFIED`, with the
  source label retained in provenance notes;
- unnamed communal sections are not generated from aggregate counts.

The workbook's separate `State Institutions` sheet is deferred. Canonical
institution IDs are now institution-centric and branch-neutral; source IDs such
as `HT-STATE-*` and `HT-EXEC-*` are retained as source-scoped external
identifiers rather than separate identities. The reconciliation ledger in
`docs/data-governance/institution-namespace-reconciliation.md` proposes mappings
for review but authorizes no import or rekey. OPC remains unresolved pending an
adequate first-party or authoritative legal source.

The communal-section import is also deferred. The IHSI 2024 statistical tables
contain parentage that conflicts with places represented as communes in the
149-commune baseline. The discrepancy queue and evidence gate are maintained in
`docs/data-governance/territorial-reconciliation-dossier.md`. No current parent
relationship may be inferred from an older statistical hierarchy.

## Institution offices

The registry models institution offices separately from institutions. The v1.1
development import contains 52 source-backed MICT territorial offices: 10
departmental delegations and 42 arrondissement-level vice-delegations. Each
office has a stable source ID, type, locality, coverage level, verification
status, department link, and—when applicable—arrondissement link.

A database constraint enforces the source taxonomy: a `DELEGATION` covers a
department and has no arrondissement link; a `VICE_DELEGATION` covers an
arrondissement and must have that link. Every office also receives a
deterministic source record and verification event. The public institution
detail DTO exposes only the office identity, type, locality, territorial links,
coverage, and verification status; internal provenance notes and hashes remain
private.
