# API

## `POST /api/v1/check`

Runs a deterministic release-risk check for CI/CD workflows.

Authentication:

```http
Authorization: Bearer $COMPASS_API_KEY
```

Request:

```json
{
  "workspace": {
    "workspaceName": "Production",
    "flags": []
  },
  "failOn": "high"
}
```

Response:

```json
{
  "ok": false,
  "riskLevel": "HIGH",
  "decision": "HOLD",
  "failed": true,
  "findings": [],
  "recommendedActions": [],
  "evidence": {}
}
```
