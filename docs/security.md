# Security Model

Compass Ultra is designed to inspect release state without requiring provider write access by default.

## Authentication

- Auth0 handles user authentication.
- Backend APIs validate JWT bearer tokens for account-bound actions.
- CI release gates use `COMPASS_API_KEY`.

## Provider Tokens

- Use read-only provider tokens for sync.
- Keep provider tokens server-side.
- Do not paste provider secrets into browser demo workspaces.

## Data Handling

- Local workspaces stay in browser storage.
- Cloud snapshots are stored in PostgreSQL only when users save them.
- Snapshot deletion is available in the app.

## AI Analysis

AI analysis may send workspace metadata to Anthropic. Do not include secrets or sensitive customer payloads in flag metadata.
