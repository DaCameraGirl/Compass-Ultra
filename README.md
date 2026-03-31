## Badges

![License](https://img.shields.io/badge/License-Proprietary-red)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-React%20Apps-purple)

## License Summary

Compass Ultra is **proprietary commercial software**.  
This repository is public for **demonstration and evaluation only** — not for production use, redistribution, or integration.

- ❌ Not open source  
- ❌ No modification or redistribution  
- ❌ No commercial use without a paid license  
- ✔️ Viewing and learning are allowed  

See the full `LICENSE` file for complete terms.

---

The The Problem

Testing complex edge cases (API 500 errors, slow responses, specific A/B variants, or config changes) usually requires 30+ minutes of backend setup, staging coordination, or code modifications.

---

## The Solution

Compass Ultra is a sleek, fixed-position control panel that lives inside your running React app.

Press `Ctrl + Shift + D` (or click the gear icon in the bottom-right) to open a professional overlay where you can instantly:

- Toggle feature gates
- Override runtime config values
- Force A/B experiment variants
- Simulate failures and edge cases
- Export a complete shareable state snapshot

Built for enterprise frontend teams that need speed, auditability, and compliance.

---

## Features

| Feature                  | Description                                                | Benefit                                       |
|--------------------------|------------------------------------------------------------|-----------------------------------------------|                                      
| **Gates Tab**            | Real-time feature flag toggles with smart categorization   | Eliminate code commenting                     |
| **Config Tab**           | Live editable runtime configuration                        | Test limits and timeouts instantly            |
| **Experiments Tab**      | Force any A/B test variant on demand                       | Validate changes without backend changes      |
| **Audit Tab**            | Timestamped, severity-coded action log                     | Full traceability for handoffs and compliance |
| **Build Tab**            | Commit SHA, branch, version, telemetry health              | Know exactly what you're running              |
| **Snapshot Export**      | One-click JSON export with deep link support               | Share exact testing state via Slack or PR     |

---

## Quick Start

```bash
npm install lucide-react
tsx// App.tsx
import { CompassUltra } from './components/CompassUltra';
import { myAdapter } from './lib/overrideAdapter';

export default function App() {
  return (
    <>
      {process.env.NODE_ENV !== 'production' && (
        <CompassUltra adapter={myAdapter} />
      )}
    </>
  );
}
Full adapter examples are available in the /examples folder.

Adapter Interface
TypeScriptinterface EnterpriseOverrideAdapter {
  getAllOverrides(): { gates: Record<string, boolean>; config?: Record<string, string> };
  getGateOverride(name: string): boolean;
  setGateOverride(name: string, value: boolean): void;
  resetAllOverrides?(): void;
}
Supports in-memory (included), LaunchDarkly, Statsig, Unleash, and custom adapters.

Production Safety
Always guard the component:
tsx
{process.env.NODE_ENV !== 'production' && <CompassUltra adapter={myAdapter} />}
No network calls. No side effects.

## Demo

> 🎥 **Demo GIF Coming Soon**  
> A short preview showing Compass Ultra in action — toggling gates, forcing experiments, simulating failures, and exporting snapshots.

Once your GIF is ready, replace this block with:

![Compass Ultra Demo](./demo/compass-ultra-demo.gif)

---

# ⭐ **4. Marketing Intro (premium, enterprise‑grade)**

## Why Compass Ultra?

Modern frontend teams move fast — but testing edge cases still slows them down.  
Compass Ultra removes the friction by giving developers a **real‑time, in‑app control panel** for feature gates, config overrides, experiments, and failure simulation.

No redeploys.  
No backend coordination.  
No waiting.

Just instant control, full auditability, and a smoother path from development → QA → production.

## Product Hunt Launch Description

🚀 **Introducing Compass Ultra — the developer HUD your React app has been missing.**

Testing edge cases shouldn’t require staging environments, backend toggles, or 30 minutes of setup.  
Compass Ultra gives developers a **fixed-position, in-app control panel** for:

- Feature gate overrides  
- Runtime config editing  
- A/B experiment forcing  
- Failure simulation (timeouts, 500s, etc.)  
- Snapshot exporting for QA + handoffs  

All without redeploying.  
All without touching the backend.

Built for enterprise teams that need **speed, traceability, and compliance** — Compass Ultra turns painful testing workflows into a smooth, instant experience.

If you’re building React apps with feature flags, experiments, or complex config…  
**Compass Ultra will change your workflow forever.**

Licensing
Compass Ultra is proprietary commercial software.
See LICENSE for full licensing terms and commercial inquiry details.

Contact for Commercial Licensing
Angela Hudson
angela.hudson.data@gmail.com
404-422-9575

Built for enterprise teams that want to move fast while staying compliant.


# Compass Ultra  
Enterprise‑grade developer HUD for React applications.

![License](https://img.shields.io/badge/License-Proprietary-red)
![React](https://img.shields.io/badge/React-18.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![Platform](https://img.shields.io/badge/Platform-React%20Apps-purple)

---

## License Summary

Compass Ultra is **proprietary commercial software**.  
This repository is public for **demonstration and evaluation only** — not for production use, redistribution, or integration.

- ❌ Not open source  
- ❌ No modification or redistribution  
- ❌ No commercial use without a paid license  
- ✔️ Viewing and learning are allowed  

See the full `LICENSE` file for complete terms.

