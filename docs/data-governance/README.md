# Data Governance

HaitiGov follows a federated ownership model. Institutions remain authoritative
for the data assigned to them by law or policy; the platform provides controlled
orchestration and interoperability.

Every implemented data domain must record:

- authoritative owner and steward;
- legal or policy basis when known;
- classification and sensitivity;
- permitted purposes and consumers;
- minimum required fields;
- retention and deletion requirements;
- provenance and verification state;
- audit requirements;
- residency, backup, and recovery constraints.

Use `DOMAIN-TEMPLATE.md`. Unknown facts must remain explicitly `UNKNOWN` rather
than being inferred or invented.

Permanent reconciliation records:

- `institution-namespace-reconciliation.md` records proposed canonical
  institution identities, source identifiers, conflicts, evidence, and approval
  status;
- `territorial-reconciliation-dossier.md` records hierarchy discrepancies and
  the authoritative-evidence gate for communal-section imports.
