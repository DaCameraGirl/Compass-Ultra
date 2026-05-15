# 🧭 Compass Ultra

> **Release intelligence for teams that ship behind feature flags.**

Compass Ultra is a release control room for feature-flagged software. It helps product, engineering, QA, DevOps, and compliance teams review flag state, policy gates, rollout risk, snapshot diffs, AI-assisted risk analysis, and audit-ready release proof before production changes go live.

[🚀 Live App](https://www.compassultra.com) · [🎮 Try the Demo](https://www.compassultra.com/app?demo=true)

---

## ✨ Why Compass Ultra?

Feature flags are supposed to make releases safer.

But over time, they can become a release surface of their own:

* 🧟 Stale or expired flags
* 🎲 Risky rollout percentages
* 👤 Missing owners and approvers
* 🕸️ Hidden flag dependencies
* 🚨 Production overrides
* 💬 Slack threads pretending to be audit trails
* 🧩 Release decisions scattered across too many tools

**Compass Ultra turns feature-flag chaos into a repeatable release review workflow.**

Instead of asking:

> “Are we good to ship?”

Your team can answer:

* ✅ What is enabled?
* 👥 Who is affected?
* 🔄 What changed?
* 💥 What can break?
* 🖊️ Who approved it?
* 🧯 What needs to be fixed first?
* 📄 What proof can we hand to QA, DevOps, leadership, or compliance?

---

## ⚡ The Short Version

Compass Ultra helps teams review and prove release readiness before shipping.

A typical release review looks like this:

1. 📦 Load or import a release workspace.
2. 👤 Evaluate flags against a real user context.
3. 🛡️ Run policy gates and risk analysis.
4. 🔍 Compare release snapshots.
5. 📄 Export a release runbook.
6. 🚀 Share the proof before production changes go live.

---

## 🎮 Live Demo

The demo works without an account:

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

The demo simulates a risky retail release with:

* 🛒 High-risk checkout and flash-sale flags
* 🚧 Policy blockers and warnings
* 🔗 Dependency checks
* 🧾 Snapshot comparison
* 📄 PDF runbook export
* 🔌 GitHub, Jira, and Slack payload generation
* 🧯 Kill-switch rollback flow for demo state

---

## 🧠 Core Features

### 🚦 Release Risk Analyzer

Compass Ultra reviews the current release workspace and returns a practical release assessment:

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

It can detect issues such as:

* 🔥 High-risk active flags
* 🔗 Dependency conflicts
* 👻 Missing approvers
* ⏰ Expired or ownerless flags
* 🐤 Canary rollout violations
* 🚨 Production overrides
* 🧾 Compliance-sensitive rollout patterns

---

### 🎯 Flag Evaluation Engine

Evaluate every flag against a specific user context.

| Field          | Description                                             |
| -------------- | ------------------------------------------------------- |
| 👤 User key    | Unique user identifier                                  |
| 📧 Email       | User email address                                      |
| 🏢 Tenant      | Customer or account tenant                              |
| 💳 Plan        | Pricing or entitlement plan                             |
| 🛂 Role        | User role or permission group                           |
| 🌎 Region      | Geographic or infrastructure region                     |
| 🏳️ Country    | Country-level targeting                                 |
| 📱 Device      | Device or platform type                                 |
| 🌐 Environment | Development, staging, production, or custom environment |

Each flag shows:

* 🎚️ Evaluated value
* 🧠 Resolution reason
* 🧩 Matching rule or condition
* 📌 Relevant context used during evaluation

---

### 🛡️ Policy Gates

Compass Ultra runs release readiness checks before changes go live.

Example gates:

* 🎟️ Change ticket attached
* 👥 Required approver assigned
* 🧬 Every flag traceable
* ⏳ Expiration dates present
* 🐤 Canary limits respected
* 🔗 Dependencies enabled
* 🚫 No production overrides
* 🔌 Provider readiness verified
* 📤 Outbound workflow readiness verified

---

### 🔍 Snapshot Diff

Compare two release checkpoints and see exactly what changed.

Diffs can identify:

* ➕ Added flags
* ➖ Removed flags
* 📈 Rollout changes
* 🚨 Criticality changes
* 👤 Owner changes
* ✅ Approver changes
* 🛠️ Override changes

---

### 📄 PDF Release Runbooks

Export release-ready PDFs for QA, CAB, leadership, DevOps, or audit review.

Runbooks can include:

* 🏷️ Release metadata
* 🎯 Flag evaluations
* 🛡️ Policy gate results
* 🧠 Risk summary
* 🧯 Rollback notes
* ✍️ Approvers
* 🧾 Audit history

---

### 🔌 Workflow Payloads

Compass Ultra can generate workflow-ready payloads for:

* 🐙 GitHub
* 🎫 Jira
* 💬 Slack

These payloads help teams move release evidence into the tools they already use.

---

## 🧭 Product Positioning

Compass Ultra is **not** a feature flag provider.

It is the **release review layer** around feature flags.

Use it when you need a clear answer to:

> “Can we safely ship this feature-flagged release, and can we prove it?”

---

## 💸 Pricing

| Plan          |   Price |          Seats | Best for                                                                  |
| ------------- | ------: | -------------: | ------------------------------------------------------------------------- |
| 🆓 Free       |      $0 |     Local only | Trying the workspace and local release review                             |
| 🧍 Solo       |  $49/mo |         1 seat | Solo operators who need cloud sync, risk analysis, snapshots, and exports |
| 🚀 Pro        | $149/mo |  Up to 5 seats | Small teams that need shared release review and diffing                   |
| 👥 Team       | $299/mo | Up to 15 seats | Release teams that need RBAC, audit export, alerts, and org workflows     |
| 🏢 Enterprise |  Custom |         Custom | Security review, onboarding, custom terms, and integrations               |

Paid plans start with a **7-day free trial**.

No credit card required. Trials downgrade to Free automatically unless the customer subscribes.

---

## 🧾 Seat and Trial Auditing

Seat limits should be enforced by the backend, not only the UI.

### 📊 Recommended Plan Limits

| Plan          | Included Seats |
| ------------- | -------------: |
| 🧍 Solo       |              1 |
| 🚀 Pro        |              5 |
| 👥 Team       |             15 |
| 🏢 Enterprise |         Custom |

### 🧪 Recommended Trial Controls

* ✅ Require verified Auth0 email.
* 🕒 Store `trial_started_at`, `trial_expires_at`, `trial_plan`, and `trial_used`.
* 📧 Limit one trial per email.
* 🏢 Limit one Pro or Team trial per company domain within a cooldown window.
* 🚦 Rate limit AI analysis and other expensive backend actions during trials.
* 🚫 Block disposable email domains if abuse becomes real.
* 🧾 Log invite, remove, role-change, and over-limit attempts in the audit trail.

### 🗂️ Recommended Seat Audit Fields

```txt
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

### 🚦 Recommended Enforcement Logic

```txt
active_seats = accepted members + pending invites

if active_seats >= plan_seat_limit:
  block invite
  show upgrade prompt
  write audit event
```

---

## 🛠️ Tech Stack

| Layer               | Technology                                     |
| ------------------- | ---------------------------------------------- |
| ⚛️ Frontend         | React, Vite                                    |
| 🧭 Routing          | React Router                                   |
| 🎨 UI icons         | Lucide React                                   |
| 📄 PDF export       | jsPDF                                          |
| 🔐 Auth             | Auth0                                          |
| 💳 Payments         | Stripe                                         |
| 📈 Analytics        | Vercel Analytics                               |
| 🧱 Backend          | Express API in the backend repo                |
| 🐘 Database         | PostgreSQL through backend                     |
| 🤖 AI risk analysis | Backend AI service with deterministic fallback |

---

## 📦 Source Code

This project is maintained in private repositories.

Public users can explore the live app and demo without access to the source code.

---

## 🧑‍💻 Run Locally

Install dependencies and start the local development server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📜 Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm test
```

---

## 🔐 Environment Variables

### ⚛️ Frontend

```bash
VITE_API_URL=
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
```

### 🧱 Backend

Configured in the backend deployment:

```bash
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

### 💳 Current Stripe Price Mapping

```bash
STRIPE_SOLO_PRICE_ID=price_1TXAM9L4Pybu5TTYBrazmLDJ
STRIPE_PRO_PRICE_ID=price_1TXAMrL4Pybu5TTYj1c0mIBV
STRIPE_TEAM_PRICE_ID=price_1TXANVL4Pybu5TTYZ9k3ip4l
```

> ⚠️ Do not commit real secrets.

---

## 🔒 Security Model

Compass Ultra is designed as a release review layer.

* 🧪 Local demo works without login.
* 🔐 Cloud snapshots require authentication.
* 🔌 Provider sync should use read-only tokens or backend proxy flows.
* 💳 Stripe handles card data.
* 🪪 Auth0 is the identity provider.
* 🔗 Share links encode workspace state and should not be used for secrets.
* 🏢 Enterprise customers should use security review and custom terms before live provider rollout.

---

## 🗺️ Roadmap

* 🧾 Full backend-enforced seat limits
* 🧪 No-card trial lifecycle automation
* 🚦 Trial abuse controls by email, domain, and usage
* 👥 Team invite flow
* 🏢 Organization workspaces
* 🔌 More provider adapters
* 💬 Slack app workflow
* 🐙 GitHub Action release gate expansion
* 📤 More export formats
* 🔒 Security review package for Enterprise

---

## ✅ Status

Compass Ultra is live:

**Production:** [https://www.compassultra.com](https://www.compassultra.com)

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

---

## 🚀 Built For

Teams that ship fast and still need proof before production.

**Ship with confidence. Review with evidence. Prove every release.**
