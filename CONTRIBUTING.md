# Contributing to HaitiGov

HaitiGov is a proposed public digital-infrastructure project. Contributions
must preserve institutional data ownership, user privacy, accessibility, and
the distinction between prototypes and officially authorized systems.

## Before starting

1. Read `AGENTS.md` and the current engineering tracker.
2. Confirm the tracker item and its boundaries.
3. Review relevant ADRs, threat models, and data-governance records.
4. Do not use real citizen data, production exports, or unapproved credentials.

## Local setup

```sh
corepack enable
pnpm run bootstrap
```

Copy `.env.example` to `.env` only for local development. Never commit `.env`
or any credential-bearing file.

## Change standards

- Use conventional commits.
- Keep changes small and reviewable.
- Add tests for behavior and regressions.
- Add a changeset when a versioned workspace package changes.
- Update documentation, the tracker, and relevant security material.
- Clearly label fixtures, stubs, and sandbox adapters.

## Required checks

```sh
pnpm run check
pnpm run test
pnpm run build
pnpm audit
```

Docker changes also require:

```sh
docker compose config
docker build --tag haitigov-foundation:local .
```

## Pull requests

Complete the pull-request template. State data ownership, authorization impact,
validation evidence, and unresolved risks. Never place secrets or sensitive
data in issues, commits, logs, screenshots, or pull-request descriptions.
