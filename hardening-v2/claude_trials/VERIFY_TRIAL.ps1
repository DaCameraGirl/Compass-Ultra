param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("trial_1", "trial_2", "trial_3")]
  [string]$Trial
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $root "..\..")
$trialDir = Join-Path $root $Trial
$goldenDir = Join-Path $repoRoot "hardening-v2\golden"

Copy-Item -LiteralPath (Join-Path $goldenDir "verify.py") -Destination (Join-Path $trialDir "verify.py") -Force
Copy-Item -LiteralPath (Join-Path $goldenDir "verifier_inputs") -Destination (Join-Path $trialDir "verifier_inputs") -Recurse -Force

Push-Location $trialDir
try {
  python verify.py
} finally {
  Pop-Location
}

