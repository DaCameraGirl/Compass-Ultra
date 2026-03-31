# compass-ultra
The Pain: "Normally, testing a complex API failure takes 30 minutes of backend setup."  The Solution: "With Compass Ultra, I mock the 500 Error in 2 seconds and verify the UI state."  The 'Aha' Moment: "I then take a State Snapshot and send it to my lead via a Deep Link."
  ██████╗ ██████╗ ███╗   ███╗██████╗  █████╗ ███████╗███████╗
 ██╔════╝██╔═══██╗████╗ ████║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ██║     ██║   ██║██╔████╔██║██████╔╝███████║███████╗███████╗
 ██║     ██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══██║╚════██║╚════██║
 ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║     ██║  ██║███████║███████║
  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝
                    D E V    H U D    v3.14.2-rc1
🌑 Dark. 🔐 Secure. ⚡ Instant. 🧪 Experimental. 📋 Audit-Ready.
</div>

📖 Table of Contents

🤔 What Even Is This?
✨ Features That Will Make You Feel Like a Hacker
🚀 Getting Started (It's Genuinely Easy)
🧩 The Five Holy Tabs

🚦 Gates Tab
⚙️ Config Tab
🧪 Experiments Tab
📋 Audit Tab
🏗️ Build Tab


🏷️ The Category System (And Why It Matters)
🌍 Environment Switcher
⌨️ Keyboard Shortcut
📤 Export Config
🔌 Wiring Up Your Adapter
🧱 Architecture Deep Dive
🚨 Production Safety Warning
🛣️ Roadmap
🤝 Contributing
📜 License


🤔 What Even Is This?
Compass Dev HUD is a fixed-position, slide-in developer overlay panel for React applications. It lives in the bottom-right corner of your screen as an unassuming little ⚙️ gear icon, waiting patiently and silently — like a very disciplined intern — until you need it.
When you pop it open (either by clicking it or hammering Ctrl+Shift+D like a person who means business), you get a full-featured, enterprise-grade control panel that lets you:

🚦 Toggle feature gates on and off in real time, without touching a single line of code or restarting your dev server
⚙️ Override runtime config values like request limits, TTLs, and rollout percentages — all locally, all instantly
🧪 Switch A/B experiment variants mid-session so you can preview what your users in the v2_guided cohort are seeing without actually being one of them
📋 Review a timestamped audit trail of every change you've made this session, color-coded by severity, so your future self can figure out why the staging environment is on fire
🏗️ Inspect build metadata and telemetry pipeline health so you know what commit you're actually running and whether your OpenTelemetry pipeline is alive or silently crying

It is not a feature flag management system. It is not a replacement for LaunchDarkly, Statsig, or whatever SaaS your company pays too much for. It is a developer experience tool — a local override layer that sits on top of your real system and lets you move fast without breaking (more) things.
Think of it as the cheat code console for your own app. 🎮

✨ Features That Will Make You Feel Like a Hacker
FeatureWhat It DoesWhy You'll Love It🚦 Feature Gate TogglesFlip boolean gates instantlyNo more commenting out if (gates.NEW_DASHBOARD_V2) like an animal🔍 Gate Search & FilterReal-time filter across all gatesBecause apparently someone added 47 gates and no one told you🏷️ Auto-CategorizationGates sorted into ui / security / api / ml / coreClean, grouped, audit-presentable⚙️ Runtime Config OverridesEditable key-value pairsChange MAX_CONCURRENT_REQUESTS without redeploying. Yes, really.🧪 A/B Experiment VariantsSwitch between control, v1, v2 etc.See what your product manager approved without reading the spec📋 Session Audit LogTimestamped trail of every actionCovers you when someone asks "who broke staging"🌍 Environment SelectorSwitch between DEV / STAGING / PROD contextsColor-coded so you don't accidentally think prod is dev (cyan = safe, red = sweating)🏗️ Build Metadata PanelCommit SHA, branch, version, region, build timeKnow exactly what you deployed so you can stop saying "should be the latest"📡 Telemetry StatusLive pipeline health indicatorsPulsing green dots that turn amber when your log ingestion is being dramatic📤 Export ConfigDownloads a JSON snapshot of all active overridesPaste it in a Slack thread to prove what you were testing🔄 Reset AllOne-click nuke back to defaultsFor when you've made it worse⌨️ Keyboard ShortcutCtrl+Shift+D (or Cmd+Shift+D on Mac)Because clicking is for people who haven't suffered enough🔒 Audit-Safe CategoriesNo gate accidentally labeled "Machine Learning"Your compliance team will thank you. Eventually.

🚀 Getting Started (It's Genuinely Easy)
1️⃣ Install Dependencies
Compass HUD uses only what you almost certainly already have:
bashnpm install react lucide-react
# tailwindcss is assumed — if you don't have it, we need to talk
2️⃣ Drop It Into Your App Root
tsx// App.tsx
import { CompassDevHUD } from './components/CompassDevHUD';
import { myAdapter } from './lib/overrideAdapter';

export default function App() {
  return (
    <>
      <YourActualApp />

      {/* Only render in non-production environments, unless you enjoy chaos */}
      {process.env.NODE_ENV !== 'production' && (
        <CompassDevHUD adapter={myAdapter} />
      )}
    </>
  );
}
3️⃣ Wire Up Your Adapter
See the 🔌 Wiring Up Your Adapter section below. It's a simple interface. You've got this.
4️⃣ Open Your App, Look Bottom-Right
See that little ⚙️ gear? That's your new best friend. Click it. Welcome to the HUD. You're home now.

🧩 The Five Holy Tabs
🚦 Gates Tab
The main event. The reason we're all here. The gates tab shows you every feature gate that your EnterpriseOverrideAdapter knows about, automatically sorted into color-coded categories:
CategoryColorWhat Goes Here🔵 uiCyanDashboard layouts, modals, themes, views🟣 securityPurpleRBAC, auth, encryption, MFA, permissions🟡 apiAmberEndpoints, rate limits, bulk ops, webhooks🟢 mlGreenModel routing, inference, shadow eval, embeddings⚪ coreSlateEverything else — honestly labeled, never mislabeled
Each gate row shows:

The gate name in monospace font (as God intended)
Whether it is enabled or disabled in plain English below the name
A toggle switch that you can click to flip it — which immediately calls adapter.setGateOverride() AND logs the change to the audit trail

There is also a search bar at the top. Type in it. Your 47 gates will filter down. You're welcome.

⚙️ Config Tab
Sometimes you don't need to toggle a boolean. Sometimes you need to change SESSION_TTL_SECONDS from 3600 to 60 because you're testing token expiry behavior and you don't want to wait an actual hour. This is that tab.
Each row has:

A key input (left, 38% width, monospace, you know what a key is)
A value input (right, fills remaining space, also monospace)
A delete button (✕) that removes the row and logs it to audit

There's also an + ADD KEY button at the bottom styled with a dashed border because we're classy like that.

⚠️ Important: These config values are local overrides only. They do not phone home. They do not persist across sessions. They do not write to your database. They are vibes.


🧪 Experiments Tab
Your app probably runs A/B experiments. Your product manager definitely has opinions about which variant is performing better. This tab lets you manually force yourself into any variant without going through the experiment assignment pipeline.
Each experiment shows:

The experiment name in monospace
A row of variant buttons — control, v1_minimal, v2_guided, whatever you've registered

The active variant is highlighted in purple. Clicking a different one switches you immediately and logs the change to audit. It's genuinely that simple.

🧠 Pro tip: This is extremely useful for QA. Instead of asking your QA engineer to "somehow get assigned to the social_proof variant," just open this tab and click the button. You're done. Go home.


📋 Audit Tab
Every single action you take in this HUD is logged here. Gate toggle? Logged. Config key deleted? Logged. Environment switched? Logged. Reset All? Very much logged, with a severity of warn because you pressed the big scary button.
Each entry shows:

⏰ Timestamp — HH:MM:SS in 24-hour time because we're professionals
🟢🟡🔴 Severity dot — green for normal ops, amber for potentially destructive actions, red for actual errors
📝 Message — what happened, in plain English
🔵 Key — the gate name or config key involved, shown in cyan for easy scanning

The log is capped at 50 entries (oldest entries are dropped) because we are not going to let this thing eat your memory just because you spent 45 minutes toggling REALTIME_COLLAB on and off.

📋 Audit-ready: If your compliance team asks "who changed what and when during this testing session," you can screenshot this tab. It is genuinely useful. This was not an accident.


🏗️ Build Tab
Two sections:
📦 Build Metadata — a 2-column grid showing:

COMMIT — the short SHA, shown in green (it exists, we're relieved)
BRANCH — what branch you're on, which may or may not be main
VERSION — the semver string, including pre-release tags like -rc1
REGION — which cloud region this is deployed to
BUILD TIME — how long the build took, shown in green (builds are hard, we celebrate them)
NODE ENV — shown in amber because development is always slightly suspicious

📡 Telemetry Pipelines — four status rows with pulsing dots:

🟢 OTel Pipeline — your OpenTelemetry trace pipeline
🟢 Error Tracker — your error reporting service (Sentry, Datadog, etc.)
🟡 Log Ingestion — shown in amber because log pipelines are always the one thing acting up
🟢 Metrics Sink — your metrics aggregation pipeline


🔧 To wire these up to real data: replace the hardcoded arrays with values fetched from your health check endpoint. The structure is simple — label, status ('ok' | 'warn' | 'err'), val (human-readable string).


🏷️ The Category System (And Why It Matters)
Gates are automatically categorized by inferCategory(), which runs a series of regex checks against the gate name:
typescriptfunction inferCategory(name: string): GateCategory {
  const n = name.toUpperCase();
  if (/DASHBOARD|UI|LAYOUT|THEME|VIEW|MODAL/.test(n))                 return 'ui';
  if (/RBAC|AUTH|AUDIT|ENCRYPT|MFA|SECURITY|ROLE|PERMISSION/.test(n)) return 'security';
  if (/API|ENDPOINT|RATE|BULK|EXPORT|WEBHOOK|REST/.test(n))           return 'api';
  if (/MODEL|INFERENCE|CANARY|SHADOW|EVAL|EMBEDDING|ML|AI/.test(n))   return 'ml';
  return 'core'; // ← the important one
}
🔒 Why core and Not ml as the Default?
Great question. The previous version of this component defaulted unknown gates to ml. This created a specific, embarrassing class of audit problem:

👔 Compliance Officer: "Why is LEGACY_CSV_PARSER_FIX classified as Machine Learning?"
😰 You: "It's... not. That was just the default."
👔 Compliance Officer: writes something down

core is an honest label. It means "this gate belongs to the platform and hasn't been explicitly categorized yet." It survives scrutiny. ml as a default does not.
🔧 Extending the Category System
You can add new categories by:

Adding the string literal to GateCategory:

typescript   type GateCategory = 'ui' | 'security' | 'api' | 'ml' | 'core' | 'billing' | 'infra';

Adding a color to CATEGORY_COLORS:

typescript   billing: 'text-pink-400',
   infra:   'text-orange-400',

Adding regex patterns to inferCategory:

typescript   if (/BILLING|PAYMENT|INVOICE|STRIPE|SUBSCRIPTION/.test(n)) return 'billing';
   if (/INFRA|K8S|KUBERNETES|POD|NODE|CLUSTER/.test(n))       return 'infra';

Adding the new categories to the .map() in the Gates tab:

typescript   {(['ui', 'security', 'api', 'ml', 'core', 'billing', 'infra'] as GateCategory[]).map(cat => {
🏭 CI Lint Rule (Advanced, Optional, Recommended)
If you want to enforce zero 'core' gates in your codebase — meaning every gate must have an explicit category — you can add this to your CI pipeline:
bash# Fail if any gate name doesn't match a known category pattern
node -e "
const gates = require('./src/config/gates.json');
const uncat = gates.filter(g => inferCategory(g.name) === 'core');
if (uncat.length > 0) {
  console.error('Uncategorized gates found:', uncat.map(g => g.name));
  process.exit(1);
}
"
This forces categorization to happen at authorship time (when the engineer adds the gate) rather than at audit time (when someone is asking uncomfortable questions). Much better.

🌍 Environment Switcher
The environment selector in the header is color-coded for a reason:
EnvironmentColorVibe🔵 DEVCyanCalm. Relaxed. Nothing matters here.🟡 STAGINGAmberMild concern. Things should work but might not.🔴 PRODRedElevated heart rate. Why is HUD open in prod??
Switching environments logs an audit entry with severity: 'warn' if you switch to prod. This is intentional. You should feel slightly watched.

⚠️ Note: The environment selector changes the context label and snapshot metadata only. It does not actually connect to different backends or change your API endpoints. For that, you need environment variables, which are a different and older problem.


⌨️ Keyboard Shortcut
Ctrl + Shift + D      (Windows / Linux)
Cmd  + Shift + D      (macOS)
This toggles the HUD open and closed from anywhere in the app. The shortcut hint is displayed in tiny, extremely subtle text below the trigger button when the panel is closed, in case you forget.
The handler is registered via useEffect on mount and properly cleaned up on unmount. It will not leak. We checked.

📤 Export Config
The Export Config button in the footer downloads a JSON file named compass-snapshot-{timestamp}.json containing the complete state of every override you have active:
json{
  "env": "staging",
  "timestamp": "2026-03-29T14:23:01.000Z",
  "gates": {
    "NEW_DASHBOARD_V2": true,
    "REALTIME_COLLAB": false,
    "RBAC_STRICT_MODE": true,
    "BULK_EXPORT_API": true
  },
  "config": {
    "MAX_CONCURRENT_REQUESTS": "25",
    "SESSION_TTL_SECONDS": "60"
  },
  "experiments": {
    "onboarding_flow": "v2_guided",
    "pricing_page_cta": "social_proof",
    "ml_model_routing": "ensemble"
  }
}
Use cases for this file:

📎 Paste in a PR to document what overrides you used during testing
💬 Share in Slack when handing off a debugging session to a colleague
🐛 Attach to a bug report so the person reproducing it knows exactly what state you were in
🗂️ Archive alongside a release for compliance documentation
🔁 Eventually feed back into the adapter to restore a previous state (future feature, see roadmap)


🔌 Wiring Up Your Adapter
The HUD expects an object conforming to the EnterpriseOverrideAdapter<T> interface. Here's the minimum viable implementation:
typescript// lib/overrideAdapter.ts

export interface EnterpriseOverrideAdapter<T> {
  getAllOverrides(): { gate: Record<string, boolean>; config?: Record<string, string> };
  getGateOverride(name: string): boolean;
  setGateOverride(name: string, value: boolean): void;
  resetAllOverrides?(): void; // Optional but strongly recommended
}

// Simple in-memory implementation to get started:
class InMemoryOverrideAdapter implements EnterpriseOverrideAdapter<any> {
  private gates: Record<string, boolean> = {
    NEW_DASHBOARD_V2:  true,
    REALTIME_COLLAB:   false,
    RBAC_STRICT_MODE:  true,
    BULK_EXPORT_API:   false,
  };

  getAllOverrides() {
    return { gate: { ...this.gates } };
  }

  getGateOverride(name: string) {
    return this.gates[name] ?? false;
  }

  setGateOverride(name: string, value: boolean) {
    this.gates[name] = value;
    console.debug(`[CompassHUD] Gate override: ${name} → ${value}`);
  }

  resetAllOverrides() {
    Object.keys(this.gates).forEach(k => (this.gates[k] = false));
  }
}

export const myAdapter = new InMemoryOverrideAdapter();
🔗 Connecting to a Real Feature Flag System
If you're using LaunchDarkly, Statsig, Growthbook, Unleash, or any other flag system, you can wrap their SDK in an adapter:
typescript// Example: wrapping a LaunchDarkly client
import { LDClient } from 'launchdarkly-js-client-sdk';

class LaunchDarklyAdapter implements EnterpriseOverrideAdapter<any> {
  private overrides: Record<string, boolean> = {};

  constructor(private ldClient: LDClient) {}

  getAllOverrides() {
    const allFlags = this.ldClient.allFlags();
    return {
      gate: Object.fromEntries(
        Object.entries(allFlags)
          .filter(([, v]) => typeof v === 'boolean')
          .map(([k, v]) => [k, this.overrides[k] ?? (v as boolean)])
      )
    };
  }

  getGateOverride(name: string) {
    return this.overrides[name] ?? this.ldClient.variation(name, false);
  }

  setGateOverride(name: string, value: boolean) {
    this.overrides[name] = value; // local override only, does not touch LD
  }

  resetAllOverrides() {
    this.overrides = {};
  }
}

🧱 Architecture Deep Dive
CompassDevHUD
├── 🔌 EnterpriseOverrideAdapter (your system, injected via prop)
├── 🎛️ State
│   ├── open          — panel visibility
│   ├── tab           — active tab (gates | config | exp | audit | build)
│   ├── env           — current environment context
│   ├── gates[]       — feature gates with enabled state + category
│   ├── config[]      — runtime config key-value pairs
│   ├── experiments[] — A/B experiments with active variant
│   └── auditLog[]    — timestamped action history (max 50)
│
├── 🔑 Keyboard Handler
│   └── useEffect → window keydown → Ctrl+Shift+D → toggles open
│
├── 🧩 Tabs
│   ├── Gates    → inferCategory() → grouped toggles → adapter.setGateOverride()
│   ├── Config   → editable key-value rows → local state only
│   ├── Exp      → variant buttons → local state + audit log
│   ├── Audit    → read-only reverse-chronological log
│   └── Build    → static metadata + telemetry status rows
│
└── 🦶 Footer
    ├── Reset All    → adapter.resetAllOverrides() + state reset + audit log
    └── Export Config → JSON blob → Blob URL → anchor click → download
🔁 Data Flow
User clicks toggle
       ↓
toggleGate(name) called
       ↓
adapter.setGateOverride(name, !current) ← your system gets notified
       ↓
setGates(prev → updated array) ← React state updates
       ↓
addAudit(msg, key, severity) ← audit log updated
       ↓
Re-render → UI reflects new state
Everything is unidirectional. No Context API, no Redux, no Zustand, no Jotai, no Recoil, no ceremonies. Just props and useState. It works. Don't overthink it.

🚨 Production Safety Warning
Please, for the love of your on-call rotation, wrap this component in an environment check:
tsx{process.env.NODE_ENV !== 'production' && <CompassDevHUD adapter={myAdapter} />}
Or if you use a custom env variable:
tsx{process.env.NEXT_PUBLIC_SHOW_DEV_HUD === 'true' && <CompassDevHUD adapter={myAdapter} />}
The HUD itself will not spontaneously combust in production — it has no server-side effects, no API calls, no telemetry of its own. But it will expose your gate names, experiment names, config keys, build metadata, and internal branch names to anyone who opens DevTools and pokes around the React component tree.
That is a information disclosure risk. Your security team has opinions about this. Listen to them.

🛣️ Roadmap
Things that would make this even better and might get built someday:

 💾 Persistent overrides via localStorage — so your gates survive a page refresh
 🔁 Import config — drag-and-drop a previously exported JSON snapshot to restore state
 👥 Multi-user broadcast — sync overrides across browser tabs via BroadcastChannel API
 🔗 Deep link support — encode override state in the URL hash so you can share a specific config with a colleague via link
 📊 Gate usage heatmap — track which gates you toggle most often during a session
 🔔 Change notifications — toast messages when a gate is toggled, so you know it worked even if the UI change is subtle
 🌐 Remote config sync — pull gate definitions from a remote source on panel open
 🎭 Persona presets — save named bundles of overrides (e.g. "power user", "free tier", "new signup") and switch between them instantly
 🧹 Stale gate detection — flag gates that have been true for the entire session, suggesting they might be ready to be made permanent
 📱 Mobile-friendly mode — bottom sheet instead of side panel, for testing on small viewports

PRs welcome. Opinions welcome. Unsolicited rewrites in Vue: kindly keep to yourself.

🤝 Contributing

🍴 Fork the repo
🌿 Create a branch: git checkout -b feat/your-feature-name
💅 Make your changes (please keep TypeScript strict mode happy)
✅ Make sure it actually works (there are no tests yet, this is a safe space, but write them anyway)
📬 Open a PR with a description that explains what you changed and why

🧹 Code Style

TypeScript — strict mode, no any except where the adapter generic genuinely demands it
Tailwind — utility classes only, no custom CSS files, no @apply (we talked about this)
React — functional components and hooks only, no class components, it's not 2018
Comments — use them for the why, not the what. The what is visible. The why is not.
Gate categories — if you add a new regex pattern to inferCategory, add a corresponding test case

🐛 Reporting Bugs
Open an issue with:

What you expected to happen
What actually happened
Whether it also happens with adapter.resetAllOverrides() called first
Your Node version, React version, and browser
Optionally: an exported config JSON from the panel at the time of the bug


📜 License
MIT — do whatever you want with it. Use it in your startup. Use it in your enterprise monolith. Use it in a side project you'll abandon in six weeks. We don't mind.
If it saves you time, that's enough.

<div align="center">
Built with 🖤 for developers who are tired of editing source code to test edge cases
Compass Dev HUD — Because console.log('GATE ENABLED:', true) is not a feature flag system
ctrl + shift + D
🛡️
