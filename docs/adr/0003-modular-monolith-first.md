# ADR 0003: Begin with a modular monolith

- Status: Accepted
- Date: 2026-09-26
- Owners: Platform architecture

## Context

HaitiGov needs strong domain and institutional boundaries, but premature
microservices would add operational and security complexity before workloads,
team ownership, and scaling evidence exist.

## Decision

Begin the backend as a modular NestJS application in `apps/api`. Enforce
service-ready domain boundaries and explicit contracts. Extract a module only
when security, scale, reliability, deployment, or organizational evidence
justifies an independent service.

## Consequences

Initial delivery remains operable by a small team while preserving a path to
service extraction. Boundary tests and dependency rules become mandatory.

## Security considerations

The modular monolith does not permit unrestricted cross-domain data access.
Institutional authority, purpose limitation, authorization, and audit remain
explicit at module boundaries.

## Alternatives considered

Immediate microservices were rejected due to operational overhead and unclear
ownership. A single unstructured application was rejected because it would
erode domain and institutional boundaries.
