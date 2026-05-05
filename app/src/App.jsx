import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Braces,
  Check,
  Clipboard,
  Download,
  FileJson,
  Gauge,
  GitBranch,
  Link,
  ListFilter,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
} from 'lucide-react';

const storageKey = 'compass-ultra-workspace-v2';

const defaultContext = {
  key: 'user_2941',
  email: 'admin@acme.test',
  plan: 'enterprise',
  region: 'us',
  environment: 'production',
};

const seedFlags = [
  {
    key: 'checkout.redesign',
    name: 'Checkout redesign',
    owner: 'Growth',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 35,
    rules: [{ attribute: 'plan', operator: 'equals', value: 'enterprise', valueWhenMatched: true }],
    source: 'Local',
  },
  {
    key: 'billing.usage_v2',
    name: 'Usage billing v2',
    owner: 'Billing',
    type: 'boolean',
    enabled: false,
    defaultValue: false,
    overrideValue: null,
    rollout: 10,
    rules: [{ attribute: 'region', operator: 'notEquals', value: 'eu', valueWhenMatched: true }],
    source: 'Local',
  },
  {
    key: 'support.ai_summary',
    name: 'AI support summary',
    owner: 'Support',
    type: 'variant',
    enabled: true,
    defaultValue: 'control',
    overrideValue: null,
    rollout: 100,
    variants: ['control', 'concise', 'detailed'],
    rules: [{ attribute: 'plan', operator: 'equals', value: 'enterprise', valueWhenMatched: 'detailed' }],
    source: 'Local',
  },
  {
    key: 'audit.realtime',
    name: 'Realtime audit log',
    owner: 'Platform',
    type: 'json',
    enabled: true,
    defaultValue: { stream: false, retentionDays: 30 },
    overrideValue: null,
    rollout: 100,
    rules: [{ attribute: 'environment', operator: 'equals', value: 'production', valueWhenMatched: { stream: true, retentionDays: 90 } }],
    source: 'Local',
  },
];

const emptyDraft = {
  key: '',
  name: '',
  owner: 'Product',
  type: 'boolean',
  defaultValue: 'false',
};

export default function App() {
  const importRef = useRef(null);
  const initial = useMemo(loadWorkspace, []);
  const [workspaceName, setWorkspaceName] = useState(initial.workspaceName);
  const [context, setContext] = useState(initial.context);
  const [flags, setFlags] = useState(initial.flags);
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(initial.flags[0]?.key || '');
  const [draft, setDraft] = useState(emptyDraft);
  const [notice, setNotice] = useState('Saved locally');
  const [audit, setAudit] = useState(initial.audit);
  const selectedFlag = flags.find((flag) => flag.key === selectedKey) || flags[0];

  const evaluations = useMemo(
    () =>
      flags.map((flag) => ({
        flag,
        result: evaluateFlag(flag, context),
      })),
    [context, flags]
  );

  const visibleEvaluations = evaluations.filter(({ flag }) => {
    const text = `${flag.key} ${flag.name} ${flag.owner} ${flag.source}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  const activeOverrides = flags.filter((flag) => flag.overrideValue !== null).length;
  const enabledFlags = flags.filter((flag) => flag.enabled).length;
  const matchedRules = evaluations.filter(({ result }) => result.reason === 'rule').length;

  const workspace = useMemo(
    () => ({
      product: 'Compass-Ultra',
      version: 2,
      workspaceName,
      context,
      flags,
      exportedAt: new Date().toISOString(),
    }),
    [context, flags, workspaceName]
  );

  const workspaceText = JSON.stringify(workspace, null, 2);
  const selectedEvaluation = selectedFlag ? evaluateFlag(selectedFlag, context) : null;
  const sdkSnippet = selectedFlag ? makeSdkSnippet(workspaceName, context, flags) : '';

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ workspaceName, context, flags, audit }));
  }, [audit, context, flags, workspaceName]);

  const record = (action) => {
    setAudit((current) => [
      { id: `${Date.now()}-${Math.random()}`, time: timeNow(), action },
      ...current,
    ].slice(0, 12));
    setNotice(action);
  };

  const updateContext = (field, value) => {
    setContext((current) => ({ ...current, [field]: value }));
    record(`Context ${field} changed`);
  };

  const updateFlag = (key, patch) => {
    setFlags((current) =>
      current.map((flag) => (flag.key === key ? normalizeFlag({ ...flag, ...patch }) : flag))
    );
  };

  const setOverride = (flag, value) => {
    updateFlag(flag.key, { overrideValue: value });
    record(`${flag.name} override ${value === null ? 'cleared' : 'set'}`);
  };

  const addFlag = () => {
    const key = slugKey(draft.key || draft.name);
    if (!key || flags.some((flag) => flag.key === key)) {
      record('Flag key must be unique');
      return;
    }

    const nextFlag = normalizeFlag({
      key,
      name: draft.name || key,
      owner: draft.owner || 'Product',
      type: draft.type,
      enabled: true,
      defaultValue: parseTypedValue(draft.defaultValue, draft.type),
      overrideValue: null,
      rollout: draft.type === 'boolean' ? 100 : 100,
      rules: [],
      source: 'Local',
    });

    setFlags((current) => [nextFlag, ...current]);
    setSelectedKey(nextFlag.key);
    setDraft(emptyDraft);
    record(`${nextFlag.name} added`);
  };

  const removeFlag = (key) => {
    const target = flags.find((flag) => flag.key === key);
    setFlags((current) => current.filter((flag) => flag.key !== key));
    if (selectedKey === key) setSelectedKey(flags.find((flag) => flag.key !== key)?.key || '');
    record(`${target?.name || key} removed`);
  };

  const updateRule = (flag, patch) => {
    const rule = { attribute: 'plan', operator: 'equals', value: '', valueWhenMatched: true, ...(flag.rules?.[0] || {}), ...patch };
    updateFlag(flag.key, { rules: [rule] });
    record(`${flag.name} rule updated`);
  };

  const importWorkspace = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      const hydrated = hydrateWorkspace(imported, file.name);
      setWorkspaceName(hydrated.workspaceName);
      setContext(hydrated.context);
      setFlags(hydrated.flags);
      setSelectedKey(hydrated.flags[0]?.key || '');
      record(`Imported ${file.name}`);
    } catch {
      record('Import failed');
    } finally {
      event.target.value = '';
    }
  };

  const exportWorkspace = () => {
    const blob = new Blob([workspaceText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugKey(workspaceName) || 'compass-workspace'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    record('Workspace exported');
  };

  const copyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      record(label);
    } catch {
      record('Clipboard unavailable');
    }
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('workspace', encodeWorkspace(workspace));
    await copyText(url.toString(), 'Share link copied');
  };

  const resetWorkspace = () => {
    const baseline = hydrateWorkspace({});
    setWorkspaceName(baseline.workspaceName);
    setContext(baseline.context);
    setFlags(baseline.flags);
    setSelectedKey(baseline.flags[0]?.key || '');
    record('Workspace reset');
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Compass-Ultra">
          <span className="brand-mark">CU</span>
          <span>
            <strong>Compass-Ultra</strong>
            <small>Feature flag control room</small>
          </span>
        </a>
        <div className="workspace-title">
          <input
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            aria-label="Workspace name"
          />
          <span>{notice}</span>
        </div>
        <div className="top-actions">
          <button type="button" onClick={() => importRef.current?.click()} title="Import JSON" aria-label="Import JSON">
            <Upload size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={exportWorkspace} title="Export workspace" aria-label="Export workspace">
            <Download size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={copyShareLink} title="Copy share link" aria-label="Copy share link">
            <Link size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={resetWorkspace} title="Reset workspace" aria-label="Reset workspace">
            <RefreshCw size={17} aria-hidden="true" />
          </button>
          <input ref={importRef} className="hidden-file" type="file" accept="application/json,.json" onChange={importWorkspace} />
        </div>
      </header>

      <section id="workspace" className="workspace-layout">
        <aside className="sidebar">
          <section className="panel">
            <div className="panel-heading">
              <UserRound size={18} aria-hidden="true" />
              <h2>Evaluation Context</h2>
            </div>
            <div className="field-grid">
              {Object.entries(context).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input value={value} onChange={(event) => updateContext(key, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <Plus size={18} aria-hidden="true" />
              <h2>Add Flag</h2>
            </div>
            <div className="field-grid">
              <label>
                key
                <input value={draft.key} onChange={(event) => setDraft((current) => ({ ...current, key: event.target.value }))} placeholder="team.flag_name" />
              </label>
              <label>
                name
                <input value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Flag name" />
              </label>
              <label>
                owner
                <input value={draft.owner} onChange={(event) => setDraft((current) => ({ ...current, owner: event.target.value }))} />
              </label>
              <label>
                type
                <select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value, defaultValue: event.target.value === 'json' ? '{}' : 'false' }))}>
                  <option value="boolean">boolean</option>
                  <option value="variant">variant</option>
                  <option value="json">json</option>
                </select>
              </label>
              <label>
                default
                <input value={draft.defaultValue} onChange={(event) => setDraft((current) => ({ ...current, defaultValue: event.target.value }))} />
              </label>
            </div>
            <button className="full-button" type="button" onClick={addFlag}>
              <Plus size={16} aria-hidden="true" />
              Add flag
            </button>
          </section>
        </aside>

        <section className="main-panel">
          <div className="summary-grid">
            <Metric icon={<ShieldCheck />} label="Enabled" value={`${enabledFlags}/${flags.length}`} />
            <Metric icon={<SlidersHorizontal />} label="Overrides" value={activeOverrides} />
            <Metric icon={<GitBranch />} label="Rule matches" value={matchedRules} />
            <Metric icon={<Gauge />} label="Provider flags" value={flags.filter((flag) => flag.source !== 'Local').length} />
          </div>

          <div className="table-panel">
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flags" />
              </div>
              <span>
                <ListFilter size={15} aria-hidden="true" />
                {visibleEvaluations.length} shown
              </span>
            </div>
            <div className="flag-table">
              {visibleEvaluations.map(({ flag, result }) => (
                <article className={`flag-row ${selectedFlag?.key === flag.key ? 'is-selected' : ''}`} key={flag.key} onClick={() => setSelectedKey(flag.key)}>
                  <div className="flag-primary">
                    <button
                      className={`switch ${flag.enabled ? 'is-on' : ''}`}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        updateFlag(flag.key, { enabled: !flag.enabled });
                        record(`${flag.name} ${flag.enabled ? 'disabled' : 'enabled'}`);
                      }}
                      aria-pressed={flag.enabled}
                    >
                      <span />
                    </button>
                    <div>
                      <h3>{flag.name}</h3>
                      <p>{flag.key}</p>
                    </div>
                  </div>
                  <span className="source-pill">{flag.source}</span>
                  <span className={`value-pill ${String(result.value) === 'true' ? 'yes' : String(result.value) === 'false' ? 'no' : ''}`}>
                    {formatValue(result.value)}
                  </span>
                  <span className="reason-pill">{result.reason}</span>
                  <button
                    className="icon-danger"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFlag(flag.key);
                    }}
                    aria-label={`Remove ${flag.name}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <aside className="inspector">
          {selectedFlag && (
            <section className="panel inspector-panel">
              <div className="panel-heading">
                <BadgeCheck size={18} aria-hidden="true" />
                <h2>Flag Inspector</h2>
              </div>
              <label>
                name
                <input value={selectedFlag.name} onChange={(event) => updateFlag(selectedFlag.key, { name: event.target.value })} />
              </label>
              <label>
                owner
                <input value={selectedFlag.owner} onChange={(event) => updateFlag(selectedFlag.key, { owner: event.target.value })} />
              </label>
              <label>
                rollout
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedFlag.rollout}
                  onChange={(event) => updateFlag(selectedFlag.key, { rollout: Number(event.target.value) })}
                />
                <span className="range-readout">{selectedFlag.rollout}%</span>
              </label>
              <label>
                override
                <select value={serializeOverride(selectedFlag.overrideValue)} onChange={(event) => setOverride(selectedFlag, deserializeOverride(event.target.value, selectedFlag))}>
                  <option value="__null__">use rules</option>
                  {overrideOptions(selectedFlag).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rule-editor">
                <h3>Target Rule</h3>
                <div className="rule-grid">
                  <select value={selectedFlag.rules?.[0]?.attribute || 'plan'} onChange={(event) => updateRule(selectedFlag, { attribute: event.target.value })}>
                    {Object.keys(context).map((key) => (
                      <option key={key}>{key}</option>
                    ))}
                  </select>
                  <select value={selectedFlag.rules?.[0]?.operator || 'equals'} onChange={(event) => updateRule(selectedFlag, { operator: event.target.value })}>
                    <option value="equals">equals</option>
                    <option value="notEquals">not equals</option>
                    <option value="contains">contains</option>
                  </select>
                  <input value={selectedFlag.rules?.[0]?.value || ''} onChange={(event) => updateRule(selectedFlag, { value: event.target.value })} />
                </div>
              </div>

              <div className="evaluation-card">
                <span>current value</span>
                <strong>{formatValue(selectedEvaluation?.value)}</strong>
                <small>{selectedEvaluation?.detail}</small>
              </div>
            </section>
          )}

          <section className="panel code-panel">
            <div className="panel-heading">
              <Braces size={18} aria-hidden="true" />
              <h2>Workspace JSON</h2>
              <button type="button" onClick={() => copyText(workspaceText, 'JSON copied')} aria-label="Copy workspace JSON">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{workspaceText}</pre>
          </section>

          <section className="panel code-panel">
            <div className="panel-heading">
              <FileJson size={18} aria-hidden="true" />
              <h2>SDK Payload</h2>
              <button type="button" onClick={() => copyText(sdkSnippet, 'SDK payload copied')} aria-label="Copy SDK payload">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{sdkSnippet}</pre>
          </section>

          <section className="panel audit-panel">
            <div className="panel-heading">
              <Activity size={18} aria-hidden="true" />
              <h2>Audit</h2>
            </div>
            {audit.map((event) => (
              <article className="audit-item" key={event.id}>
                <span>{event.time}</span>
                <strong>{event.action}</strong>
              </article>
            ))}
          </section>
        </aside>
      </section>
    </main>
  );
}

function Metric({ icon, label, value }) {
  return (
    <article className="metric">
      <span>{icon}</span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function loadWorkspace() {
  if (typeof window === 'undefined') return hydrateWorkspace({});

  const fromUrl = readWorkspaceFromUrl();
  if (fromUrl) return hydrateWorkspace(fromUrl);

  try {
    return hydrateWorkspace(JSON.parse(window.localStorage.getItem(storageKey)));
  } catch {
    return hydrateWorkspace({});
  }
}

function hydrateWorkspace(input, fallbackName = 'Production rollout workspace') {
  const importedFlags = normalizeImportedFlags(input);
  return {
    workspaceName: input?.workspaceName || input?.name || fallbackName,
    context: { ...defaultContext, ...(input?.context || {}) },
    flags: (importedFlags.length ? importedFlags : seedFlags).map(normalizeFlag),
    audit: Array.isArray(input?.audit) && input.audit.length ? input.audit : [{ id: 'boot', time: timeNow(), action: 'Workspace ready' }],
  };
}

function normalizeImportedFlags(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input.flags)) return input.flags;
  if (Array.isArray(input.items)) return input.items.map(fromLaunchDarkly);
  if (Array.isArray(input.feature_gates)) return input.feature_gates.map(fromStatsig);
  if (Array.isArray(input.gates)) return input.gates.map(fromStatsig);
  if (input.parameters && typeof input.parameters === 'object') return Object.entries(input.parameters).map(fromFirebase);
  return [];
}

function fromLaunchDarkly(item) {
  return {
    key: item.key,
    name: item.name || item.key,
    owner: item.tags?.[0] || 'LaunchDarkly',
    type: typeof item.fallthrough?.variation === 'number' ? 'variant' : 'boolean',
    enabled: item.on ?? true,
    defaultValue: Boolean(item.offVariation),
    rollout: item.fallthrough?.rollout?.variations?.[0]?.weight ? Math.round(item.fallthrough.rollout.variations[0].weight / 1000) : 100,
    source: 'LaunchDarkly',
  };
}

function fromStatsig(item) {
  return {
    key: item.name || item.id,
    name: item.description || item.name || item.id,
    owner: 'Statsig',
    type: 'boolean',
    enabled: item.isEnabled ?? item.enabled ?? true,
    defaultValue: false,
    rollout: item.rollout || 100,
    source: 'Statsig',
  };
}

function fromFirebase([key, value]) {
  const raw = value?.defaultValue?.value ?? value?.defaultValue ?? false;
  return {
    key,
    name: key,
    owner: 'Firebase',
    type: raw === 'true' || raw === 'false' ? 'boolean' : 'variant',
    enabled: true,
    defaultValue: raw === 'true' ? true : raw === 'false' ? false : raw,
    rollout: 100,
    source: 'Firebase',
  };
}

function normalizeFlag(flag) {
  const type = flag.type || inferType(flag.defaultValue);
  const normalized = {
    key: slugKey(flag.key || flag.id || flag.name),
    name: flag.name || flag.key || flag.id || 'Untitled flag',
    owner: flag.owner || 'Product',
    type,
    enabled: flag.enabled ?? true,
    defaultValue: normalizeValue(flag.defaultValue ?? false, type),
    overrideValue: flag.overrideValue === undefined ? null : normalizeValue(flag.overrideValue, type),
    rollout: clamp(Number(flag.rollout ?? flag.exposure ?? 100), 0, 100),
    rules: Array.isArray(flag.rules) ? flag.rules : [],
    variants: Array.isArray(flag.variants) ? flag.variants : undefined,
    source: flag.source || 'Imported',
  };

  if (normalized.type === 'variant' && !normalized.variants) {
    normalized.variants = uniqueValues([normalized.defaultValue, normalized.overrideValue, 'control', 'treatment'].filter((item) => item !== null));
  }

  return normalized;
}

function evaluateFlag(flag, context) {
  if (!flag.enabled) return { value: flag.defaultValue, reason: 'disabled', detail: 'Flag is disabled' };
  if (flag.overrideValue !== null) return { value: flag.overrideValue, reason: 'override', detail: 'Manual override is active' };

  const matchedRule = flag.rules?.find((rule) => matchesRule(rule, context));
  if (matchedRule) {
    return {
      value: normalizeValue(matchedRule.valueWhenMatched ?? true, flag.type),
      reason: 'rule',
      detail: `${matchedRule.attribute} ${matchedRule.operator} ${matchedRule.value}`,
    };
  }

  if (flag.type === 'boolean') {
    const bucket = hashBucket(`${context.key || context.email || 'anonymous'}:${flag.key}`);
    const value = bucket < flag.rollout;
    return { value, reason: 'rollout', detail: `bucket ${bucket} of 100` };
  }

  return { value: flag.defaultValue, reason: 'default', detail: 'Default variation' };
}

function matchesRule(rule, context) {
  const actual = String(context[rule.attribute] ?? '').toLowerCase();
  const expected = String(rule.value ?? '').toLowerCase();
  if (rule.operator === 'notEquals') return actual !== expected;
  if (rule.operator === 'contains') return actual.includes(expected);
  return actual === expected;
}

function makeSdkSnippet(workspaceName, context, flags) {
  const payload = {
    workspace: workspaceName,
    context,
    evaluations: flags.reduce((acc, flag) => {
      const result = evaluateFlag(flag, context);
      acc[flag.key] = result.value;
      return acc;
    }, {}),
  };

  return `window.__COMPASS_ULTRA__ = ${JSON.stringify(payload, null, 2)};`;
}

function overrideOptions(flag) {
  if (flag.type === 'boolean') {
    return [
      { value: 'true', label: 'true' },
      { value: 'false', label: 'false' },
    ];
  }

  if (flag.type === 'json') {
    return [
      { value: JSON.stringify(flag.defaultValue), label: 'default json' },
      { value: '{"enabled":true}', label: 'enabled json' },
    ];
  }

  return uniqueValues([...(flag.variants || []), flag.defaultValue]).map((value) => ({
    value: String(value),
    label: String(value),
  }));
}

function serializeOverride(value) {
  return value === null ? '__null__' : typeof value === 'object' ? JSON.stringify(value) : String(value);
}

function deserializeOverride(value, flag) {
  if (value === '__null__') return null;
  return normalizeValue(value, flag.type);
}

function parseTypedValue(value, type) {
  if (type === 'boolean') return value === true || String(value).toLowerCase() === 'true';
  if (type === 'json') {
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return String(value || 'control');
}

function normalizeValue(value, type) {
  if (value === null) return null;
  if (type === 'boolean') return value === true || String(value).toLowerCase() === 'true';
  if (type === 'json') {
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch {
      return {};
    }
  }
  return String(value);
}

function inferType(value) {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'object') return 'json';
  return 'variant';
}

function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function slugKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '.')
    .replace(/^\.+|\.+$/g, '');
}

function hashBucket(input) {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash) % 100;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function uniqueValues(values) {
  return [...new Set(values.map((value) => String(value)))];
}

function timeNow() {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function encodeWorkspace(workspace) {
  return btoa(JSON.stringify(workspace)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function readWorkspaceFromUrl() {
  try {
    const encoded = new URLSearchParams(window.location.search).get('workspace');
    if (!encoded) return null;
    const padded = encoded.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(encoded.length / 4) * 4, '=');
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}
