<div align="center">

# ⚡ COMPASS ULTRA

### The Enterprise Feature Flag Command Center

**Debug. Simulate. Deploy with Confidence.**

[![Live App](https://img.shields.io/badge/LIVE_APP-compassultra.com-6366f1?style=for-the-badge)](https://compassultra.com)
[![Status](https://img.shields.io/badge/STATUS-PRODUCTION-22c55e?style=for-the-badge)](https://compassultra.com)
[![Auth0](https://img.shields.io/badge/AUTH-Auth0-eb5424?style=for-the-badge)](https://auth0.com)
[![AI](https://img.shields.io/badge/AI-Claude_Sonnet-f97316?style=for-the-badge)](https://anthropic.com)
[![Stripe](https://img.shields.io/badge/PAYMENTS-Stripe-635bff?style=for-the-badge)](https://stripe.com)

---

![JS](https://img.shields.io/badge/JavaScript-61.6%25-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![TS](https://img.shields.io/badge/TypeScript-22.6%25-3178c6?style=flat-square&logo=typescript&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-15.2%25-264de4?style=flat-square&logo=css3&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-0.6%25-e34f26?style=flat-square&logo=html5&logoColor=white)

</div>

---

## What Is This

Compass Ultra is a **release intelligence platform** for frontend, QA, and platform teams.

Stop flying blind on deploy day. Load your feature flags, set your user context, run the AI risk check, and know *before* you ship whether you're about to cause an incident.

No more 2AM pages because someone forgot to expire a flag. No more "it worked in staging" disasters. No more five-person Slack threads trying to figure out who approved what.

---

## The Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, deployed on Vercel |
| Backend | Node.js + Express, deployed on Railway |
| Database | PostgreSQL on Railway |
| Auth | Auth0 (JWT bearer tokens) |
| AI Engine | Claude Sonnet (Anthropic) |
| Payments | Stripe (Pro $199/mo · Team $499/mo · Enterprise — contact sales) |
| Domain | compassultra.com |

---

## What It Does

### 🏴 Live Flag Evaluation Engine
Load flags from LaunchDarkly, Statsig, Firebase Remote Config, or any JSON export. Compass Ultra evaluates every flag against a real user context — plan, role, region, device — and shows you exactly what each user sees.

### 🎛️ Evaluation Context Editor
Set user attributes (plan, role, region, device type) and watch flag values update live. No code changes. No deployments. Just answers.

### 🤖 AI Risk Analyzer (Claude Sonnet)
Send your full flag workspace to the AI and get back:

- **Risk level** — LOW / MEDIUM / HIGH / CRITICAL
- **Financial impact forecast** — estimated revenue at risk, percentage of users affected
- **Step-by-step deployment recommendations**
- **Auto-triggered rollback modal** if the risk is HIGH or CRITICAL

### 🛡️ Enterprise Policy Checks
8 automated checks run on every workspace:

- Change ticket present?
- Required approvers assigned?
- Flags have expiration dates?
- Canary limits respected?
- No circular dependencies?
- No unauthorized production overrides?

### 📊 Release State Meter
0–100% release readiness score based on policy compliance, flag health, and risk level.

### 👥 Team RBAC
Admin / Approver / Operator / Viewer roles with write controls baked in.

### 📸 Cloud Snapshots
Named snapshots saved to PostgreSQL. Compare any two snapshots side by side with the diff viewer. Share snapshots via public URL. Restore any saved state with one click.

### 🔗 Integration Payloads
Auto-generate GitHub Issues, Jira tickets, and Slack war room messages. Copy the payload or POST it directly to your webhook.

### 📄 PDF Runbook Export
Generate a full release runbook from your active workspace — flag evaluations, rollback steps, approvers, everything — as a downloadable PDF.

### 🔒 Audit Log
Last 60 actions logged with actor, role, action type, and full detail. Know exactly who changed what and when.

---

## Sample Packs

Not ready to connect a live provider? Load a sample pack and explore instantly:

| Pack | What It Simulates |
|---|---|
| **Enterprise** | 12-flag B2B SaaS release with approvals and canary limits |
| **LaunchDarkly** | Realistic LD-shaped flag export |
| **Statsig** | Gate + experiment + dynamic config combo |
| **Firebase** | Remote Config with rollout percentages |

---

## Pricing

| Plan | Price | Includes |
|---|---|---|
| **Free** | $0 | Core flag evaluation, context editor, policy checks |
| **Pro** | $199/mo | + Unlimited snapshots, cloud sync, diff viewer, share links, AI analyzer |
| **Team** | $499/mo | + Expiration alerts, RBAC, audit export, multi-workspace, org management |
| **Enterprise** | Contact sales | hello@compassultra.com |

---

## Run Locally

```bash
git clone https://github.com/DaCameraGirl/Compass-Ultra.git
cd Compass-Ultra
npm install
npm run dev
```

For the full stack with cloud saves and AI analysis, you'll also need the backend running:

```bash
git clone https://github.com/DaCameraGirl/compass-ultra-backend.git
cd compass-ultra-backend
npm install
npm run dev
```

---

## Who This Is For

- Frontend platform teams managing 50+ flags across environments
- QA teams that need shareable, reproducible flag states for bug reports
- DevOps teams that get paged when a forgotten flag breaks prod
- Engineering orgs on LaunchDarkly, Statsig, Optimizely, or Firebase Remote Config

---

## Security Model

Compass Ultra is designed to be **read-only by default**:

- No writes back to your flag provider
- Override state is local to your workspace
- Provider credentials never committed to code
- Adapters inspect state before anything mutates
- Snapshots are scoped to your authenticated account

---

## Roadmap

- [ ] Flag expiration email alerts (daily digest via Resend)
- [ ] What-if simulator — toggle flags in a sandbox, see risk score change live
- [ ] Slack bot — `/compass check` returns current readiness score
- [ ] GitHub Actions integration — fail CI if risk is HIGH or CRITICAL
- [ ] Multi-workspace / org support
- [ ] Real-time collaboration (WebSockets)
- [ ] CVE / security scanning against OWASP patterns

---

<div align="center">

**Built for teams that ship fast and sleep at night.**

[![compassultra.com](https://img.shields.io/badge/compassultra.com-Visit_Now-6366f1?style=for-the-badge)](https://compassultra.com)

</div>
