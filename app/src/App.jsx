import { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Bug,
  CheckCircle2,
  Clipboard,
  Database,
  Flag,
  GitBranch,
  LockKeyhole,
  Radio,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Zap,
} from 'lucide-react';

const environments = ['Production mirror', 'Staging', 'QA branch'];
const segments = ['Enterprise admin', 'Trial workspace', 'EU customer'];

const initialFlags = [
  { id: 'checkout_redesign', name: 'Checkout redesign', owner: 'Growth', enabled: true, risk: 'High', exposure: 12 },
  { id: 'usage_based_billing', name: 'Usage based billing', owner: 'Billing', enabled: false, risk: 'High', exposure: 4 },
  { id: 'realtime_audit_log', name: 'Realtime audit log', owner: 'Platform', enabled: true, risk: 'Medium', exposure: 38 },
  { id: 'ai_support_summary', name: 'AI support summary', owner: 'Support', enabled: false, risk: 'Medium', exposure: 9 },
];

const integrations = [
  ['LaunchDarkly', 'Read flag state and simulate variations with local overrides.'],
  ['Statsig', 'Inspect gates, configs, layers, and experiment assignments.'],
  ['Firebase Remote Config', 'Preview remote config values without shipping builds.'],
  ['Generic JSON', 'Drop in a simple adapter for homegrown flag platforms.'],
];

export default function App() {
  const [environment, setEnvironment] = useState(environments[0]);
  const [segment, setSegment] = useState(segments[0]);
  const [flags, setFlags] = useState(initialFlags);
  const [copied, setCopied] = useState(false);

  const enabledCount = flags.filter((flag) => flag.enabled).length;
  const highRiskCount = flags.filter((flag) => flag.enabled && flag.risk === 'High').length;

  const snapshot = useMemo(
    () => ({
      product: 'Compass-Ultra',
      environment,
      segment,
      createdAt: 'local-preview',
      overrides: flags.reduce((acc, flag) => {
        acc[flag.id] = flag.enabled ? 'on' : 'off';
        return acc;
      }, {}),
    }),
    [environment, flags, segment]
  );

  const snapshotText = JSON.stringify(snapshot, null, 2);

  const toggleFlag = (id) => {
    setFlags((current) =>
      current.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag))
    );
  };

  const resetDemo = () => {
    setEnvironment(environments[0]);
    setSegment(segments[0]);
    setFlags(initialFlags);
    setCopied(false);
  };

  const copySnapshot = async () => {
    try {
      await navigator.clipboard.writeText(snapshotText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Primary">
        <a className="brand" href="#top" aria-label="Compass-Ultra home">
          <span className="brand-mark">CU</span>
          <span>
            <strong>Compass-Ultra</strong>
            <small>React flag debug HUD</small>
          </span>
        </a>
        <div className="nav-links">
          <a href="#demo">Demo</a>
          <a href="#integrations">Integrations</a>
          <a href="#security">Security</a>
        </div>
      </nav>

      <section id="top" className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">
            <ShieldCheck size={16} aria-hidden="true" />
            Enterprise-ready local preview
          </p>
          <h1>Debug React feature flags before they break production.</h1>
          <p className="hero-lede">
            Compass-Ultra gives frontend, QA, and platform teams a focused HUD for
            simulating gates, config, experiments, and user segments without writing
            back to production systems.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#demo">
              <Zap size={18} aria-hidden="true" />
              Try the simulator
            </a>
            <a className="secondary-action" href="#integrations">
              <GitBranch size={18} aria-hidden="true" />
              View adapters
            </a>
          </div>
          <div className="trust-row" aria-label="Product guarantees">
            <span>No production writes</span>
            <span>Local-only overrides</span>
            <span>Shareable QA state</span>
          </div>
        </div>

        <section className="signal-panel" aria-label="Release risk summary">
          <div className="panel-header">
            <div>
              <p>Release simulation</p>
              <h2>Billing rollout</h2>
            </div>
            <span className="status-pill live">
              <Radio size={14} aria-hidden="true" />
              Live mirror
            </span>
          </div>
          <div className="metric-grid">
            <Metric label="Flags enabled" value={`${enabledCount}/4`} tone="green" />
            <Metric label="High risk active" value={highRiskCount} tone="red" />
            <Metric label="Snapshot drift" value="0.8%" tone="blue" />
          </div>
          <div className="release-path">
            <span>Dev</span>
            <span>QA</span>
            <span>Staging</span>
            <strong>Prod mirror</strong>
          </div>
        </section>
      </section>

      <section id="demo" className="demo-section">
        <div className="section-heading">
          <p className="eyebrow">
            <Bug size={16} aria-hidden="true" />
            Working demo
          </p>
          <h2>Simulate the exact state QA needs to reproduce.</h2>
          <p>
            Toggle flags, change the audience, copy the snapshot, and hand the same
            state to another teammate without touching the flag provider.
          </p>
        </div>

        <div className="workspace-grid">
          <section className="control-panel" aria-label="Simulation controls">
            <div className="toolbar">
              <label>
                Environment
                <select value={environment} onChange={(event) => setEnvironment(event.target.value)}>
                  {environments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                User segment
                <select value={segment} onChange={(event) => setSegment(event.target.value)}>
                  {segments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button className="icon-button" type="button" onClick={resetDemo} aria-label="Reset demo">
                <RefreshCw size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flag-list">
              {flags.map((flag) => (
                <article className="flag-row" key={flag.id}>
                  <div>
                    <div className="flag-title">
                      <Flag size={17} aria-hidden="true" />
                      <h3>{flag.name}</h3>
                    </div>
                    <p>
                      {flag.owner} owner · {flag.exposure}% exposure · {flag.risk} risk
                    </p>
                  </div>
                  <button
                    className={`toggle ${flag.enabled ? 'is-on' : ''}`}
                    type="button"
                    onClick={() => toggleFlag(flag.id)}
                    aria-pressed={flag.enabled}
                  >
                    <span>{flag.enabled ? 'On' : 'Off'}</span>
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="snapshot-panel" aria-label="Shareable snapshot">
            <div className="panel-header">
              <div>
                <p>Shareable QA snapshot</p>
                <h2>State bundle</h2>
              </div>
              <button className="copy-button" type="button" onClick={copySnapshot}>
                <Clipboard size={16} aria-hidden="true" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre>{snapshotText}</pre>
          </section>
        </div>
      </section>

      <section id="integrations" className="integrations-section">
        <div className="section-heading">
          <p className="eyebrow">
            <SlidersHorizontal size={16} aria-hidden="true" />
            Adapter-first architecture
          </p>
          <h2>Works beside the tools teams already trust.</h2>
        </div>
        <div className="card-grid">
          {integrations.map(([name, text]) => (
            <article className="integration-card" key={name}>
              <Database size={20} aria-hidden="true" />
              <h3>{name}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="security" className="security-section">
        <div className="security-copy">
          <p className="eyebrow">
            <LockKeyhole size={16} aria-hidden="true" />
            Enterprise posture
          </p>
          <h2>Designed for debugging without provider-side risk.</h2>
          <p>
            Compass-Ultra is built around read-only provider adapters, local override
            state, and explicit snapshots so product engineers can reproduce rollout
            bugs without changing real customer exposure.
          </p>
        </div>
        <div className="security-list">
          <SecurityItem icon={<CheckCircle2 />} title="Read-only by default" text="Provider adapters inspect flag and config state without mutating production values." />
          <SecurityItem icon={<Users />} title="Segment simulation" text="Preview enterprise, trial, regional, and custom audiences before rollout." />
          <SecurityItem icon={<Activity />} title="Audit-friendly snapshots" text="Every shared state bundle is visible, portable, and easy to review in tickets." />
          <SecurityItem icon={<BadgeCheck />} title="Team-ready roadmap" text="Add SSO, role-aware workspaces, and provider sync once the core demo earns demand." />
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SecurityItem({ icon, title, text }) {
  return (
    <article className="security-item">
      <span className="security-icon">{icon}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}
