# WheelyGood backend tests
# Usage:
#   .\run_tests.ps1              # verbose + backlog summary table + CSV
#   .\run_tests.ps1 -Html        # also generate pytest_report.html
#   .\run_tests.ps1 -Quiet       # short progress + table only (less noise)
param(
    [switch]$Html,
    [switch]$Quiet
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========== WheelyGood backlog tests ==========" -ForegroundColor Cyan
Write-Host "  tests\test_backlog.py" -ForegroundColor Gray
Write-Host "  End of run: backlog summary table printed to terminal (no CSV files)" -ForegroundColor Gray
Write-Host ""

$pytestArgs = @("tests/test_backlog.py", "--tb=short")
if ($Quiet) {
    $pytestArgs += @("-q", "--disable-warnings")
} else {
    $pytestArgs += "-v"
}

if ($Html) {
    pip install pytest-html -q 2>$null
    $pytestArgs += @("--html=pytest_report.html", "--self-contained-html")
}

python -m pytest @pytestArgs
$code = $LASTEXITCODE

if ($code -eq 0) {
    Write-Host ""
    Write-Host "Done." -ForegroundColor Green
}
if ($Html -and $code -eq 0) {
    Write-Host "HTML: $PSScriptRoot\pytest_report.html" -ForegroundColor Green
}

exit $code
