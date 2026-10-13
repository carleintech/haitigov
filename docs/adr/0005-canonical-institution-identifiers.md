# Canonical Institution Identifiers

Status: Superseded by ADR 0006

## Context

HaitiGov needs stable identifiers for institutions while names, leaders,
organizational structures, and legal mandates may change. The supplied project
registry already uses uppercase identifiers such as `HT-MIN-001`. Those values
are project identifiers; they do not imply government adoption or official
status.

## Decision

An institution ID is an opaque, immutable project identifier matching:

```text
^HT-[A-Z0-9]+(?:-[A-Z0-9]+)*$
```

The identifier must not encode a person, officeholder, administration, or term.
An institution retains its ID when its display name, acronym, leader, or
verification state changes. Renames are represented with dated aliases. A
legally distinct successor receives its own ID and an explicit successor or
predecessor relationship.

Existing conforming IDs in the supplied registry are preserved. New IDs require
source review and collision checking; they must not be inferred from names at
request time.

## Consequences

- URLs and references remain stable across ordinary organizational changes.
- Duplicate IDs are rejected by the database primary key.
- Callers must resolve aliases instead of deriving identifiers from names.
- Historical continuity is explicit rather than silently overwriting records.

## Security considerations

Identifiers are public references, not authorization credentials. Possession of
an ID grants no access. Public DTOs exclude internal notes, classifications, and
integration metadata.

## Alternatives considered

- Name- or acronym-derived IDs: rejected because names and acronyms change and
  collide.
- Officeholder-derived IDs: rejected because leadership is not institutional
  identity.
- Random IDs only: rejected for this project baseline because it would discard
  stable conforming identifiers already present in the supplied registry.
