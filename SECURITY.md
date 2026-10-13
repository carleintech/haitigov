# Security Policy

## Reporting a vulnerability

Do not report security vulnerabilities in a public issue or discussion.

Use GitHub private vulnerability reporting once it is enabled for the
repository. Until a remote repository and private reporting channel are
configured, contact the repository owner through an established private channel
and share only the minimum information needed to coordinate secure disclosure.

Do not include real citizen records, credentials, tokens, private keys, or
production data in a report. Redact logs and screenshots.

## Response expectations

The project will acknowledge receipt, establish a private coordination channel,
assess affected versions and environments, and communicate remediation status.
Timelines depend on severity and available evidence; no fixed response time is
claimed before an operational security team is established.

## Supported versions

The repository is pre-release. Only the current `main` branch is maintained.
No production deployment is represented as supported at this stage.

## Security baseline

Changes are expected to pass formatting, linting, type checking, tests, builds,
secret scanning, dependency review, SAST, container scanning, IaC scanning, and
SBOM generation where applicable. Security controls must not be disabled merely
to make a check pass.
