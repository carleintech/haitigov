# HaitiGov — Codex Engineering Instructions

## 1. Project Identity

Project: HaitiGov
Program: Haiti Digital Transformation Initiative
Initiator: TechKlein
Repository type: Production-grade TypeScript monorepo

HaitiGov is a proposed national digital public-service and interoperability
platform for Haiti.

It is NOT currently an official Government of Haiti platform.

Never represent prototypes, integrations, seals, credentials, services,
institutional relationships, or APIs as officially adopted unless the repository
contains authoritative documentation establishing that status.

---

## 2. Engineering Mission

Build a secure, resilient, accessible, multilingual and maintainable digital
public-infrastructure platform capable of supporting:

- public government information
- public-service discovery
- citizen services
- institutional portals
- department and commune portals
- digital identity integration
- government service applications
- document verification
- notifications
- payments through authorized providers
- government data exchange
- GIS
- transparency/open data
- HaitiExplore
- future HaitiXR
- future HaitiAI
- developer APIs

The architecture must support national scale without prematurely creating
unnecessary distributed-system complexity.

---

# 3. Non-Negotiable Architecture Principle

HaitiGov MUST NOT become one unrestricted national database.

Canonical principle:

> One national ecosystem — multiple authoritative institutional databases —
> one secure interoperability layer.

Individual institutions remain authoritative for their legally assigned data.

Examples:

ONI -> identity records
DGI -> tax records
ONA -> social-insurance records
MCI -> applicable commercial records
MENFP -> applicable education records
MSPP -> applicable health records
MICT/DIE -> applicable immigration records

HaitiGov provides:

- user experience
- service orchestration
- authentication
- authorization
- discovery
- verification
- consent where applicable
- interoperability
- APIs
- event exchange
- audit
- notifications

Never implement cross-institution unrestricted database access.

---

# 4. Architecture Strategy

Use:

MODULAR MONOLITH FIRST
+
SERVICE-READY DOMAIN BOUNDARIES

Do NOT create dozens of microservices during initial development.

Initial backend:

apps/api

Domain modules should be independently structured so that a module can later
be extracted into a service without rewriting its business domain.

Potential future services include:

- identity-service
- notification-service
- audit-service
- document-service
- payment-service
- search-service
- gis-service

Only extract services when there is a concrete security, scaling, reliability,
deployment or organizational reason.

---

# 5. Approved Core Stack

Package manager:
pnpm

Monorepo:
Turborepo

Primary language:
TypeScript

Frontend:
Next.js

Backend:
NestJS

Primary relational database:
PostgreSQL

ORM:
Prisma

Geospatial:
PostGIS

Cache:
Redis

Schema/runtime validation:
Zod

API specification:
OpenAPI

Asynchronous messaging:
AWS EventBridge + SQS

Object storage:
AWS S3

Search:
OpenSearch when justified

Infrastructure as Code:
Terraform

Containers:
Docker

Initial AWS application orchestration:
ECS

Edge / DNS / WAF:
Cloudflare

CI/CD:
GitHub Actions

Observability:
OpenTelemetry

Secrets:
AWS Secrets Manager

Encryption/key management:
AWS KMS

Testing:
Vitest
Playwright

Formatting/linting:
Biome
ESLint only where additional rules materially improve security or correctness.

Do not introduce competing frameworks without an ADR and justification.

---

# 6. Monorepo Target

haitigov/
├── apps/
│   ├── web/
│   ├── citizen/
│   ├── admin/
│   ├── institutions/
│   ├── departments/
│   ├── explore/
│   ├── developers/
│   ├── status/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── design-system/
│   ├── icons/
│   ├── branding/
│   ├── config/
│   ├── database/
│   ├── auth/
│   ├── authorization/
│   ├── contracts/
│   ├── api-client/
│   ├── schemas/
│   ├── validation/
│   ├── observability/
│   ├── logging/
│   ├── security/
│   ├── crypto/
│   ├── i18n/
│   ├── feature-flags/
│   ├── testing/
│   └── utils/
│
├── infrastructure/
│   ├── terraform/
│   ├── docker/
│   ├── cloudflare/
│   └── monitoring/
│
├── data/
│   ├── institutions/
│   ├── territories/
│   ├── services/
│   ├── laws/
│   ├── gis/
│   └── seeds/
│
├── docs/
│   ├── architecture/
│   ├── adr/
│   ├── api/
│   ├── engineering/
│   ├── security/
│   ├── data-governance/
│   ├── standards/
│   ├── runbooks/
│   └── threat-models/
│
├── scripts/
├── tests/
├── .github/
└── .changeset/

Do not create empty directories merely to make the repository visually match
this target.

Create components when the corresponding phase requires them.

---

# 7. Application Boundaries

## apps/web

Public HaitiGov portal.

Primary domain:

haitigov.org

Responsibilities:

- homepage
- service discovery
- institution directory
- public information
- government directory
- announcements
- public documents
- transparency entry points
- search

No privileged administrative functionality.

---

## apps/citizen

My Haiti citizen experience.

Future domain:

my.haitigov.org

Responsibilities may include:

- secure citizen dashboard
- applications
- appointments
- documents
- notifications
- service history
- authorized identity information
- consent/access information where legally applicable

This application must never expose another citizen's private records.

---

## apps/admin

Privileged administrative platform.

Must NEVER imply universal government data access.

Authorization must be institution-scoped and purpose-scoped.

Future requirements include:

RBAC
ABAC
MFA
privileged access controls
immutable audit
short-lived sessions/credentials
least privilege

---

## apps/institutions

Institution-management experience.

Designed for controlled management of:

- institution profile
- offices
- public contacts
- public services
- public documents
- public announcements

It does NOT grant access to unrelated institutional datasets.

---

## apps/departments

Territorial government experience.

Supports:

Department
-> Arrondissement
-> Commune
-> Communal Section

Territorial records should use stable identifiers.

---

## apps/api

Initial backend platform.

Begin as a modular NestJS application.

Initial domains will eventually include:

institutions
territories
service catalog
applications
documents
notifications
consent
audit

Do not implement these merely because they are listed here.
Follow the active development phase.

---

# 8. Institution Architecture

Institutions must use stable internal identifiers.

Never use the current officeholder as the institution identifier.

Example:

HT-MEF-DGI

rather than:

<minister-name>-tax-office

Leadership changes must not alter institutional identity.

The National Institution Registry is an authoritative project dataset only to
the extent indicated by its verification metadata.

Preserve:

- source
- verification status
- source verification date
- aliases
- historical names
- parent relationships

Never silently convert a legacy institution into a current institution.

---

# 9. Territorial Architecture

Canonical hierarchy:

Republic of Haiti
-> Department
-> Arrondissement
-> Commune
-> Communal Section

Current project baseline:

10 departments
42 arrondissements
149 communes

The registry also records verified aggregate counts for communal sections and
quartiers.

Do not invent missing territorial names.

Use verification metadata.

---

# 10. API Design

External and internal APIs must have explicit contracts.

Shared contracts belong in:

packages/contracts

Contracts must be versionable.

Examples:

v1.identity.verification.request
v1.identity.verification.completed
v1.application.submitted
v1.application.approved
v1.payment.confirmed
v1.document.issued

Avoid leaking internal ORM models directly through public APIs.

Use explicit DTOs/schemas.

All untrusted inputs require validation.

---

# 11. Data Ownership

Every data domain must define:

- authoritative owner
- steward
- classification
- permitted consumers
- retention requirements
- audit requirements
- legal/policy basis when known

Do not duplicate sensitive authoritative records merely for convenience.

Where possible use verification responses, references or purpose-limited
projections rather than copying complete source records.

---

# 12. Security Rules

Security begins at repository initialization.

Required principles:

- zero trust
- least privilege
- deny by default
- MFA for privileged access
- RBAC + ABAC where appropriate
- encryption in transit
- encryption at rest
- no hard-coded credentials
- no secrets committed to Git
- short-lived cloud credentials
- environment isolation
- immutable security audit events
- secure session handling
- input validation
- output encoding
- dependency scanning
- secret scanning
- SAST
- container scanning
- IaC scanning
- SBOM generation
- dependency pinning where appropriate
- secure headers
- CSRF protection where applicable
- rate limiting
- API abuse protection
- backup/restore testing
- incident-response readiness

Never disable a security mechanism simply to make a test pass.

Fix the root cause.

---

# 13. Sensitive Data

Treat at minimum the following as sensitive:

- identity records
- authentication credentials
- tax information
- financial information
- health information
- education records
- immigration information
- criminal-justice information
- protected court records
- minors' information
- precise personal location
- security-sensitive infrastructure
- military information

Never log sensitive payloads by default.

Use structured redaction.

---

# 14. Authentication vs Identity

Authentication is not the same as authoritative civil identity.

Do not model:

login account == national identity record

Use separation similar to:

User Account
-> Authentication
-> Identity Reference
-> Authorized Verification
-> Authoritative Institution

Future ONI integrations must use defined contracts.

Never create fake production ONI integrations.

Use clearly marked development adapters/test fixtures until an authorized
integration exists.

---

# 15. Audit

Security-sensitive actions must eventually emit structured audit events.

An audit event should support:

event ID
timestamp
actor
institution
action
resource
purpose
result
correlation ID
source
security context

Do not place passwords, tokens or unnecessary sensitive values into audit
events.

---

# 16. Environments

Maintain hard boundaries between:

development
staging
production

Never share:

databases
secrets
encryption keys
service credentials
identity configuration

across production and non-production environments.

Production data must not be copied into development.

---

# 17. Infrastructure

Infrastructure must be reproducible through Terraform whenever practical.

Avoid manual production configuration.

AWS resources must follow:

least privilege
private networking where applicable
encryption
logging
tagging
backup
monitoring
cost attribution

Do not deploy production infrastructure during local foundation phases unless
explicitly requested.

---

# 18. Cloudflare

Cloudflare is the intended public edge for:

DNS
CDN
WAF
rate limiting
bot/abuse protections where appropriate

Do not make Cloudflare configuration manually if a safe reproducible
Terraform/API-managed configuration is available and approved.

---

# 19. Accessibility

Public applications target WCAG 2.2 AA.

Accessibility is a release requirement.

Include:

keyboard navigation
semantic HTML
visible focus
screen-reader support
sufficient contrast
accessible forms
error identification
captions/transcripts where applicable
reduced-motion support
responsive design

Never sacrifice accessibility for visual effects.

---

# 20. Language

Primary public languages:

Haitian Creole (ht)
French (fr)

Additional supported experiences may include:

English (en)
Spanish (es)

Do not treat Haitian Creole as an afterthought.

Architecture must support multilingual content from the beginning even if the
first implementation phase does not contain complete translations.

---

# 21. Design System

Shared UI belongs in:

packages/design-system
packages/ui

Brand assets belong in:

packages/branding

National identity assets should eventually support:

national seal
national emblem
simplified national mark
ministry seals
agency seals
department marks

Do not fabricate an "official" status for proposed visual assets.

---

# 22. Government Content Integrity

Government/public information requires provenance.

Content records should eventually support:

source URL
source institution
verification status
verified timestamp
effective date
expiration/review date
version
publisher

Do not silently generate factual government content and store it as verified
official information.

---

# 23. AI

HaitiAI is NOT part of the initial implementation.

Future AI capabilities must clearly distinguish:

official information
retrieved source information
AI-generated explanation
human/government decisions

AI must never independently issue:

official credentials
licenses
court decisions
immigration decisions
government approvals

unless a future legally authorized architecture explicitly provides such a
workflow.

---

# 24. Payments

Do not hard-code KobKlein as the national government payment provider.

Architecture must support multiple authorized providers.

KobKlein may be implemented only as an integration adapter when explicitly
requested and appropriately authorized for the target environment.

Payment domain contracts should remain provider-neutral.

---

# 25. Coding Standards

TypeScript strict mode is mandatory.

Avoid `any`.

Prefer explicit domain types.

Use descriptive names.

Keep modules cohesive.

Avoid giant files.

Avoid circular dependencies.

Avoid hidden global state.

Do not swallow exceptions.

Use structured logging.

Validate environment variables at startup.

Do not expose stack traces to public users.

Use deterministic migrations.

All schema changes require migrations.

Do not edit production data manually.

---

# 26. Testing Requirements

Use a testing pyramid.

Unit:
domain logic

Integration:
database
API
queues
storage adapters

E2E:
critical user journeys

Security:
authorization boundaries
input handling
session behavior
rate limits where applicable

Accessibility:
automated + eventual manual validation

Performance:
critical APIs and pages before production

Every bug fix should include a regression test when practical.

---

# 27. Definition of Done

A task is NOT complete merely because code was written.

Before reporting completion:

1. formatting passes
2. lint passes
3. TypeScript passes
4. unit tests pass
5. relevant integration tests pass
6. production build passes
7. no secrets were committed
8. dependencies were reviewed
9. security checks applicable to the phase pass
10. documentation was updated
11. tracker was updated
12. git diff was reviewed
13. unresolved risks are explicitly reported

Never claim a check passed unless it was actually executed.

---

# 28. Git Standards

Use conventional commits.

Examples:

feat(web): add government service search
fix(auth): reject expired verification sessions
chore(repo): initialize pnpm workspace
docs(adr): record modular-monolith decision
test(api): cover institution authorization

Prefer small, reviewable commits.

Do not force push shared branches.

Do not merge automatically unless explicitly instructed.

Never commit:

.env
credentials
private keys
tokens
production exports
real citizen data

---

# 29. Architecture Decision Records

Significant architectural decisions require ADRs.

Location:

docs/adr/

Naming:

0001-use-pnpm.md
0002-use-turborepo.md
0003-modular-monolith-first.md

ADR format:

# Title

Status

Context

Decision

Consequences

Security considerations

Alternatives considered

---

# 30. No Mock Production Integrations

Do not pretend an integration exists.

Development fixtures are allowed.

They must be clearly labeled as:

development fixture
test adapter
stub
sandbox adapter

Never label test data or simulated external services as production-connected.

---

# 31. Working Method

For every assigned phase:

1. inspect repository state
2. inspect current tracker
3. inspect relevant ADRs
4. state implementation plan
5. make the smallest coherent change
6. run required validation
7. inspect git diff
8. update documentation
9. update tracker
10. report exactly what changed
11. report tests/checks executed
12. report remaining risks
13. STOP

Do not continue into the next phase without instruction.

---

# 32. Progress Tracking

Canonical tracker:

docs/engineering/MASTER-TRACKER.md

Every completed task must update it.

Allowed states:

[ ] Not started
[~] In progress
[x] Complete
[!] Blocked

Never mark work complete without satisfying its definition of done.

---

# 33. Current Development State

Project architecture/design work exists.

Engineering implementation has completed Phase 0 except for the externally
blocked CODEOWNERS identity mapping, and Phases 1 and 2 are complete. The Phase
3 Institution Registry service foundation, canonical workbook imports, and
institution offices are complete; independent/state institution reconciliation
and named communal sections remain open.

Current verified progress:

21.8% (76 of 349 tracked items complete; 1 item blocked)

The next implementation target is resolution of the deferred State
Institutions identity/taxonomy conflicts and a source-backed named
communal-section dataset.

Do not assume infrastructure, databases, identity systems or external
government integrations already exist.

Inspect the repository before making changes.

---

# 34. Current Assignment

On 2026-09-26, the repository owner authorized continued implementation of the
engineering master tracker in sequence.

Proceed autonomously through the smallest coherent tracker phases. Validate and
document each phase before moving forward. Stop and request user action when a
credential, external account, legal/policy decision, authoritative government
source, GitHub identity/team handle, production deployment approval, or other
material choice is required.

Do not bypass phase order merely because later capabilities are listed in the
target architecture. Do not fabricate official integrations or authority.
