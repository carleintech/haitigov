# Development Database Backup and Restore

This runbook applies only to the local `haitigov-postgres` container and its
development data. The `backups/` directory is ignored by Git.

## Backup

```powershell
.\scripts\database\backup.ps1
```

The script creates a timestamped custom-format PostgreSQL dump under
`backups/`, copies it out of the container, and removes its container temporary
file.

## Restore test

```powershell
.\scripts\database\restore-test.ps1 -DumpPath .\backups\haitigov_dev-<timestamp>.dump
```

The restore test always targets the fixed disposable database
`haitigov_restore_test`. It never overwrites `haitigov_dev`. A successful run
restores the dump and verifies the seeded classification table.

## Safety

- Never commit database dumps.
- Never use production data in this development environment.
- Do not run `docker compose down --volumes` unless destruction of the local
  database is explicitly intended.
- Production backup, encryption, retention, recovery-point, and recovery-time
  requirements remain separate future infrastructure decisions.
