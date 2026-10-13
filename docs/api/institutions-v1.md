# Public Institution API v1

Base prefix: `/v1`

This read-only API serves the proposed HaitiGov project registry. A returned
record's verification fields describe project evidence; they do not establish
official government adoption of HaitiGov.

## List institutions

```http
GET /v1/institutions
```

Optional query parameters:

| Parameter | Meaning |
| --- | --- |
| `type` | Exact institution type |
| `branch` | Exact government branch |
| `parent` | Canonical parent institution ID |
| `status` | Exact lifecycle status |
| `verificationStatus` | Exact verification status |
| `q` | Case-insensitive official-name, acronym, or alias search |
| `cursor` | Last canonical ID returned by the preceding page |
| `limit` | Page size from 1 to 100; default 50 |

Results are ordered by canonical ID. `nextCursor` is `null` when no further
page exists.

## Get institution

```http
GET /v1/institutions/:institutionId
```

The identifier must use the canonical uppercase `HT-...` format. The detail
response includes public aliases, relationships, provenance, and verification
history. An unknown valid ID returns `404`; invalid input returns `400`.

## Public-data boundary

Responses are produced by explicit contracts in `@haitigov/contracts`. They do
not expose Prisma records, internal notes, data-classification codes, proposed
integration routes or domains, record hashes, verifier identity, or other
security-sensitive metadata.

OpenAPI documentation is mounted at `/openapi` when the API is running locally.
