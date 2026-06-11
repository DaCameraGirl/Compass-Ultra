# Compass Ultra

Release intelligence for teams that ship behind feature flags.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](CHANGELOG.md)

Compass Ultra is a release control room for feature-flagged software. It helps teams review flag state, policy gates, rollout risk, snapshot diffs, AI risk analysis, and audit-ready release proof before production changes go live.

[Live app](https://www.compassultra.com) | [Try the demo](https://www.compassultra.com/app?demo=true) | [AI DevOps checker](https://www.compassultra.com/ai-devops) | [Trust](https://www.compassultra.com/trust)

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
- Runs 9 automated enterprise policy gates for release readiness.
- Generates AI-assisted or deterministic risk analysis with financial impact estimates.
- Compares release snapshots before and after changes.
- Exports PDF release runbooks for QA, CAB, leadership, or audit review.
- Generates GitHub Issues, Jira, and Slack-ready workflow payloads.
- Syncs flags read-only from LaunchDarkly, Statsig, Unleash, Flagsmith, and Firebase Remote Config.
- Embeds a floating AI DevOps chat widget on any page via a single script tag.
- Supports AI DevOps web search through a backend-only search proxy.
- Supports Auth0 login, Stripe billing, cloud snapshots, and provider proxy workflows through the backend.
- GitHub Action CI gate blocks deploys when release risk exceeds configured threshold.
- Links the product story to the companion `compass-ultra-web-intel` pipeline: Tavily discovery, Python crawling, Snowflake raw storage, dbt marts, Streamlit analysis, and optional Fivetran metadata.

## Live Demo

The demo works without an account:

https://www.compassultra.com/app?demo=true

The demo simulates a risky retail release (Black Friday eve, peak-sale-2026.11) with:

- 10 feature flags across LaunchDarkly, Statsig, and Firebase.
- High-risk checkout, flash-sale, and same-day shipping flags.
- Policy blockers and warnings (dependency gaps, canary violations).
- Dependency graph checks.
- Snapshot comparison.
- PDF runbook export.
- GitHub, Jira, and Slack payload generation.
- A kill-switch rollback flow for demo state.

## Core Features

### Release Risk Analyzer

Compass Ultra reviews the current workspace and returns a ship, hold, or fix-first style assessment with specific flags, blockers, and remediation steps. A live AI service powers the analysis; a deterministic fallback runs locally if the service is unavailable so analysis is never blocked.

It can flag:

- High-risk active flags.
- Dependency conflicts.
- Missing approvers.
- Expired or ownerless flags.
- Canary rollout violations.
- Production overrides.
- Compliance-sensitive rollout patterns.
- Financial impact estimates for peak-traffic deploy windows.

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

Each flag shows the evaluated value and the reason it resolved that way (rule match, rollout bucket, default, or override). Switch between saved context presets (Production admin, EU customer, Mobile guest) to see how flags behave per segment.

### Enterprise Policy Gates (9 checks)

Compass Ultra runs automated release checks on every workspace state change:

| Gate | What it checks |
| --- | --- |
| Change ticket attached | CHG or Jira ticket is present before production |
| Critical flags have approvers | All high/critical active flags have named approvers |
| Every flag has traceability | All flags have Jira/change IDs |
| No expired flags enabled | No enabled flags are past expiration |
| Production override discipline | No manual overrides active in production |
| Canary rollout limit | Canary-required flags stay within 50% rollout |
| Dependencies enabled | No enabled flag has a disabled dependency |
| Live provider adapters configured | At least one provider token is connected |
| Outbound DevOps hooks configured | GitHub/Jira/Slack endpoints are set |

### AI DevOps Chat Widget

A floating chat widget that can be embedded on any page with a single script tag:

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

The widget reads the live workspace state, lets users ask release questions in natural language, remembers recent chat context in the browser, and shows visitor/message counters. It renders as a compact bottom-right popup so it stays usable without covering the release workspace.

For web search, keep the provider key in the backend and expose a proxy endpoint. The Tavily-backed search route returns answer snippets plus source URLs, and DevOps status questions such as `latest GitHub Actions status` are routed toward official status sources where possible. See [docs/ai-devops-web-search.md](docs/ai-devops-web-search.md).

### Provider Integrations (Read-Only Sync)

Import live flag state from your flag provider via a customer-owned read-only token through the server proxy:

| Provider | Type |
| --- | --- |
| LaunchDarkly | Provider sync |
| Statsig | Provider sync |
| Unleash | Provider sync |
| Flagsmith | Provider sync |
| Firebase Remote Config | Provider sync |

API keys never leave the backend proxy. The browser only calls the Compass Ultra API.

### Outbound DevOps Integrations

One-click payload copy or POST to:

| Integration | Type |
| --- | --- |
| GitHub Issues | Release evidence issue |
| Jira Change | CHG ticket update |
| Slack War Room | Release blocks/rich message |

### Compass Ultra Web Intel Pipeline

The public site now includes a Snowflake, Fivetran-ready, and dbt proof section that points to the companion data-engineering repo:

```text
https://github.com/DaCameraGirl/compass-ultra-web-intel
```

That repo is separate from this React/Vite website, but it supports the same Compass Ultra product story.

The workflow covers:

- Company or website input.
- Tavily discovery.
- Python crawling and loading.
- Snowflake `RAW_WEBSITE_INTEL.PAGES` storage.
- dbt staging and mart models.
- Streamlit Web Intel analysis.
- Optional Fivetran connector and destination metadata ingestion.

The main website is the public product surface. The Web Intel repo is the working data pipeline proof.

### Snapshot Diff

Compare two release checkpoints and see exactly what changed:

- Added flags
- Removed flags
- Rollout changes
- Criticality changes
- Owner or approver changes
- Override changes

### PDF Release Runbooks and Certificates

Export a CAB-ready PDF with:

- Release metadata and deploy window
- Flag evaluations and rollout states
- Policy gate results
- Risk summary and financial impact
- Rollback notes per flag
- Approver sign-off list
- Audit history

### GitHub Action CI Gate

Block deploys in CI when release risk exceeds a configured threshold:

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

See [docs/github-action.md](docs/github-action.md) for full setup.

### RBAC (4 Roles)

| Role | Permissions |
| --- | --- |
| Admin | Full access — flags, release, team, integrations |
| Approver | Approve releases, view all |
| Operator | Edit flags and release metadata |
| Viewer | Read only |

All blocked actions are logged with actor, role, gate triggered, and timestamp.

## Pricing

| Plan | Price | Seats | Best for |
| --- | ---: | ---: | --- |
| Free | $0 | Local only | Trying the workspace and local release review |
| Solo | $49/mo | 1 seat | Solo operators who need cloud sync, risk analysis, snapshots, and exports |
| Pro | $149/mo | Up to 5 seats | Small teams that need shared release review and diffing |
| Team | $299/mo | Up to 15 seats | Release teams that need RBAC, audit export, alerts, and org workflows |
| Enterprise | Custom | Custom | Security review, onboarding, custom terms, and integrations |

Paid plans start with a 7-day free trial. No credit card required. Trials downgrade to Free automatically unless the customer subscribes.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite |
| Routing | React Router |
| Code splitting | React.lazy + Suspense |
| UI icons | Lucide React |
| PDF export | jsPDF |
| Auth | Auth0 |
| Payments | Stripe |
| Analytics | Vercel Analytics |
| Security headers | X-Frame-Options, CSP, HSTS, cache control |
| Backend | Express API in the backend repo |
| Database | PostgreSQL through backend |
| AI risk analysis | Backend AI service with deterministic fallback |
| Hosting | Vercel (frontend), Railway (backend) |

Web Intel adapter targets:

| Area | Target |
| --- | --- |
| Managed ELT | Fivetran API and connector metadata |
| Warehouse | Snowflake |
| Modeling | dbt Core / dbt Snowflake |
| Evidence | GitHub, Slack, PDF runbooks |

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
npm run dev        # start local dev server
npm run build      # production build
npm run preview    # preview production build locally
npm run typecheck  # tsc --noEmit
npm run lint       # basic lint
npm test           # smoke tests
```

## Frontend Environment

```env
VITE_API_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
VITE_AUTH0_REDIRECT_URI=
VITE_AUTH0_LOGOUT_RETURN_TO=
```

Auth0 redirects must match exactly. Add the deployed callback URL to the Auth0 application under **Allowed Callback URLs**:

```text
https://www.compassultra.com/app
https://compass-ultra.vercel.app/app
http://localhost:5173/app
```

If a deployment uses another origin, set `VITE_AUTH0_REDIRECT_URI` to that exact `/app` URL and add the same URL in Auth0. Add the same `/app` URLs under **Allowed Logout URLs** unless `VITE_AUTH0_LOGOUT_RETURN_TO` is set to a different exact URL. The app falls back to the current browser origin plus `/app` when `VITE_AUTH0_REDIRECT_URI` is not set.

For Auth0 social login with GitHub, the GitHub OAuth App callback is different from the Compass app callback. In GitHub's OAuth App settings, set **Authorization callback URL** to:

```text
https://compassultra.us.auth0.com/login/callback
```

If Auth0 is using a custom authentication domain, use that Auth0 domain plus `/login/callback` instead.

## Backend Environment

Configured in the backend deployment:

```env
DATABASE_URL=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
ANTHROPIC_API_KEY=
TAVILY_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SOLO_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_TEAM_PRICE_ID=
```

Do not commit real secrets.

## Security Model

Compass Ultra is designed as a release review layer.

- Local demo works without login.
- Cloud snapshots require authentication.
- Provider sync uses read-only tokens through the backend proxy — API keys never pass through the browser.
- Share links encode workspace state and should not be used for secrets.
- Security headers are set on all responses: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
- Stripe handles card data.
- Auth0 is the identity provider.
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
- Live backend session and message count for AI DevOps widget stats bar.

## Status

Compass Ultra is live:

https://www.compassultra.com

Demo:

https://www.compassultra.com/app?demo=true

AI DevOps checker:

https://www.compassultra.com/ai-devops

Built for teams that ship fast and still need proof before production.
