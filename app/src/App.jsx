import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Bug,
  CheckCircle2,
  Clipboard,
  Database,
  Download,
  Flag,
  GitBranch,
  Link,
  LockKeyhole,
  Radio,
  RefreshCw,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  Users,
  Zap,
} from 'lucide-react';

const storageKey = 'compass-ultra-workspace-v1';
const environments = ['Production mirror', 'Staging', 'QA branch'];
const segments = ['Enterprise admin', 'Trial workspace', 'EU customer'];

const initialFlags = [
  { id: 'checkout_redesign', name: 'Checkout redesign', owner: 'Growth', enabled: true, risk: 'High', exposure: 12 },
  { id: 'usage_based_billing', name: 'Usage based billing', owner: 'Billing', enabled: false, risk: 'High', exposure: 4 },
  { id: 'realtime_audit_log', name: 'Realtime audit log', owner: 'Platform', enabled: true, risk: 'Medium', exposure: 38 },
  { id: 'ai_support_summary', name: 'AI support summary', owner: 'Support', enabled: false, risk: 'Medium', exposure: 9 },
];

const scenarios = [
  {
    name: 'Billing rollback',
    detail: 'High-risk checkout path with new billing disabled for a release review.',
    environment: 'Production mirror',
    segment: 'Enterprise admin',
    overrides: {
      checkout_redesign: 'on',
      usage_based_billing: 'off',
      realtime_audit_log: 'on',
      ai_support_summary: 'off',
    },
  },
  {
    name: 'EU support pilot',
    detail: 'Regional privacy check with support summaries and audit trail enabled.',
    environment: 'Staging',
    segment: 'EU customer',
    overrides: {
      checkout_redesign: 'off',
      usage_based_billing: 'off',
      realtime_audit_log: 'on',
      ai_support_summary: 'on',
    },
  },
  {
    name: 'Trial conversion',
    detail: 'Trial workspace sees checkout, billing, and support experiments together.',
    environment: 'QA branch',
    segment: 'Trial workspace',
    overrides: {
      checkout_redesign: 'on',
      usage_based_billing: 'on',
      realtime_audit_log: 'on',
      ai_support_summary: 'on',
    },
  },
];

const integrations = [
  ['LaunchDarkly', 'Read flag state and simulate variations with local overrides.'],
  ['Statsig', 'Inspect gates, configs, layers, and experiment assignments.'],
  ['Firebase Remote Config', 'Preview remote config values without shipping builds.'],
  ['Generic JSON', 'Drop in a simple adapter for homegrown flag platforms.'],
];

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return { environment: environments[0], segment: segments[0], flags: initialFlags };
  }

  const fromUrl = readSnapshotFromUrl();
  if (fromUrl) return hydrateSnapshot(fromUrl);

  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey));
    if (saved) return hydrateSnapshot(saved);
  } catch {
    return { environment: environments[0], segment: segments[0], flags: initialFlags };
  }

  return { environment: environments[0], segment: segments[0], flags: initialFlags };
};

export default function App() {
  const importedFileRef = useRef(null);
  const initialState = useMemo(getInitialState, []);
  const [environment, setEnvironment] = useState(initialState.environment);
  const [segment, setSegment] = useState(initialState.segment);
  const [flags, setFlags] = useState(initialState.flags);
  const [copied, setCopied] = useState('');
  const [notice, setNotice] = useState('Workspace saves locally');
  const [auditLog, setAuditLog] = useState(() => [
    {
      id: 'boot',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      action: readSnapshotFromUrl() ? 'Restored snapshot from URL' : 'Workspace ready',
    },
  ]);

  const enabledCount = flags.filter((flag) => flag.enabled).length;
  const highRiskCount = flags.filter((flag) => flag.enabled && flag.risk === 'High').length;
  const changedCount = flags.filter((flag) => {
    const baseline = initialFlags.find((item) => item.id === flag.id);
    return baseline?.enabled !== flag.enabled;
  }).length;
  const driftScore =
    changedCount + (environment !== environments[0] ? 1 : 0) + (segment !== segments[0] ? 1 : 0);

  const snapshot = useMemo(
    () => ({
      product: 'Compass-Ultra',
      version: 1,
      environment,
      segment,
      createdAt: new Date().toISOString(),
      overrides: flags.reduce((acc, flag) => {
        acc[flag.id] = flag.enabled ? 'on' : 'off';
        return acc;
      }, {}),
    }),
    [environment, flags, segment]
  );

  const snapshotText = JSON.stringify(snapshot, null, 2);

  useEffect(() => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ environment, segment, overrides: snapshot.overrides })
    );
  }, [environment, segment, snapshot.overrides]);

  const record = (action) => {
    setAuditLog((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        action,
      },
      ...current,
    ].slice(0, 8));
  };

  const updateEnvironment = (value) => {
    setEnvironment(value);
    setNotice(`Environment set to ${value}`);
    record(`Environment changed to ${value}`);
  };

  const updateSegment = (value) => {
    setSegment(value);
    setNotice(`Segment set to ${value}`);
    record(`Segment changed to ${value}`);
  };

  const toggleFlag = (id) => {
    const target = flags.find((flag) => flag.id === id);
    if (target) {
      const next = !target.enabled;
      setNotice(`${target.name} ${next ? 'enabled' : 'disabled'}`);
      record(`${target.name} ${next ? 'enabled' : 'disabled'}`);
    }
    setFlags((current) =>
      current.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag))
    );
  };

  const applySnapshot = (nextSnapshot, action = 'Snapshot restored') => {
    const hydrated = hydrateSnapshot(nextSnapshot);
    setEnvironment(hydrated.environment);
    setSegment(hydrated.segment);
    setFlags(hydrated.flags);
    setNotice(action);
    record(action);
  };

  const applyScenario = (scenario) => {
    applySnapshot(scenario, `${scenario.name} scenario applied`);
  };

  const resetDemo = () => {
    applySnapshot(
      { environment: environments[0], segment: segments[0], overrides: flagsToOverrides(initialFlags) },
      'Workspace reset to baseline'
    );
    setCopied('');
    const url = new URL(window.location.href);
    url.searchParams.delete('snapshot');
    window.history.replaceState({}, '', `${url.pathname}${url.hash || '#demo'}`);
  };

  const copySnapshot = async () => {
    await copyText(snapshotText, 'JSON copied');
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('snapshot', encodeSnapshot(snapshot));
    url.hash = 'demo';
    await copyText(url.toString(), 'Share link copied');
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setNotice(label);
      record(label);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setNotice('Clipboard unavailable');
    }
  };

  const downloadSnapshot = () => {
    const blob = new Blob([snapshotText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compass-ultra-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Snapshot downloaded');
    record('Snapshot downloaded');
  };

  const importSnapshot = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      applySnapshot(imported, `Imported ${file.name}`);
    } catch {
      setNotice('Import failed: invalid snapshot JSON');
      record('Import failed');
    } finally {
      event.target.value = '';
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
            <button className="secondary-action" type="button" onClick={copyShareLink}>
              <Link size={18} aria-hidden="true" />
              Copy state link
            </button>
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
              <h2>{segment}</h2>
            </div>
            <span className="status-pill live">
              <Radio size={14} aria-hidden="true" />
              {environment}
            </span>
          </div>
          <div className="metric-grid">
            <Metric label="Flags enabled" value={`${enabledCount}/4`} tone="green" />
            <Metric label="High risk active" value={highRiskCount} tone="red" />
            <Metric label="Snapshot drift" value={`${driftScore} changes`} tone="blue" />
          </div>
          <div className="release-path">
            <span>Dev</span>
            <span>QA</span>
            <span>Staging</span>
            <strong>Prod mirror</strong>
          </div>
          <p className="state-note">
            <Save size={15} aria-hidden="true" />
            {notice}
          </p>
        </section>
      </section>

      <section id="demo" className="demo-section">
        <div className="section-heading">
          <p className="eyebrow">
            <Bug size={16} aria-hidden="true" />
            Working demo
          </p>
          <h2>Simulate, save, share, restore.</h2>
          <p>
            Apply a QA scenario, change the flag state, export it as JSON, or copy a
            link that restores the exact same workspace for another teammate.
          </p>
        </div>

        <div className="scenario-grid" aria-label="QA scenario presets">
          {scenarios.map((scenario) => (
            <button className="scenario-button" type="button" key={scenario.name} onClick={() => applyScenario(scenario)}>
              <strong>{scenario.name}</strong>
              <span>{scenario.detail}</span>
            </button>
          ))}
        </div>

        <div className="workspace-grid">
          <section className="control-panel" aria-label="Simulation controls">
            <div className="toolbar">
              <label>
                Environment
                <select value={environment} onChange={(event) => updateEnvironment(event.target.value)}>
                  {environments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                User segment
                <select value={segment} onChange={(event) => updateSegment(event.target.value)}>
                  {segments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button className="icon-button" type="button" onClick={resetDemo} aria-label="Reset workspace">
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
                      {flag.owner} owner - {flag.exposure}% exposure - {flag.risk} risk
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
              <div className="snapshot-actions">
                <button className="copy-button" type="button" onClick={copySnapshot}>
                  <Clipboard size={16} aria-hidden="true" />
                  {copied === 'JSON copied' ? 'Copied' : 'JSON'}
                </button>
                <button className="copy-button" type="button" onClick={copyShareLink}>
                  <Link size={16} aria-hidden="true" />
                  Link
                </button>
                <button className="copy-button" type="button" onClick={downloadSnapshot}>
                  <Download size={16} aria-hidden="true" />
                  File
                </button>
                <button className="copy-button" type="button" onClick={() => importedFileRef.current?.click()}>
                  <Upload size={16} aria-hidden="true" />
                  Import
                </button>
              </div>
            </div>
            <input
              ref={importedFileRef}
              className="hidden-file"
              type="file"
              accept="application/json,.json"
              onChange={importSnapshot}
            />
            <pre>{snapshotText}</pre>
          </section>
        </div>

        <section className="audit-panel" aria-label="Audit log">
          <div className="panel-header">
            <div>
              <p>Local audit trail</p>
              <h2>What changed</h2>
            </div>
            <span className="status-pill live">{auditLog.length} events</span>
          </div>
          <div className="audit-list">
            {auditLog.map((event) => (
              <article className="audit-item" key={event.id}>
                <span>{event.time}</span>
                <strong>{event.action}</strong>
              </article>
            ))}
          </div>
        </section>
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

function flagsToOverrides(flags) {
  return flags.reduce((acc, flag) => {
    acc[flag.id] = flag.enabled ? 'on' : 'off';
    return acc;
  }, {});
}

function hydrateSnapshot(snapshot) {
  const overrides = snapshot?.overrides || {};
  return {
    environment: environments.includes(snapshot?.environment) ? snapshot.environment : environments[0],
    segment: segments.includes(snapshot?.segment) ? snapshot.segment : segments[0],
    flags: initialFlags.map((flag) => ({
      ...flag,
      enabled: overrides[flag.id] ? overrides[flag.id] === 'on' : flag.enabled,
    })),
  };
}

function encodeSnapshot(snapshot) {
  return btoa(JSON.stringify(snapshot)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function readSnapshotFromUrl() {
  try {
    const encoded = new URLSearchParams(window.location.search).get('snapshot');
    if (!encoded) return null;
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}
