# Institution Namespace Reconciliation

Status: Reconciliation only; no records authorized for import

Decision date: 2026-09-28

## Purpose

This ledger reconciles source-specific institution identifiers with HaitiGov's
branch-neutral canonical namespace. It does not establish official Government
of Haiti identifiers and does not authorize a database import.

Canonical identifiers describe institutional identity, not the institution's
current branch, class, parent, leadership, or source workbook. The target form
is `HT-<STABLE-INSTITUTION-KEY>`. Once approved, a key is immutable.

Source and earlier project identifiers remain evidence. They are stored as
source-scoped external identifiers through `SourceRecord.externalId`, linked by
`SourceRecord.subjectId` to the canonical institution. Human-readable aliases
remain reserved for acronyms, former names, short names, and translations.

## Reconciliation ledger

`PROPOSED` means the identity mapping is ready for owner review, not import.
`UNRESOLVED` means more authoritative evidence or taxonomy review is required.

| Source identifier | Proposed canonical identifier | Institution | Source taxonomy | Proposed HaitiGov taxonomy | Conflict or duplicate reason | Evidence source | Resolution status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `HT-STATE-001` | `HT-PRESIDENCE` | Présidence de la République | `PRESIDENCY` / `EXECUTIVE` | `PRESIDENCY` / `EXECUTIVE` | Source URL points to a Primature page and does not establish detailed Presidency metadata. | Registry v1.1, `State Institutions`, row 2 | `UNRESOLVED` |
| `HT-STATE-002`; existing `HT-EXEC-002` | `HT-PRIMATURE` | Primature | `PRIMATURE` / `EXECUTIVE` | `PRIMATURE` / `EXECUTIVE` | Two project identifiers describe one institution; neither branch-prefixed value should remain canonical. | Registry v1.1, `State Institutions`, row 3; `Institutions`, row 21; Primature communication page | `PROPOSED` |
| `HT-STATE-003` | `HT-CONSEIL-MINISTRES` | Conseil des Ministres | `EXECUTIVE_COUNCIL` / `EXECUTIVE` | `EXECUTIVE_COUNCIL` / `EXECUTIVE` | Parent relationship and legal identity require review before deciding whether this is an institution record or a governance body. | Registry v1.1, `State Institutions`, row 4 | `UNRESOLVED` |
| `HT-STATE-004` | `HT-CEP` | Conseil Électoral Provisoire | `INDEPENDENT_INSTITUTION` / `ELECTORAL` | Proposed `INDEPENDENT_INSTITUTION` / `INDEPENDENT` | The current type enum lacks the proposed value. The CEP first-party site supports institutional independence, but import and taxonomy extension remain unapproved. | Registry v1.1, `State Institutions`, row 5; CEP official institution page | `PROPOSED` |
| `HT-STATE-005` | `HT-CSCCA` | Cour Supérieure des Comptes et du Contentieux Administratif | `INDEPENDENT_INSTITUTION` / `AUDIT / ADMINISTRATIVE JURISDICTION` | Proposed `INDEPENDENT_INSTITUTION` / `INDEPENDENT` | The current type enum lacks the proposed value; the functional spheres must remain metadata rather than be forced into the branch field. | Registry v1.1, `State Institutions`, row 6; CSCCA official missions page | `PROPOSED` |
| `HT-STATE-006` | `HT-UEH` | Université d'État d'Haïti | `PUBLIC_UNIVERSITY` / `HIGHER EDUCATION` | `UNRESOLVED` | Current type and branch enums do not express a public university without an unapproved classification choice. | Registry v1.1, `State Institutions`, row 7; UEH official site | `UNRESOLVED` |
| `HT-STATE-007` | `HT-OPC` | Office de la Protection du Citoyen | `INDEPENDENT_INSTITUTION` / `RIGHTS / OMBUDS` | `UNRESOLVED` | No adequate first-party or authoritative legal source is recorded in the workbook. No final classification may be inferred from secondary material. | Registry v1.1, `State Institutions`, row 8 | `UNRESOLVED` |
| `HT-STATE-008` | `HT-PARLEMENT` | Parlement haïtien | `LEGISLATURE` / `LEGISLATIVE` | `UNRESOLVED` | Institutional continuity must remain separate from the current operational status of individual chambers; legal mapping is absent. | Registry v1.1, `State Institutions`, row 9 | `UNRESOLVED` |
| `HT-STATE-009` | `HT-POUVOIR-JUDICIAIRE` | Pouvoir judiciaire | `JUDICIARY` / `JUDICIAL` | `UNRESOLVED` | This is an umbrella sphere; the workbook notes that individual courts require legal mapping. | Registry v1.1, `State Institutions`, row 10 | `UNRESOLVED` |

## Evidence links

- Registry workbook:
  `docs/HaitiGov_National_Institution_Registry_v1_1.xlsx`
- Primature communication page:
  <https://communication.gouv.ht/institution/primature/>
- CEP official institution page: <https://cephaiti.ht/institution/>
- CSCCA official missions page:
  <https://m.cscca.gouv.ht/missions-et-attributions>
- UEH official site: <https://ueh.edu.ht/>

URLs identify evidence to review; their presence does not promote a row to a
verified lifecycle state.

## Approval gates

Before any reconciliation import or rekey:

1. Approve each canonical identity and collision review independently.
2. Approve the type taxonomy for independent institutions and public
   universities; do not use `OTHER` as a silent permanent classification.
3. Confirm that every source identifier is retained with its source namespace.
4. Design API compatibility for existing IDs before changing any stored ID.
5. Run the migration and seed integrity suite against a disposable database.
6. Keep OPC, Parliament, the judicial umbrella, and every other unresolved row
   out of the import until their evidence gates are satisfied.

## Current implementation impact

No Prisma migration is required for this documentation-only reconciliation.
The existing `SourceRecord.externalId` and `SourceRecord.subjectId` fields can
preserve the source-to-canonical identifier mapping. A future import may still
need a reviewed type-enum migration for `INDEPENDENT_INSTITUTION`. No record,
manifest, seed, API response, or tracker completion state changes as a result
of this document.
