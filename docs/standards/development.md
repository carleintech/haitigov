# Development Standard

## Principles

- TypeScript strict mode is mandatory.
- Domain boundaries are explicit and dependency direction is enforced.
- Inputs are validated at trust boundaries.
- Sensitive data is minimized and redacted from logs.
- Haitian Creole and French are primary public languages.
- Public experiences target WCAG 2.2 AA.
- Production-like integrations require authorization and evidence.

## Repository workflow

1. Link work to a tracker item.
2. Add or update tests with the implementation.
3. Run `pnpm run check`, `pnpm run test`, and `pnpm run build`.
4. Run applicable security and Docker checks.
5. Review the complete Git diff.
6. Update documentation and the tracker.

## Dependency policy

Dependencies must be pinned in the lockfile, compatible with supported runtime
versions, actively maintained, and justified by concrete value. Peer dependency
warnings are errors. GitHub Actions are pinned to immutable commit SHAs and
updated through Dependabot review.

Dependency installation is explicit. `verifyDepsBeforeRun` is disabled because
automatic installs before scripts can race and cannot operate in the read-only
validation container. Bootstrap, Docker, and CI all run a frozen install before
executing project scripts.

## Generated and external content

Generated files must identify their generator when practical. Public or
government information requires provenance and verification metadata. Never
store generated claims as verified official information.
