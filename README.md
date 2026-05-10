<div align="center">

# ⚡ Compass Ultra

## 🧭 Feature Flag Control Room for Safer Releases

### 🚀 Run the review. Catch the risk. Export the proof. Ship with confidence.

[![Live App](https://img.shields.io/badge/🚀_LIVE_APP-compassultra.com-6366f1?style=for-the-badge)](https://compassultra.com)
[![Status](https://img.shields.io/badge/✅_STATUS-PRODUCTION-22c55e?style=for-the-badge)](https://compassultra.com)
[![Demo](https://img.shields.io/badge/🎮_DEMO-No_Login_Required-58a6ff?style=for-the-badge)](https://compassultra.com/app?demo=true)
[![Auth0](https://img.shields.io/badge/🔐_AUTH-Auth0-eb5424?style=for-the-badge)](https://auth0.com)
[![AI](https://img.shields.io/badge/🤖_AI-Claude_Sonnet-f97316?style=for-the-badge)](https://anthropic.com)
[![Stripe](https://img.shields.io/badge/💳_PAYMENTS-Stripe-635bff?style=for-the-badge)](https://stripe.com)

---

![JavaScript](https://img.shields.io/badge/JavaScript-61.6%25-f7df1e?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-22.6%25-3178c6?style=flat-square&logo=typescript&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-15.2%25-264de4?style=flat-square&logo=css3&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-0.6%25-e34f26?style=flat-square&logo=html5&logoColor=white)

</div>

---

## ✨ What Is Compass Ultra?

**Compass Ultra** is a **release intelligence platform** and **feature flag control room** for frontend, QA, DevOps, and platform teams.

It helps teams inspect feature flags, targeting rules, rollout state, provider imports, overrides, policy gates, and AI release risk **before production**.

Instead of guessing whether a release is safe, Compass Ultra gives teams a reviewable control room for the messy part of release day.

Because apparently shipping software still involves humans, flags, Slack panic, and one forgotten rollout setting hiding in the bushes. 🌲

---

## 🔥 The One-Line Pitch

> **Compass Ultra finds risky feature flags before production does.**

---

## 🎮 Live Demo

The live demo works with **no account required**.

👉 **Try it here:**  
[https://compassultra.com/app?demo=true](https://compassultra.com/app?demo=true)

The demo workspace simulates a blocked production release with:

- 🚩 Feature flags
- 🛡️ Policy gates
- ⚠️ Rollout warnings
- 🤖 AI risk findings
- 🔍 Snapshot comparison
- 📄 PDF runbook export
- 🔗 GitHub, Jira, and Slack payload generation

### 🧪 Demo Scenario

**Demo Retail — Peak Sale Release**

### 🛡️ Enterprise Policy Checks
9 automated checks run on every workspace:

- Change ticket present?
- Required approvers assigned?
- Every flag has traceability?
- Flags have expiration dates?
- Canary limits respected?
- Dependencies enabled?
- No unauthorized production overrides?
- Live provider adapters configured?
- Outbound release hooks configured?

Sample flags include:

- `checkout.new_flow`
- `payments.stripe_v4`
- `eu.gdpr_consent_v2`
- `flash_sale_engine`

The demo lets users:

1. 🔁 Change a flag
2. 🧠 Run AI analysis
3. 🛡️ Watch policy gates update
4. 🔍 Compare snapshots
5. 📄 Export a release runbook
6. 🔗 Generate GitHub, Jira, and Slack payloads

---

## 💥 Why It Exists

Feature flags make releases safer until they become their own source of release risk.

Teams often ship with:

- 🧟 Old flags nobody owns
- ⏰ Expired rollout experiments
- 👻 Missing approval records
- 🚨 Risky production overrides
- 🕸️ Dependency chains nobody checked
- 🌍 Region-specific targeting surprises
- 💬 Slack threads pretending to be audit trails

Compass Ultra turns that mess into a repeatable release review workflow.

---

## 🧠 AI Release Risk Analyzer

Compass Ultra reviews the active release workspace and returns a structured ship / no-ship assessment.

It can identify:

- 🔴 High-risk flags
- 🧩 Dependency conflicts
- 🏛️ Compliance-sensitive rollout issues
- 👥 Missing approvals
- ⏳ Expired flags
- 📈 Risky rollout percentages
- 🛠️ Suggested remediation steps

### Example Output

```txt
HIGH RISK

checkout.new_flow depends on payments.v2, which is disabled for EU users.
eu.gdpr_consent_v2 expires in 48 hours with no renewal ticket.
dark_mode_v3 requires canary rollout but is set to 100%.

Recommendation: WITH CAUTION
Fix 2 blockers before shipping.
🏴 Feature Flag Evaluation Engine

Evaluate every flag against real user and release context.

Supported context fields include:

👤 User key
📧 Email
🏢 Tenant
💼 Plan
🧑‍💻 Role
🌎 Region
🇺🇸 Country
📱 Device
🚀 Environment

Compass Ultra shows exactly why each flag is on or off for a specific user context.

🛡️ Automated Policy Gates

Compass Ultra runs enterprise-style release checks before deployment.

Policy checks include:

✅ Change ticket attached
✅ Required approvers assigned
✅ Every flag has traceability
✅ Expiration dates set
✅ Canary limits respected
✅ No dependency gaps
✅ No unauthorized production overrides
✅ Provider and outbound workflow configuration

The release score updates as the workspace changes. Shocking concept: changing risky things changes the risk score. Revolutionary. 🫠

📊 Release Score

Compass Ultra calculates a release readiness score based on flag health, policy results, risk level, and rollout state.

Example:

Release Score: 62%
Risk Level: HIGH
Policy Blockers: 2
Warnings: 3
Recommendation: Fix before production
🔍 Snapshot Diff

Save release checkpoints and compare them against previous states.

Use snapshot diff to answer:

What changed since the last safe release?
Which flags were added?
Which flags changed rollout percentage?
Which risky flags became active?
Which policies regressed?
📄 PDF Release Runbooks

Export release proof as a PDF runbook.

Runbooks include:

🚀 Release metadata
🏴 Flag evaluations
🛡️ Policy gate results
🔁 Rollback notes
👥 Approvers
⚠️ Risk summaries
🧭 Active rollout context

Useful for CAB review, QA handoff, launch review, leadership reporting, or internal audit trails.

👥 Team RBAC & Audit Log

Compass Ultra supports role-based release workflows.

Roles include:

👑 Admin
✅ Approver
🎛️ Operator
👀 Viewer

Every workspace action is logged with:

Actor
Role
Action
Timestamp
Detail
Severity

No more “who changed this?” mysteries, which is great because production incidents are already enough detective work. 🕵️‍♀️

🔗 Integration Payloads

Compass Ultra can generate workflow payloads for:

🐙 GitHub Issues
🎟️ Jira change tickets
💬 Slack war room updates

Teams can copy payloads or post them to configured webhook/proxy endpoints. Slack uses a Slack-compatible `text` + `blocks` payload; direct Slack incoming webhooks should be routed through the backend/proxy when browser CORS blocks direct posting.

🧩 Supported Providers

Compass Ultra is provider-flexible.

Provider	Support
🚩 LaunchDarkly	Supported through import / adapter flow
📊 Statsig	Supported through import / adapter flow
🔥 Firebase Remote Config	Supported through import / adapter flow
🧱 Unleash	Compatible via JSON-style workflows
🏁 Flagsmith	Compatible via JSON-style workflows
🧭 OpenFeature	Compatible with provider-neutral flag state
📦 Any JSON export	Supported
📦 Sample Packs

Compass Ultra includes sample packs so teams can explore without connecting a live provider.

Pack	What It Simulates
🛒 Demo Retail — Peak Sale Release	High-risk production release with dependency gaps and rollout warnings
🚩 LaunchDarkly Import	LaunchDarkly-shaped flag export
📊 Statsig Gates	Gates, experiments, and dynamic config review
🔥 Firebase Config	Remote Config parameters and rollout checks
🧱 Tech Stack
Layer	Technology
⚛️ Frontend	React + Vite
🧭 Routing	React Router
🎨 UI Icons	Lucide React
📄 PDF Export	jsPDF
🔐 Auth	Auth0
🖥️ Backend	Node.js + Express
🗄️ Database	PostgreSQL
☁️ Hosting	Vercel frontend + Railway backend
🤖 AI Engine	Claude Sonnet via Anthropic
💳 Payments	Stripe
📈 Analytics	Vercel Analytics
🌐 Domain	compassultra.com
💸 Pricing
Plan	Price	Best For
🆓 Free	$0	Solo builders and teams trying local flag review
⚡ Pro	$199/mo	Engineers and small teams needing AI analysis, cloud sync, snapshots, and diff review
👥 Team	$499/mo	Release teams needing RBAC, audit export, expiration alerts, Slack payloads, and org workflows
🏢 Enterprise	Custom	SSO, SAML, custom security review, onboarding, SLA, and custom integrations
🚀 Run Locally
Frontend
git clone https://github.com/DaCameraGirl/Compass-Ultra.git
cd Compass-Ultra
npm install
npm run dev
Backend
git clone https://github.com/DaCameraGirl/compass-ultra-backend.git
cd compass-ultra-backend
npm install
npm run dev
🧪 Available Scripts
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run test
🔐 Environment Variables

The frontend and backend expect environment variables for production features such as Auth0, backend API access, provider sync, Stripe, and AI analysis.

Frontend
VITE_API_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
Backend
DATABASE_URL=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

⚠️ Do not commit real secrets. The internet is already a cursed enough place.

🔒 Security Model

Compass Ultra is designed to be safe by default.

🔍 Read-only provider review by default
🚫 No forced writes back to flag providers
🔐 Provider credentials are not committed to the repo
🎮 Local demo works without login
👤 Authenticated cloud features are scoped to user accounts
📸 Snapshots are tied to authenticated workspace access
🧾 Audit logs preserve review activity
🏢 Enterprise plans support SSO / SAML and security review
🎯 Who It Is For

Compass Ultra is built for:

Frontend platform teams managing feature flags across environments
QA teams that need repeatable release states
DevOps teams responsible for production launch safety
Product engineering teams shipping behind flags
Teams using LaunchDarkly, Statsig, Firebase Remote Config, OpenFeature, or JSON-based flag exports
Organizations that need proof before production changes
🧭 Example Use Cases
🚀 Release Preflight

Run a final release review before production deployment.

Load current flag state
Run policy gates
Run AI risk analyzer
Fix blockers
Export PDF runbook
Ship with proof
🧪 QA Reproduction

Create a shareable state for QA.

Set user context
Evaluate flags
Save snapshot
Share public link
Attach runbook to bug report
🚨 Incident Prevention

Catch risky rollout conditions before launch.

Detect expired flags
Find dependency gaps
Check rollout limits
Review production overrides
Generate Slack war room payload
🧾 Audit Handoff

Give leadership, QA, or compliance a readable release package.

Snapshot diff
Policy gate status
Approver list
Risk summary
Rollback steps
PDF export
🧠 Product Positioning

Compass Ultra is not just a feature flag list.

It is a release control room for teams that need to know:

What is enabled?
Who is affected?
What can break?
Who approved it?
What changed since the last safe release?
What should we fix before shipping?
What proof can we hand to QA, DevOps, leadership, or compliance?
🛣️ Roadmap

Planned upgrades include:

📬 Email flag expiration digest
🧪 What-if simulator for rollout/risk score changes
💬 Future installed Slack app: /compass check
🐙 GitHub Actions integration
🚦 CI failure on HIGH or CRITICAL risk
🏢 Multi-workspace organization support
👯 Real-time collaboration
🔌 Expanded provider adapters
🛡️ OWASP-style security pattern scanning
📤 More export formats
✅ Status

Compass Ultra is live in production:

https://compassultra.com

Live demo:

https://compassultra.com/app?demo=true

🔒 Private Repository Notice

This repository may be private or restricted.

Public-facing users should use the live Compass Ultra app and demo links.

For access, contact the project owner.

⚡ Built for teams that ship fast and still want to sleep.

