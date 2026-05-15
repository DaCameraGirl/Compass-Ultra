# Compass Ultra

Release intelligence for teams that ship behind feature flags.

Compass Ultra is a release control room for feature-flagged software. It helps teams review flag state, policy gates, rollout risk, snapshot diffs, AI risk analysis, and audit-ready release proof before production changes go live.

[Live app](https://www.compassultra.com) | [Try the demo](https://www.compassultra.com/app?demo=true) | [Trust](https://www.compassultra.com/trust)

## The Short Version

Feature flags are supposed to make releases safer. Over time, they become a release surface of their own: stale flags, risky rollouts, missing owners, hidden dependencies, production overrides, and Slack threads pretending to be audit trails.

Compass Ultra turns that mess into a repeatable release review workflow:

1. Load or import a release workspace.
2. Evaluate flags against a real user context.
3. Run policy gates and risk analysis.
4. Compare snapshots.
5. Export a release runbook.
6. Share the proof before shipping.

## What It Does

- Reviews feature flag state before deploys.
- Evaluates flags by user, tenant, plan, role, region, country, device, and environment.
- Runs automated policy gates for release readiness.
- Generates AI-assisted or deterministic risk analysis.
- Compares release snapshots before and after changes.
- Exports PDF release runbooks for QA, CAB, leadership, or audit review.
- Generates GitHub, Jira, and Slack-ready workflow payloads.
- Supports Auth0 login, Stripe billing, cloud snapshots, and provider proxy workflows through the backend.

## Live Demo

The demo works without an account:

https://www.compassultra.com/app?demo=true

The demo simulates a risky retail release with:

- High-risk checkout and flash-sale flags.
- Policy blockers and warnings.
- Dependency checks.
- Snapshot comparison.
- PDF runbook export.
- GitHub, Jira, and Slack payload generation.
- A kill-switch rollback flow for demo state.

## Core Features

### Release Risk Analyzer

Compass Ultra reviews the current workspace and returns a ship, hold, or fix-first style assessment with specific flags and remediation steps.

It can flag:

- High-risk active flags.
- Dependency conflicts.
- Missing approvers.
- Expired or ownerless flags.
- Canary rollout violations.
- Production overrides.
- Compliance-sensitive rollout patterns.

### Flag Evaluation Engine

Evaluate every flag against a specific user context:

- User key
- Email
- Tenant
- Plan
- Role
- Region
- Country
- Device
- Environment

Each flag shows the evaluated value and the reason it resolved that way.

### Policy Gates

Compass Ultra runs release checks such as:

- Change ticket attached
- Required approver assigned
- Every flag traceable
- Expiration dates present
- Canary limits respected
- Dependencies enabled
- No production overrides
- Provider readiness
- Outbound workflow readiness

### Snapshot Diff

Compare two release checkpoints and see exactly what changed:

- Added flags
- Removed flags
- Rollout changes
- Criticality changes
- Owner or approver changes
- Override changes

### PDF Release Runbooks

Export a release-ready PDF with:

- Release metadata
- Flag evaluations
- Policy gate results
- Risk summary
- Rollback notes
- Approvers
- Audit history

## Pricing

| Plan | Price | Seats | Best for |
| --- | ---: | ---: | --- |
| Free | $0 | Local only | Trying the workspace and local release review |
| Solo | $49/mo | 1 seat | Solo operators who need cloud sync, risk analysis, snapshots, and exports |
| Pro | $149/mo | Up to 5 seats | Small teams that need shared release review and diffing |
| Team | $299/mo | Up to 15 seats | Release teams that need RBAC, audit export, alerts, and org workflows |
| Enterprise | Custom | Custom | Security review, onboarding, custom terms, and integrations |

Paid plans start with a 7-day free trial. No credit card required. Trials downgrade to Free automatically unless the customer subscribes.

## Seat and Trial Auditing

Seat limits should be enforced by the backend, not only the UI.

Recommended plan limits:

| Plan | Included seats |
| --- | ---: |
| Solo | 1 |
| Pro | 5 |
| Team | 15 |
| Enterprise | Custom |

Recommended trial controls:

- Require verified Auth0 email.
- Store `trial_started_at`, `trial_expires_at`, `trial_plan`, and `trial_used`.
- Limit one trial per email.
- Limit one Pro or Team trial per company domain within a cooldown window.
- Rate limit AI analysis and other expensive backend actions during trials.
- Block disposable email domains if abuse becomes real.
- Log invite, remove, role-change, and over-limit attempts in the audit trail.

Recommended seat audit fields:

```text
workspace_id
user_id
email
role
status
invited_at
accepted_at
removed_at
last_active_at
```

Recommended enforcement:

```text
active_seats = accepted members + pending invites
if active_seats >= plan_seat_limit:
  block invite
  show upgrade prompt
  write audit event
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite |
| Routing | React Router |
| UI icons | Lucide React |
| PDF export | jsPDF |
| Auth | Auth0 |
| Payments | Stripe |
| Analytics | Vercel Analytics |
| Backend | Express API in the backend repo |
| Database | PostgreSQL through backend |
| AI risk analysis | Backend AI service with deterministic fallback |

## Repositories

Frontend:

```text
https://github.com/DaCameraGirl/Compass-Ultra
```

Backend:

```text
https://github.com/DaCameraGirl/compass-ultra-backend
```

## Run Locally

```bash
git clone https://github.com/DaCameraGirl/Compass-Ultra.git
cd Compass-Ultra
npm install
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm test
```

## Frontend Environment

```env
VITE_API_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
```

## Backend Environment

Configured in the backend deployment:

```env
DATABASE_URL=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SOLO_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
```

Current Stripe price mapping:

```env
STRIPE_SOLO_PRICE_ID=price_1TXAM9L4Pybu5TTYBrazmLDJ
STRIPE_PRO_PRICE_ID=price_1TXAMrL4Pybu5TTYj1c0mIBV
STRIPE_TEAM_PRICE_ID=price_1TXANVL4Pybu5TTYZ9k3ip4l
```

Do not commit real secrets.

## Security Model

Compass Ultra is designed as a release review layer.

- Local demo works without login.
- Cloud snapshots require authentication.
- Provider sync should use read-only tokens or backend proxy flows.
- Stripe handles card data.
- Auth0 is the identity provider.
- Share links encode workspace state and should not be used for secrets.
- Enterprise customers should use security review and custom terms before live provider rollout.

## Product Positioning

Compass Ultra is not a feature flag provider.

It is the release review layer around feature flags. It helps answer:

- What is enabled?
- Who is affected?
- What changed?
- What can break?
- Who approved it?
- What should we fix before shipping?
- What proof can we hand to QA, DevOps, leadership, or compliance?

## Roadmap

- Full backend-enforced seat limits.
- No-card trial lifecycle automation.
- Trial abuse controls by email, domain, and usage.
- Team invite flow.
- Organization workspaces.
- More provider adapters.
- Slack app workflow.
- GitHub Action release gate expansion.
- More export formats.
- Security review package for Enterprise.

## Status

Compass Ultra is live:

https://www.compassultra.com

Demo:

https://www.compassultra.com/app?demo=true

Built for teams that ship fast and still need proof before production.
