# HaitiGov Engineering Master Tracker

Version: 1.0
Program: Haiti Digital Transformation Initiative
Platform: HaitiGov

## Overall Engineering Progress

31.5% (110 of 349 tracked items complete; 3 items blocked; 12 items in progress)

---

# Phase 0 — Engineering Foundation

## Repository

- [x] 0.1 Initialize repository baseline
- [x] 0.2 Configure pnpm workspace
- [x] 0.3 Configure Turborepo
- [x] 0.4 Establish strict TypeScript foundation
- [x] 0.5 Configure Biome
- [x] 0.6 Configure additional lint/security rules
- [x] 0.7 Configure Git hooks
- [x] 0.8 Configure commit standards
- [x] 0.9 Configure Changesets
- [x] 0.10 Establish environment-variable standard

## Local Platform

- [x] 0.11 Docker development foundation
- [x] 0.12 Local dependency orchestration
- [x] 0.13 Environment validation
- [x] 0.14 Developer bootstrap script

## CI/CD

- [x] 0.15 GitHub Actions baseline
- [x] 0.16 Formatting check
- [x] 0.17 Lint check
- [x] 0.18 Type check
- [x] 0.19 Unit-test check
- [x] 0.20 Build check

## Supply Chain Security

- [x] 0.21 Secret scanning
- [x] 0.22 Dependency scanning
- [x] 0.23 SAST
- [x] 0.24 Container scanning
- [x] 0.25 IaC scanning
- [x] 0.26 SBOM generation

## Governance

- [!] 0.27 CODEOWNERS — awaiting authoritative GitHub user/team handles
- [x] 0.28 CONTRIBUTING.md
- [x] 0.29 SECURITY.md
- [x] 0.30 CODE_OF_CONDUCT.md
- [x] 0.31 Pull-request template
- [x] 0.32 Issue templates

## Architecture Documentation

- [x] 0.33 ADR framework
- [x] 0.34 ADR — pnpm
- [x] 0.35 ADR — Turborepo
- [x] 0.36 ADR — modular-monolith-first
- [x] 0.37 Threat-model structure
- [x] 0.38 Data-governance documentation structure
- [x] 0.39 Runbook structure

## Phase 0 Verification — 2026-09-26

- The pinned Node.js 24.18.1 and pnpm 12.6.0 container completed formatting,
  linting, type checking, unit tests, environment/config validation, and secret
  scanning as a non-root read-only workload.
- `pnpm audit --audit-level high` reported no known dependency vulnerabilities.
- Checkov reported 68 Dockerfile checks passed, 164 GitHub Actions checks
  passed, zero failures, and one documented health-check exception for the
  one-shot validation container.
- Grype reported no fixable high or critical vulnerabilities in the final
  container image.
- Syft generated a valid SPDX 2.3 SBOM containing 424 packages; CI publishes
  the durable SBOM artifact for each verified image build.
- GitHub-hosted CodeQL and dependency-review execution remains subject to the
  repository's remote configuration and GitHub security-feature availability.

---

# Phase 1 — Shared Platform Foundation

- [x] Workspace configuration package
- [x] Shared TypeScript configuration
- [x] Shared testing configuration
- [x] Shared logging package
- [x] Shared observability package
- [x] Shared validation package
- [x] Shared contracts package
- [x] Shared security package
- [x] Shared utilities
- [x] Error model
- [x] Correlation/request IDs
- [x] Health/readiness standards

## Phase 1 Verification — 2026-09-26

- Nine workspace packages are recognized by pnpm and Turborepo: eight
  executable shared packages plus the shared TypeScript configuration package.
- Structured logging redacts sensitive field names before serialization.
- Correlation IDs use UUID v4 generation and reject untrusted malformed input.
- The versionable API result, platform error, and health/readiness contracts are
  defined in `@haitigov/contracts` without coupling to an application framework.
- Strict lint and type checks completed for all eight executable packages.
- The repository test suite passed 15 tests across two test files in the
  non-root, read-only validation container.

---

# Phase 2 — Data Foundation

- [x] PostgreSQL development environment
- [x] Prisma foundation
- [x] Migration strategy
- [x] Seed strategy
- [x] PostGIS
- [x] Institution Registry schema
- [x] Institution aliases
- [x] Institution relationships
- [x] Territorial hierarchy
- [x] Source provenance
- [x] Verification events
- [x] Data classifications
- [x] Audit schema
- [x] Backup/restore development procedure

---

# Phase 3 — Institution Registry

- [x] Import ministries
- [x] Import agencies
- [!] Import independent institutions — authoritative identity/taxonomy review required
- [x] Import public enterprises
- [x] Import departments
- [x] Import arrondissements
- [x] Import communes
- [!] Import communal sections — current authoritative IHSI crosswalk required
- [x] Institution search
- [x] Institution relationships
- [x] Institution offices
- [x] Institution verification status
- [x] Provenance tracking
- [x] Public Institution API

## Phase 3 Foundation Verification — 2026-09-27

- Canonical institution identifiers use an immutable uppercase `HT-...`
  project format; leadership and ordinary name changes do not alter identity.
- Institution lifecycle status is modeled separately from verification status.
- The read-only NestJS module supports list, filter, cursor pagination, alias
  search, detail retrieval, relationships, public provenance, and public
  verification history through explicit DTOs.
- Domain tests reject malformed IDs, self-relations, and parent cycles; the
  database independently rejects self-referential relationships.
- At the foundation checkpoint, no institution or territory rows had been
  imported and no record had been promoted to a verified status.

## Phase 3 Registry Import Verification — 2026-09-27

- Normalized manifests retain the registry workbook, source sheet, source row,
  verification date, source-specific status label, and upstream source URL.
- The repeatable seed imports 74 canonical institution records, including 19
  ministries and 6 public enterprises, plus 54 parent relationships.
- The named territorial hierarchy contains 10 departments, 42 arrondissements,
  and 149 communes. Aggregate counts remain 574 communal sections and 59
  quartiers; no unnamed communal-section rows were generated.
- Every imported row has a deterministic payload hash, source record, and
  verification event. Two consecutive seed runs produced unchanged counts.
- The separate `State Institutions` sheet remains deferred because it contains
  a second Primature identity and non-canonical classifications/statuses.

## Phase 3 Institution Office Verification — 2026-09-28

- The source-reviewed office manifest exactly matches all 52 workbook rows: 10
  MICT departmental delegations and 42 arrondissement vice-delegations.
- Every office resolves to an existing department; every vice-delegation also
  resolves to the matching arrondissement.
- Database constraints reject office type/coverage mismatches, and repeated
  seeds retain deterministic office, provenance, and verification records.
- Public institution detail responses expose explicit office DTOs without ORM
  models, payload hashes, internal notes, or verifier identity.

## Phase 3 Reconciliation Decision — 2026-09-28

- Canonical institution IDs are institution-centric and branch-neutral.
  `HT-STATE-*`, `HT-EXEC-*`, and other workbook identifiers remain
  source-scoped external identifiers until a reviewed rekey migration is
  approved.
- The institution identity ledger prepares CEP and CSCCA mappings for review,
  leaves OPC unresolved, and authorizes no registry import.
- The territorial discrepancy dossier records conflicts involving promoted
  communes. Communal-section import remains blocked pending the current IHSI
  codification crosswalk or authoritative legal acts establishing parentage.
- The existing schema can record source identifiers through provenance, so no
  Prisma migration was created. Both incomplete Phase 3 tracker items remain
  unchecked.

---

# Phase 4 — HaitiGov Design System

- [x] Design tokens
- [x] Typography
- [x] Haitian national palette
- [x] Grid
- [x] Spacing
- [x] Responsive system
- [x] Accessibility foundation
- [x] Buttons
- [x] Inputs
- [x] Forms
- [x] Cards
- [x] Tables
- [x] Navigation
- [x] Government header
- [x] Government footer
- [x] Official banner
- [x] Institution header
- [x] Service cards
- [x] Alerts
- [x] Emergency alerts
- [x] Status badges
- [x] Search
- [x] Pagination
- [x] Language selector
- [~] National seal assets
- [~] National emblem assets
- [~] Simplified national mark
- [x] Ministry identity framework

## Phase 4A Design Foundation Verification — 2026-10-02

- Added framework-neutral design tokens and CSS custom properties for semantic
  colors, the proposed digital national palette, typography, spacing, radii,
  elevation, responsive breakpoints, grid, motion, and z-index layers.
- Added the React UI package boundary and a language-aware design-system
  provider for Haitian Creole, French, English, and Spanish experiences.
- Added WCAG 2.2 AA contrast tests, visible focus and skip-link treatment,
  reduced-motion tokens, and Windows forced-colors behavior.
- Added a guarded branding registry. National seal, emblem, and simplified-mark
  slots remain `REVIEW_REQUIRED`; no reference image is represented as approved
  or official.
- Added Storybook 10 with interactive accessibility review and a Haitian Creole
  foundation story. Playwright performs a zero-violation axe scan and compares
  a reviewed Linux/Chromium screenshot in CI.
- Package boundaries and asset-review requirements are recorded in ADR 0007 and
  `docs/standards/design-system.md`.

## Phase 4B Foundation Components Verification — 2026-10-02

- Added reusable Button, TextInput, Alert, Card, and StatusBadge primitives to
  `packages/ui`, with explicit variants, labels, descriptions, error states,
  and semantic roles.
- Added component styles using the Phase 4A tokens, including minimum touch
  targets and inherited visible-focus treatment.
- Added a Haitian Creole Storybook showcase for the component foundation.
- UI package TypeScript build passed. A Windows Storybook rebuild was attempted
  but its manager cache returned an access-denied error; the pinned
  Linux/Chromium visual path remains the CI verification path.

## Phase 4B Portal Primitives Verification — 2026-10-02

- Added presentation-only Government Header and Footer primitives with
  semantic navigation landmarks and a proposed-mark placeholder.
- Added language selection, service cards, search, and pagination primitives
  with explicit callbacks and accessible labels.
- UI TypeScript build, Biome, ESLint, and diff validation passed.

## Phase 4B Registry and Alert Components Verification — 2026-10-02

- Added an accessible, horizontally scrollable data-table primitive with
  captions, scoped headers, deterministic row keys, and explicit cell renderers.
- Added provenance-aware institution headers that display stable IDs and
  verification state without claiming official adoption.
- Added public-information and emergency-alert banners with distinct semantic
  roles and token-based visual treatment.
- UI TypeScript build, Biome, ESLint, and diff validation passed.

## Phase 4B Ministry Identity Framework Verification — 2026-10-02

- Added a neutral `MinistryIdentityProfile` contract with source, review status,
  stable institution ID, and optional color/mark references.
- Added a usability gate that prevents unreviewed or unsourced profiles from
  being treated as distributable identity assets.
- Added standards documentation and four passing branding governance tests.

## Phase 5 Public Portal Foundation — 2026-10-02

- Added the initial `apps/web` Next.js App Router shell with Haitian Creole
  metadata, shared design-system styles, and a provenance disclaimer.
- Added a public landing-page composition using shared header, footer, search,
  public-information banner, and service-card primitives.
- Next.js dependency installation, TypeScript, ESLint, and production build
  passed; the static `/` route prerendered successfully. No public institution
  or service data was added.

## Phase 5 Public Directory Empty State — 2026-10-02

- Added `/institutions` as a static, accessible public-directory shell with
  search affordance and an explicit no-records state.
- The page requires verified source-backed data before displaying institution
  records; it does not claim the prototype is an official government directory.
- Web TypeScript, ESLint, and Next.js production build passed; `/` and
  `/institutions` prerendered successfully.

## Phase 5 Service and Institution Route Shells — 2026-10-02

- Added `/services` as a source-gated service-discovery empty state.
- Added `/institutions/[institutionId]` as a dynamic detail route that shows
  the requested stable ID without inventing institution content.
- Web TypeScript, ESLint, and Next.js production build passed; the static
  service route and dynamic institution route compiled successfully.

## Phase 5 Candidate Service Import — 2026-10-02

- Added a Prisma service-catalog model and migration with publication and
  verification state defaults that keep candidates out of public results.
- Added a deterministic seed importer for three source-observed OMRH-CRA
  candidates, preserving source URLs and `PENDING_REVIEW` status.
- Generated the Prisma client and passed database TypeScript, Biome, ESLint,
  and diff validation. Migration application and public publication remain
  intentionally separate review steps.
- Development migration applied, deterministic seed executed, and Prisma
  migration status confirmed up to date. Candidate records remain hidden from
  public service results until verification.

## Phase 5 Public Service API Gate — 2026-10-02

- Added `GET /v1/services` with validated query parameters and explicit public
  DTOs.
- The repository hard-filters results to `PUBLISHED` plus
  `VERIFIED_CURRENT`, so candidate records cannot leak into the public API.
- Added API regression coverage; 18 API tests passed, including invalid-locale
  rejection, the source-gated empty response, and repository-level filtering
  that excludes pending candidates.
- Added the read-only `service:review-queue` command; it returns the three
  candidate records with source URLs, `DRAFT` status, and `PENDING_REVIEW`.

## Phase 5 Public Content Contracts — 2026-10-02

- Added explicit public service query schemas and DTOs in
  `@haitigov/contracts`, including publication, verification, language, and
  provenance fields.
- Added standards documentation requiring explicit contracts and source
  metadata before public content is displayed.
- Contract TypeScript build, Biome, ESLint, diff validation, and two schema
  tests passed. No institution or service records were invented.

---

# Phase 5 — Public HaitiGov Portal

- [x] Next.js public application
- [x] Homepage
- [x] Government directory
- [x] Institution pages
- [x] Ministry pages
- [x] Service discovery
- [x] Search
- [~] News/announcements
- [~] Public documents
- [~] Transparency landing page
- [~] Department discovery
- [~] Commune discovery
- [x] Kreyòl
- [x] French
- [~] Accessibility validation
- [~] SEO
- [~] Performance baseline

## Phase 5 Web Accessibility, SEO, and Performance Foundation — 2026-10-03

- Added a keyboard-accessible skip link to every web route.
- Added viewport metadata, a prototype-safe `robots.txt` that disallows
  indexing, and an empty `sitemap.xml` until verified public content exists.
- Web TypeScript, ESLint, Next.js build, and static generation passed for all
  current routes. Full axe/manual accessibility and production performance
  baselines remain outstanding.

## Phase 5 Public Content Route Shells — 2026-10-03

- Added source-gated `/news`, `/documents`, and `/transparency` routes.
- Each route includes Haitian Creole headings, provenance/publication notices,
  semantic landmarks, and the shared skip-link/header/footer treatment.
- Web TypeScript, ESLint, Next.js build, and static generation passed for all
  ten current routes. No unverified content was added.

## Phase 5 Institutional and Territorial Route Shells — 2026-10-03

- Added source-gated `/ministries`, `/departments`, and `/communes` routes.
- Each route states the applicable identity or IHSI hierarchy review requirement
  and avoids inventing institution or territorial relationships.
- Web TypeScript, ESLint, Next.js build, and static generation passed for all
  thirteen current routes.

## Phase 5 French Entry Route — 2026-10-03

- Added a French-language `/fr` entry route with localized metadata, navigation,
  search labels, and the same prototype/provenance disclaimer.
- Web TypeScript, ESLint, Next.js build, and static generation passed for all
  fourteen current routes. Full route-by-route translation remains open.

## Phase 5 Public Search Route — 2026-10-03

- Added a source-gated `/search` route with Haitian Creole labels, accessible
  form semantics, and an explicit empty-result state.
- Web TypeScript, ESLint, Next.js build, and static generation passed for all
  fifteen current routes. Search results remain pending API-backed verified
  content.

## Phase 5 Accessible Recovery and Automated Validation — 2026-10-04

- Added accessible loading, error-recovery, and not-found experiences with
  Haitian Creole messaging and explicit prototype status.
- Added a web application manifest and Playwright/axe checks for all current
  public content routes plus the dynamic institution route and 404 recovery.
- All 24 Playwright checks passed in pinned Chromium, with zero automatically
  detected violations for the configured WCAG A/AA rule tags.
- Upgraded Next.js from vulnerable `16.0.0` to patched Active LTS `16.3.8`;
  the post-upgrade dependency audit reports no known vulnerabilities.
- Automated WCAG checks are now repeatable; manual keyboard, screen-reader,
  zoom, reflow, and cognitive-accessibility review remain required before this
  tracker item can be completed.

## Phase 5 French Public Route Coverage — 2026-10-04

- Added French routes for institutions, institution details, services, search,
  news, documents, transparency, ministries, departments, and communes.
- Added localized metadata, navigation, source-verification notices, empty
  states, error recovery, and a bilingual HTTP 404 recovery experience.
- Recorded the default-Kreyòl and `/fr` routing decision in ADR 0008.
- Web TypeScript, ESLint, Biome, production build, and all 24 automated
  accessibility checks passed. No unverified public records were added.

## Phase 5 Data-backed Service Discovery — 2026-10-05

- Connected the Kreyòl and French service-catalogue routes to the versioned
  public API through the shared runtime-validated service contract.
- Search terms are URL-backed, limited to 100 characters, and passed with an
  explicit locale. The web layer accepts only `PUBLISHED` and
  `VERIFIED_CURRENT` results even though the API already enforces that gate.
- Missing configuration, upstream failures, and invalid payloads remain
  distinct from a valid empty catalogue; no candidate service is presented as
  verified or official.
- Added unit coverage for query validation, transport restrictions, upstream
  schema validation, and defensive publication filtering.
- Repository formatting, lint, TypeScript, unit/API/web tests, the 24-route
  automated accessibility suite, secret scanning, and the production monorepo
  build passed. The Storybook build required the approved unsandboxed build
  execution because its generated manager cache traverses pnpm paths outside
  the workspace sandbox.
- The high-severity dependency audit completed with no known vulnerabilities;
  this slice reuses the repository's pinned Vitest version and adds no new
  third-party package version.

## Phase 5 Verified Institution Directory Boundary — 2026-10-05

- Restricted public institution list and detail queries to current or legacy
  verified records. Pending and partially verified records cannot be retrieved
  through public list filters or canonical-ID detail requests.
- Shared contracts and OpenAPI metadata now expose only public verification
  statuses; API regression tests cover rejection of non-public filters and
  repository-level list/detail filtering.
- Connected Kreyòl and French ministry directory pages to the verified public
  institution API, with ministry-type filtering, search, and explicit
  prototype/non-official notices.
- Contract, API, and web TypeScript checks passed. Contract build, API
  production build, and Next.js production build passed; Next.js generated all
  25 routes.
- Focused API, web service-discovery, and contract tests passed (8, 9, and 2
  tests respectively). Biome formatting passed. Focused ESLint passed for the
  API and web files; linting the touched contracts module still reports the
  existing deprecated `z.string().url()` call at line 251. It was not changed
  because it is unrelated to this work.
- The data-backed public directory remains incomplete: only appropriately
  verified records are shown, and source coverage, the broader directory, and
  manual accessibility review remain open. No institutional records or
  official status were invented.

## Phase 5 Institution Directory Completion Gate — 2026-10-13

- Completed the Kreyòl and French government directory, institution detail,
  and ministry directory implementation boundary. All three experiences use
  runtime-validated public API contracts and expose only `VERIFIED_CURRENT` or
  visibly dated `VERIFIED_LEGACY` records; pending records remain private.
- Confirmed all 21 API tests, 9 web unit tests, and 59 Chromium journeys pass.
  The browser suite covers both directory languages, institution details,
  ministry filters, responsive layouts, keyboard behavior, reduced motion,
  and automated WCAG A/AA checks.
- Capped Playwright at two workers after the uncapped six-worker run exhausted
  local browser sessions. The deterministic two-worker run passed all tests.
- The production monorepo build passed and generated all 27 current Next.js
  routes. Secret scanning passed.
- Added pinned transitive overrides for `shell-quote` 1.11.0 and
  `source-map-js` 1.2.2 after the registry began reporting one critical and one
  high advisory. A fresh high-severity dependency audit reports no known
  vulnerabilities.
- Completion means the source-gated software boundary is operational; it does
  not convert unresolved institution candidates into verified records or imply
  official Government of Haiti adoption. Manual accessibility review remains
  tracked separately.

## Phase 5 Bilingual Global Search — 2026-10-13

- Connected `/search` and `/fr/recherche` to both the public institution and
  service APIs through a shared parallel orchestration layer.
- Each catalogue retains its own runtime schema, publication/verification
  gate, availability state, and empty state. A failure in one source cannot be
  presented as an empty result from the other.
- Oversized queries are rejected before transport. Institution results remain
  limited to current or visibly legacy verified records; service results remain
  limited to published and currently verified records.
- Eleven web unit tests, focused Biome and ESLint, strict web TypeScript, both
  search-route WCAG A/AA browser checks, and the 27-route production web build
  passed.

## Phase 5 Homepage Intro Playback — 2026-10-05

- Connected the six-second proposed HaitiGov logo intro to the Kreyòl homepage
  as a silent, skippable opening that plays once per browser session.
- Reduced-motion preferences bypass the animation; the native modal dialog
  provides keyboard focus, an explicit skip control, and a non-official-status
  notice.
- Refined the homepage opening into a native CSS/SVG cinematic sequence:
  midnight-navy awakening, restrained particles and network connections,
  progressive light-sweep logo reveal, a single outward pulse, the requested
  English signature (with its language identified), and a final half-second
  dissolve revealing the actual homepage underneath.
- The supplied `docs/logo.png` is copied byte-for-byte into the public assets;
  it is not regenerated or recolored. This is owner-requested prototype use,
  not approval of an official national identity asset. Authoritative provenance
  and usage-rights review remain required before production distribution.
- The earlier standalone MP4 remains under `docs`; the homepage uses the native
  animation rather than that recording. Playwright covers six-second timing,
  dismissal, session behavior, keyboard Escape, reduced-motion changes, asset
  failure, and the active dialog's automated accessibility.
- Validation: 9 web unit tests and 33 browser tests pass, including desktop,
  mobile, and landscape control-spacing regressions. Web lint, TypeScript,
  production build, and changed-file Biome checks pass. Desktop reveal,
  signature, and dissolve frames and the mobile signature were visually
  reviewed; the source and public logo hashes match.

---

## Phase 5 Bilingual Public Homepage Redesign — 2026-10-06

- Replaced the Kreyol and French homepage shells with a shared responsive
  public-portal composition: branded navigation, scenic service search,
  essential-service and life-event links, verified-institution preview,
  territorial discovery, heritage, transparency, and public-information links.
- Preserved the silent six-second, session-scoped, skippable homepage intro.
  The default entry remains Kreyol; the French entry remains `/fr`.
- Used an attributed public-domain 2010 Citadelle photograph, with the source,
  author, rights review, and local WebP derivative documented in the branding
  README. Unreviewed reference renderings were not presented as photographs.
- Replaced the proposed map with the owner-approved department selector.
  Stable department IDs and registry-derived counts provide 10 departments,
  149 communes, 42 arrondissements, and 574 communal sections. This does not
  resolve the outstanding source review for named communal sections or GIS
  boundaries.
- Mon Haiti is explicitly a concept preview, with no accounts, applications,
  private records, or external identity/payment integrations. Service cards
  initiate catalogue searches, not transactional requests. Institutional API
  configuration/failure states remain explicit; no news or alerts were invented.
- Web ESLint, TypeScript, changed-file Biome checks, secret scanning, and the
  production build passed. Nine unit tests and 44 Chromium browser checks
  passed, including bilingual search/navigation, registry counts, the intro,
  responsive reflow, mobile search-field sizing, and automated WCAG checks.
- Desktop and mobile pages were visually reviewed. Next.js runtime diagnostics
  reported no application errors. The browser's existing missing favicon
  request remains outside this change; full manual accessibility and production
  performance reviews are still required.
- Local preview uses the direct web development command. The previously
  identified Windows Application Control block on Turbo, absent API database
  configuration, and production asset/source approvals remain external gates.

---

## Phase 5 Public Homepage Visual Enhancements — 2026-10-06

- Added a restrained eight-second Haitian blue/red gradient only to the hero
  HaitiGov wordmark, with two identical color periods and a narrow light sheen.
  The welcome line, typography, layout and original intro logo remain unchanged.
- Added a native keyboard-operable visual-effects pause control, static
  reduced-motion treatment, forced-color fallback, and sampled large-text
  contrast checks. No animation-only client component or new dependency was
  introduced; the owner selected the existing design system over competing
  Tailwind/component-library migrations.
- Integrated six optimized owner-supplied prototype illustrations. Mon Haiti
  uses the phone-user image (`docs/monhaiti.png`); the coastline discovery card
  uses `docs/coat.png`. Citadelle, territorial discovery, culture and open
  government use their respective source illustrations. Sources remain
  untouched, and bilingual visible labels distinguish illustrations from
  documentary photographs. Exact mappings and permission status are recorded
  in the branding README. Official identity and production rights review
  remain required.
- Added restrained glass panels, accessible bento-style life-event links,
  hover lift/image zoom and short department-content reveals. The native
  selector, verified territorial counts, DOM navigation order, explicit API
  failure state and concept-only dashboard remain intact. This is not a GIS
  map, an authentication implementation or a production integration.
- Validation passed: five changed-source Biome checks, web ESLint, strict
  TypeScript, production build, changed-text secret scanning, nine unit tests
  and all 53 Chromium browser tests. Tests cover seven widths (320-1920px),
  localized navigation/search, illustration loading/placement, no browser
  console/runtime errors on both illustrated homepages, gradient periodicity,
  keyboard pause, reduced motion, forced colors and automated WCAG checks.
  The full browser run used two workers after a higher-concurrency run exposed
  a timing-sensitive existing intro accessibility/skip test.
- Final visual review passed at desktop (1440px), tablet (768px) and mobile
  (390px), with every illustration decoded and no browser console errors.
  Stale local optimized-image derivatives for the two corrected source
  mappings were removed before checking the preview.
- Dependency review: no manifest or lockfile changes. `pnpm audit --prod`
  reports one existing high-severity advisory for transitive `source-map-js`
  below 1.2.2 via Next/PostCSS (GHSA-68fv-2mgg-jv7q). Dependency remediation and
  production release remain gated; this unrelated advisory was not silently
  suppressed or represented as passing.
- Named communal sections, authoritative GIS sources, API/database setup,
  Windows Application Control's Turbo restriction, Node patch-version
  compliance and production approvals remain unchanged external gates.

## Phase 5 Bilingual Service Catalogue Experience — 2026-10-13

- Reworked `/services` and `/fr/services` into a shared, localized service
  catalogue page with search, topic suggestions, responsive navigation, and
  the existing public-portal visual system.
- Topic cards remain search suggestions, not claims that a service is
  available. Search results continue to use the source-gated API; no service
  records or government integrations were added.
- Focused validation passed: 9 service-discovery unit tests, 4 Chromium browser
  tests across both locales (including automated WCAG checks), web TypeScript,
  ESLint, Biome, and the Next.js production build. Manual accessibility review
  and verified catalogue coverage remain open.

### Dedicated Vercel publication — 2026-10-13

- GitHub source: `carleintech/haitigov`, branch `main`; initial source commit
  `f95f579`. The existing GitHub repository is public.
- Dedicated Vercel project: `haitigov` in
  `erickharlein-pierres-projects`, project ID
  `prj_OJ8kP3udZKt6BJkS9PrqNjjcbxeB`, connected to that GitHub repository.
  Public URL: <https://haitigov.vercel.app>.
- Project settings: Next.js, root `apps/web`, Node `24.x`, install
  `pnpm install --frozen-lockfile`, build
  `pnpm exec turbo run build --filter=@haitigov/web...`, output `.next`.
  The dependency-aware build is required for clean GitHub checkouts because
  shared packages export compiled JavaScript. Deploy the repository
  root, not the app directory. Verify the exact project ID before deploying;
  never reuse the unrelated `web` project or KobKlein domains.
- Deployment `dpl_5UPWWR4U3HVBnayGitXSdCPj5Yan` reached READY with a successful
  remote production build. Browser checks returned HTTP 200 for `/fr`,
  `/services`, and `/fr/services`, with expected localized headings and no
  captured page errors. The initial one-hour Vercel error-log query returned
  zero records; monitoring/drains were not verified.
- Publication correction: an earlier deployment incorrectly targeted the
  unrelated `web` project and its KobKlein production alias. This dedicated
  deployment does not restore that site. Restoration requires owner approval;
  no rollback or domain mutation was performed during this correction.
- Both local project links now target `haitigov`. Local Vercel directories
  and environment files remain ignored; the production environment file
  previously pulled from the unrelated project was removed.
- Release checks remain open: GitHub CI's Quality and build job failed at
  Run unit tests; the visual-regression job and CodeQL passed. This deployment
  is a proposed-platform UI publication, not completion of production
  readiness, backend integration, security remediation, or the broader phase.
- GitHub-source verification: redeployment
  `dpl_BMhpE4iBUJ4ch4i64XVMpciFcRkM` of commit `d91f60a` reached READY after
  correcting the dependency build. Vercel reported a 33-second build and
  HaitiGov-only aliases, including `haitigov.vercel.app` and the configured
  `haitigov.org` / `www.haitigov.org` domains. No custom-domain configuration
  was changed during this correction. The error query returned zero records.
- CI failure detail: the Quality and build job attempted Playwright tests
  without an installed Chromium headless-shell executable. The CI browser
  installation/order needs separate repair; this is not a passing test suite.

---

## Phase 5 Remaining Public-Page Visual Milestone — 2026-10-14

- [x] Shared bilingual layouts aligned to the owner-supplied public-page
      mockups: institution directory, department directory, all ten department
      details, Explore Haiti, history, transparency and news.
- [x] Responsive illustrated heroes, navigation, cards, search/filter controls
      and explicit prototype notices. Owner-mockup crops are reproducible using
      `node scripts/prepare-public-page-assets.mjs`; provenance and production
      rights limitations are recorded in `packages/branding/README.md`.
- [x] Canonical department identifiers, capitals, counts and commune membership
      retained. Unknown department slugs return 404; language links preserve the
      selected department. The schematic selector is not an authoritative GIS map.
- [x] Institution and news layouts preserve source-gated API responses and
      explicit unavailable states. Loaded results support localized filtering,
      sorting and pagination; news date filtering uses Haiti's local calendar.
- [x] History citations and editorial caveats retained. Unverified population,
      area, projects, announcements and media were not fabricated to match mockups.
- Validation passed: `pnpm format:check`, `pnpm exec biome lint .`,
  `pnpm --filter @haitigov/web lint`,
  `pnpm --filter @haitigov/web typecheck`,
  `pnpm --filter @haitigov/web exec vitest run tests/public-service-discovery.test.ts`
  (20 tests), `pnpm test:unit` (15 tests), and
  `pnpm exec turbo run build --filter=@haitigov/web...` (49 generated pages).
  With `PLAYWRIGHT_REUSE_SERVER=true`,
  `pnpm --filter @haitigov/web exec playwright test tests/public-pages.spec.ts tests/history.spec.ts tests/service-catalog.spec.ts tests/accessibility.spec.ts`
  passed 64 Chromium tests, including both locales, all department details,
  responsive overflow, image decoding and automated WCAG checks.
  A separate keyboard-scroll regression also passed after the final semantic
  corrections. `pnpm secrets:scan` and `git diff --check` passed. Desktop
  Explore and mobile Nord screenshots were reviewed with no horizontal overflow.
- [x] Fixture-driven browser coverage of populated institution/news filters,
      sorting and pagination: 14 Chromium tests passed across French and Haitian
      Creole, including localized institution names, current/legacy separation,
      category/filter synchronization, reset behavior, search submission, empty
      results, partial-result notices and explicit API outages. News tests cover
      source filters, chronology and both sides of Haiti's local midnight.
      Populated mobile pages also passed automated WCAG checks and overflow checks.
- [x] Fixed a populated-news hydration regression: Node and Chromium resolve
      unsupported `ht-HT` date formatting differently, which could replace the
      search field during hydration and discard an entered query. Haitian Creole
      publication labels now use explicit month names and Haiti-local calendar
      parts; French labels retain their existing format. Unit regressions cover
      all twelve months, year rollover, midnight boundaries and invalid timestamps.
      All 14 populated-data browser tests passed after the fix with automatic
      per-test assertions for zero hydration/runtime page errors and explicit
      bilingual date-label assertions.
- Reproduce populated-data validation with
  `pnpm --filter @haitigov/web test:public-data`. This builds the web app and
  workspace dependencies, then runs the production server on loopback port
  3210 against a synthetic API on loopback port 3211. Playwright owns both test
  servers, refuses occupied ports and stops them after the suite. Fixture tests
  are excluded from the normal development-server suite; neither the ordinary
  development server nor production configuration receives synthetic records.
  These tests do not verify a connected production API or authoritative data.
- [ ] Verified GIS geometry, source-backed additional public content, approved
      videos/slides with captions and rights, and manual accessibility review.
- No dependencies were added. Existing Node patch-version mismatch,
  transitive source-map-js advisory and GitHub CI browser-install failure remain
  separate unresolved gates. No new commit, push or deployment was performed.
- This visual milestone does not complete Phase 5 or change the tracked
  349-item baseline; full data and production-readiness gates remain open.

---

## Phase 5 Commune Directory Milestone — 2026-10-14

- [x] Replaced unavailable-registry placeholders at `/communes` and
      `/fr/communes` with a shared Haitian Creole/French directory of all 149
      canonical communes. Stable identifiers, department and arrondissement
      relationships, verification status and individual IHSI source links are
      preserved from the project registry.
- [x] Accent/case-insensitive name, identifier and parent-territory search;
      department filters; dependent arrondissement options; reset and explicit
      empty states; nine cards per page with accessible pagination and result
      counts. Parent/filter changes reset pagination, and department changes
      clear the arrondissement selection.
- [x] Shared illustrated public layout, responsive commune cards, truthful
      prototype/provenance notices and language links. Department links use
      existing department pages; unimplemented commune-detail URLs are not exposed.
- Validation passed: `pnpm --filter @haitigov/web lint`,
  `pnpm --filter @haitigov/web typecheck`,
  `pnpm --filter @haitigov/web exec vitest run tests/public-service-discovery.test.ts`
  (22 tests), `pnpm test:unit` (15 tests), `pnpm exec biome lint .`,
  `pnpm format:check`, `pnpm secrets:scan`, and
  `pnpm exec turbo run build --filter=@haitigov/web...` (49 generated pages).
  With `PLAYWRIGHT_REUSE_SERVER=true`,
  `pnpm --filter @haitigov/web exec playwright test tests/public-pages.spec.ts`
  passed 30 Chromium tests. A final
  `pnpm --filter @haitigov/web exec playwright test tests/public-pages.spec.ts --grep 'commune|/communes'`
  passed six tests after the component lint corrections.
- Browser regressions cover all 149 identifiers across 17 pages in canonical
  order, both locales, dependent filters, pagination resets, search submission,
  empty/reset states, source/department links and language navigation. Mobile
  commune routes passed automated WCAG checks and horizontal-overflow checks.
- Production-browser verification used an isolated Next production server on
  loopback port 3214 and Chromium with `ht-HT` locale. Both routes returned 200,
  search/filter/pagination interactions passed, and no hydration/runtime page
  errors or desktop/mobile overflow were observed. Fully loaded desktop artwork,
  the desktop directory and mobile commune-card screenshots were reviewed.
  This validates local production rendering, not a deployed production service.
- [ ] Commune detail pages, verified officials/local services, named communal
      sections, authoritative GIS boundaries and manual accessibility review.
- No dependencies were added, and no commit, push or deployment was performed.
  Existing Node patch compliance, transitive source-map-js advisory, GitHub CI
  browser installation and other production gates remain unresolved.
  Commune discovery remains in progress; this bounded milestone does not mark
  Phase 5 complete or change the 349-item baseline.

---

### Public-page release authorization — 2026-10-14

- Owner explicitly requested commit and Vercel deployment of the completed
  public-page work. Target remains `carleintech/haitigov` on `main` and the
  dedicated Vercel project `prj_OJ8kP3udZKt6BJkS9PrqNjjcbxeB` (`haitigov`).
- Pre-release validation passed: web lint/typecheck, repository formatting,
  secret scanning, whitespace checks, 12 shared-contract unit tests and
  `pnpm --filter @haitigov/web test:public-data` (production build and
  14 fixture-driven Chromium tests).
- Current `pnpm audit --prod --audit-level high` reports no known
  vulnerabilities, superseding the earlier local source-map-js audit result
  for this check. No dependency versions were changed in this release.
- Release scope is the proposed public web experience, its shared announcement
  contracts, artwork preparation and documentation. Separate API/database
  work remains uncommitted; no database migration or backend deployment is
  authorized or performed by this web release.
- [x] Published web release `884e0c32155423343ec79ea24dfa803fe69bdf4f`
      to `carleintech/haitigov` on `main`. Its Git-triggered Next.js production
      deployment `dpl_4bVCnRwWhXyNqrWexLEL13cii93J` is READY (28-second build);
      `https://haitigov.vercel.app` and existing HaitiGov domain aliases point to
      the dedicated project. No KobKlein project or domain was modified.
- Live Chromium verification passed on 20 public routes across both locales,
  commune search/submission/filter/reset/pagination and five mobile layouts.
  All requested routes returned 200, headings were visible, no horizontal
  overflow occurred and no hydration/runtime page errors were captured.
  The deployment-scoped Vercel error-log query returned no logs; persistent
  log drains and alerting have not been verified.
- Rollback remains available to the preceding READY deployment
  `dpl_BVbuqEUJyuMRpdi9Rbed2FhPEHKk`. No rollback was performed.
- GitHub release CI exposed a security-lint warning in artwork preparation.
  The script now requires the repository-root working directory before its
  literal output-directory creation; no security rule was disabled.
  Root invocation regenerated identical artwork and focused ESLint passed.
  Full dirty-workspace lint remains blocked by two unsafe-assignment errors
  in separate, uncommitted announcement repository tests, outside this release.
- The quality job now installs pinned Playwright Chromium and Linux system
  dependencies before running public-page tests, matching the existing
  design-system job. Remote CI then passed 87 of 89 browser tests; two homepage
  assertions retained an outdated supported-route list. The list now includes
  both implemented Explore routes, independently verified live with status 200.
- Follow-up tooling commit `734b9540104ef991164f7d0a0d0c5128b24002da`
  deployed READY as `dpl_8oRxuHPkE6C35nCrqRE5pGY2T443` (19-second build).
  Live verification traversed all 149 distinct communes across 17 pages in
  each locale and decoded artwork on five public pages without runtime errors.
  Its deployment-scoped error-log query returned no logs.
- Remote CodeQL, design-system visual regression, dependency/secret audit,
  SBOM and infrastructure scan passed. The foundation-container Grype scan
  failed on high-or-higher vulnerabilities; that separate container is not
  used by this Vercel web deployment. Its findings remain an open gate, not
  suppressed or reported as a passing security check.
- [x] Corrected assertions passed locally in both languages.
      Validated release commit `f2883f61c3b56d3769f1a54fdb53922bbeee35f5`
      passed remote Quality and build (formatting, lint, types, all unit tests,
      89 Chromium journeys, production build and secret scan) and design-system
      visual regression in CI run `38624149400`.
      Its dedicated Next.js production deployment
      `dpl_EzgCtTURcVsdrXxVwc9M7Jq5URDr` is READY (17-second build).
      Final live smoke checks passed both commune and Explore routes; no
      runtime/hydration page errors or deployment-scoped error logs were found.
- Node patch compliance, connected production API, verified content/media
  rights and identity approvals, manual accessibility and foundation-container
  vulnerability remediation remain open. Deployment must not imply government adoption or
  completion of production-readiness gates.

---

## History navigation follow-up

- [x] Added localized `Istwa` / `Histoire` links after Explore in the homepage,
      service catalog and shared public-page desktop and mobile navigation.
      Removed the shared mobile menu's duplicate history entry and marked the
      current history page in both navigation variants.
- Validation passed: web lint and typecheck, focused Biome checks, 22 web unit
  tests, 30 Chromium history/homepage tests and the dependency-aware production
  web build. Navigation tests cover both languages at 320, 390, 1201 and 1440
  pixels, keyboard activation, localized destinations, current-page state,
  horizontal overflow and page runtime errors; existing automated accessibility
  checks also passed.
- The owner authorized commit and production publication on 2026-10-14.
  Target verification confirmed `carleintech/haitigov` on `main` and the
  dedicated Vercel `haitigov` project (`prj_OJ8kP3udZKt6BJkS9PrqNjjcbxeB`).
  Only this navigation follow-up is included; unrelated API/database work
  remains local.
- Published navigation commit `fd2dabb0bb2188b580652e62e486172ec4d597b2`
  deployed READY to production as `dpl_6ppTiFChhm3GTT2BDuLZDrxrZ1TZ`
  (25-second build). GitHub's Vercel commit status is successful.
  Live Chromium smoke checks passed 12 homepage/service/institution navigation
  journeys across both languages at 390 and 1440 pixels on
  `https://haitigov.vercel.app`, including destination headings, overflow and
  page runtime errors. Deployment-scoped error queries returned no logs.
  Remote Quality and build and design-system visual regression both passed in
  CI run `38644182211`. Log drains and alerting remain unverified.
  Existing production-readiness gates remain unchanged.

---

# Phase 6 — Identity & Access Foundation

- [ ] Authentication architecture
- [ ] Account model
- [ ] Identity-reference model
- [ ] MFA
- [ ] Session management
- [ ] Recovery
- [ ] RBAC
- [ ] ABAC
- [ ] Institution-scoped authorization
- [ ] Privileged access
- [ ] Security audit
- [ ] Identity verification contracts
- [ ] Development identity adapter
- [ ] Threat model
- [ ] Penetration-test preparation

---

# Phase 7 — My Haiti

- [ ] Citizen application
- [ ] Account profile
- [ ] Citizen dashboard
- [ ] Service applications
- [ ] Application status
- [ ] Appointments
- [ ] Notifications
- [ ] Documents
- [ ] Verification results
- [ ] Consent/access history
- [ ] Security center
- [ ] Accessibility
- [ ] Mobile-first optimization

---

# Phase 8 — Service Catalog & Workflow

- [ ] Government service model
- [ ] Eligibility rules
- [ ] Requirements
- [ ] Forms
- [ ] Fees
- [ ] Offices
- [ ] Digital channels
- [ ] Application workflows
- [ ] Status transitions
- [ ] Case management boundaries
- [ ] Service-level audit
- [ ] Notifications
- [ ] Citizen tracking

---

# Phase 9 — Haiti Data Exchange

- [ ] Interoperability architecture
- [ ] API gateway
- [ ] Institution service registry
- [ ] Machine authentication
- [ ] Authorization policies
- [ ] Purpose limitation
- [ ] Consent integration
- [ ] Data minimization
- [ ] Event architecture
- [ ] Schema registry
- [ ] Audit
- [ ] Rate limits
- [ ] Institutional sandbox
- [ ] Test adapters
- [ ] Integration certification

---

# Phase 10 — Documents & Credentials

- [ ] Document service
- [ ] Verification
- [ ] QR verification
- [ ] Digital signatures
- [ ] Credential model
- [ ] Issuer model
- [ ] Revocation
- [ ] Expiration
- [ ] Secure storage
- [ ] Public verification endpoint

---

# Phase 11 — Payments

- [ ] Provider-neutral payment contracts
- [ ] Payment requests
- [ ] Payment confirmation
- [ ] Refund model
- [ ] Receipts
- [ ] Reconciliation
- [ ] Audit
- [ ] Provider adapter interface
- [ ] Authorized-provider sandbox
- [ ] KobKlein adapter only if authorized
- [ ] Additional provider adapters

---

# Phase 12 — Territorial Government

- [ ] Department portals
- [ ] Arrondissement representation
- [ ] Commune portals
- [ ] Communal sections
- [ ] Local offices
- [ ] Local services
- [ ] Local notices
- [ ] Local projects
- [ ] Local emergency information
- [ ] Local statistics

---

# Phase 13 — GIS

- [ ] PostGIS architecture
- [ ] Administrative boundaries
- [ ] Roads
- [ ] Hospitals
- [ ] Schools
- [ ] Government offices
- [ ] Emergency shelters
- [ ] Public infrastructure
- [ ] Cultural sites
- [ ] Public projects
- [ ] Sensitive-layer controls
- [ ] Vector-tile architecture
- [ ] Public maps

---

# Phase 14 — Transparency & Open Government

- [ ] Budget datasets
- [ ] Procurement
- [ ] Contracts
- [ ] Projects
- [ ] Project milestones
- [ ] Funding
- [ ] Audit reports
- [ ] Public datasets
- [ ] APIs
- [ ] Rebuild Haiti dashboard
- [ ] Citizen feedback

---

# Phase 15 — HaitiExplore

- [ ] Cultural registry
- [ ] Heritage registry
- [ ] Places
- [ ] Food
- [ ] Music
- [ ] Festivals
- [~] Historical content
  - Implementation started (2026-10-13; owner-requested): create a dedicated,
    bilingual "Istwa Ayiti / Histoire d'Haïti" experience under HaitiExplore,
    covering Indigenous history before 1492 through the present. Keep the
    canonical narrative on bookmarkable, linkable pages: a chronological
    overview, focused era articles, and individual profiles for historical
    figures and heroines. Use dialogs only for optional short previews or
    supporting context, never as the sole home for substantial articles.
  - Include a sourced, period-specific historical FAQ such as "Did Haiti have
    military equipment?" Separate documented historical inventories and
    disposition from claims about present-day equipment or readiness; date
    claims and do not infer present conditions from historical sources.
  - Plan optional video and slide/timeline presentations as supporting media,
    not replacements for readable text. Require source and rights records,
    captions and transcripts, keyboard-accessible controls, no autoplay, and
    reduced-motion support before publication.
  - Editorial gates: verify chronology, names, quotations, population and
    equipment figures against authoritative or reputable cited sources; retain
    source URLs, publication/verification dates, uncertainty and review
    history; provide Haitian Creole and French content. Owner-provided draft
    material is research input, not independently verified publication copy.
  - Preserve prototype disclosure and do not imply government adoption,
    institutional approval, or official historical authority without evidence.
  - Implemented: initial bilingual chronology, sourced figure summaries,
    historical military FAQ, and accessible future-media guidance.
  - Remains in progress: coverage beyond the 14 July 2026 UN report, additional
    biographies, translation review, and rights-cleared video/slide media.
    Owner-requested work does not resolve separate Phase 3 source gates or
    imply official government approval.
- [ ] Hidden Haiti
- [ ] Community verification
- [ ] Tourism discovery
- [ ] Maps
- [ ] Media
- [ ] Heritage protection controls

---

# Phase 16 — HaitiXR

- [ ] XR architecture
- [ ] 360 media
- [ ] Virtual tours
- [ ] Heritage experiences
- [ ] WebXR
- [ ] Education experiences
- [ ] Accessibility
- [ ] Performance
- [ ] Content provenance

---

# Phase 17 — HaitiAI

- [ ] AI governance
- [ ] Retrieval architecture
- [ ] Official-source boundaries
- [ ] Kreyòl support
- [ ] French support
- [ ] English support
- [ ] Spanish support
- [ ] Service assistant
- [ ] Government-information assistant
- [ ] HaitiExplore assistant
- [ ] Human escalation
- [ ] Safety controls
- [ ] AI audit
- [ ] Evaluation framework

---

# Phase 18 — AWS Infrastructure

- [ ] AWS account/environment architecture
- [ ] Networking
- [ ] VPC
- [ ] Subnets
- [ ] Security groups
- [ ] KMS
- [ ] Secrets Manager
- [ ] RDS PostgreSQL
- [ ] ElastiCache
- [ ] S3
- [ ] EventBridge
- [ ] SQS
- [ ] ECS
- [ ] Load balancing
- [ ] Monitoring
- [ ] Backups
- [ ] Disaster recovery
- [ ] Terraform state
- [ ] Cost controls

---

# Phase 19 — Cloudflare Edge

- [ ] DNS
- [ ] CDN
- [ ] TLS
- [ ] WAF
- [ ] Rate limiting
- [ ] Bot protection
- [ ] Security headers
- [ ] Cache policy
- [ ] Origin protection
- [ ] Terraform-managed configuration where practical

---

# Phase 20 — Observability & Operations

- [ ] OpenTelemetry
- [ ] Logs
- [ ] Metrics
- [ ] Traces
- [ ] Dashboards
- [ ] Alerts
- [ ] SLOs
- [ ] SLIs
- [ ] Incident response
- [ ] On-call model
- [ ] Runbooks
- [ ] Status platform

---

# Phase 21 — Security Validation

- [ ] Threat models complete
- [ ] SAST
- [ ] DAST
- [ ] Dependency audit
- [ ] Container audit
- [ ] IaC audit
- [ ] Authorization testing
- [ ] Abuse-case testing
- [ ] Penetration testing
- [ ] Disaster-recovery exercise
- [ ] Backup restoration exercise
- [ ] Incident-response exercise
- [ ] Security review

---

# Phase 22 — Performance & Resilience

- [ ] Load tests
- [ ] Stress tests
- [ ] Failover tests
- [ ] Queue resilience
- [ ] Database resilience
- [ ] Cache resilience
- [ ] Edge resilience
- [ ] Low-bandwidth testing
- [ ] Mobile testing
- [ ] Disaster-mode testing

---

# Phase 23 — Production Readiness

- [ ] Production checklist
- [ ] Privacy review
- [ ] Security approval
- [ ] Accessibility approval
- [ ] Data-governance approval
- [ ] Infrastructure review
- [ ] Cost review
- [ ] Monitoring review
- [ ] Backup review
- [ ] DR review
- [ ] Incident-response readiness
- [ ] Documentation
- [ ] Operator training
- [ ] Launch decision

---

# Current Assignment

Progress is recorded through 2026-10-13:

- Phase 0 is complete except for CODEOWNERS, which requires authoritative
  GitHub user/team handles.
- Phase 3 institution-registry service foundation, canonical workbook imports,
  and institution offices are complete. Independent-institution
  identity/taxonomy reconciliation and named communal sections remain gated on
  authoritative evidence.
- Phase 4A/4B foundations include the design-system and UI packages, portal
  primitives, registry components, and a neutral ministry identity framework.
  National branding records remain `REVIEW_REQUIRED`; no proposed asset is
  represented as official.
- Phase 5 service discovery is API-backed and source-gated. The bilingual
  government directory, institution details, and ministry directory are
  complete at the software boundary and remain restricted to verified
  current/legacy records with prototype disclaimers. Other public-portal
  capabilities remain in progress.

Latest focused validation:

- Repository lint and strict TypeScript passed before the browser stage. API
  tests passed (21), web unit tests passed (9), and all Chromium journeys
  passed (59) with the deterministic two-worker configuration.
- The production monorepo build passed; Next.js generated all 27 current
  routes and Storybook completed successfully. Secret scanning passed.
- A fresh high-severity dependency audit passed with no known vulnerabilities
  after pinning patched transitive releases for two newly published advisories.

Next implementation target: continue Phase 5 news/announcements and public
document capabilities while keeping the deferred Phase 3
identity/taxonomy and named communal-section items blocked until authoritative
sources are available. Do not infer names or institutional status. Manual
accessibility review and incomplete source coverage remain open.
