# Environment Variable Standard

## Rules

- Commit names and safe examples only in `.env.example`.
- Never commit `.env`, credentials, tokens, private keys, or production exports.
- Use uppercase snake case names.
- Prefix public browser values with the framework-required public prefix only
  after confirming they are safe for anyone to read.
- Validate required variables at process startup.
- Keep development, staging, and production secrets isolated.
- Store production secrets in the approved secret manager for that environment.

## Base variables

| Variable | Purpose | Allowed values |
| --- | --- | --- |
| `HAITIGOV_ENVIRONMENT` | Platform deployment tier | `development`, `test`, `staging`, `production` |
| `NODE_ENV` | Node runtime mode | `development`, `test`, `production` |
| `LOG_LEVEL` | Structured log threshold | `trace`, `debug`, `info`, `warn`, `error`, `fatal` |

Staging and production require `NODE_ENV=production`.

Run `pnpm run env:check` to validate the committed example. Applications must later
extend this foundation with domain-specific runtime schemas without logging
secret values.
