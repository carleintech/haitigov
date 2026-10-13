param(
  [string]$OutputDirectory = "backups"
)

$ErrorActionPreference = "Stop"
$container = "haitigov-postgres"
$database = "haitigov_dev"
$user = "haitigov"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$repositoryRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")).Path
$resolvedOutput = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot $OutputDirectory))

if (-not $resolvedOutput.StartsWith($repositoryRoot + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Backup output must remain inside the repository."
}

New-Item -ItemType Directory -Force -Path $resolvedOutput | Out-Null
$containerPath = "/tmp/haitigov-$timestamp.dump"
$outputPath = Join-Path $resolvedOutput "haitigov_dev-$timestamp.dump"

docker exec $container pg_dump --username $user --dbname $database --format custom --file $containerPath
if ($LASTEXITCODE -ne 0) { throw "pg_dump failed." }

docker cp "${container}:${containerPath}" $outputPath
if ($LASTEXITCODE -ne 0) { throw "docker cp failed." }

docker exec $container rm -f $containerPath
if ($LASTEXITCODE -ne 0) { throw "Temporary backup cleanup failed." }

Write-Output $outputPath
