# Registry Data Manifests

The JSON files in this directory are normalized, reviewable mirrors of selected
rows from `docs/HaitiGov_National_Institution_Registry_v1_1.xlsx`. They support
deterministic development seeds. They do not establish an official Government
of Haiti registry or replace the upstream sources named in the workbook.

## Imported scope

- `institutions/registry-v1.1.json`: the 74 rows in the workbook's canonical
  `Institutions` sheet;
- `institutions/offices-v1.1.json`: 10 MICT departmental delegations and 42
  arrondissement-level vice-delegations;
- `territories/departments-v1.1.json`: 10 named departments;
- `territories/arrondissements-v1.1.json`: 42 named arrondissements;
- `territories/communes-v1.1.json`: 149 named communes.

Every manifest retains its workbook name, sheet name, source row, source
verification date, upstream source URL, and source-specific verification label.
The seed adds a SHA-256 payload hash, deterministic provenance record, and
deterministic verification event for every imported row.

## Conservative normalization

- Institution `VERIFIED_CURRENT` and `VERIFIED_LEGACY` values are preserved.
- Departments and arrondissements have upstream URLs but no row-level status in
  the workbook, so they import as `PENDING_REVIEW`.
- Commune status `VERIFIED_2024_IHSI` imports as `PARTIALLY_VERIFIED`; the exact
  source label remains in provenance notes.
- Institution lifecycle status remains `UNKNOWN`; the seed does not infer that
  a source-backed record is legally active.
- Territorial-office type and coverage labels normalize to explicit enums;
  each office keeps its workbook status and links to the reviewed department or
  arrondissement row.

## Excluded scope

- The `State Institutions` sheet is not imported. It contains a second
  Primature identifier and taxonomies/status labels that require canonical-ID
  reconciliation before import.
- The workbook verifies an aggregate count of 574 communal sections but does
  not provide their names. No communal-section row is invented.
Changes to these manifests require comparison with the workbook, validation of
counts and relationships, deterministic seed execution twice, integration
tests, and documentation of all normalization decisions.
