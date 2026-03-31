import { useState, useEffect, useRef, useCallback } from "react";
import {
  Shield, Network, Clock, UserCheck, Bug, Camera, Package,
  Plus, Trash2, Search, Download, RotateCcw, Zap, FlaskConical,
  ToggleLeft, ToggleRight, X, ChevronRight, RefreshCw, FileJson
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBALS / CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
.compass-hud * { box-sizing: border-box; }
.compass-hud ::-webkit-scrollbar { width: 3px; }
.compass-hud ::-webkit-scrollbar-track { background: transparent; }
.compass-hud ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 2px; }
.compass-hud input[type=range] { -webkit-appearance: none; height: 3px; border-radius: 2px; outline: none; cursor: pointer; }
.compass-hud input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 12px; height: 12px; border-radius: 50%; cursor: pointer; }
.compass-hud button:hover { filter: brightness(1.15); }
@keyframes compass-pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
@keyframes compass-fadein { from { opacity:0; transform: translateX(8px); } to { opacity:1; transform: translateX(0); } }
`;

const C = {
  bg:          '#07090e',
  surface:     '#0e1117',
  elevated:    '#161b22',
  border:      'rgba(255,255,255,0.07)',
  borderHi:    'rgba(255,255,255,0.14)',
  text:        '#e6edf3',
  muted:       '#8b949e',
  faint:       '#3d4451',
  gold:        '#ffb800',
  green:       '#3fb950',
  red:         '#f85149',
  blue:        '#58a6ff',
  purple:      '#bc8cff',
  orange:      '#f0883e',
};

const CAT_COLORS = {
  payments: C.blue, ui: C.purple, api: C.green,
  auth: C.orange, experiment: C.red, rollout: '#ff7b72',
};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_FLAGS = [
  { id: 'ff_checkout_v2',  name: 'Checkout v2',        category: 'payments', enabled: true,  rollout: 100 },
  { id: 'ff_ai_copilot',   name: 'AI Copilot',          category: 'ui',       enabled: false, rollout: 0   },
  { id: 'ff_api_v3_beta',  name: 'API v3 Beta',         category: 'api',      enabled: true,  rollout: 25  },
  { id: 'ff_sso_saml',     name: 'SSO / SAML',          category: 'auth',     enabled: true,  rollout: 100 },
  { id: 'ff_fraud_ml',     name: 'Fraud ML Engine',     category: 'payments', enabled: false, rollout: 5   },
  { id: 'ff_cache_v2',     name: 'Cache Layer v2',      category: 'api',      enabled: true,  rollout: 75  },
  { id: 'ff_realtime_ws',  name: 'Realtime WebSockets', category: 'api',      enabled: false, rollout: 0   },
];

const DEFAULT_EXPERIMENTS = [
  { id: 'exp_hero',    name: 'Hero CTA Copy',      status: 'running', variants: ['control', 'short_copy', 'emoji_cta'],    active: 'control'    },
  { id: 'exp_pricing', name: 'Pricing Page Layout', status: 'running', variants: ['control', 'card_grid', 'comparison'],   active: 'card_grid'  },
  { id: 'exp_onboard', name: 'Onboarding Flow',     status: 'paused',  variants: ['wizard_v1', 'checklist_v2'],            active: 'wizard_v1'  },
  { id: 'exp_search',  name: 'Search Algorithm',    status: 'running', variants: ['baseline', 'ml_ranked', 'hybrid'],      active: 'baseline'   },
];

const LATENCY_PRESETS = [
  { label: 'INSTANT', val: 0,    color: C.green  },
  { label: '4G',      val: 100,  color: C.green  },
  { label: 'LTE',     val: 300,  color: C.blue   },
  { label: '3G',      val: 1500, color: C.gold   },
  { label: '2G',      val: 3000, color: C.orange },
  { label: 'OFFLINE', val: -1,   color: C.red    },
];

const BUILD_INFO = {
  ENV:       'STAGING',
  VERSION:   '2.14.0-rc.3',
  COMMIT:    'a3f9e1c',
  BRANCH:    'feat/checkout-v2',
  BUILT:     '28 Mar 2025 · 14:22 UTC',
  REGION:    'us-east-1',
  API:       'https://api.staging.acme.io',
  NODE_ENV:  'development',
};

// ─────────────────────────────────────────────────────────────────────────────
// WINDOW INTERCEPTOR SETUP
// Attaches to window once; stays active even if HUD component unmounts.
// ─────────────────────────────────────────────────────────────────────────────

const setupInterceptors = () => {
  if (typeof window === 'undefined' || window.__COMPASS_INITIALIZED__) return;

  const origFetch        = window.fetch;
  const origConsoleError = console.error;
  const origConsoleWarn  = console.warn;
  const origConsoleLog   = console.log;

  window.__COMPASS_CONFIG__ = { latency: 0, mocks: [], impersonationId: null, logs: [] };

  const pushLog = (type, args) => {
    const cfg = window.__COMPASS_CONFIG__;
    cfg.logs = [...cfg.logs.slice(-49), {
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type,
      msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '),
    }];
    window.dispatchEvent(new CustomEvent('compass:log'));
  };

  window.fetch = async (...args) => {
    const cfg = window.__COMPASS_CONFIG__;
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;

    if (cfg.latency < 0) return new Response(null, { status: 0, statusText: 'Compass: Network Offline' });
    if (cfg.latency > 0) await new Promise(r => setTimeout(r, cfg.latency));

    const mock = cfg.mocks.find(m => m.enabled && url.includes(m.pattern));
    if (mock) {
      pushLog('info', [`[Compass Mock] ${url} → ${mock.status}`]);
      return new Response(mock.payload, {
        status: mock.status || 200,
        headers: { 'Content-Type': 'application/json', 'X-Compass-Mock': 'true' },
      });
    }

    const [resource, config = {}] = args;
    if (cfg.impersonationId) {
      return origFetch(resource, { ...config, headers: { ...config.headers, 'X-Compass-Impersonate': cfg.impersonationId } });
    }
    return origFetch(...args);
  };

  console.error = (...a) => { pushLog('err',  a); origConsoleError(...a); };
  console.warn  = (...a) => { pushLog('warn', a); origConsoleWarn(...a);  };
  console.log   = (...a) => { pushLog('log',  a); origConsoleLog(...a);   };

  window.__COMPASS_INITIALIZED__ = true;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const nowStr = () =>
  new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

const useLS = (key, init) => {
  const [v, set] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? init; } catch { return init; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, set];
};

// Shared inline-style primitives
const pill = (bg, color) => ({
  display: 'inline-block', background: `${bg}20`, color: bg,
  fontSize: 8, fontWeight: 700, padding: '1px 5px', borderRadius: 3, letterSpacing: 0.5,
});

const miniBtn = (color = C.muted, solid = false) => ({
  background: solid ? color : 'transparent',
  border: `1px solid ${color}50`,
  color: solid ? C.bg : color,
  fontSize: 9, fontWeight: 700, padding: '5px 10px', borderRadius: 4,
  cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.8, transition: 'filter 0.15s',
});

const inputStyle = (accent = C.text) => ({
  background: C.surface, border: `1px solid ${C.border}`, color: accent,
  padding: '7px 10px', fontSize: 11, borderRadius: 4, fontFamily: 'inherit',
  outline: 'none', width: '100%',
});

const sectionLabel = (text) => (
  <div style={{ color: C.faint, fontSize: 8, fontWeight: 700, letterSpacing: 1.5, marginBottom: 10, textTransform: 'uppercase' }}>
    {text}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: BUILD INFO
// ─────────────────────────────────────────────────────────────────────────────

const BuildPanel = () => (
  <div style={{ animation: 'compass-fadein 0.2s ease' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
      {Object.entries(BUILD_INFO).map(([k, v]) => (
        <div key={k} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '9px 11px' }}>
          <div style={{ color: C.faint, fontSize: 8, fontWeight: 700, letterSpacing: 1, marginBottom: 4 }}>{k}</div>
          <div style={{ color: k === 'ENV' ? C.gold : C.text, fontSize: 10, fontWeight: k === 'ENV' ? 700 : 400, wordBreak: 'break-all', lineHeight: 1.4 }}>{v}</div>
        </div>
      ))}
    </div>

    {sectionLabel('Interceptor Status')}
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, overflow: 'hidden' }}>
      {[
        { label: 'window.fetch → compass.proxy', active: true  },
        { label: 'console.error → captured',     active: true  },
        { label: 'console.warn  → captured',     active: true  },
        { label: 'console.log   → captured',     active: true  },
        { label: 'XHR / axios   → passthrough',  active: false },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.active ? C.green : C.faint, flexShrink: 0 }} />
          <span style={{ color: item.active ? C.muted : C.faint, fontSize: 10 }}>{item.label}</span>
          <span style={{ marginLeft: 'auto', ...pill(item.active ? C.green : C.faint, C.bg) }}>{item.active ? 'ACTIVE' : 'SKIP'}</span>
        </div>
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: FEATURE FLAGS
// ─────────────────────────────────────────────────────────────────────────────

const FlagsPanel = ({ flags, setFlags, addAudit }) => {
  const [q,   setQ]   = useState('');
  const [cat, setCat] = useState('all');

  const cats    = ['all', ...new Set(flags.map(f => f.category))];
  const visible = flags.filter(f =>
    (cat === 'all' || f.category === cat) &&
    (q === '' || f.name.toLowerCase().includes(q.toLowerCase()) || f.id.includes(q.toLowerCase()))
  );

  const toggle = useCallback((id) => {
    const flag = flags.find(f => f.id === id);
    setFlags(p => p.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
    addAudit('flag.toggle', `${flag.name}: ${flag.enabled ? 'ON→OFF' : 'OFF→ON'}`);
  }, [flags, setFlags, addAudit]);

  const setRollout = (id, pct) =>
    setFlags(p => p.map(f => f.id === id ? { ...f, rollout: pct } : f));

  const bulkSet = (enabled) => {
    setFlags(p => p.map(f => ({ ...f, enabled })));
    addAudit('flags.bulk', `All → ${enabled ? 'ENABLED' : 'DISABLED'}`);
  };

  const resetAll = () => {
    setFlags(DEFAULT_FLAGS);
    addAudit('flags.reset', 'Restored all defaults');
  };

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      {/* Search + Category */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={11} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: C.faint, pointerEvents: 'none' }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search flags or IDs…"
            style={{ ...inputStyle(), paddingLeft: 28 }} />
        </div>
        <select value={cat} onChange={e => setCat(e.target.value)}
          style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted, padding: '7px 10px', fontSize: 9, borderRadius: 4, fontFamily: 'inherit', outline: 'none' }}>
          {cats.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
        </select>
      </div>

      {/* Bulk actions */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <button onClick={() => bulkSet(true)}  style={{ ...miniBtn(C.green) }}>▶ ALL ON</button>
        <button onClick={() => bulkSet(false)} style={{ ...miniBtn(C.red)   }}>■ ALL OFF</button>
        <button onClick={resetAll}             style={{ ...miniBtn(C.muted) }}>↺ RESET</button>
        <span style={{ marginLeft: 'auto', color: C.faint, fontSize: 9, alignSelf: 'center' }}>{visible.length} / {flags.length}</span>
      </div>

      {/* Flag cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {visible.map(flag => {
          const def        = DEFAULT_FLAGS.find(f => f.id === flag.id);
          const overridden = def && (flag.enabled !== def.enabled || flag.rollout !== def.rollout);
          const cc         = CAT_COLORS[flag.category] || C.muted;
          return (
            <div key={flag.id} style={{ background: C.surface, border: `1px solid ${overridden ? C.gold + '50' : C.border}`, borderRadius: 6, padding: '10px 12px', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ color: C.text, fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{flag.name}</div>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={pill(cc)}>{flag.category}</span>
                    <span style={{ color: C.faint, fontSize: 9 }}>{flag.id}</span>
                    {overridden && <span style={{ color: C.gold, fontSize: 8, fontWeight: 700 }}>◆ OVERRIDE</span>}
                  </div>
                </div>
                <button onClick={() => toggle(flag.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: flag.enabled ? C.green : C.faint, flexShrink: 0, transition: 'color 0.15s' }}>
                  {flag.enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: C.faint, fontSize: 8, width: 48, letterSpacing: 1, flexShrink: 0 }}>ROLLOUT</span>
                <div style={{ flex: 1, position: 'relative', height: 3, background: C.elevated, borderRadius: 2 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${flag.rollout}%`, background: C.gold, borderRadius: 2, transition: 'width 0.1s' }} />
                  <input type="range" min={0} max={100} value={flag.rollout}
                    onChange={e => setRollout(flag.id, +e.target.value)}
                    style={{ position: 'absolute', inset: '-4px 0', opacity: 0, width: '100%', cursor: 'pointer', margin: 0 }} />
                </div>
                <span style={{ color: C.gold, fontSize: 10, fontWeight: 700, width: 34, textAlign: 'right', flexShrink: 0 }}>{flag.rollout}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: A/B EXPERIMENTS (LABS)
// ─────────────────────────────────────────────────────────────────────────────

const LabsPanel = ({ exps, setExps, addAudit }) => {
  const STATUS_COLORS = { running: C.green, paused: C.gold, ended: C.faint };

  const forceVariant = (id, v) => {
    const exp = exps.find(e => e.id === id);
    setExps(p => p.map(e => e.id === id ? { ...e, active: v } : e));
    addAudit('experiment.force', `${exp.name} → ${v}`);
  };

  const resetAll = () => {
    setExps(DEFAULT_EXPERIMENTS);
    addAudit('experiments.reset', 'All variants reset to defaults');
  };

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {exps.map(exp => {
          const sc = STATUS_COLORS[exp.status] || C.faint;
          const def = DEFAULT_EXPERIMENTS.find(e => e.id === exp.id);
          const overridden = def && exp.active !== def.active;
          return (
            <div key={exp.id} style={{ background: C.surface, border: `1px solid ${overridden ? C.gold + '40' : C.border}`, borderRadius: 6, padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ color: C.text, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{exp.name}</div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ color: C.faint, fontSize: 9 }}>{exp.id}</span>
                    {overridden && <span style={{ color: C.gold, fontSize: 8, fontWeight: 700 }}>◆ FORCED</span>}
                  </div>
                </div>
                <span style={pill(sc)}>{exp.status.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {exp.variants.map(v => {
                  const isActive = exp.active === v;
                  return (
                    <button key={v} onClick={() => forceVariant(exp.id, v)}
                      style={{ background: isActive ? C.gold : C.elevated, color: isActive ? C.bg : C.muted,
                        border: `1px solid ${isActive ? C.gold : C.border}`, fontSize: 9, fontWeight: 700,
                        padding: '5px 10px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.15s', letterSpacing: 0.5 }}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={resetAll} style={{ ...miniBtn(C.muted), width: '100%', marginTop: 14, padding: '9px 0' }}>
        ↺ RESET ALL VARIANTS
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: NETWORK (latency + mocks)
// ─────────────────────────────────────────────────────────────────────────────

const NetPanel = ({ mocks, setMocks, latency, setLatency, addAudit }) => {
  const addMock   = () => setMocks(p => [...p, { id: Date.now(), pattern: '', payload: '{}', status: 200, enabled: true }]);
  const removeMock = (id) => setMocks(p => p.filter(m => m.id !== id));
  const toggleMock = (id) => setMocks(p => p.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));
  const updateMock = (id, k, v) => setMocks(p => p.map(m => m.id === id ? { ...m, [k]: v } : m));

  const setPreset = (val) => {
    setLatency(val);
    addAudit('net.latency', val < 0 ? 'OFFLINE mode' : val === 0 ? 'Instant (no delay)' : `${val}ms delay`);
  };

  const latencyColor = latency < 0 ? C.red : latency > 1000 ? C.gold : latency > 200 ? C.orange : C.green;

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      {/* Latency */}
      {sectionLabel('Latency Injection')}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
        {LATENCY_PRESETS.map(p => {
          const active = latency === p.val;
          return (
            <button key={p.label} onClick={() => setPreset(p.val)}
              style={{ background: active ? `${p.color}20` : C.elevated, color: active ? p.color : C.faint,
                border: `1px solid ${active ? p.color + '60' : C.border}`, fontSize: 9, fontWeight: 700,
                padding: '6px 11px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.5, transition: 'all 0.15s' }}>
              {p.label}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{ flex: 1, position: 'relative', height: 3, background: C.elevated, borderRadius: 2 }}>
          {latency > 0 && (
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${Math.min((latency / 5000) * 100, 100)}%`, background: latencyColor, borderRadius: 2 }} />
          )}
          <input type="range" min={0} max={5000} step={50} value={latency < 0 ? 0 : latency}
            onChange={e => setLatency(+e.target.value)}
            style={{ position: 'absolute', inset: '-5px 0', opacity: 0, width: '100%', cursor: 'pointer', margin: 0 }} />
        </div>
        <span style={{ color: latencyColor, fontSize: 11, fontWeight: 700, width: 66, textAlign: 'right', flexShrink: 0 }}>
          {latency < 0 ? 'OFFLINE' : `${latency}ms`}
        </span>
      </div>

      {/* Mocks */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        {sectionLabel('API Mocks')}
        <button onClick={addMock} style={{ ...miniBtn(C.gold), marginBottom: 10 }}>+ ADD MOCK</button>
      </div>
      {mocks.length === 0 && (
        <div style={{ color: C.faint, fontSize: 10, textAlign: 'center', padding: '18px 0', border: `1px dashed ${C.border}`, borderRadius: 6, marginBottom: 8 }}>
          No mocks configured
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mocks.map(mock => (
          <div key={mock.id} style={{ background: C.surface, border: `1px solid ${mock.enabled ? C.gold + '30' : C.border}`, borderRadius: 6, padding: 10 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
              <input value={mock.pattern} onChange={e => updateMock(mock.id, 'pattern', e.target.value)}
                placeholder="/api/endpoint…"
                style={{ flex: 1, background: C.elevated, border: `1px solid ${C.border}`, color: C.blue, padding: '5px 8px', fontSize: 10, borderRadius: 4, fontFamily: 'inherit', outline: 'none' }} />
              <input value={mock.status} onChange={e => updateMock(mock.id, 'status', +e.target.value)}
                style={{ width: 48, background: C.elevated, border: `1px solid ${C.border}`, color: C.gold, padding: '5px 6px', fontSize: 10, borderRadius: 4, fontFamily: 'inherit', outline: 'none', textAlign: 'center' }} />
              <button onClick={() => toggleMock(mock.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: mock.enabled ? C.green : C.faint, flexShrink: 0 }}>
                {mock.enabled ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              </button>
              <button onClick={() => removeMock(mock.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.faint, flexShrink: 0 }}>
                <Trash2 size={14} />
              </button>
            </div>
            <textarea value={mock.payload} onChange={e => updateMock(mock.id, 'payload', e.target.value)}
              placeholder='{ "key": "value" }'
              style={{ width: '100%', height: 56, background: C.elevated, border: `1px solid ${C.border}`, color: C.muted, padding: '5px 8px', fontSize: 9, borderRadius: 4, fontFamily: 'inherit', resize: 'vertical', outline: 'none' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: USER IMPERSONATION
// ─────────────────────────────────────────────────────────────────────────────

const UserPanel = ({ impersonation, setImpersonation, addAudit }) => {
  const [input, setInput] = useState(impersonation || '');
  const QUICK = ['user_1234', 'admin@acme.io', 'test_qa_engineer', 'beta_tester_99', 'free_tier_user'];

  const apply = useCallback((val) => {
    const v = val ?? input;
    setImpersonation(v);
    if (typeof window !== 'undefined' && window.__COMPASS_CONFIG__) window.__COMPASS_CONFIG__.impersonationId = v;
    addAudit('user.impersonate', v ? `Active: ${v}` : 'Cleared');
  }, [input, setImpersonation, addAudit]);

  const clear = () => { setInput(''); apply(''); };

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      {sectionLabel('Impersonate User Context')}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && apply()}
          placeholder="User ID, UUID, or email…"
          style={{ ...inputStyle(impersonation ? C.gold : C.text), border: `1px solid ${impersonation ? C.gold + '60' : C.border}` }} />
        <button onClick={() => apply()} style={{ ...miniBtn(C.gold, true), flexShrink: 0, padding: '7px 14px' }}>APPLY</button>
      </div>

      {impersonation && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${C.gold}12`, border: `1px solid ${C.gold}30`, borderRadius: 6, padding: '10px 14px', marginBottom: 16 }}>
          <div>
            <div style={{ color: C.faint, fontSize: 8, letterSpacing: 1 }}>ACTIVE SESSION</div>
            <div style={{ color: C.gold, fontSize: 11, fontWeight: 600, marginTop: 3 }}>{impersonation}</div>
          </div>
          <button onClick={clear} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.faint }}>
            <X size={14} />
          </button>
        </div>
      )}

      {sectionLabel('Quick Select')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {QUICK.map(u => (
          <button key={u} onClick={() => { setInput(u); apply(u); }}
            style={{ background: impersonation === u ? `${C.gold}12` : C.surface, border: `1px solid ${impersonation === u ? C.gold + '40' : C.border}`, color: impersonation === u ? C.gold : C.muted, padding: '8px 12px', borderRadius: 4, textAlign: 'left', fontSize: 10, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ChevronRight size={10} style={{ color: C.faint }} />
            {u}
          </button>
        ))}
      </div>

      <p style={{ color: C.faint, fontSize: 9, marginTop: 14, lineHeight: 1.6, padding: '10px 12px', background: C.surface, borderRadius: 6, border: `1px solid ${C.border}` }}>
        Injects <span style={{ color: C.blue }}>X-Compass-Impersonate</span> header into every outgoing fetch. Your backend should swap the session context on this header in staging/dev <em>only</em>.
      </p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: CONSOLE LOGS
// ─────────────────────────────────────────────────────────────────────────────

const LogsPanel = ({ logs, clearLogs }) => {
  const [filter,     setFilter]     = useState('all');
  const [q,          setQ]          = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const bottomRef = useRef(null);

  const visible = logs.filter(l =>
    (filter === 'all' || l.type === filter) &&
    (q === '' || l.msg.toLowerCase().includes(q.toLowerCase()))
  );

  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const LOG_COLOR = { err: C.red, warn: C.gold, info: C.blue, log: C.muted };
  const LOG_BG    = { err: `${C.red}08`,  warn: `${C.gold}08`, info: `${C.blue}08`, log: 'transparent' };

  const copyAll = () => {
    navigator.clipboard.writeText(visible.map(l => `[${l.time}] ${l.type.toUpperCase()} ${l.msg}`).join('\n'));
  };

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      {/* Controls row */}
      <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
        {['all', 'err', 'warn', 'info', 'log'].map(f => {
          const count = f === 'all' ? logs.length : logs.filter(l => l.type === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)}
              style={{ background: filter === f ? C.elevated : 'transparent', border: `1px solid ${filter === f ? C.borderHi : C.border}`, color: filter === f ? C.text : C.faint, fontSize: 8, fontWeight: 700, padding: '5px 8px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 0.5 }}>
              {f.toUpperCase()} {count > 0 && <span style={{ color: LOG_COLOR[f] || C.faint }}>({count})</span>}
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Filter messages…"
          style={{ ...inputStyle(), flex: 1, fontSize: 10, padding: '6px 10px' }} />
        <button onClick={() => setAutoScroll(a => !a)}
          style={{ ...miniBtn(autoScroll ? C.green : C.faint), flexShrink: 0 }}>
          AUTO
        </button>
        <button onClick={copyAll}  style={{ ...miniBtn(C.blue),  flexShrink: 0 }}><Download size={12} /></button>
        <button onClick={clearLogs} style={{ ...miniBtn(C.red), flexShrink: 0 }}>CLR</button>
      </div>

      {/* Log entries */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '6px 8px', height: 300, overflowY: 'auto' }}>
        {visible.length === 0 && (
          <div style={{ color: C.faint, fontSize: 10, textAlign: 'center', paddingTop: 20 }}>No logs captured</div>
        )}
        {visible.map(log => (
          <div key={log.id} style={{ display: 'flex', gap: 8, padding: '3px 4px', borderRadius: 3, background: LOG_BG[log.type] || 'transparent', marginBottom: 1 }}>
            <span style={{ color: C.faint,                    fontSize: 9, flexShrink: 0, width: 60, letterSpacing: 0.3 }}>{log.time}</span>
            <span style={{ color: LOG_COLOR[log.type] || C.muted, fontSize: 8, fontWeight: 700, width: 26, flexShrink: 0, letterSpacing: 0.5 }}>{(log.type || '').toUpperCase()}</span>
            <span style={{ color: C.muted, fontSize: 9, wordBreak: 'break-all', lineHeight: 1.5 }}>{log.msg}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PANEL: SNAPSHOTS + AUDIT TRAIL
// ─────────────────────────────────────────────────────────────────────────────

const SnapPanel = ({ snapshots, setSnapshots, appState, onRestore, audit }) => {
  const takeSnap = () => {
    const snap = {
      id:    Date.now(),
      label: `snap-${new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '')}`,
      time:  nowStr(),
      state: JSON.stringify(appState ?? { _demo: true, ts: Date.now() }),
    };
    setSnapshots(p => [snap, ...p].slice(0, 10));
  };

  const restore   = (snap) => onRestore?.(JSON.parse(snap.state));
  const del       = (id) => setSnapshots(p => p.filter(s => s.id !== id));
  const exportSnap = (snap) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([snap.state], { type: 'application/json' }));
    a.download = `${snap.label}.json`;
    a.click();
  };

  const renameSnap = (id, label) =>
    setSnapshots(p => p.map(s => s.id === id ? { ...s, label } : s));

  return (
    <div style={{ animation: 'compass-fadein 0.2s ease' }}>
      <button onClick={takeSnap}
        style={{ width: '100%', background: `${C.gold}10`, border: `1px solid ${C.gold}40`, color: C.gold, fontFamily: 'inherit', fontSize: 11, fontWeight: 700, padding: 12, borderRadius: 6, cursor: 'pointer', letterSpacing: 1, marginBottom: 14 }}>
        ◆ TAKE SNAPSHOT
      </button>

      {snapshots.length === 0 && (
        <div style={{ color: C.faint, fontSize: 10, textAlign: 'center', padding: '20px 0', border: `1px dashed ${C.border}`, borderRadius: 6, marginBottom: 14 }}>
          No snapshots yet
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 20 }}>
        {snapshots.map(snap => (
          <div key={snap.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '9px 12px', display: 'flex', gap: 10, alignItems: 'center' }}>
            <input value={snap.label} onChange={e => renameSnap(snap.id, e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', color: C.text, fontSize: 10, fontFamily: 'inherit', outline: 'none', padding: 0 }} />
            <span style={{ color: C.faint, fontSize: 9, flexShrink: 0 }}>{snap.time}</span>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => restore(snap)}   title="Restore" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.green }}><RotateCcw size={13} /></button>
              <button onClick={() => exportSnap(snap)} title="Export"  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.blue }}><Download  size={13} /></button>
              <button onClick={() => del(snap.id)}    title="Delete"  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.faint }}><Trash2     size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Trail */}
      {sectionLabel(`Audit Trail (${audit.length})`)}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: 8, maxHeight: 220, overflowY: 'auto' }}>
        {audit.length === 0 && <div style={{ color: C.faint, fontSize: 9, textAlign: 'center', paddingTop: 10 }}>No activity yet</div>}
        {[...audit].reverse().map(a => (
          <div key={a.id} style={{ display: 'flex', gap: 8, padding: '3px 4px', borderBottom: `1px solid ${C.border}` }}>
            <span style={{ color: C.faint, fontSize: 8, flexShrink: 0, width: 55 }}>{a.time}</span>
            <span style={{ color: C.gold, fontSize: 8, width: 110, flexShrink: 0, fontWeight: 600 }}>{a.action}</span>
            <span style={{ color: C.muted, fontSize: 8, wordBreak: 'break-all' }}>{a.detail}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN HUD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function CompassEnterpriseHUD({ adapter, appState, onRestoreState }) {
  setupInterceptors();

  const [open,          setOpen]          = useLS('compass.open',   false);
  const [tab,           setTab]           = useState('flags');
  const [flags,         setFlags]         = useLS('compass.flags',  DEFAULT_FLAGS);
  const [exps,          setExps]          = useLS('compass.exps',   DEFAULT_EXPERIMENTS);
  const [mocks,         setMocks]         = useLS('compass.mocks',  []);
  const [latency,       setLatency]       = useLS('compass.lat',    0);
  const [impersonation, setImpersonation] = useLS('compass.user',   '');
  const [snapshots,     setSnapshots]     = useLS('compass.snaps',  []);
  const [audit,         setAudit]         = useLS('compass.audit',  []);
  const [logs,          setLogs]          = useState([
    { id: 1, time: nowStr(), type: 'info', msg: 'CompassHUD initialized — all interceptors active' },
    { id: 2, time: nowStr(), type: 'warn', msg: '[Auth] Token expires in 44 minutes' },
    { id: 3, time: nowStr(), type: 'err',  msg: '[API] /api/v2/metrics returned HTTP 503' },
  ]);

  const addAudit = useCallback((action, detail) => {
    setAudit(p => [...p.slice(-99), { id: Date.now() + Math.random(), time: nowStr(), action, detail }]);
  }, [setAudit]);

  const clearLogs = () => setLogs([]);

  // Live log sync from window interceptor
  useEffect(() => {
    const handler = () => {
      if (window.__COMPASS_CONFIG__) setLogs([...window.__COMPASS_CONFIG__.logs]);
    };
    window.addEventListener('compass:log', handler);
    return () => window.removeEventListener('compass:log', handler);
  }, []);

  // Sync global interceptor config
  useEffect(() => {
    if (window.__COMPASS_CONFIG__) {
      window.__COMPASS_CONFIG__.latency       = latency;
      window.__COMPASS_CONFIG__.impersonationId = impersonation;
      window.__COMPASS_CONFIG__.mocks         = mocks;
    }
  }, [latency, impersonation, mocks]);

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const h = (e) => { if (e.ctrlKey && e.shiftKey && e.key === 'D') { e.preventDefault(); setOpen(o => !o); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const exportConfig = () => {
    const cfg = { _meta: { exported: new Date().toISOString(), version: BUILD_INFO.VERSION }, flags, exps, mocks, latency, impersonation, audit };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' }));
    a.download = `compass-config-${Date.now()}.json`;
    a.click();
  };

  const importConfig = () => {
    const el = document.createElement('input');
    el.type = 'file';
    el.accept = '.json';
    el.onchange = async (e) => {
      try {
        const text = await e.target.files[0].text();
        const cfg  = JSON.parse(text);
        if (cfg.flags)         setFlags(cfg.flags);
        if (cfg.exps)          setExps(cfg.exps);
        if (cfg.mocks)         setMocks(cfg.mocks);
        if (cfg.latency  != null) setLatency(cfg.latency);
        if (cfg.impersonation != null) setImpersonation(cfg.impersonation);
        addAudit('config.import', `Loaded from file`);
      } catch { addAudit('config.import', 'ERROR: invalid JSON'); }
    };
    el.click();
  };

  // Derive "hasOverrides" badge
  const overrideCount =
    flags.filter((f, i) => f.enabled !== DEFAULT_FLAGS[i]?.enabled || f.rollout !== DEFAULT_FLAGS[i]?.rollout).length +
    exps.filter((e, i)  => e.active  !== DEFAULT_EXPERIMENTS[i]?.active).length +
    mocks.filter(m => m.enabled).length +
    (latency !== 0 ? 1 : 0) +
    (impersonation ? 1 : 0);

  const TABS = [
    { id: 'build', icon: <Package      size={13} />, label: 'BUILD' },
    { id: 'flags', icon: <Shield       size={13} />, label: 'FLAGS' },
    { id: 'labs',  icon: <FlaskConical size={13} />, label: 'LABS'  },
    { id: 'net',   icon: <Network      size={13} />, label: 'NET'   },
    { id: 'user',  icon: <UserCheck    size={13} />, label: 'USER'  },
    { id: 'logs',  icon: <Bug          size={13} />, label: 'LOGS'  },
    { id: 'snap',  icon: <Camera       size={13} />, label: 'SNAP'  },
  ];

  // ── CLOSED STATE (floating trigger button) ──────────────────────────────────
  if (!open) return (
    <div className="compass-hud" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 99999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, fontFamily: "'JetBrains Mono', monospace" }}>
      <style>{FONT_CSS}</style>
      {overrideCount > 0 && (
        <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}40`, borderRadius: 5, padding: '4px 9px', color: C.gold, fontSize: 8, fontWeight: 700, letterSpacing: 1 }}>
          ◆ {overrideCount} OVERRIDE{overrideCount !== 1 ? 'S' : ''} ACTIVE
        </div>
      )}
      <button onClick={() => setOpen(true)} title="Open Compass HUD (Ctrl+Shift+D)"
        style={{ background: C.bg, border: `1px solid ${overrideCount > 0 ? C.gold + '70' : C.border}`, color: overrideCount > 0 ? C.gold : C.muted, width: 46, height: 46, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 28px rgba(0,0,0,0.6)' }}>
        <Zap size={18} style={overrideCount > 0 ? { animation: 'compass-pulse 2s infinite' } : {}} />
      </button>
    </div>
  );

  // ── OPEN STATE (side panel) ─────────────────────────────────────────────────
  return (
    <div className="compass-hud" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: C.bg, borderLeft: `1px solid ${C.border}`, zIndex: 99999, display: 'flex', flexDirection: 'column', fontFamily: "'JetBrains Mono', monospace", boxShadow: '-6px 0 48px rgba(0,0,0,0.7)', animation: 'compass-fadein 0.2s ease' }}>
      <style>{FONT_CSS}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface, flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={13} style={{ color: C.gold }} />
            <span style={{ color: C.text, fontSize: 12, fontWeight: 700, letterSpacing: 2.5 }}>COMPASS</span>
            <span style={pill(C.gold)}>{BUILD_INFO.ENV}</span>
            {overrideCount > 0 && <span style={{ ...pill(C.red), animation: 'compass-pulse 3s infinite' }}>◆ {overrideCount} ACTIVE</span>}
          </div>
          <div style={{ color: C.faint, fontSize: 8, marginTop: 3, letterSpacing: 0.5 }}>
            v{BUILD_INFO.VERSION} · {BUILD_INFO.COMMIT} · Ctrl+Shift+D to toggle
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={importConfig} title="Import config" style={{ background: 'none', border: `1px solid ${C.border}`, color: C.faint, width: 28, height: 28, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={11} />
          </button>
          <button onClick={exportConfig} title="Export config" style={{ background: 'none', border: `1px solid ${C.border}`, color: C.faint, width: 28, height: 28, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Download size={11} />
          </button>
          <button onClick={() => setOpen(false)} style={{ background: 'none', border: `1px solid ${C.border}`, color: C.faint, width: 28, height: 28, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={11} />
          </button>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', background: C.surface, borderBottom: `1px solid ${C.border}`, flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '9px 4px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? C.gold : 'transparent'}`, color: tab === t.id ? C.gold : C.faint, cursor: 'pointer', fontSize: 8, fontWeight: 700, letterSpacing: 0.8, transition: 'all 0.15s', fontFamily: 'inherit', minWidth: 0 }}>
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 24px' }}>
        {tab === 'build' && <BuildPanel />}
        {tab === 'flags' && <FlagsPanel flags={flags} setFlags={setFlags} addAudit={addAudit} />}
        {tab === 'labs'  && <LabsPanel  exps={exps}   setExps={setExps}   addAudit={addAudit} />}
        {tab === 'net'   && <NetPanel   mocks={mocks}  setMocks={setMocks} latency={latency} setLatency={setLatency} addAudit={addAudit} />}
        {tab === 'user'  && <UserPanel  impersonation={impersonation} setImpersonation={setImpersonation} addAudit={addAudit} />}
        {tab === 'logs'  && <LogsPanel  logs={logs}    clearLogs={clearLogs} />}
        {tab === 'snap'  && <SnapPanel  snapshots={snapshots} setSnapshots={setSnapshots} appState={appState} onRestore={onRestoreState} audit={audit} />}
      </div>

      {/* ── FOOTER STATUS BAR ──────────────────────────────────────────────── */}
      <div style={{ padding: '8px 18px', background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          {[
            { label: 'NET',   color: latency < 0 ? C.red : latency > 0 ? C.gold : C.green },
            { label: 'USER',  color: impersonation ? C.gold : C.green },
            { label: `MOCKS (${mocks.filter(m => m.enabled).length})`, color: mocks.some(m => m.enabled) ? C.gold : C.green },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: s.color, boxShadow: `0 0 4px ${s.color}` }} />
              <span style={{ color: C.faint, fontSize: 8, letterSpacing: 0.5 }}>{s.label}</span>
            </div>
          ))}
        </div>
        <span style={{ color: C.faint, fontSize: 8, letterSpacing: 0.5 }}>COMPASS PROXY ACTIVE</span>
      </div>
    </div>
  );
}
