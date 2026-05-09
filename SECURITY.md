# Security Policy

Compass Ultra is a release-risk review layer for feature-flagged teams.

## Supported Version

The production service at `https://compassultra.com` tracks the `main` branch.

## Reporting Security Issues

Email security concerns to `hello@compassultra.com`.

Please include:

- A concise description of the issue
- Affected URL, endpoint, or workflow
- Reproduction steps
- Expected impact

## Security Model

- Authentication uses Auth0 and JWT bearer tokens.
- Cloud snapshot APIs require authenticated requests.
- Provider integrations should use read-only tokens by default.
- Provider secrets must stay server-side in environment variables or provider vaults.
- Local demo workspaces remain in the browser unless explicitly saved to cloud snapshots.
- Cloud snapshots are stored in PostgreSQL and can be deleted from the app.
- CI release gates authenticate with `COMPASS_API_KEY`.
- The GitHub Action should receive `COMPASS_API_KEY` only through GitHub Secrets.

## AI Data Handling

AI risk analysis sends release workspace context to the configured Anthropic model. Do not include provider secrets, access tokens, passwords, or sensitive customer payloads in feature flag metadata.

## Production Checklist

- Use production Auth0 social keys.
- Configure Railway secrets through environment variables.
- Keep provider tokens read-only until write actions are explicitly supported.
- Rotate `COMPASS_API_KEY` if exposed.
- Review `/trust` before enterprise/security conversations.
