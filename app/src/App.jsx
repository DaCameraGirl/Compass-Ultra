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
  FileDown,
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
  key: 'user_2941',
  email: 'ops.admin@dacameragirl.dev',
  tenant: 'dcg-enterprise',
  plan: 'enterprise',
  role: 'admin',
  region: 'us-east',
  country: 'US',
  device: 'desktop',
  environment: 'production',
};

const defaultRelease = {
  train: 'DCG-prod-2026.05',
  changeTicket: 'CHG-24051',
  incidentChannel: '#dcg-war-room',
  releaseCaptain: 'DaCameraGirl DevOps',
  approver: 'Platform SRE',
  window: 'Tue 22:00-23:00 ET',
};

const defaultTeam = {
  workspaceId: 'dcg-prod-command',
  authMode: 'Local RBAC session',
  members: [
    { id: 'dcg', name: 'DaCameraGirl', email: 'ops.admin@dacameragirl.dev', role: 'admin' },
    { id: 'sre', name: 'Platform SRE', email: 'sre@dacameragirl.dev', role: 'approver' },
    { id: 'qa', name: 'QA Release', email: 'qa@dacameragirl.dev', role: 'operator' },
    { id: 'viewer', name: 'Audit Viewer', email: 'audit@dacameragirl.dev', role: 'viewer' },
  ],
  activeMemberId: 'dcg',
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
    label: 'DaCameraGirl Enterprise',
    workspaceName: 'DaCameraGirl production command center',
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
    setFlags(baseline.flags);
    setSelectedKey(baseline.flags[0]?.key || '');
    record('Workspace reset');
  };

  const loadCloudSnapshots = async () => {
    if (!isAuthenticated) return;
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently();
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
    setCloudLoading(true);
    try {
      const token = await getAccessTokenSilently();
      await api.saveSnapshot(token, workspaceName, '', workspace);
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
      const token = await getAccessTokenSilently();
      await api.deleteSnapshot(token, id);
      await loadCloudSnapshots();
      setCloudNotice('Snapshot deleted');
    } catch (e) {
      setCloudNotice('Delete failed');
    }
  };

  const shareCloudSnapshot = async (id) => {
    if (!isAuthenticated) return;
    try {
      const token = await getAccessTokenSilently();
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
            <strong>Compass-Ultra</strong>
            <small>DaCameraGirl DevOps control room</small>
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
                <input value={selectedFlag.rollback} onChange={(event) => updateFlag(selectedFlag.key, { rollback: event.target.value })} />
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
      title: '1. Start Here',
      icon: <BookOpenCheck size={17} aria-hidden="true" />,
      body: [
        'Compass-Ultra is a release control room for feature flags, rollout risk, team approvals, provider imports, and DevOps handoff payloads.',
        'Start on the left side with Release Control, then choose the active Team Auth user, then review the main flag table and policy checks.',
        'Everything saves locally in this browser. Use the top-right share link or export button when you need to hand the exact workspace to another person.',
      ],
    },
    {
      title: '2. Pick The Person Using It',
      icon: <Users size={17} aria-hidden="true" />,
      body: [
        'Open Team Auth and choose the active actor. Admin can configure team roles and integrations. Operator can edit release and flag state. Viewer is read-only.',
        'If a viewer tries to edit a flag, Compass records the blocked action in the audit trail instead of silently allowing it.',
        'Use this to show who changed what during a release review.',
      ],
    },
    {
      title: '3. Load Realistic Data',
      icon: <CloudCog size={17} aria-hidden="true" />,
      body: [
        'Use Sample Packs for the built-in DaCameraGirl Enterprise workspace or provider-shaped LaunchDarkly, Statsig, and Firebase examples.',
        'Use the import button in the top bar for a JSON file export. Compass recognizes workspace JSON, LaunchDarkly items, Statsig gates, and Firebase Remote Config parameters.',
        'Use Live Integrations when you have a read-only proxy/export URL that returns provider JSON.',
      ],
    },
    {
      title: '4. Check A User Or Customer',
      icon: <UserRound size={17} aria-hidden="true" />,
      body: [
        'Evaluation Context is the user, tenant, region, role, device, and environment Compass evaluates against.',
        'Click Prod admin, EU customer, or Mobile trial to quickly see how the same flags behave for different audiences.',
        'Edit any context field directly when QA needs to reproduce a specific customer or rollout path.',
      ],
    },
    {
      title: '5. Review Flags And Risk',
      icon: <ShieldCheck size={17} aria-hidden="true" />,
      body: [
        'The main table shows every flag, criticality, provider source, current evaluated value, and why that value happened.',
        'Click a flag row to inspect it on the right. You can update owner, ticket, approver, criticality, expiration, rollout, override, targeting rule, and rollback note.',
        'The release board and Enterprise Policy Checks tell you whether the release is ready, risky, or blocked.',
      ],
    },
    {
      title: '6. Use GitHub, Jira, Slack',
      icon: <Webhook size={17} aria-hidden="true" />,
      body: [
        'Live Integrations can copy or POST generated payloads for GitHub Issues, Jira Changes, and Slack workflow webhooks.',
        'On GitHub Pages, do not paste secret tokens directly into the page. Put secrets in a backend/proxy/webhook tool, then paste the safe endpoint URL into Compass.',
        'If no endpoint is configured, the Copy button still gives you the exact JSON payload to paste into another tool.',
      ],
    },
    {
      title: '7. Ship The Handoff',
      icon: <Rocket size={17} aria-hidden="true" />,
      body: [
        'Use Release Runbook to copy a human-readable release note with context, failed checks, active evaluations, and rollback steps.',
        'Use SDK Payload when another app needs machine-readable evaluated values plus owners, tickets, reasons, and criticality.',
        'Use Workspace JSON to export the entire control room state for audit, QA, or another browser.',
      ],
    },
  ];

  return (
    <section className="workspace-guide" aria-label="How to use Compass-Ultra">
      <div className="guide-intro">
        <div>
          <span className="guide-kicker">How to use Compass-Ultra</span>
          <h1>Run the workspace like a release command center.</h1>
          <p>
            Open the dropdowns below in order the first time. After that, use them as quick
            reference while you review flags, approvals, integrations, and rollout readiness.
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

function hydrateWorkspace(input, fallbackName = 'DaCameraGirl production command center') {
  const importedFlags = normalizeImportedFlags(input);
  return {
    workspaceName: input?.workspaceName || input?.name || fallbackName,
    release: { ...defaultRelease, ...(input?.release || {}) },
    team: normalizeTeam(input?.team),
    integrations: normalizeIntegrations(input?.integrations),
    context: { ...defaultContext, ...(input?.context || {}) },
    flags: (importedFlags.length ? importedFlags : seedFlags).map(normalizeFlag),
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
    jira: 'DCG-import',
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
    jira: 'DCG-import',
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
    jira: 'DCG-import',
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
