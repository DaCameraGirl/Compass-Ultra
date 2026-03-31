# Compass Ultra

**Enterprise-grade developer HUD for React applications.**

Instant runtime overrides for feature gates, configuration, experiments, and failure simulation — without redeploying or touching the backend.

---

## The Problem

Testing complex edge cases (API 500 errors, slow responses, specific A/B variants, or config changes) usually requires 30+ minutes of backend setup, staging coordination, or code modifications.

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
tsx{process.env.NODE_ENV !== 'production' && <CompassUltra adapter={myAdapter} />}
No network calls. No side effects.

Licensing
Compass Ultra is proprietary commercial software.
See LICENSE for full licensing terms and commercial inquiry details.

Contact for Commercial Licensing
Angela Hudson
angela.hudson.data@gmail.com
404-422-9575

Built for enterprise teams that want to move fast while staying compliant.
