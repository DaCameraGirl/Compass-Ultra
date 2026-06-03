# Changelog

## 1.1.2 - 2026-06-02

- Added configurable Auth0 redirect and logout URLs to prevent callback mismatch errors across production, preview, and local deployments.
- Aligned the default logout return URL with the Auth0 app callback path and documented the GitHub OAuth callback required for Auth0 social login.

## 1.1.1 - 2026-05-29

- Added Auth0 social login buttons for Gmail/Google and GitHub.
- Added configurable social connection names with `VITE_AUTH0_GOOGLE_CONNECTION` and `VITE_AUTH0_GITHUB_CONNECTION`.
- Removed the visible email/password Auth0 fallback from the app UI so normal login and checkout paths use Gmail or GitHub.
- Updated unauthenticated save, risk analysis, rollback, and checkout actions to start social login instead of the generic Auth0 email screen.
- Restored regular email login as an explicit fallback alongside Gmail and GitHub.
- Added a public Compass Ultra logo asset for Auth0 Universal Login branding.

## 1.1.0 - 2026-05-28

- Improved documentation and code comments
- Added CONTRIBUTING.md guidelines
- Minor performance improvements to feature flag evaluation

## 0.3.0 - 2026-05-09

- Added Compass Release Gate GitHub Action.
- Added GitHub Action quickstart documentation.
- Added public trust page and security posture copy.
- Added Pro `$199/month` pricing display.
- Added animated landing-page product tour.

## 0.2.0 - 2026-05-09

- Added backend CI risk-check API.
- Added Slack customer alert support in the backend.
- Added configurable Stripe price IDs.

## 0.1.0 - Initial Launch

- Added landing page, demo app, Auth0 login, Stripe checkout, cloud snapshots, snapshot diff, AI risk analysis, PDF runbook export, and release policy checks.
