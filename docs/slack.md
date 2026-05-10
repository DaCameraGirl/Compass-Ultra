# Slack Workflows

Compass Ultra supports Slack-ready release updates in two ways:

- The frontend generates a Slack-compatible `text` + `blocks` payload from the current release workspace.
- A configured backend/proxy endpoint can forward that payload to Slack, which avoids browser CORS issues with direct incoming webhook calls.

Compass Ultra does not currently ship an installed Slack app or `/compass check` slash command. That is a roadmap item.

## Setup

1. Create a Slack incoming webhook.
2. Add it to Railway:

```text
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
```

If the variable is missing, Slack alerts are skipped safely.
