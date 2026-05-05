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

The repo now includes a deployable Vite demo app with:

- interactive flag toggle simulator
- environment and user-segment controls
- shareable JSON state bundle
- adapter cards for LaunchDarkly, Statsig, Firebase Remote Config, and generic JSON
- enterprise posture section covering local overrides and read-only adapters

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

The included `.github/workflows/deploy.yml` workflow builds the Vite app and
deploys the `dist` folder to GitHub Pages on pushes to `main`.

## Market-Ready Checklist

- Add GitHub topics: `react`, `feature-flags`, `developer-tools`, `qa-tools`, `experimentation`, `debugging`.
- Record a 30-60 second demo GIF showing flag toggles, segment simulation, and snapshot copy.
- Write a technical launch post: "How to debug React feature flags without changing staging."
- Launch to Hacker News Show HN after the live demo is deployed.
- Post a short LinkedIn demo aimed at frontend and QA leads.
- Add a contact link or waitlist for teams that want provider adapters.

## Roadmap

- Provider adapter examples for LaunchDarkly and Statsig
- URL-encoded share snapshots
- Import/export snapshot files
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
