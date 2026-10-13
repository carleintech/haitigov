# Local Platform Foundation

The Phase 0 container validates repository tooling in an isolated Node.js 24
environment. It does not claim to model production infrastructure.

```sh
docker compose run --rm workspace-check
```

The container:

- installs the lockfile exactly;
- uses network access only for pnpm's lockfile supply-chain policy verification;
- uses a read-only root filesystem with a temporary `/tmp`;
- prevents privilege escalation;
- runs repository validation only.

PostgreSQL, Redis, PostGIS, queues, object storage, and application containers
belong to their authorized implementation phases and are intentionally absent.
