# Compass-Ultra

React feature flag debugging before production rollout.

Compass-Ultra is an enterprise developer HUD for frontend, QA, and platform
teams that need to preview feature gates, config overrides, experiments, and
user segments without writing changes back to production flag providers.

## Product Positioning

**Debug React feature flags before they break production.**

Teams use Compass-Ultra to:

- simulate feature flag combinations across environments
- preview enterprise, trial, regional, and custom user segments
- create shareable QA snapshots for bug reports and release reviews
- validate rollout behavior without mutating provider-side flag state
- connect existing providers through read-only adapters

## Live Product Surface

The repo now includes a deployable Vite workspace with:

- editable feature flags
- deterministic flag evaluation against user context
- boolean, variant, and JSON flag values
- manual overrides and rollout percentage controls
- single-rule targeting per flag
- release train, change ticket, approver, captain, window, and incident-channel controls
- enterprise policy checks for approvals, expired flags, canary limits, dependencies, and production overrides
- sample packs for DaCameraGirl Enterprise, LaunchDarkly, Statsig, and Firebase Remote Config shapes
- sample user contexts for production admins, EU customers, and mobile trial users
- local team/RBAC sessions with admin, approver, operator, and viewer roles
- structured audit history with actor, role, level, action, and detail fields
- live adapter cards for provider pulls through read-only proxy/export URLs
- GitHub, Jira, and Slack payload generation with copy or webhook POST actions
- criticality, Jira/change IDs, approvers, expiration dates, dependencies, and rollback notes per flag
- generated release runbook with active evaluations and rollback steps
- local workspace persistence
- provider JSON import for common LaunchDarkly, Statsig, Firebase Remote Config, and generic shapes
- shareable URL snapshot restore
- workspace JSON copy, download, and import
- generated SDK payload with values, reasons, owners, tickets, and criticality
- local audit trail for state changes

## Integration Model

The GitHub Pages build is static, so it does not store OAuth credentials or
provider secrets. Live provider sync is designed to use read-only proxy/export
URLs that return JSON. GitHub, Jira, and Slack actions can copy payloads locally
or POST to user-configured webhook/proxy endpoints.

## Ideal Buyers

- frontend platform teams
- QA automation teams
- product engineering teams
- companies using LaunchDarkly, Statsig, Optimizely, Firebase Remote Config, or homegrown flag systems

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

GitHub Pages serves the built static files from the repo root. Source files live
under `app/`; run `npm run build` and copy `dist/index.html` plus `dist/assets/`
to the repo root before publishing a new visual update.

## Market-Ready Checklist

- Add GitHub topics: `react`, `feature-flags`, `developer-tools`, `qa-tools`, `experimentation`, `debugging`.
- Record a 30-60 second product GIF showing release gate checks, provider sample imports, context switching, and runbook copy.
- Write a technical launch post: "How to debug React feature flags without changing staging."
- Launch to Hacker News Show HN after the live workspace is deployed.
- Post a short LinkedIn demo aimed at frontend and QA leads.
- Add a contact link or waitlist for teams that want provider adapters.

## Roadmap

- Provider adapter examples for LaunchDarkly and Statsig
- SSO-ready team workspace design
- Optional hosted version for team snapshot history

## Security Model

Compass-Ultra should remain read-only by default:

- no production writes from the HUD
- local-only override state
- explicit share snapshots
- provider credentials kept outside committed code
- adapters designed to inspect state before they mutate anything

## Licensing

Compass-Ultra is proprietary commercial software. See `LICENSE` for terms.
