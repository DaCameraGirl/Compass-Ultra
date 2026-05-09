# Compass Ultra GitHub Action

Use the Compass Ultra release gate in CI to block deploys when a workspace has high or critical release risk.

## Workflow Example

```yaml
name: Release Gate

on:
  pull_request:
  workflow_dispatch:

jobs:
  compass:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Compass Ultra release gate
        uses: DaCameraGirl/Compass-Ultra/.github/actions/compass-check@main
        with:
          api-url: https://api.compass-ultra.com
          api-key: ${{ secrets.COMPASS_API_KEY }}
          workspace: ./release/compass-workspace.json
          fail-on: high
```

## Inputs

- `api-url`: Compass Ultra backend URL. Defaults to `https://api.compass-ultra.com`.
- `api-key`: Secret API key from the backend `COMPASS_API_KEY` environment variable.
- `workspace`: Path to a Compass Ultra JSON workspace export.
- `fail-on`: `low`, `medium`, `high`, or `critical`.

## What It Returns

The Action writes a GitHub step summary with:

- Decision: `SHIP`, `SHIP_WITH_CAUTION`, or `HOLD`
- Risk level
- Findings
- Recommended actions
- Audit evidence metadata

If the risk is at or above the threshold, the Action exits with code `1` and fails the workflow.
