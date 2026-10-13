# Territorial Reconciliation Dossier

Status: Blocked pending a current authoritative crosswalk

Decision date: 2026-09-28

## Purpose

This dossier records conflicts between HaitiGov's 149-commune project baseline
and communal-section parentage visible in the IHSI 2024 statistical
publication. It is a change-control record, not an import manifest.

The IHSI territorial codification manual or an equivalent authoritative legal
act must establish the current labels, codes, promotions, and resulting parent
relationships before HaitiGov creates communal-section records.

```text
IHSI codification manual or authoritative legal act
                    |
                    v
       reviewed territorial crosswalk
                    |
                    v
        HaitiGov territorial importer
```

The 2024 statistical publication remains provenance evidence. Its detailed
tables must not be treated as proof of current parentage when they conflict
with the publication's newer aggregate commune count or a later legal status.

## Source discrepancy

The publication reports a national aggregate of 10 departments, 42
arrondissements, 149 communes, 574 communal sections, and 59 quartiers. Its
detailed territorial tables do not consistently express all 149 communes as
commune headers. Several places represented as communes in the project
baseline still appear as a section or quartier under an older commune in those
tables.

This is evidence of a temporal or classification mismatch. It is not evidence
that either hierarchy should be silently overwritten.

## Reconciliation queue

The following queue records every promoted-commune conflict encountered during
the 2026-09-28 review. Parentage descriptions are observations from the
statistical tables and require confirmation against the current codification
manual or legal act.

| Place in the 149-commune baseline | Department | Conflicting table representation | Required evidence | Status |
| --- | --- | --- | --- | --- |
| Grand-Bassin | Nord-Est | Represented within the older Terrier-Rouge hierarchy rather than consistently as a commune header. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Liancourt | Artibonite | Represented as a quartier or section associated with Verrettes. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Montrouis | Artibonite | Represented through an older Saint-Marc or Arcahaie-area hierarchy rather than consistently as a commune header. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Baptiste | Centre | Represented as a quartier or section associated with Belladère. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Ducis | Sud | Represented as a quartier associated with Torbeck. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Fonds-des-Blancs | Sud | Not consistently represented as a commune header in the detailed tables. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Marfranc | Grande-Anse | Represented as a quartier or section associated with Jérémie. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| Île-Cayémites | Grande-Anse | Not consistently represented as a commune header in the detailed tables. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |
| La Pointe | Nord-Ouest | Represented as a section associated with Port-de-Paix. | Current IHSI code and label, promotion act, arrondissement, and post-promotion section assignments. | `UNRESOLVED` |

Caracol appeared as a commune header in the reviewed detailed tables, despite a
typographical variation, so it is not currently listed as a parentage conflict.
Its spelling and code must still exact-match the authoritative crosswalk before
communal-section import.

## Evidence links

- IHSI territorial-codification guidance:
  <https://ihsi.gouv.ht/statistiques/statistiques_demographiques_et_sociales/gouvernance_et_autres_activites_communautaires>
- IHSI 2024 statistical publication:
  <https://ihsi.gouv.ht/public/storage/document-views/March2025/Oan4m17p5LEKtsGEnHgt.pdf>
- Registry workbook:
  `docs/HaitiGov_National_Institution_Registry_v1_1.xlsx`

The IHSI guidance identifies the territorial-codification manual as the legal
reference for codes and labels and describes the six-digit territorial code
structure. HaitiGov requires that current reference, not a guessed conversion
of the statistical tables.

## Import gate

Communal-section import remains prohibited until a reviewed crosswalk provides:

- the current six-digit IHSI code and official label for every row;
- the current department, arrondissement, and commune parent;
- the legal or official basis and effective date for each promoted commune;
- the disposition of sections or quartiers affected by each promotion;
- a documented resolution for every row in the reconciliation queue;
- exact counts and uniqueness checks at every hierarchy level.

No communal-section manifest, seed record, Prisma migration, or inferred
parent relationship is authorized by this dossier.
