import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { jsPDF } from 'jspdf';
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  Braces,
  CheckCircle2,
  Clipboard,
  Cloud,
  CloudCog,
  Download,
  BrainCircuit,
  DollarSign,
  GitCompare,
  FileDown,
  Sparkles,
  FileJson,
  Gauge,
  GitBranch,
  KeyRound,
  Link,
  ListChecks,
  ListFilter,
  LockKeyhole,
  LogIn,
  LogOut,
  Plus,
  Share2,
  RefreshCw,
  Rocket,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserRound,
  Users,
  Webhook,
  XCircle,
} from 'lucide-react';
import { api } from './api.js';

const storageKey = 'compass-ultra-workspace-v4';

const defaultContext = {
  key: 'user_001',
  email: 'admin@yourcompany.dev',
  tenant: 'my-org',
  plan: 'enterprise',
  role: 'admin',
  region: 'us-east',
  country: 'US',
  device: 'desktop',
  environment: 'production',
};

const defaultRelease = {
  train: 'prod-2026.05',
  changeTicket: 'CHG-00001',
  incidentChannel: '#war-room',
  releaseCaptain: 'Release Captain',
  approver: 'Platform SRE',
  window: 'Tue 22:00-23:00 ET',
};

const defaultTeam = {
  workspaceId: 'prod-command',
  authMode: 'Local RBAC session',
  members: [
    { id: 'admin', name: 'Release Admin', email: 'admin@yourcompany.dev', role: 'admin' },
    { id: 'sre', name: 'Platform SRE', email: 'sre@yourcompany.dev', role: 'approver' },
    { id: 'qa', name: 'QA Release', email: 'qa@yourcompany.dev', role: 'operator' },
    { id: 'viewer', name: 'Audit Viewer', email: 'audit@yourcompany.dev', role: 'viewer' },
  ],
  activeMemberId: 'admin',
};

const defaultIntegrations = [
  { id: 'launchdarkly', name: 'LaunchDarkly', kind: 'provider', status: 'ready', endpoint: '', secretHint: 'read-only proxy endpoint', lastSync: 'sample loaded' },
  { id: 'statsig', name: 'Statsig', kind: 'provider', status: 'ready', endpoint: '', secretHint: 'server SDK proxy endpoint', lastSync: 'sample loaded' },
  { id: 'firebase', name: 'Firebase Remote Config', kind: 'provider', status: 'ready', endpoint: '', secretHint: 'template export endpoint', lastSync: 'sample loaded' },
  { id: 'github', name: 'GitHub Issues', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'repo issue proxy or GitHub app endpoint', lastSync: 'payload ready' },
  { id: 'jira', name: 'Jira Change', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'Jira automation webhook', lastSync: 'payload ready' },
  { id: 'slack', name: 'Slack War Room', kind: 'outbound', status: 'not configured', endpoint: '', secretHint: 'Slack workflow webhook', lastSync: 'payload ready' },
];

const sampleContexts = [
  { name: 'Prod admin', context: defaultContext },
  {
    name: 'EU customer',
    context: { ...defaultContext, key: 'user_8842', email: 'buyer@eu-client.test', tenant: 'eu-bank', role: 'billing_admin', region: 'eu-west', country: 'DE' },
  },
  {
    name: 'Mobile trial',
    context: { ...defaultContext, key: 'trial_701', email: 'trial@creator.test', tenant: 'trial-lab', plan: 'trial', role: 'owner', region: 'us-west', device: 'mobile', environment: 'staging' },
  },
];

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
    criticality: 'high',
    jira: 'DCG-4211',
    approver: 'Growth Lead',
    expiresAt: '2026-06-30',
    rollback: 'Set checkout.redesign off and flush edge cache.',
    canaryRequired: true,
    dependencies: ['billing.usage_v2'],
    tags: ['revenue', 'frontend'],
    rules: [{ attribute: 'plan', operator: 'equals', value: 'enterprise', valueWhenMatched: true }],
    source: 'LaunchDarkly',
  },
  {
    key: 'billing.usage_v2',
    name: 'Usage billing v2',
    owner: 'Billing',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 18,
    criticality: 'critical',
    jira: 'DCG-4209',
    approver: 'Finance Ops',
    expiresAt: '2026-07-15',
    rollback: 'Disable usage billing and replay invoices from billing.v1.',
    canaryRequired: true,
    dependencies: [],
    tags: ['billing', 'sox'],
    rules: [{ attribute: 'country', operator: 'notEquals', value: 'DE', valueWhenMatched: true }],
    source: 'Statsig',
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
    criticality: 'medium',
    jira: 'DCG-4180',
    approver: 'Support Ops',
    expiresAt: '2026-08-01',
    rollback: 'Force variant to control.',
    canaryRequired: false,
    dependencies: [],
    tags: ['ai', 'support'],
    variants: ['control', 'concise', 'detailed', 'redacted'],
    rules: [{ attribute: 'plan', operator: 'equals', value: 'enterprise', valueWhenMatched: 'redacted' }],
    source: 'Firebase',
  },
  {
    key: 'audit.realtime',
    name: 'Realtime audit log',
    owner: 'Platform',
    type: 'json',
    enabled: true,
    defaultValue: { stream: false, retentionDays: 30, piiMode: 'hash' },
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'DCG-4174',
    approver: 'Security',
    expiresAt: '2026-12-31',
    rollback: 'Set stream false and keep retention at 30 days.',
    canaryRequired: false,
    dependencies: [],
    tags: ['audit', 'security'],
    rules: [{ attribute: 'environment', operator: 'equals', value: 'production', valueWhenMatched: { stream: true, retentionDays: 90, piiMode: 'hash' } }],
    source: 'LaunchDarkly',
  },
  {
    key: 'risk.step_up_auth',
    name: 'Risk step-up auth',
    owner: 'Identity',
    type: 'boolean',
    enabled: true,
    defaultValue: true,
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'DCG-4160',
    approver: 'Security',
    expiresAt: '2026-09-01',
    rollback: 'Keep enabled. Roll back only with Security approval.',
    canaryRequired: false,
    dependencies: ['audit.realtime'],
    tags: ['identity', 'security'],
    rules: [{ attribute: 'role', operator: 'contains', value: 'admin', valueWhenMatched: true }],
    source: 'Generic JSON',
  },
  {
    key: 'ops.kill_switch',
    name: 'Global kill switch',
    owner: 'SRE',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 0,
    criticality: 'critical',
    jira: 'DCG-4000',
    approver: 'Release Captain',
    expiresAt: '2026-12-31',
    rollback: 'Turn on to force legacy paths and pause async workers.',
    canaryRequired: false,
    dependencies: [],
    tags: ['sre', 'rollback'],
    rules: [],
    source: 'Local',
  },
  {
    key: 'mobile.fast_lane',
    name: 'Mobile fast lane',
    owner: 'Mobile',
    type: 'boolean',
    enabled: true,
    defaultValue: false,
    overrideValue: null,
    rollout: 45,
    criticality: 'medium',
    jira: 'DCG-4152',
    approver: 'Mobile Lead',
    expiresAt: '2026-07-01',
    rollback: 'Disable mobile fast lane.',
    canaryRequired: true,
    dependencies: [],
    tags: ['mobile'],
    rules: [{ attribute: 'device', operator: 'equals', value: 'mobile', valueWhenMatched: true }],
    source: 'Firebase',
  },
  {
    key: 'data.residency_guard',
    name: 'EU residency guard',
    owner: 'Data Platform',
    type: 'json',
    enabled: true,
    defaultValue: { route: 'global', encrypt: true },
    overrideValue: null,
    rollout: 100,
    criticality: 'critical',
    jira: 'DCG-4191',
    approver: 'Privacy',
    expiresAt: '2026-12-31',
    rollback: 'Route all EU traffic to legacy eu-west pipeline.',
    canaryRequired: false,
    dependencies: ['audit.realtime'],
    tags: ['privacy', 'eu'],
    rules: [{ attribute: 'region', operator: 'contains', value: 'eu', valueWhenMatched: { route: 'eu-west', encrypt: true } }],
    source: 'LaunchDarkly',
  },
];

const samplePacks = {
  dcg: {
    label: 'Enterprise Sample',
    workspaceName: 'Production command center',
    flags: seedFlags,
  },
  launchdarkly: {
    label: 'LaunchDarkly import',
    workspaceName: 'LaunchDarkly production mirror',
    payload: {
      items: [
        { key: 'ld.checkout.holdback', name: 'Checkout holdback', on: true, tags: ['Growth'], fallthrough: { rollout: { variations: [{ weight: 25000 }] } } },
        { key: 'ld.search.pipeline', name: 'Search pipeline v4', on: true, tags: ['Search'], fallthrough: { rollout: { variations: [{ weight: 50000 }] } } },
        { key: 'ld.eu.privacy_banner', name: 'EU privacy banner', on: true, tags: ['Privacy'], fallthrough: { rollout: { variations: [{ weight: 100000 }] } } },
      ],
    },
  },
  statsig: {
    label: 'Statsig gates',
    workspaceName: 'Statsig experiment gate review',
    payload: {
      feature_gates: [
        { name: 'statsig_ai_triage', description: 'AI triage queue', isEnabled: true, rollout: 30 },
        { name: 'statsig_enterprise_sso', description: 'Enterprise SSO hardening', isEnabled: true, rollout: 100 },
        { name: 'statsig_invoice_pdf_v2', description: 'Invoice PDF v2', isEnabled: false, rollout: 5 },
      ],
    },
  },
  firebase: {
    label: 'Firebase config',
    workspaceName: 'Firebase mobile config review',
    payload: {
      parameters: {
        firebase_mobile_paywall: { defaultValue: { value: 'variant_b' } },
        firebase_review_prompt: { defaultValue: { value: 'true' } },
        firebase_cache_ttl: { defaultValue: { value: '900' } },
      },
    },
  },
};

const emptyDraft = {
  key: '',
  name: '',
  owner: 'Product',
  type: 'boolean',
  defaultValue: 'false',
};

export default function App() {
  const { isAuthenticated, loginWithRedirect, logout, getAccessTokenSilently, user } = useAuth0();
  const [cloudSnapshots, setCloudSnapshots] = useState([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudNotice, setCloudNotice] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [diffA, setDiffA] = useState(null);
  const [diffB, setDiffB] = useState(null);
  const [showDiff, setShowDiff] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  const importRef = useRef(null);
  const initial = useMemo(loadWorkspace, []);
  const [workspaceName, setWorkspaceName] = useState(initial.workspaceName);
  const [context, setContext] = useState(initial.context);
  const [release, setRelease] = useState(initial.release);
  const [team, setTeam] = useState(initial.team);
  const [integrations, setIntegrations] = useState(initial.integrations);
  const [flags, setFlags] = useState(initial.flags);
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState(initial.flags[0]?.key || '');
  const [draft, setDraft] = useState(emptyDraft);
  const [notice, setNotice] = useState('Saved locally');
  const [audit, setAudit] = useState(initial.audit);
  const selectedFlag = flags.find((flag) => flag.key === selectedKey) || flags[0];
  const activeMember = team.members.find((member) => member.id === team.activeMemberId) || team.members[0];
  const canEdit = ['admin', 'operator'].includes(activeMember?.role);
  const canAdmin = activeMember?.role === 'admin';

  const evaluations = useMemo(
    () =>
      flags.map((flag) => ({
        flag,
        result: evaluateFlag(flag, context),
      })),
    [context, flags]
  );

  const policyChecks = useMemo(() => makePolicyChecks(flags, evaluations, context, release, integrations), [context, evaluations, flags, integrations, release]);
  const releaseState = getReleaseState(policyChecks);

  const visibleEvaluations = evaluations.filter(({ flag }) => {
    const text = `${flag.key} ${flag.name} ${flag.owner} ${flag.source} ${flag.criticality} ${flag.jira} ${flag.tags?.join(' ')}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  });

  const activeOverrides = flags.filter((flag) => flag.overrideValue !== null).length;
  const enabledFlags = flags.filter((flag) => flag.enabled).length;
  const matchedRules = evaluations.filter(({ result }) => result.reason === 'rule').length;
  const criticalActive = evaluations.filter(({ flag, result }) => flag.criticality === 'critical' && Boolean(result.value)).length;

  const workspace = useMemo(
    () => ({
      product: 'Compass-Ultra',
      version: 4,
      workspaceName,
      release,
      team,
      integrations,
      context,
      flags,
      exportedAt: new Date().toISOString(),
    }),
    [context, flags, integrations, release, team, workspaceName]
  );

  const workspaceText = JSON.stringify(workspace, null, 2);
  const selectedEvaluation = selectedFlag ? evaluateFlag(selectedFlag, context) : null;
  const sdkSnippet = selectedFlag ? makeSdkSnippet(workspaceName, context, flags) : '';
  const runbook = makeRunbook(workspaceName, release, context, evaluations, policyChecks);
  const integrationPayloads = useMemo(
    () => makeIntegrationPayloads(workspaceName, release, context, evaluations, policyChecks, runbook),
    [context, evaluations, policyChecks, release, runbook, workspaceName]
  );

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ workspaceName, release, team, integrations, context, flags, audit }));
  }, [audit, context, flags, integrations, release, team, workspaceName]);

  const record = (action, detail = '', level = 'info') => {
    setAudit((current) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: timeNow(),
        actor: activeMember?.name || 'System',
        role: activeMember?.role || 'system',
        level,
        action,
        detail,
      },
      ...current,
    ].slice(0, 60));
    setNotice(action);
  };

  const updateContext = (field, value) => {
    setContext((current) => ({ ...current, [field]: value }));
    record(`Context ${field} changed`);
  };

  const updateRelease = (field, value) => {
    if (!canEdit) {
      record('Release edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setRelease((current) => ({ ...current, [field]: value }));
    record(`Release ${field} changed`);
  };

  const updateFlag = (key, patch) => {
    if (!canEdit) {
      record('Flag edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setFlags((current) =>
      current.map((flag) => (flag.key === key ? normalizeFlag({ ...flag, ...patch }) : flag))
    );
  };

  const setOverride = (flag, value) => {
    updateFlag(flag.key, { overrideValue: value });
    record(`${flag.name} override ${value === null ? 'cleared' : 'set'}`);
  };

  const addFlag = () => {
    if (!canEdit) {
      record('Add flag blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

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
      rollout: 100,
      criticality: 'medium',
      jira: release.changeTicket,
      approver: release.approver,
      expiresAt: '2026-12-31',
      rollback: `Disable ${key}.`,
      canaryRequired: false,
      dependencies: [],
      tags: ['local'],
      rules: [],
      source: 'Local',
    });

    setFlags((current) => [nextFlag, ...current]);
    setSelectedKey(nextFlag.key);
    setDraft(emptyDraft);
    record(`${nextFlag.name} added`);
  };

  const removeFlag = (key) => {
    if (!canEdit) {
      record('Remove flag blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    const target = flags.find((flag) => flag.key === key);
    setFlags((current) => current.filter((flag) => flag.key !== key));
    if (selectedKey === key) setSelectedKey(flags.find((flag) => flag.key !== key)?.key || '');
    record(`${target?.name || key} removed`);
  };

  const updateRule = (flag, patch) => {
    const rule = { attribute: 'plan', operator: 'equals', value: '', valueWhenMatched: defaultRuleValue(flag), ...(flag.rules?.[0] || {}), ...patch };
    updateFlag(flag.key, { rules: [rule] });
    record(`${flag.name} rule updated`);
  };

  const applySamplePack = (packKey) => {
    const pack = samplePacks[packKey];
    if (!pack) return;
    const hydrated = hydrateWorkspace({
      workspaceName: pack.workspaceName,
      release: defaultRelease,
      context: defaultContext,
      flags: pack.flags,
      ...pack.payload,
    });
    setWorkspaceName(hydrated.workspaceName);
    setRelease(hydrated.release);
    setContext(hydrated.context);
    setFlags(hydrated.flags);
    setSelectedKey(hydrated.flags[0]?.key || '');
    record(`${pack.label} loaded`);
  };

  const applySampleContext = (nextContext) => {
    setContext(nextContext);
    record('Sample context loaded');
  };

  const updateTeamMember = (id, patch) => {
    if (!canAdmin) {
      record('Team edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setTeam((current) => ({
      ...current,
      members: current.members.map((member) => (member.id === id ? { ...member, ...patch } : member)),
    }));
    record('Team member updated', id);
  };

  const updateIntegration = (id, patch) => {
    if (!canAdmin) {
      record('Integration edit blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }
    setIntegrations((current) =>
      current.map((integration) => (integration.id === id ? { ...integration, ...patch } : integration))
    );
  };

  const syncProvider = async (integration) => {
    if (!canEdit) {
      record('Provider sync blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    if (!integration.endpoint) {
      record(`${integration.name} needs endpoint`, 'Configure a read-only proxy/export URL first', 'warn');
      return;
    }

    setIntegrations((current) =>
      current.map((item) => (item.id === integration.id ? { ...item, status: 'syncing' } : item))
    );
    try {
      const response = await fetch(integration.endpoint, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const hydrated = hydrateWorkspace({ flags: normalizeImportedFlags(payload), context, release });
      setFlags(hydrated.flags);
      setSelectedKey(hydrated.flags[0]?.key || '');
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'connected', lastSync: new Date().toLocaleString() } : item
        )
      );
      record(`${integration.name} synced`, `${hydrated.flags.length} flags imported`);
    } catch (error) {
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'error', lastSync: error.message } : item
        )
      );
      record(`${integration.name} sync failed`, error.message, 'warn');
    }
  };

  const sendIntegrationPayload = async (integration) => {
    const payload = integrationPayloads[integration.id] || integrationPayloads.generic;
    const text = JSON.stringify(payload, null, 2);

    if (!integration.endpoint) {
      await copyText(text, `${integration.name} payload copied`);
      return;
    }

    if (!canEdit) {
      record('Outbound send blocked', `${activeMember?.name} is ${activeMember?.role}`, 'warn');
      return;
    }

    setIntegrations((current) =>
      current.map((item) => (item.id === integration.id ? { ...item, status: 'posting' } : item))
    );
    try {
      const response = await fetch(integration.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: text,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'posted', lastSync: new Date().toLocaleString() } : item
        )
      );
      record(`${integration.name} payload posted`, release.changeTicket);
    } catch (error) {
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integration.id ? { ...item, status: 'error', lastSync: error.message } : item
        )
      );
      record(`${integration.name} post failed`, error.message, 'warn');
    }
  };

  const importWorkspace = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = JSON.parse(await file.text());
      const hydrated = hydrateWorkspace(imported, file.name);
      setWorkspaceName(hydrated.workspaceName);
      setRelease(hydrated.release);
      setTeam(hydrated.team);
      setIntegrations(hydrated.integrations);
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

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const margin = 48;
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin * 2;
    let y = margin;

    const addPage = () => { doc.addPage(); y = margin; };
    const checkY = (needed = 20) => { if (y + needed > doc.internal.pageSize.getHeight() - margin) addPage(); };

    // Header bar
    doc.setFillColor(7, 9, 14);
    doc.rect(0, 0, pageW, 56, 'F');
    doc.setTextColor(255, 184, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('COMPASS-ULTRA', margin, 36);
    doc.setFontSize(9);
    doc.setTextColor(139, 148, 158);
    doc.setFont('helvetica', 'normal');
    doc.text(`Release Runbook  ·  ${new Date().toLocaleString()}`, margin, 50);
    y = 80;

    // Title
    doc.setTextColor(230, 237, 243);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(22, 27, 34);
    doc.rect(margin - 8, y - 14, maxW + 16, 24, 'F');
    doc.text(workspaceName, margin, y);
    y += 32;

    // Release metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const meta = [
      ['Change Ticket', release.changeTicket],
      ['Release Train', release.train],
      ['Release Captain', release.releaseCaptain],
      ['Approver', release.approver],
      ['Window', release.window],
      ['Incident Channel', release.incidentChannel],
    ];
    meta.forEach(([label, value]) => {
      checkY(16);
      doc.setTextColor(139, 148, 158);
      doc.text(`${label}:`, margin, y);
      doc.setTextColor(230, 237, 243);
      doc.text(String(value), margin + 110, y);
      y += 16;
    });
    y += 12;

    // Gate status
    checkY(28);
    const blocked = policyChecks.filter(c => c.status === 'block').length;
    const warnings = policyChecks.filter(c => c.status === 'warn').length;
    const gateColor = blocked ? [248, 81, 73] : warnings ? [240, 136, 62] : [63, 185, 80];
    const gateLabel = blocked ? 'BLOCKED' : warnings ? 'NEEDS REVIEW' : 'READY TO SHIP';
    doc.setFillColor(...gateColor);
    doc.roundedRect(margin - 8, y - 14, maxW + 16, 22, 3, 3, 'F');
    doc.setTextColor(7, 9, 14);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`GATE STATUS: ${gateLabel}`, margin, y);
    y += 30;

    // Policy checks
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ENTERPRISE POLICY CHECKS', margin, y);
    y += 16;
    policyChecks.forEach(check => {
      checkY(18);
      const color = check.status === 'pass' ? [63, 185, 80] : check.status === 'warn' ? [240, 136, 62] : [248, 81, 73];
      doc.setFillColor(...color);
      doc.circle(margin + 4, y - 4, 4, 'F');
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(check.title, margin + 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      const lines = doc.splitTextToSize(check.detail, maxW - 14);
      lines.forEach(line => { checkY(13); doc.text(line, margin + 14, y += 13); });
      y += 6;
    });
    y += 8;

    // Active flags
    checkY(28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ACTIVE FLAG EVALUATIONS', margin, y);
    y += 16;
    evaluations.filter(({ result }) => Boolean(result.value)).forEach(({ flag, result }) => {
      checkY(36);
      doc.setFillColor(22, 27, 34);
      doc.rect(margin - 8, y - 14, maxW + 16, 32, 'F');
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(flag.name, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      doc.text(`${flag.key}  ·  owner: ${flag.owner}  ·  ticket: ${flag.jira}  ·  criticality: ${flag.criticality}  ·  reason: ${result.reason}`, margin, y + 13);
      y += 38;
    });
    y += 8;

    // Rollback steps
    checkY(28);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 184, 0);
    doc.text('ROLLBACK PROCEDURES', margin, y);
    y += 16;
    flags.filter(f => f.enabled).forEach(flag => {
      checkY(28);
      doc.setTextColor(230, 237, 243);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(flag.key, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(139, 148, 158);
      const lines = doc.splitTextToSize(flag.rollback, maxW - 14);
      lines.forEach(line => { checkY(13); doc.text(line, margin + 14, y += 13); });
      y += 6;
    });

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFillColor(7, 9, 14);
      doc.rect(0, doc.internal.pageSize.getHeight() - 28, pageW, 28, 'F');
      doc.setFontSize(8);
      doc.setTextColor(61, 68, 81);
      doc.text(`Compass-Ultra  ·  ${workspaceName}  ·  Page ${i} of ${pages}`, margin, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save(`${slugKey(workspaceName) || 'compass-runbook'}-${Date.now()}.pdf`);
    record('PDF runbook exported');
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
    setRelease(baseline.release);
    setTeam(baseline.team);
    setIntegrations(baseline.integrations);
    setContext(baseline.context);
    setFlags([]);
    setSelectedKey('');
    record('Workspace reset');
  };

  const loadDemo = () => {
    const demo = hydrateWorkspace({ flags: seedFlags, workspaceName: 'Acme Corp — Production Release' });
    setWorkspaceName(demo.workspaceName);
    setRelease({ ...defaultRelease, changeTicket: 'CHG-24051', train: 'prod-2026.05', releaseCaptain: 'Demo User' });
    setTeam(demo.team);
    setIntegrations(demo.integrations);
    setContext(demo.context);
    setFlags(demo.flags);
    setSelectedKey(demo.flags[0]?.key || '');
    record('Demo workspace loaded');
  };

  const loadCloudSnapshots = async () => {
    if (!isAuthenticated) return;
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const snaps = await api.listSnapshots(token);
      setCloudSnapshots(snaps);
    } catch (e) {
      setCloudNotice('Failed to load cloud snapshots');
    } finally {
      setCloudLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) loadCloudSnapshots();
  }, [isAuthenticated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const snapId = params.get('snapshot');
    if (!snapId) return;
    api.getSnapshot(snapId).then((snap) => {
      restoreFromCloud(snap);
      window.history.replaceState({}, '', window.location.pathname);
    }).catch(() => {});
  }, []);

  const saveToCloud = async () => {
    if (!isAuthenticated) { loginWithRedirect(); return; }
    const name = window.prompt('Name this snapshot:', workspaceName);
    if (!name) return;
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      await api.saveSnapshot(token, name, '', workspace);
      setCloudNotice('Saved to cloud!');
      await loadCloudSnapshots();
    } catch (e) {
      setCloudNotice('Cloud save failed');
    } finally {
      setCloudLoading(false);
    }
  };

  const restoreFromCloud = (snap) => {
    const hydrated = hydrateWorkspace(snap.snapshot_data);
    setWorkspaceName(hydrated.workspaceName);
    setRelease(hydrated.release);
    setTeam(hydrated.team);
    setIntegrations(hydrated.integrations);
    setContext(hydrated.context);
    setFlags(hydrated.flags);
    setSelectedKey(hydrated.flags[0]?.key || '');
    record(`Restored cloud snapshot: ${snap.name}`);
  };

  const deleteCloudSnapshot = async (id) => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      await api.deleteSnapshot(token, id);
      await loadCloudSnapshots();
      setCloudNotice('Snapshot deleted');
    } catch (e) {
      setCloudNotice('Delete failed');
    }
  };

  const runAiAnalysis = async () => {
    if (!isAuthenticated) { loginWithRedirect(); return; }
    setAiLoading(true);
    setAiAnalysis('');
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const { analysis } = await api.analyzeFlags(token, { flags, context, release, policyChecks });
      setAiAnalysis(analysis);
      record('AI risk analysis complete');
    } catch (e) {
      if (e.error === 'login_required' || e.error === 'consent_required') {
        loginWithRedirect();
        return;
      }
      setAiAnalysis('Analysis failed — check your connection and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const shareCloudSnapshot = async (id) => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently({ authorizationParams: { audience: import.meta.env.VITE_AUTH0_AUDIENCE } });
      const { shareUrl } = await api.shareSnapshot(token, id);
      await navigator.clipboard.writeText(shareUrl);
      setCloudNotice('Share link copied to clipboard!');
    } catch (e) {
      setCloudNotice('Share failed');
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#workspace" aria-label="Compass-Ultra">
          <span className="brand-mark">CU</span>
          <span>
            <strong>Compass Ultra</strong>
            <small>Release Intelligence Platform</small>
          </span>
        </a>
        <div className="workspace-title">
          <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} aria-label="Workspace name" />
          <span>{notice}</span>
        </div>
        <div className="release-badge" data-state={releaseState.state}>
          {releaseState.icon}
          <strong>{releaseState.label}</strong>
          <span>{releaseState.score}% ready</span>
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
          <button type="button" onClick={() => setShowPricing(true)} title="Pricing" aria-label="Pricing" style={{ color: '#ffb800' }}>
            <DollarSign size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => setShowDiff(v => !v)} title="Snapshot diff viewer" aria-label="Snapshot diff viewer" style={{ color: showDiff ? '#58a6ff' : '#8b949e' }}>
            <GitCompare size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={runAiAnalysis} title="AI risk analysis" aria-label="AI risk analysis" style={{ color: aiLoading ? '#ffb800' : '#bc8cff' }}>
            <BrainCircuit size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={exportPDF} title="Export PDF runbook" aria-label="Export PDF runbook">
            <FileDown size={17} aria-hidden="true" />
          </button>
          <button type="button" onClick={saveToCloud} title={isAuthenticated ? 'Save to cloud' : 'Login to save to cloud'} aria-label="Save to cloud" style={{ color: isAuthenticated ? '#3fb950' : '#8b949e' }}>
            <Cloud size={17} aria-hidden="true" />
          </button>
          {isAuthenticated ? (
            <button type="button" onClick={() => logout({ logoutParams: { returnTo: window.location.href } })} title={`Logout ${user?.email}`} aria-label="Logout">
              <LogOut size={17} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={() => loginWithRedirect()} title="Login" aria-label="Login">
              <LogIn size={17} aria-hidden="true" />
            </button>
          )}
          <input ref={importRef} className="hidden-file" type="file" accept="application/json,.json" onChange={importWorkspace} />
        </div>
      </header>

      <section id="workspace" className="workspace-layout">
        <WorkspaceGuide />

        <aside className="sidebar">
          <section className="panel">
            <div className="panel-heading">
              <Rocket size={18} aria-hidden="true" />
              <h2>Release Control</h2>
            </div>
            <div className="field-grid">
              {Object.entries(release).map(([key, value]) => (
                <label key={key}>
                  {key}
                  <input value={value} onChange={(event) => updateRelease(key, event.target.value)} />
                </label>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <Users size={18} aria-hidden="true" />
              <h2>Team Auth</h2>
            </div>
            <label>
              active actor
              <select value={team.activeMemberId} onChange={(event) => setTeam((current) => ({ ...current, activeMemberId: event.target.value }))}>
                {team.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.role}
                  </option>
                ))}
              </select>
            </label>
            <div className="auth-card">
              <KeyRound size={17} aria-hidden="true" />
              <div>
                <strong>{team.authMode}</strong>
                <span>{canEdit ? 'Write controls enabled for this role' : 'Read-only role active'}</span>
              </div>
            </div>
            <div className="team-list">
              {team.members.map((member) => (
                <article className="team-member" key={member.id}>
                  <div>
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>
                  <select value={member.role} disabled={!canAdmin} onChange={(event) => updateTeamMember(member.id, { role: event.target.value })}>
                    <option value="admin">admin</option>
                    <option value="approver">approver</option>
                    <option value="operator">operator</option>
                    <option value="viewer">viewer</option>
                  </select>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <CloudCog size={18} aria-hidden="true" />
              <h2>Sample Packs</h2>
            </div>
            <div className="sample-grid">
              {Object.entries(samplePacks).map(([key, pack]) => (
                <button type="button" key={key} onClick={() => applySamplePack(key)}>
                  <strong>{pack.label}</strong>
                  <span>{pack.workspaceName}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <UserRound size={18} aria-hidden="true" />
              <h2>Evaluation Context</h2>
            </div>
            <div className="context-pills">
              {sampleContexts.map((item) => (
                <button type="button" key={item.name} onClick={() => applySampleContext(item.context)}>
                  {item.name}
                </button>
              ))}
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
            <Metric icon={<LockKeyhole />} label="Critical active" value={criticalActive} />
            <Metric icon={<Gauge />} label="Provider flags" value={flags.filter((flag) => flag.source !== 'Local').length} />
            <Metric icon={<Webhook />} label="Connected" value={integrations.filter((item) => item.endpoint).length} />
          </div>

          <section className="release-board">
            <div className="board-column">
              <span>Dev</span>
              <strong>{flags.length}</strong>
              <small>editable flags</small>
            </div>
            <div className="board-column">
              <span>QA</span>
              <strong>{policyChecks.filter((check) => check.status !== 'block').length}/{policyChecks.length}</strong>
              <small>checks passable</small>
            </div>
            <div className="board-column">
              <span>Stage</span>
              <strong>{evaluations.filter(({ result }) => result.reason === 'rollout').length}</strong>
              <small>rollout evaluated</small>
            </div>
            <div className={`board-column ${releaseState.state}`}>
              <span>Prod Gate</span>
              <strong>{releaseState.label}</strong>
              <small>{release.changeTicket}</small>
            </div>
          </section>

          <section className="table-panel">
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search flags, owners, tickets, tags" />
              </div>
              <span>
                <ListFilter size={15} aria-hidden="true" />
                {visibleEvaluations.length} shown
              </span>
            </div>
            <div className="flag-table">
              {flags.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', gap: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 48 }}>🧭</div>
                  <div>
                    <h3 style={{ color: '#e6edf3', margin: '0 0 8px', fontSize: 16 }}>No flags loaded yet</h3>
                    <p style={{ color: '#8b949e', fontSize: 13, margin: '0 0 24px', maxWidth: 360 }}>
                      Load the demo to see Compass Ultra in action, or import your own flags from LaunchDarkly, Statsig, Firebase, or any JSON export.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button type="button" onClick={loadDemo} style={{ background: '#ffb800', color: '#07090e', border: 'none', borderRadius: 6, padding: '10px 20px', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Sparkles size={15} />
                      Try the Demo
                    </button>
                    <button type="button" onClick={() => importRef.current?.click()} style={{ background: 'none', color: '#e6edf3', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 6, padding: '10px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Upload size={15} />
                      Import Flags
                    </button>
                  </div>
                </div>
              )}
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
                  <span className={`criticality ${flag.criticality}`}>{flag.criticality}</span>
                  <span className="source-pill">{flag.source}</span>
                  <span className={`value-pill ${String(result.value) === 'true' ? 'yes' : String(result.value) === 'false' ? 'no' : ''}`}>
                    {formatValue(result.value)}
                  </span>
                  <span className="reason-pill">{result.reason}</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      copyText(flag.key, `${flag.key} copied`);
                    }}
                    aria-label={`Copy ${flag.key}`}
                    title="Copy flag key"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3d4451', padding: '0 4px' }}
                  >
                    <Clipboard size={13} aria-hidden="true" />
                  </button>
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
          </section>

          <section className="policy-panel">
            <div className="panel-heading">
              <ListChecks size={18} aria-hidden="true" />
              <h2>Enterprise Policy Checks</h2>
            </div>
            <div className="policy-list">
              {policyChecks.map((check) => (
                <article className={`policy-item ${check.status}`} key={check.id}>
                  {check.status === 'pass' ? <CheckCircle2 size={18} /> : check.status === 'warn' ? <AlertTriangle size={18} /> : <XCircle size={18} />}
                  <div>
                    <strong>{check.title}</strong>
                    <p>{check.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="policy-panel">
            <div className="panel-heading">
              <Webhook size={18} aria-hidden="true" />
              <h2>Live Integrations</h2>
            </div>
            <div className="integration-console">
              {integrations.map((integration) => (
                <article className="integration-row" key={integration.id}>
                  <div>
                    <strong>{integration.name}</strong>
                    <span>{integration.kind === 'provider' ? 'Read provider JSON through a secure proxy/export URL' : 'Copy or post the generated release payload'}</span>
                  </div>
                  <label>
                    endpoint
                    <input
                      value={integration.endpoint}
                      disabled={!canAdmin}
                      onChange={(event) => updateIntegration(integration.id, { endpoint: event.target.value, status: event.target.value ? 'configured' : 'not configured' })}
                      placeholder={integration.secretHint}
                    />
                  </label>
                  <span className={`connector-status ${slugKey(integration.status)}`}>{integration.status}</span>
                  <small>{integration.lastSync}</small>
                  <div className="connector-actions">
                    {integration.kind === 'provider' ? (
                      <button type="button" onClick={() => syncProvider(integration)}>
                        <RefreshCw size={15} aria-hidden="true" />
                        Pull
                      </button>
                    ) : (
                      <button type="button" onClick={() => sendIntegrationPayload(integration)}>
                        <Send size={15} aria-hidden="true" />
                        Send
                      </button>
                    )}
                    <button type="button" onClick={() => copyText(JSON.stringify(integrationPayloads[integration.id] || integrationPayloads.generic, null, 2), `${integration.name} payload copied`)}>
                      <Clipboard size={15} aria-hidden="true" />
                      Copy
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="inspector">
          {selectedFlag && (
            <section className="panel inspector-panel">
              <div className="panel-heading">
                <BadgeCheck size={18} aria-hidden="true" />
                <h2>Flag Inspector</h2>
                {selectedFlag && (
                  <button type="button" onClick={() => copyText(selectedFlag.key, `${selectedFlag.key} copied`)} title="Copy flag key" aria-label="Copy flag key">
                    <Clipboard size={15} aria-hidden="true" />
                  </button>
                )}
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
                jira/change
                <input value={selectedFlag.jira} onChange={(event) => updateFlag(selectedFlag.key, { jira: event.target.value })} />
              </label>
              <label>
                approver
                <input value={selectedFlag.approver} onChange={(event) => updateFlag(selectedFlag.key, { approver: event.target.value })} />
              </label>
              <label>
                criticality
                <select value={selectedFlag.criticality} onChange={(event) => updateFlag(selectedFlag.key, { criticality: event.target.value })}>
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                  <option value="critical">critical</option>
                </select>
              </label>
              <label>
                expires
                <input value={selectedFlag.expiresAt} onChange={(event) => updateFlag(selectedFlag.key, { expiresAt: event.target.value })} />
              </label>
              <label>
                rollout
                <input type="range" min="0" max="100" value={selectedFlag.rollout} onChange={(event) => updateFlag(selectedFlag.key, { rollout: Number(event.target.value) })} />
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

              <label>
                rollback
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input value={selectedFlag.rollback} onChange={(event) => updateFlag(selectedFlag.key, { rollback: event.target.value })} style={{ flex: 1 }} />
                  <button type="button" onClick={() => copyText(selectedFlag.rollback, 'Rollback copied!')} title="Copy rollback" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e', padding: 0, flexShrink: 0 }}>
                    <Clipboard size={13} />
                  </button>
                </div>
              </label>

              <div className="evaluation-card">
                <span>current value</span>
                <strong>{formatValue(selectedEvaluation?.value)}</strong>
                <small>{selectedEvaluation?.detail}</small>
              </div>
            </section>
          )}

          <section className="panel code-panel">
            <div className="panel-heading">
              <BookOpenCheck size={18} aria-hidden="true" />
              <h2>Release Runbook</h2>
              <button type="button" onClick={() => copyText(runbook, 'Runbook copied')} aria-label="Copy release runbook">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            <pre>{runbook}</pre>
          </section>

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

          {showDiff && (
            <section className="panel code-panel">
              <div className="panel-heading">
                <GitCompare size={18} aria-hidden="true" />
                <h2>Snapshot Diff</h2>
                <button type="button" onClick={() => setShowDiff(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e' }}>✕</button>
              </div>
              {cloudSnapshots.length < 2 ? (
                <p style={{ fontSize: 11, color: '#8b949e' }}>Save at least 2 cloud snapshots to compare them.</p>
              ) : (
                <>
                  <label style={{ fontSize: 10, color: '#8b949e', display: 'block', marginBottom: 6 }}>
                    Snapshot A (before)
                    <select style={{ width: '100%', background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', color: '#e6edf3', padding: '4px 6px', borderRadius: 4, marginTop: 4, fontSize: 10 }}
                      value={diffA?.id || ''} onChange={e => setDiffA(cloudSnapshots.find(s => s.id === e.target.value) || null)}>
                      <option value=''>Select snapshot…</option>
                      {cloudSnapshots.map(s => <option key={s.id} value={s.id}>{s.name} — {new Date(s.created_at).toLocaleString()}</option>)}
                    </select>
                  </label>
                  <label style={{ fontSize: 10, color: '#8b949e', display: 'block', marginBottom: 10 }}>
                    Snapshot B (after)
                    <select style={{ width: '100%', background: '#161b22', border: '1px solid rgba(255,255,255,0.07)', color: '#e6edf3', padding: '4px 6px', borderRadius: 4, marginTop: 4, fontSize: 10 }}
                      value={diffB?.id || ''} onChange={e => setDiffB(cloudSnapshots.find(s => s.id === e.target.value) || null)}>
                      <option value=''>Select snapshot…</option>
                      {cloudSnapshots.map(s => <option key={s.id} value={s.id}>{s.name} — {new Date(s.created_at).toLocaleString()}</option>)}
                    </select>
                  </label>
                  {diffA && diffB && (() => {
                    const aFlags = diffA.snapshot_data?.flags || [];
                    const bFlags = diffB.snapshot_data?.flags || [];
                    const allKeys = [...new Set([...aFlags.map(f => f.key), ...bFlags.map(f => f.key)])];
                    const diffs = allKeys.map(key => {
                      const a = aFlags.find(f => f.key === key);
                      const b = bFlags.find(f => f.key === key);
                      if (!a) return { key, type: 'added', b };
                      if (!b) return { key, type: 'removed', a };
                      const changes = [];
                      ['enabled','rollout','criticality','overrideValue','expiresAt','owner','approver'].forEach(field => {
                        if (JSON.stringify(a[field]) !== JSON.stringify(b[field])) {
                          changes.push({ field, from: a[field], to: b[field] });
                        }
                      });
                      return changes.length ? { key, type: 'changed', changes } : null;
                    }).filter(Boolean);

                    if (diffs.length === 0) return <p style={{ fontSize: 11, color: '#3fb950' }}>✓ No differences found between these snapshots.</p>;

                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontSize: 10, color: '#8b949e', marginBottom: 4 }}>{diffs.length} difference{diffs.length !== 1 ? 's' : ''} found</p>
                        {diffs.map(diff => (
                          <div key={diff.key} style={{ background: '#161b22', border: `1px solid ${diff.type === 'added' ? '#3fb950' : diff.type === 'removed' ? '#f85149' : '#ffb800'}`, borderRadius: 4, padding: '8px 10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <strong style={{ fontSize: 10, color: '#e6edf3' }}>{diff.key}</strong>
                              <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: diff.type === 'added' ? '#3fb950' : diff.type === 'removed' ? '#f85149' : '#ffb800', color: '#07090e', fontWeight: 700 }}>
                                {diff.type.toUpperCase()}
                              </span>
                            </div>
                            {diff.type === 'changed' && diff.changes.map(c => (
                              <div key={c.field} style={{ fontSize: 9, marginTop: 3 }}>
                                <span style={{ color: '#8b949e' }}>{c.field}: </span>
                                <span style={{ color: '#f85149', textDecoration: 'line-through', marginRight: 6 }}>{JSON.stringify(c.from)}</span>
                                <span style={{ color: '#3fb950' }}>{JSON.stringify(c.to)}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </>
              )}
            </section>
          )}

          {(aiAnalysis || aiLoading) && (
            <section className="panel code-panel">
              <div className="panel-heading">
                <BrainCircuit size={18} aria-hidden="true" />
                <h2>AI Risk Analysis</h2>
                {aiAnalysis && (
                  <>
                    <button type="button" onClick={() => copyText(aiAnalysis, 'AI analysis copied!')} aria-label="Copy plain text" title="Copy plain text">
                      <Clipboard size={15} aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => copyText(`\`\`\`\n${aiAnalysis}\n\`\`\``, 'Copied as Slack markdown!')} aria-label="Copy as Slack markdown" title="Copy for Slack" style={{ fontSize: 10, background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, color: '#8b949e', padding: '2px 5px', cursor: 'pointer' }}>
                      Slack
                    </button>
                    <button type="button" onClick={() => copyText(aiAnalysis, 'Copied as Markdown!')} aria-label="Copy as Markdown" title="Copy for Notion/GitHub" style={{ fontSize: 10, background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 3, color: '#8b949e', padding: '2px 5px', cursor: 'pointer' }}>
                      MD
                    </button>
                    <button type="button" onClick={() => setAiAnalysis('')} aria-label="Close analysis" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b949e' }}>
                      ✕
                    </button>
                  </>
                )}
              </div>
              {aiLoading && <p style={{ color: '#bc8cff', fontSize: 11 }}>Analyzing your flags… ✨</p>}
              {aiAnalysis && <pre style={{ whiteSpace: 'pre-wrap', fontSize: 10, lineHeight: 1.6 }}>{aiAnalysis}</pre>}
            </section>
          )}

          <section className="panel audit-panel">
            <div className="panel-heading">
              <Cloud size={18} aria-hidden="true" />
              <h2>Cloud Snapshots</h2>
              {isAuthenticated && (
                <button type="button" onClick={loadCloudSnapshots} aria-label="Refresh cloud snapshots">
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
              )}
            </div>
            {!isAuthenticated && (
              <button className="full-button" type="button" onClick={() => loginWithRedirect()}>
                <LogIn size={16} aria-hidden="true" />
                Login to save &amp; load snapshots
              </button>
            )}
            {isAuthenticated && (
              <>
                {cloudNotice && <p style={{ fontSize: 11, color: '#3fb950', marginBottom: 8 }}>{cloudNotice}</p>}
                {cloudLoading && <p style={{ fontSize: 11, color: '#8b949e' }}>Loading…</p>}
                {cloudSnapshots.length === 0 && !cloudLoading && (
                  <p style={{ fontSize: 11, color: '#8b949e' }}>No cloud snapshots yet. Hit the cloud icon in the toolbar to save one.</p>
                )}
                {cloudSnapshots.map((snap) => (
                  <article className="audit-item" key={snap.id} style={{ cursor: 'pointer' }}>
                    <span>{new Date(snap.created_at).toLocaleDateString()}</span>
                    <div style={{ flex: 1 }}>
                      <strong>{snap.name}</strong>
                    </div>
                    <button type="button" onClick={() => restoreFromCloud(snap)} title="Restore" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3fb950', padding: 0 }}>
                      <RefreshCw size={13} />
                    </button>
                    <button type="button" onClick={() => shareCloudSnapshot(snap.id)} title="Copy share link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#58a6ff', padding: 0, marginLeft: 8 }}>
                      <Share2 size={13} />
                    </button>
                    <button type="button" onClick={() => deleteCloudSnapshot(snap.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f85149', padding: 0, marginLeft: 8 }}>
                      <Trash2 size={13} />
                    </button>
                  </article>
                ))}
              </>
            )}
          </section>

          <section className="panel audit-panel">
            <div className="panel-heading">
              <Activity size={18} aria-hidden="true" />
              <h2>Audit</h2>
              <button type="button" onClick={() => copyText(JSON.stringify(audit, null, 2), 'Audit copied')} aria-label="Copy structured audit history">
                <Clipboard size={15} aria-hidden="true" />
              </button>
            </div>
            {audit.map((event) => (
              <article className="audit-item" key={event.id}>
                <span>{event.time}</span>
                <div>
                  <strong>{event.action}</strong>
                  <small>{formatAuditMeta(event)}</small>
                </div>
              </article>
            ))}
          </section>
        </aside>
      </section>
      {showPricing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowPricing(false)}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 40, maxWidth: 860, width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPricing(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 20 }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <span style={{ color: '#ffb800', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>Compass Ultra</span>
              <h2 style={{ color: '#e6edf3', fontSize: 28, margin: '8px 0 12px' }}>Simple, transparent pricing</h2>
              <p style={{ color: '#8b949e', fontSize: 14 }}>Start free. Upgrade when your team needs more.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                {
                  name: 'Free', price: '$0', period: 'forever',
                  color: '#3d4451',
                  features: ['3 saved snapshots', 'Local workspace', 'PDF runbook export', 'Flag evaluation engine', 'Policy checks'],
                  cta: 'Get started', highlight: false,
                },
                {
                  name: 'Pro', price: '$29', period: 'per month',
                  color: '#58a6ff',
                  features: ['Unlimited snapshots', 'Cloud save & sync', 'Shareable public links', 'Snapshot diff viewer', 'All Free features'],
                  cta: 'Start Pro', highlight: false,
                },
                {
                  name: 'Team', price: '$99', period: 'per month',
                  color: '#ffb800',
                  features: ['Everything in Pro', 'AI risk analyzer', 'Flag expiration alerts', 'Team RBAC', 'Audit log export', 'Priority support'],
                  cta: 'Start Team', highlight: true,
                },
                {
                  name: 'Enterprise', price: 'Custom', period: 'contact us',
                  color: '#bc8cff',
                  features: ['Everything in Team', 'SSO / SAML', 'Slack bot integration', 'Real-time collaboration', 'SLA guarantee', 'Dedicated onboarding'],
                  cta: 'Contact sales', highlight: false,
                },
              ].map(tier => (
                <div key={tier.name} style={{ background: tier.highlight ? 'rgba(255,184,0,0.05)' : '#161b22', border: `1px solid ${tier.highlight ? tier.color : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
                  {tier.highlight && <span style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#ffb800', color: '#07090e', fontSize: 10, fontWeight: 700, padding: '2px 10px', borderRadius: 10, letterSpacing: 1 }}>MOST POPULAR</span>}
                  <div>
                    <div style={{ color: tier.color, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{tier.name}</div>
                    <div style={{ color: '#e6edf3', fontSize: 28, fontWeight: 800 }}>{tier.price}</div>
                    <div style={{ color: '#8b949e', fontSize: 11 }}>{tier.period}</div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
                    {tier.features.map(f => (
                      <li key={f} style={{ color: '#8b949e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: tier.color }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <button style={{ background: tier.highlight ? '#ffb800' : 'none', color: tier.highlight ? '#07090e' : tier.color, border: `1px solid ${tier.color}`, borderRadius: 6, padding: '9px 0', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

function WorkspaceGuide() {
  const sections = [
    {
      title: '1. Connect Your Flag Data',
      icon: <BookOpenCheck size={17} aria-hidden="true" />,
      body: [
        'Compass Ultra works with LaunchDarkly, Statsig, Firebase Remote Config, or any JSON-based flag provider. Use the Sample Packs to load a realistic workspace instantly, or import your own JSON export from your provider.',
        'Once your flags are loaded, set the Release Control fields on the left — change ticket, release train, captain, and deployment window. These appear in every generated artifact.',
        'Your workspace auto-saves to the cloud. Use the cloud icon to save a named snapshot at any point in your review.',
      ],
    },
    {
      title: '2. Set Your Team and Permissions',
      icon: <Users size={17} aria-hidden="true" />,
      body: [
        'Open Team Auth to set the active reviewer. Admins can configure integrations and team roles. Operators can edit flags and release state. Viewers get a read-only view with a full audit trail.',
        'Every blocked action is recorded — if a viewer attempts to edit a flag, Compass logs it with the actor name, role, and timestamp. No silent permission bypasses.',
        'Use role switching during a release review to walk stakeholders through what each team member can and cannot change.',
      ],
    },
    {
      title: '3. Evaluate Flags Against Real User Segments',
      icon: <UserRound size={17} aria-hidden="true" />,
      body: [
        'The Evaluation Context defines the user Compass evaluates all flags against — environment, plan, role, region, device, and custom attributes.',
        'Switch between saved context presets to instantly see how your flag configuration behaves for enterprise users, EU customers, mobile trial users, or any segment you define.',
        'This is the fastest way to reproduce a customer-specific flag state without touching production or writing code.',
      ],
    },
    {
      title: '4. Review Risk Before You Ship',
      icon: <ShieldCheck size={17} aria-hidden="true" />,
      body: [
        'The flag table shows every flag with its evaluated value, criticality, source provider, rollout percentage, and the reason for the current value — rule, override, rollout, or default.',
        'Enterprise Policy Checks automatically validate change ticket coverage, approver assignments, expiration dates, canary rollout limits, dependency integrity, and provider connectivity.',
        'Use the AI Risk Analyzer (brain icon) to get a Claude-powered assessment of your full release — it identifies dependency gaps, rollout mismatches, compliance risks, and recommended actions before you ship.',
      ],
    },
    {
      title: '5. Save and Share Snapshots',
      icon: <CloudCog size={17} aria-hidden="true" />,
      body: [
        'Save named snapshots to the cloud at any point in your review. Snapshots capture the complete flag state, context, release metadata, and policy check results.',
        'Use the Snapshot Diff viewer to compare any two saved snapshots side by side — added, removed, and changed flags are highlighted in green and red.',
        'Generate a public share link from any snapshot. Anyone with the link can load the exact workspace state you were reviewing — no login required for recipients.',
      ],
    },
    {
      title: '6. Generate DevOps Handoff Artifacts',
      icon: <Rocket size={17} aria-hidden="true" />,
      body: [
        'Export a PDF Release Runbook with gate status, policy check results, active evaluations, and flag-by-flag rollback procedures — formatted for management review or change advisory board submission.',
        'Generate integration payloads for GitHub Issues, Jira Change tickets, and Slack War Room webhooks. Configure a proxy endpoint to POST directly, or copy the JSON payload manually.',
        'The SDK Payload gives downstream applications machine-readable evaluated flag values with owners, tickets, criticality, and evaluation reasons attached.',
      ],
    },
  ];

  return (
    <section className="workspace-guide" aria-label="Compass Ultra documentation">
      <div className="guide-intro">
        <div>
          <span className="guide-kicker">Compass Ultra — Release Intelligence Platform</span>
          <h1>Ship with confidence. Every flag, every risk, every time.</h1>
          <p>
            Connect your flag providers, evaluate against real user segments, validate enterprise policy, and generate handoff artifacts — all before a single line changes in production.
          </p>
        </div>
      </div>
      <div className="guide-tabs">
        {sections.map((section, index) => (
          <details key={section.title} open={index === 0}>
            <summary>
              <span>{section.icon}</span>
              <strong>{section.title}</strong>
            </summary>
            <div className="guide-body">
              {section.body.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
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

function hydrateWorkspace(input, fallbackName = 'My production workspace') {
  const importedFlags = normalizeImportedFlags(input);
  return {
    workspaceName: input?.workspaceName || input?.name || fallbackName,
    release: { ...defaultRelease, ...(input?.release || {}) },
    team: normalizeTeam(input?.team),
    integrations: normalizeIntegrations(input?.integrations),
    context: { ...defaultContext, ...(input?.context || {}) },
    flags: importedFlags.length ? importedFlags.map(normalizeFlag) : [],
    audit: normalizeAudit(input?.audit),
  };
}

function normalizeTeam(team) {
  const nextTeam = { ...defaultTeam, ...(team || {}) };
  const members = Array.isArray(team?.members) && team.members.length ? team.members : defaultTeam.members;
  const activeMemberId = members.some((member) => member.id === nextTeam.activeMemberId)
    ? nextTeam.activeMemberId
    : members[0]?.id || defaultTeam.activeMemberId;

  return { ...nextTeam, members, activeMemberId };
}

function normalizeIntegrations(integrations) {
  if (!Array.isArray(integrations)) return defaultIntegrations;
  return defaultIntegrations.map((defaultIntegration) => ({
    ...defaultIntegration,
    ...(integrations.find((item) => item.id === defaultIntegration.id) || {}),
  }));
}

function normalizeAudit(audit) {
  if (!Array.isArray(audit) || !audit.length) {
    return [{ id: 'boot', time: timeNow(), actor: 'System', role: 'system', level: 'info', action: 'Workspace ready', detail: 'Local audit initialized' }];
  }

  return audit.map((event) => ({
    id: event.id || `${Date.now()}-${Math.random()}`,
    time: event.time || timeNow(),
    actor: event.actor || 'System',
    role: event.role || 'system',
    level: event.level || 'info',
    action: event.action || 'Event',
    detail: event.detail || '',
  }));
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
    criticality: item.key?.includes('checkout') || item.key?.includes('privacy') ? 'high' : 'medium',
    jira: 'IMPORT-001',
    approver: 'Provider Owner',
    expiresAt: '2026-12-31',
    rollback: `Disable ${item.key}.`,
    canaryRequired: true,
    dependencies: [],
    tags: item.tags || ['launchdarkly'],
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
    criticality: item.name?.includes('sso') ? 'critical' : 'medium',
    jira: 'IMPORT-001',
    approver: 'Experiment Owner',
    expiresAt: '2026-12-31',
    rollback: `Disable ${item.name || item.id}.`,
    canaryRequired: true,
    dependencies: [],
    tags: ['statsig'],
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
    criticality: key.includes('paywall') ? 'high' : 'low',
    jira: 'IMPORT-001',
    approver: 'Mobile Owner',
    expiresAt: '2026-12-31',
    rollback: `Restore Firebase default for ${key}.`,
    canaryRequired: key.includes('paywall'),
    dependencies: [],
    tags: ['firebase', 'mobile'],
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
    criticality: flag.criticality || 'medium',
    jira: flag.jira || 'DCG-untracked',
    approver: flag.approver || 'Release Captain',
    expiresAt: flag.expiresAt || '2026-12-31',
    rollback: flag.rollback || `Disable ${flag.key || flag.name}.`,
    canaryRequired: Boolean(flag.canaryRequired),
    dependencies: Array.isArray(flag.dependencies) ? flag.dependencies : [],
    tags: Array.isArray(flag.tags) ? flag.tags : [],
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
      value: normalizeValue(matchedRule.valueWhenMatched ?? defaultRuleValue(flag), flag.type),
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

function makePolicyChecks(flags, evaluations, context, release, integrations = defaultIntegrations) {
  const today = new Date('2026-05-05T00:00:00');
  const activeCritical = evaluations.filter(({ flag, result }) => ['critical', 'high'].includes(flag.criticality) && Boolean(result.value));
  const missingChange = flags.filter((flag) => !flag.jira || flag.jira === 'DCG-untracked');
  const expired = flags.filter((flag) => flag.enabled && new Date(`${flag.expiresAt}T00:00:00`) < today);
  const prodOverrides = context.environment === 'production' ? flags.filter((flag) => flag.overrideValue !== null) : [];
  const canaryBreaches = flags.filter((flag) => flag.canaryRequired && flag.rollout > 50 && context.environment === 'production');
  const brokenDeps = flags.filter((flag) =>
    flag.enabled && flag.dependencies.some((dependency) => !flags.find((item) => item.key === dependency && item.enabled))
  );
  const configuredProviders = integrations.filter((integration) => integration.kind === 'provider' && integration.endpoint).length;
  const configuredOutbound = integrations.filter((integration) => integration.kind === 'outbound' && integration.endpoint).length;

  return [
    {
      id: 'change-ticket',
      status: release.changeTicket ? 'pass' : 'block',
      title: 'Change ticket attached',
      detail: release.changeTicket ? `${release.changeTicket} controls this rollout.` : 'Add a CHG or Jira ticket before production.',
    },
    {
      id: 'critical-approvals',
      status: activeCritical.every(({ flag }) => flag.approver) ? 'pass' : 'block',
      title: 'Critical flags have approvers',
      detail: `${activeCritical.length} high or critical active evaluation paths checked.`,
    },
    {
      id: 'missing-change',
      status: missingChange.length ? 'warn' : 'pass',
      title: 'Every flag has traceability',
      detail: missingChange.length ? `${missingChange.length} flags need Jira/change IDs.` : 'All flags have traceable IDs.',
    },
    {
      id: 'expires',
      status: expired.length ? 'block' : 'pass',
      title: 'No expired flags enabled',
      detail: expired.length ? `${expired.length} enabled flags are past expiration.` : 'Flag expiration dates are clean.',
    },
    {
      id: 'prod-overrides',
      status: prodOverrides.length ? 'warn' : 'pass',
      title: 'Production override discipline',
      detail: prodOverrides.length ? `${prodOverrides.length} manual overrides active in production.` : 'No manual prod overrides.',
    },
    {
      id: 'canary',
      status: canaryBreaches.length ? 'block' : 'pass',
      title: 'Canary rollout limit',
      detail: canaryBreaches.length ? `${canaryBreaches.length} canary-required flags exceed 50%.` : 'Canary-required flags stay within policy.',
    },
    {
      id: 'dependencies',
      status: brokenDeps.length ? 'block' : 'pass',
      title: 'Dependencies enabled',
      detail: brokenDeps.length ? `${brokenDeps.length} enabled flags have disabled dependencies.` : 'Flag dependency graph is satisfied.',
    },
    {
      id: 'provider-adapters',
      status: configuredProviders ? 'pass' : 'warn',
      title: 'Live provider adapters configured',
      detail: configuredProviders ? `${configuredProviders} read-only provider endpoints configured.` : 'Add proxy/export URLs for live LaunchDarkly, Statsig, or Firebase sync.',
    },
    {
      id: 'outbound-hooks',
      status: configuredOutbound ? 'pass' : 'warn',
      title: 'Outbound DevOps hooks configured',
      detail: configuredOutbound ? `${configuredOutbound} GitHub/Jira/Slack endpoints configured.` : 'Payload copy works now; configure webhooks for one-click posting.',
    },
  ];
}

function getReleaseState(checks) {
  const blocked = checks.filter((check) => check.status === 'block').length;
  const warnings = checks.filter((check) => check.status === 'warn').length;
  const passed = checks.filter((check) => check.status === 'pass').length;
  const score = Math.round((passed / checks.length) * 100);

  if (blocked) return { state: 'blocked', label: 'Blocked', score, icon: <XCircle size={16} aria-hidden="true" /> };
  if (warnings) return { state: 'warn', label: 'Needs review', score, icon: <AlertTriangle size={16} aria-hidden="true" /> };
  return { state: 'ready', label: 'Ready', score, icon: <CheckCircle2 size={16} aria-hidden="true" /> };
}

function makeRunbook(workspaceName, release, context, evaluations, checks) {
  const active = evaluations.filter(({ result }) => Boolean(result.value)).slice(0, 12);
  const failed = checks.filter((check) => check.status !== 'pass');

  return [
    `# ${workspaceName}`,
    '',
    `Change: ${release.changeTicket}`,
    `Train: ${release.train}`,
    `Captain: ${release.releaseCaptain}`,
    `Approver: ${release.approver}`,
    `Window: ${release.window}`,
    `Incident channel: ${release.incidentChannel}`,
    '',
    '## Context',
    ...Object.entries(context).map(([key, value]) => `- ${key}: ${value}`),
    '',
    '## Gate Status',
    ...(failed.length
      ? failed.map((check) => `- ${check.status.toUpperCase()}: ${check.title} - ${check.detail}`)
      : ['- PASS: all enterprise checks passed']),
    '',
    '## Active Evaluations',
    ...active.map(({ flag, result }) => `- ${flag.key}: ${formatValue(result.value)} (${result.reason}) owner=${flag.owner} ticket=${flag.jira}`),
    '',
    '## Rollback',
    ...active.map(({ flag }) => `- ${flag.key}: ${flag.rollback}`),
  ].join('\n');
}

function makeIntegrationPayloads(workspaceName, release, context, evaluations, checks, runbook) {
  const failed = checks.filter((check) => check.status !== 'pass');
  const summary = {
    workspaceName,
    changeTicket: release.changeTicket,
    releaseTrain: release.train,
    environment: context.environment,
    gateStatus: failed.length ? 'needs-review' : 'ready',
    failedChecks: failed.map((check) => ({ id: check.id, status: check.status, title: check.title, detail: check.detail })),
    activeFlags: evaluations
      .filter(({ result }) => Boolean(result.value))
      .map(({ flag, result }) => ({
        key: flag.key,
        value: result.value,
        reason: result.reason,
        owner: flag.owner,
        ticket: flag.jira,
        criticality: flag.criticality,
      })),
  };

  return {
    generic: summary,
    github: {
      title: `${release.changeTicket}: ${workspaceName} release gate`,
      labels: ['compass-ultra', 'release-readiness', summary.gateStatus],
      body: runbook,
    },
    jira: {
      fields: {
        project: { key: 'DCG' },
        summary: `${workspaceName} release gate - ${summary.gateStatus}`,
        issuetype: { name: 'Change' },
        description: runbook,
        labels: ['compass-ultra', release.train],
      },
    },
    slack: {
      text: `${workspaceName} is ${summary.gateStatus} for ${release.changeTicket}`,
      blocks: [
        { type: 'header', text: { type: 'plain_text', text: 'Compass-Ultra release gate' } },
        { type: 'section', text: { type: 'mrkdwn', text: `*${workspaceName}*\nChange: ${release.changeTicket}\nStatus: ${summary.gateStatus}` } },
        { type: 'section', text: { type: 'mrkdwn', text: failed.length ? failed.map((check) => `*${check.status}* ${check.title}`).join('\n') : 'All enterprise checks passed.' } },
      ],
    },
    launchdarkly: summary,
    statsig: summary,
    firebase: summary,
  };
}

function formatAuditMeta(event) {
  const actor = event.actor || 'System';
  const role = event.role || 'system';
  const detail = event.detail ? ` - ${event.detail}` : '';
  return `${actor} (${role})${detail}`;
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
      acc[flag.key] = {
        value: result.value,
        reason: result.reason,
        owner: flag.owner,
        ticket: flag.jira,
        criticality: flag.criticality,
      };
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

function defaultRuleValue(flag) {
  if (flag.type === 'boolean') return true;
  if (flag.type === 'json') return flag.defaultValue;
  return flag.variants?.[1] || 'treatment';
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
