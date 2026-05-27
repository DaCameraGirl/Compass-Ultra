(() => {
  const API_BASE = (window.__COMPASS_API_BASE__ || 'https://compass-ultra-backend-production.up.railway.app').replace(/\/+$/, '');
  const STORAGE_KEY = 'compass-ultra-workspace-v4';
  const SESSION_KEY = 'cu-aiw-session-id';
  const SESSIONS_LOCAL_KEY = 'cu-aiw-local-session-log';

  if (window.__compassAiDevOpsWidgetLoaded) return;
  window.__compassAiDevOpsWidgetLoaded = true;

  // ── Session tracking ──────────────────────────────────────────────────────
  // Each unique browser session gets one ID (stored in sessionStorage so it
  // resets on every new tab/window). We also keep a running log of unique
  // session IDs in localStorage so we can show a rough local count before
  // the backend stats endpoint is wired up.

  function getOrCreateSessionId() {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem(SESSION_KEY, id);
      try {
        const log = JSON.parse(localStorage.getItem(SESSIONS_LOCAL_KEY) || '[]');
        if (!log.includes(id)) {
          log.push(id);
          localStorage.setItem(SESSIONS_LOCAL_KEY, JSON.stringify(log.slice(-500)));
        }
      } catch {}
    }
    return id;
  }

  function localSessionCount() {
    try {
      return JSON.parse(localStorage.getItem(SESSIONS_LOCAL_KEY) || '[]').length;
    } catch {
      return 0;
    }
  }

  const sessionId = getOrCreateSessionId();
  let liveStats = null;

  async function fetchStats() {
    try {
      const res = await fetch(`${API_BASE}/api/v1/ai-devops/stats`, { method: 'GET' });
      if (res.ok) {
        liveStats = await res.json();
        refreshStatsBar();
      }
    } catch {
      // Endpoint not yet deployed — local count is the fallback
    }
  }

  // ── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .cu-aiw-button{position:fixed;right:24px;bottom:92px;z-index:2147483000;display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(51,214,159,.42);border-radius:999px;padding:12px 16px;background:#101827;color:#f4f7fb;box-shadow:0 18px 48px rgba(0,0,0,.42);font:800 13px/1.1 "Segoe UI",system-ui,sans-serif;cursor:pointer}
    .cu-aiw-button:hover{border-color:#33d69f;transform:translateY(-1px)}
    .cu-aiw-dot{display:grid;width:30px;height:30px;place-items:center;border-radius:999px;background:#33d69f;color:#061713;font-style:normal;font-size:13px;font-weight:900}
    .cu-aiw-panel{position:fixed;right:24px;bottom:148px;z-index:2147483001;display:none;width:min(500px,calc(100vw - 32px));max-height:min(760px,calc(100vh - 176px));overflow:hidden;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#0b1020;color:#f4f7fb;box-shadow:0 24px 80px rgba(0,0,0,.55);font:14px/1.45 "Segoe UI",system-ui,sans-serif}
    .cu-aiw-panel.is-open{display:grid;grid-template-rows:auto 1fr auto auto}
    .cu-aiw-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.1);background:#101827}
    .cu-aiw-title{display:grid;gap:2px}.cu-aiw-title strong{font-size:15px}.cu-aiw-title span{color:#9aa7bd;font-size:12px}
    .cu-aiw-close{border:0;border-radius:8px;width:32px;height:32px;background:#162033;color:#f4f7fb;cursor:pointer}
    .cu-aiw-body{overflow:auto;padding:14px;display:grid;gap:12px}
    .cu-aiw-card{border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px;background:#101827}
    .cu-aiw-card strong{display:block;margin-bottom:5px}.cu-aiw-card p{margin:0;color:#d7e0ee}
    .cu-aiw-prompts,.cu-aiw-copybar{display:flex;flex-wrap:wrap;gap:8px}
    .cu-aiw-prompts button,.cu-aiw-copybar button,.cu-aiw-send{border:1px solid rgba(255,255,255,.12);border-radius:8px;background:#162033;color:#f4f7fb;padding:8px 10px;cursor:pointer;font:inherit;font-size:12px}
    .cu-aiw-feed{display:grid;gap:10px}
    .cu-aiw-msg{max-width:92%;border-radius:12px;padding:10px 12px;white-space:pre-wrap}
    .cu-aiw-user{justify-self:end;background:#1f6feb;color:#fff}
    .cu-aiw-bot{justify-self:start;background:#101827;border:1px solid rgba(255,255,255,.1);color:#e8eef8}
    .cu-aiw-report{display:grid;gap:10px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#101827;padding:12px}
    .cu-aiw-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .cu-aiw-strip span{display:grid;gap:3px;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:#0a1020;padding:8px;color:#9aa7bd;font-size:11px;text-transform:uppercase}
    .cu-aiw-strip strong{color:#f4f7fb;font-size:13px;text-transform:none}
    .cu-aiw-answer h2,.cu-aiw-answer h3{margin:12px 0 8px;color:#f4f7fb;line-height:1.2}.cu-aiw-answer h2{font-size:17px}.cu-aiw-answer h3{font-size:15px;color:#33d69f}
    .cu-aiw-answer p{margin:0 0 10px;color:#d7e0ee}.cu-aiw-answer ul,.cu-aiw-answer ol{margin:8px 0 12px;padding-left:22px}.cu-aiw-answer li{margin:5px 0}
    .cu-aiw-answer code{border-radius:5px;background:#090e1a;color:#9be8c9;padding:1px 5px;font-family:Consolas,monospace}
    .cu-aiw-composer{display:grid;gap:10px;padding:14px;border-top:1px solid rgba(255,255,255,.1);background:#0f1726}
    .cu-aiw-composer textarea{width:100%;min-height:82px;resize:vertical;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:10px;background:#080d19;color:#f4f7fb;font:inherit}
    .cu-aiw-send{background:#33d69f;color:#061713;font-weight:900}
    .cu-aiw-statsbar{display:flex;gap:16px;align-items:center;padding:8px 14px;border-top:1px solid rgba(255,255,255,.06);background:#08101e;font-size:11px;color:#9aa7bd;flex-wrap:wrap}
    .cu-aiw-statsbar b{color:#33d69f}
    @media(max-width:640px){.cu-aiw-button{right:16px;bottom:80px}.cu-aiw-panel{right:16px;bottom:136px}.cu-aiw-strip{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  // ── DOM ───────────────────────────────────────────────────────────────────
  const button = document.createElement('button');
  button.className = 'cu-aiw-button';
  button.type = 'button';
  button.innerHTML = '<i class="cu-aiw-dot">AI</i><span>AI DevOps</span>';

  const panel = document.createElement('section');
  panel.className = 'cu-aiw-panel';
  panel.innerHTML = `
    <div class="cu-aiw-head">
      <div class="cu-aiw-title">
        <strong>AI DevOps Checker</strong>
        <span>Talks through this workspace and checks release readiness.</span>
      </div>
      <button class="cu-aiw-close" type="button" aria-label="Close AI DevOps checker">x</button>
    </div>
    <div class="cu-aiw-body">
      <div class="cu-aiw-card">
        <strong>Live workspace</strong>
        <p id="cu-aiw-summary">Open the platform demo or workspace, then ask about the release.</p>
      </div>
      <div class="cu-aiw-prompts">
        <button type="button" data-prompt="Run a live release readiness check.">Run check</button>
        <button type="button" data-prompt="What should block this release?">Blockers</button>
        <button type="button" data-prompt="Build a rollback plan from the current flags.">Rollback</button>
        <button type="button" data-prompt="What should GitHub, Jira, and Slack receive?">Payloads</button>
      </div>
      <div id="cu-aiw-feed" class="cu-aiw-feed">
        <div class="cu-aiw-msg cu-aiw-bot">Hi. Ask me about the release, blockers, rollback, Jira, Slack, or whether it is safe to ship.</div>
      </div>
    </div>
    <form class="cu-aiw-composer">
      <textarea name="message" placeholder="Ask AI DevOps..."></textarea>
      <button class="cu-aiw-send" type="submit">Ask AI DevOps</button>
    </form>
    <div class="cu-aiw-statsbar" id="cu-aiw-statsbar" title="Session counter — powered by Compass Ultra">
      <span>Sessions: <b id="cu-aiw-session-count">—</b></span>
      <span>Messages: <b id="cu-aiw-msg-count">—</b></span>
      <span style="margin-left:auto;color:#3d4451;font-size:10px" id="cu-aiw-stats-source"></span>
    </div>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  const feed = panel.querySelector('#cu-aiw-feed');
  const summary = panel.querySelector('#cu-aiw-summary');
  const form = panel.querySelector('form');
  const textarea = panel.querySelector('textarea');
  const sendButton = panel.querySelector('.cu-aiw-send');
  const promptButtons = Array.from(panel.querySelectorAll('[data-prompt]'));
  const sessionCountEl = panel.querySelector('#cu-aiw-session-count');
  const msgCountEl = panel.querySelector('#cu-aiw-msg-count');
  const statsSourceEl = panel.querySelector('#cu-aiw-stats-source');
  const chatHistory = [];
  let running = false;
  let messageCount = 0;

  function refreshStatsBar() {
    if (liveStats) {
      sessionCountEl.textContent = (liveStats.unique_sessions ?? liveStats.sessions ?? '—').toLocaleString();
      msgCountEl.textContent = (liveStats.total_messages ?? liveStats.messages ?? '—').toLocaleString();
      statsSourceEl.textContent = 'live ✓';
    } else {
      const local = localSessionCount();
      sessionCountEl.textContent = local > 0 ? local.toLocaleString() : '—';
      msgCountEl.textContent = messageCount > 0 ? messageCount.toLocaleString() : '—';
      statsSourceEl.textContent = 'local';
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  }

  function renderMarkdown(text) {
    const lines = String(text || '').split('\n');
    const html = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim() || /^---+$/.test(line.trim())) { i += 1; continue; }
      if (line.startsWith('## ')) html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      else if (line.startsWith('# ')) html.push(`<h2>${inlineMarkdown(line.slice(2))}</h2>`);
      else if (line.startsWith('- ') || /^\d+\.\s/.test(line)) {
        const ordered = /^\d+\.\s/.test(line);
        const items = [];
        while (i < lines.length && (lines[i].startsWith('- ') || /^\d+\.\s/.test(lines[i]))) {
          items.push(`<li>${inlineMarkdown(lines[i].replace(/^-\s/, '').replace(/^\d+\.\s/, ''))}</li>`);
          i += 1;
        }
        html.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`);
        continue;
      } else {
        html.push(`<p>${inlineMarkdown(line)}</p>`);
      }
      i += 1;
    }
    return html.join('');
  }

  function plainAnswer(answer) {
    return String(answer || '')
      .replace(/^#+\s*/gm, '')
      .replace(/^Decision:\s.*$/gmi, '')
      .replace(/^Risk:\s.*$/gmi, '')
      .replace(/^Risk level:\s.*$/gmi, '')
      .replace(/^Mode:\s.*$/gmi, '')
      .trim();
  }

  function sectionText(answer, label) {
    const text = String(answer || '').trim();
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|\\n)#{1,3}\\s*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n#{1,3}\\s+|$)`, 'i');
    const match = text.match(pattern);
    return (match?.[1] || text).trim();
  }

  function addMessage(role, html) {
    const node = document.createElement('div');
    node.className = `cu-aiw-msg ${role === 'user' ? 'cu-aiw-user' : 'cu-aiw-bot'}`;
    node.innerHTML = html;
    feed.appendChild(node);
    node.scrollIntoView({ block: 'end' });
  }

  function remember(role, content) {
    chatHistory.push({ role, content: String(content || '').slice(0, 1200) });
    while (chatHistory.length > 8) chatHistory.shift();
  }

  function addReport(data) {
    const node = document.createElement('div');
    node.className = 'cu-aiw-report cu-aiw-answer';
    node.innerHTML = `
      <div class="cu-aiw-strip">
        <span>Decision<strong>${escapeHtml(data.decision || 'CHECKED')}</strong></span>
        <span>Risk<strong>${escapeHtml(data.risk || 'REVIEW')}</strong></span>
        <span>Mode<strong>${escapeHtml(data.mode || 'checker')}</strong></span>
      </div>
      <div>${renderMarkdown(data.answer || data.summary || 'Checker completed.')}</div>
      ${/github|jira|slack|payload/i.test(data.answer || '') ? `
        <div class="cu-aiw-copybar">
          <button type="button" data-copy="GitHub">Copy GitHub text</button>
          <button type="button" data-copy="Jira">Copy Jira text</button>
          <button type="button" data-copy="Slack">Copy Slack text</button>
        </div>` : ''}
    `;
    feed.appendChild(node);
    node.querySelectorAll('[data-copy]').forEach((copyButton) => {
      copyButton.addEventListener('click', async () => {
        const label = copyButton.dataset.copy;
        await navigator.clipboard.writeText(sectionText(data.answer || data.summary || '', label));
        copyButton.textContent = `Copied ${copyButton.dataset.copy}`;
        setTimeout(() => { copyButton.textContent = `Copy ${copyButton.dataset.copy} text`; }, 1400);
      });
    });
    node.scrollIntoView({ block: 'end' });
    // If the backend echoes stats back, use them to update the bar
    if (data.session_count != null || data.total_sessions != null) {
      liveStats = { ...liveStats, unique_sessions: data.session_count ?? data.total_sessions, total_messages: data.total_messages };
      refreshStatsBar();
    }
  }

  function getWorkspace() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function landingDemoWorkspace() {
    const rows = Array.from(document.querySelectorAll('.lp-root .dash-flag-row'));
    if (rows.length < 3) return null;
    const meta = {
      'checkout.new_flow': { owner: 'Growth', criticality: 'high', expiresAt: '2026-11-27', dependencies: ['payments.stripe_v4'] },
      'payments.stripe_v4': { owner: 'Payments', criticality: 'medium', expiresAt: '2026-11-30', dependencies: [] },
      'eu.gdpr_consent_v2': { owner: 'Legal', criticality: 'medium', expiresAt: '2026-05-24', dependencies: [] },
      'dark_mode_v3': { owner: 'Frontend', criticality: 'low', expiresAt: '2027-03-01', dependencies: [] },
      'flash_sale_engine': { owner: 'Commerce', criticality: 'high', expiresAt: 'not set', dependencies: ['payments.stripe_v4'] },
    };
    const flags = rows.map((row) => {
      const name = row.querySelector('.dash-flag-name')?.textContent?.trim() || 'Demo flag';
      const keyText = row.querySelector('.dash-flag-key')?.textContent?.trim() || '';
      const key = keyText.split('·')[0]?.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.|\.$/g, '');
      const details = meta[key] || { owner: 'Product', criticality: 'medium', expiresAt: '2026-12-31', dependencies: [] };
      return {
        key,
        name,
        enabled: !/disabled/i.test(keyText),
        rollout: Number(keyText.match(/(\d+)%/)?.[1] || 0),
        source: 'Landing demo',
        ...details,
      };
    });
    return {
      source: 'landing-demo-dom',
      release: { train: 'peak-sale-2026.11', environment: 'production', changeTicket: 'CHG-1850', window: 'Thu 23:00-01:00 ET' },
      context: { environment: 'production' },
      flags,
    };
  }

  function fallbackFlags() {
    return [
      { key: 'checkout.new_flow', enabled: true, criticality: 'high', rollout: 85, owner: 'Growth', expiresAt: '2026-11-27', dependencies: ['payments.stripe_v4'] },
      { key: 'payments.stripe_v4', enabled: true, criticality: 'medium', rollout: 100, owner: 'Payments', expiresAt: '2026-11-30', dependencies: [] },
      { key: 'eu.gdpr_consent_v2', enabled: true, criticality: 'medium', rollout: 100, owner: 'Legal', expiresAt: '2026-05-24', dependencies: [] },
      { key: 'flash_sale_engine', enabled: true, criticality: 'high', rollout: 0, owner: 'Commerce', expiresAt: 'not set', dependencies: ['payments.stripe_v4'] },
    ];
  }

  function buildChecks(flags, release) {
    const missingExpiry = flags.filter((flag) => flag.enabled && (!flag.expiresAt || flag.expiresAt === 'not set'));
    const highRollout = flags.filter((flag) => flag.enabled && ['high', 'critical'].includes(String(flag.criticality).toLowerCase()) && Number(flag.rollout || 0) >= 70);
    const brokenDeps = flags.filter((flag) => flag.enabled && Array.isArray(flag.dependencies) && flag.dependencies.some((dep) => !flags.find((item) => item.key === dep && item.enabled)));
    return [
      { label: 'Change ticket attached', status: release?.changeTicket ? 'pass' : 'block', detail: release?.changeTicket || 'Missing change ticket' },
      { label: 'High-risk rollout exposure', status: highRollout.length ? 'warn' : 'pass', detail: highRollout.length ? `${highRollout.length} high-risk rollout(s) at 70%+` : 'No high-risk rollout over policy threshold' },
      { label: 'Flag expirations', status: missingExpiry.length ? 'block' : 'pass', detail: missingExpiry.length ? `${missingExpiry.length} enabled flag(s) missing expiration` : 'Expiration metadata present' },
      { label: 'Dependencies enabled', status: brokenDeps.length ? 'block' : 'pass', detail: brokenDeps.length ? `${brokenDeps.length} dependency gap(s)` : 'Dependency graph is satisfied' },
    ];
  }

  function currentPayload(message) {
    const workspace = landingDemoWorkspace() || getWorkspace();
    const flags = Array.isArray(workspace.flags) && workspace.flags.length ? workspace.flags : fallbackFlags();
    const release = workspace.release || { train: 'peak-sale-2026.11', environment: 'production', changeTicket: 'CHG-1850', window: 'next production deploy' };
    const source = workspace.source ? ` · ${workspace.source}` : '';
    summary.textContent = `${flags.length} flag(s), ${flags.filter((flag) => flag.enabled).length} enabled, ${release.changeTicket || 'no change ticket'}${source}.`;
    return {
      message,
      history: chatHistory.slice(-8),
      release,
      context: workspace.context || { environment: 'production' },
      flags,
      checks: buildChecks(flags, release),
      // ── Session tracking ──────────────────────────────────────────────
      // session_id is stable for the browser tab; resets on a new tab so
      // each new visitor gets a fresh ID. local_session_count lets the AI
      // mention visitor count in conversation before backend stats are live.
      session_id: sessionId,
      local_session_count: liveStats?.unique_sessions ?? localSessionCount(),
    };
  }

  // ── Send a message ────────────────────────────────────────────────────────
  async function ask(message) {
    if (running) return;
    running = true;
    sendButton.disabled = true;
    promptButtons.forEach((promptButton) => { promptButton.disabled = true; });
    addMessage('user', escapeHtml(message));
    remember('user', message);
    const loading = document.createElement('div');
    loading.className = 'cu-aiw-msg cu-aiw-bot';
    loading.textContent = 'Thinking...';
    feed.appendChild(loading);
    loading.scrollIntoView({ block: 'end' });

    try {
      const response = await fetch(`${API_BASE}/api/v1/ai-devops/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload(message)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      loading.remove();
      messageCount += 1;
      if (data.mode === 'conversation') {
        const answer = plainAnswer(data.answer || data.summary);
        addMessage('bot', renderMarkdown(answer));
        remember('assistant', answer);
      } else {
        addReport(data);
        remember('assistant', data.answer || data.summary || 'Release check completed.');
      }
      // Update stats bar from backend response if available
      if (data.session_count != null || data.total_sessions != null) {
        liveStats = { ...liveStats, unique_sessions: data.session_count ?? data.total_sessions, total_messages: data.total_messages };
      }
      refreshStatsBar();
    } catch (error) {
      loading.remove();
      addMessage('bot', `I could not reach the checker backend yet. ${escapeHtml(error.message)}`);
    } finally {
      running = false;
      sendButton.disabled = false;
      promptButtons.forEach((promptButton) => { promptButton.disabled = false; });
    }
  }

  // ── Event wiring ──────────────────────────────────────────────────────────
  button.addEventListener('click', () => {
    panel.classList.toggle('is-open');
    currentPayload('summary');
    if (panel.classList.contains('is-open')) {
      refreshStatsBar();
      fetchStats(); // async — updates bar when it resolves
    }
  });
  panel.querySelector('.cu-aiw-close').addEventListener('click', () => panel.classList.remove('is-open'));
  promptButtons.forEach((promptButton) => {
    promptButton.addEventListener('click', () => {
      if (running) return;
      textarea.value = promptButton.dataset.prompt;
      ask(promptButton.dataset.prompt);
    });
  });
  textarea.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    form.requestSubmit();
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (running) return;
    const message = textarea.value.trim() || 'Run a live release readiness check.';
    textarea.value = '';
    ask(message);
  });

  currentPayload('summary');
})();
