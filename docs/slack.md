# Slack Alerts

Compass Ultra backend can send Slack alerts for customer lifecycle events and future release-risk events.

## Setup

1. Create a Slack incoming webhook.
2. Add it to Railway:

```text
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

If the variable is missing, Slack alerts are skipped safely.
