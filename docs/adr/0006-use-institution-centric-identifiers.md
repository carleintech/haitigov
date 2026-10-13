# Use Institution-Centric Identifiers

Status: Accepted

Supersedes: ADR 0005

## Context

ADR 0005 established stable project identifiers but preserved source workbook
patterns such as `HT-STATE-*`, `HT-EXEC-*`, and `HT-MIN-*`. Reconciliation of
the registry's `State Institutions` sheet found that those patterns can encode
classification, branch, or source structure into an identity intended to
survive organizational change. Primature consequently has two proposed project
identifiers for one institution.

## Decision

Canonical institution identifiers are institution-centric and branch-neutral.
The preferred form is `HT-<STABLE-INSTITUTION-KEY>`, for example
`HT-PRIMATURE`, `HT-CEP`, `HT-CSCCA`, `HT-MEF`, or `HT-DGI`.

The stable key is assigned through reviewed reconciliation and is immutable. It
must not encode a branch, class, parent, person, officeholder, administration,
term, or source workbook. It is not derived dynamically from a name or acronym.

An institution retains its canonical ID when its name, acronym, leader, parent,
classification, branch, or verification state changes. A legally distinct
successor receives its own ID and an explicit relationship.

Source and earlier project identifiers are preserved as source-scoped external
identifiers, not separate institutions or human-readable name aliases. The
current schema supports that mapping with `SourceRecord.externalId` and
`SourceRecord.subjectId`.

The 74 imported v1.1 records retain their current IDs until a separately
reviewed rekey migration and API compatibility plan are approved. This ADR does
not authorize an automatic data migration or import.

## Consequences

- Institutional identity survives taxonomy and constitutional changes.
- Primature's source identifiers can resolve to one canonical identity.
- Source-specific IDs remain available as provenance evidence.
- Existing API IDs remain unchanged until an explicit compatibility plan and
  migration are approved.
- New IDs require source review, collision checking, and entry in the
  institution namespace reconciliation ledger.

## Security considerations

Identifiers are public references, not authorization credentials. Resolving a
legacy identifier grants no access. Public DTOs continue excluding internal
notes, classifications, and integration metadata.

## Alternatives considered

- Preserve branch- or class-prefixed identifiers: rejected because taxonomy can
  change without changing institutional identity.
- Make `HT-STATE-*` canonical: rejected because it encodes a source grouping.
- Make `HT-EXEC-*` canonical: rejected because it encodes a branch.
- Generate IDs from current names or acronyms at request time: rejected because
  labels change and can collide.
- Random-only identifiers: rejected because reviewed mnemonic keys remain more
  legible for registry operations.
