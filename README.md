# HaitiGov

HaitiGov is a proposed digital public-service and interoperability platform for
Haiti under the Haiti Digital Transformation Initiative.

This repository is an engineering project initiated by TechKlein. It is not an
official Government of Haiti platform, and no prototype, visual identity,
integration, credential, service, or API in this repository should be described
as officially adopted without authoritative documentation.

## Architecture principle

> One national ecosystem — multiple authoritative institutional databases —
> one secure interoperability layer.

The platform will begin as a modular monolith with service-ready domain
boundaries. It must not become a single unrestricted national database.

## Current scope

Phases 0 and 1 establish repository tooling and framework-neutral shared
platform contracts. Application features, databases, authentication,
infrastructure, and external integrations remain out of scope until their
tracker phases are implemented and verified.

## Prerequisites

- Node.js 24.18.1 or newer in the Node.js 24 LTS line
- Corepack
- pnpm 12.6.0

Enable the repository's pinned package manager if necessary:

```sh
corepack enable
corepack prepare pnpm@12.6.0 --activate
```

## Development commands

```sh
pnpm install
pnpm run bootstrap
pnpm run check
pnpm run test
pnpm run typecheck
pnpm run build
```

Run the isolated foundation check in Docker with:

```sh
docker compose run --rm workspace-check
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a change. Report
security issues through the private process in [`SECURITY.md`](SECURITY.md), not
through a public issue.

The canonical roadmap is
[`docs/engineering/MASTER-TRACKER.md`](docs/engineering/MASTER-TRACKER.md).
Repository-wide engineering constraints are defined in [`AGENTS.md`](AGENTS.md).

## Shared foundation packages

- `@haitigov/config` — deployment-environment contracts
- `@haitigov/contracts` — API results, platform errors, and health contracts
- `@haitigov/logging` — structured JSON logging with field redaction
- `@haitigov/observability` — correlation IDs and telemetry ports
- `@haitigov/security` — data classifications and sensitive-field redaction
- `@haitigov/testing` — shared Vitest defaults
- `@haitigov/typescript-config` — strict TypeScript baseline
- `@haitigov/utils` — narrow runtime utilities
- `@haitigov/validation` — shared validation issues and errors
