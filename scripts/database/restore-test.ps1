param(
  [Parameter(Mandatory = $true)]
  [string]$DumpPath
)

$ErrorActionPreference = "Stop"
$container = "haitigov-postgres"
$source = (Resolve-Path -LiteralPath $DumpPath).Path
$targetDatabase = "haitigov_restore_test"
$user = "haitigov"
$containerPath = "/tmp/haitigov-restore-test.dump"

docker cp $source "${container}:${containerPath}"
if ($LASTEXITCODE -ne 0) { throw "Could not copy the dump into the database container." }

docker exec $container psql --username $user --dbname postgres --set ON_ERROR_STOP=1 --command "DROP DATABASE IF EXISTS $targetDatabase WITH (FORCE);"
if ($LASTEXITCODE -ne 0) { throw "Could not reset the fixed restore-test database." }

docker exec $container psql --username $user --dbname postgres --set ON_ERROR_STOP=1 --command "CREATE DATABASE $targetDatabase OWNER $user;"
if ($LASTEXITCODE -ne 0) { throw "Could not create the restore-test database." }

docker exec $container pg_restore --username $user --dbname $targetDatabase --exit-on-error $containerPath
if ($LASTEXITCODE -ne 0) { throw "pg_restore failed." }

docker exec $container psql --username $user --dbname $targetDatabase --tuples-only --command "SELECT COUNT(*) FROM data_classifications;"
if ($LASTEXITCODE -ne 0) { throw "Restore verification query failed." }

docker exec $container rm -f $containerPath
if ($LASTEXITCODE -ne 0) { throw "Temporary restore file cleanup failed." }

Write-Output "Restore verified in $targetDatabase."
