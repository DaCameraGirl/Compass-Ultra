(() => {
  const API_BASE = (window.__COMPASS_API_BASE__ || 'https://compass-ultra-backend-production.up.railway.app').replace(/\/+$/, '');
  const STORAGE_KEY = 'compass-ultra-workspace-v4';

  if (window.__compassAiDevOpsWidgetLoaded) return;
  window.__compassAiDevOpsWidgetLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .cu-ai-widget-button {
      position: fixed;
      right: 24px;
      bottom: 92px;
      z-index: 2147483000;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      border: 1px solid rgba(51, 214, 159, 0.42);
      border-radius: 999px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #101827, #162033);
      color: #f4f7fb;
      box-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
      font: 800 13px/1.1 "Segoe UI", system-ui, sans-serif;
      cursor: pointer;
    }
    .cu-ai-widget-button:hover { border-color: #33d69f; transform: translateY(-1px); }
    .cu-ai-widget-button i {
      display: grid;
      width: 30px;
      height: 30px;
      place-items: center;
      border-radius: 999px;
      background: #33d69f;
      color: #061713;
      font-style: normal;
      font-size: 17px;
    }
    .cu-ai-widget-panel {
      position: fixed;
      right: 24px;
      bottom: 148px;
      z-index: 2147483001;
      display: none;
      width: min(500px, calc(100vw - 32px));
      max-height: min(760px, calc(100vh - 176px));
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      background: #0b1020;
      color: #f4f7fb;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
      font: 14px/1.45 "Segoe UI", system-ui, sans-serif;
    }
    .cu-ai-widget-panel.is-open { display: grid; grid-template-rows: auto 1fr auto; }
    .cu-ai-widget-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: #101827;
    }
    .cu-ai-widget-title { display: grid; gap: 2px; }
    .cu-ai-widget-title strong { font-size: 15px; }
    .cu-ai-widget-title span { color: #9aa7bd; font-size: 12px; }
    .cu-ai-widget-close {
      border: 0;
      border-radius: 8px;
      width: 32px;
      height: 32px;
      background: #162033;
      color: #f4f7fb;
      cursor: pointer;
    }
    .cu-ai-widget-body {
      overflow: auto;
      padding: 14px;
      display: grid;
      gap: 12px;
    }
    .cu-ai-widget-card {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px;
      background: #101827;
    }
    .cu-ai-widget-card strong { display: block; margin-bottom: 5px; }
    .cu-ai-widget-card p { margin: 0; color: #d7e0ee; }
    .cu-ai-widget-prompts, .cu-ai-widget-copybar, .cu-ai-widget-actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .cu-ai-widget-prompts button,
    .cu-ai-widget-send,
    .cu-ai-widget-copybar button {
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      background: #162033;
      color: #f4f7fb;
      padding: 8px 10px;
      cursor: pointer;
      font: inherit;
      font-size: 12px;
    }
    .cu-ai-widget-composer {
      display: grid;
      gap: 10px;
      padding: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      background: #0f1726;
    }
    .cu-ai-widget-composer textarea {
      width: 100%;
      min-height: 82px;
      resize: vertical;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 10px;
      background: #080d19;
      color: #f4f7fb;
      font: inherit;
    }
    .cu-ai-widget-send {
      background: #33d69f;
      color: #061713;
      font-weight: 900;
    }
    .cu-ai-widget-summary-strip {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .cu-ai-widget-summary-strip span {
      display: grid;
      gap: 3px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: #0a1020;
      padding: 8px;
      color: #9aa7bd;
      font-size: 11px;
      text-transform: uppercase;
    }
    .cu-ai-widget-summary-strip strong {
      color: #f4f7fb;
      font-size: 13px;
      text-transform: none;
    }
    .cu-ai-widget-brief {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .cu-ai-widget-brief ul {
      margin: 0;
      padding-left: 18px;
      color: #d7e0ee;
    }
    .cu-ai-widget-brief li { margin: 6px 0; }
    .cu-ai-widget-next {
      border-left: 3px solid #33d69f;
      padding: 8px 10px;
      background: #0a1020;
      color: #d7e0ee;
      border-radius: 8px;
    }
    .cu-ai-widget-report {
      margin-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 10px;
    }
    .cu-ai-widget-report summary {
      width: fit-content;
      border: 1px solid rgba(51, 214, 159, 0.3);
      border-radius: 8px;
      background: #162033;
      color: #33d69f;
      padding: 8px 10px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 800;
      list-style: none;
    }
    .cu-ai-widget-report summary::-webkit-details-marker { display: none; }
    .cu-ai-widget-rendered { margin-top: 12px; }
    .cu-ai-widget-answer {
      color: #e8eef8;
      overflow-x: auto;
    }
    .cu-ai-widget-answer h2,
    .cu-ai-widget-answer h3,
    .cu-ai-widget-answer h4 {
      margin: 14px 0 8px;
      color: #f4f7fb;
      line-height: 1.2;
    }
    .cu-ai-widget-answer h2 { font-size: 17px; }
    .cu-ai-widget-answer h3 { font-size: 15px; color: #33d69f; }
    .cu-ai-widget-answer h4 { font-size: 13px; color: #e3b341; }
    .cu-ai-widget-answer p { margin: 0 0 10px; color: #d7e0ee; }
    .cu-ai-widget-answer ul,
    .cu-ai-widget-answer ol { margin: 8px 0 12px; padding-left: 22px; }
    .cu-ai-widget-answer li { margin: 5px 0; }
    .cu-ai-widget-answer code {
      border-radius: 5px;
      background: #090e1a;
      color: #9be8c9;
      padding: 1px 5px;
      font-family: Consolas, monospace;
    }
    .cu-ai-widget-answer pre {
      margin: 10px 0;
      overflow: auto;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: #080d19;
      padding: 10px;
      color: #d7e0ee;
      white-space: pre-wrap;
      font-family: Consolas, monospace;
      font-size: 12px;
    }
    .cu-ai-widget-answer table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px;
      font-size: 12px;
    }
    .cu-ai-widget-answer th,
    .cu-ai-widget-answer td {
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 7px;
      text-align: left;
      vertical-align: top;
    }
    .cu-ai-widget-answer th { background: #162033; color: #f4f7fb; }
    .cu-ai-widget-answer td { color: #d7e0ee; }
    .cu-ai-widget-meta {
      color: #9aa7bd;
      font-size: 12px;
      margin-top: 8px;
    }
    .cu-ai-widget-copybar { margin-top: 10px; }
    .cu-ai-widget-copybar button { color: #33d69f; }
    @media (max-width: 640px) {
      .cu-ai-widget-button { right: 16px; bottom: 80px; }
      .cu-ai-widget-panel { right: 16px; bottom: 136px; }
      .cu-ai-widget-summary-strip { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.className = 'cu-ai-widget-button';
  button.type = 'button';
  button.innerHTML = '<i>🤖</i><span>AI DevOps</span>';

  const panel = document.createElement('section');
  panel.className = 'cu-ai-widget-panel';
  panel.innerHTML = `
    <div class="cu-ai-widget-head">
      <div class="cu-ai-widget-title">
        <strong>AI DevOps Checker</strong>
        <span>Reads this workspace and checks release readiness.</span>
      </div>
      <button class="cu-ai-widget-close" type="button" aria-label="Close AI DevOps checker">x</button>
    </div>
    <div class="cu-ai-widget-body">
      <div class="cu-ai-widget-card">
        <strong>Live workspace check</strong>
        <p id="cu-ai-widget-summary">Open the platform demo or workspace, then ask what should block the release.</p>
      </div>
      <div class="cu-ai-widget-prompts">
        <button type="button" data-prompt="Run a live release readiness check.">Run check</button>
        <button type="button" data-prompt="What should block this release?">Blockers</button>
        <button type="button" data-prompt="Build a rollback plan from the current flags.">Rollback</button>
        <button type="button" data-prompt="What should GitHub, Jira, and Slack receive?">Payloads</button>
      </div>
      <div id="cu-ai-widget-output" class="cu-ai-widget-card cu-ai-widget-answer">Ask the checker to review the current Compass Ultra workspace.</div>
    </div>
    <form class="cu-ai-widget-composer">
      <textarea name="message" placeholder="Ask the AI DevOps checker..."></textarea>
      <button class="cu-ai-widget-send" type="submit">Ask AI DevOps</button>
    </form>
  `;

  document.body.appendChild(button);
  document.body.appendChild(panel);

  const output = panel.querySelector('#cu-ai-widget-output');
  const summary = panel.querySelector('#cu-ai-widget-summary');
  const form = panel.querySelector('form');
  const textarea = panel.querySelector('textarea');
  let lastAnswer = '';

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

  function renderTable(lines) {
    const rows = lines.filter(line => line.trim().startsWith('|')).map(line =>
      line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim())
    );
    const usefulRows = rows.filter(row => !row.every(cell => /^-+$/.test(cell.replace(/\s/g, ''))));
    if (!usefulRows.length) return '';
    const [head, ...body] = usefulRows;
    return `<table><thead><tr>${head.map(cell => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr>${row.map(cell => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  function renderMarkdown(text) {
    const lines = String(text || '').split('\n');
    const html = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim() || /^---+$/.test(line.trim())) { i += 1; continue; }
      if (line.startsWith('```')) {
        const code = [];
        i += 1;
        while (i < lines.length && !lines[i].startsWith('```')) { code.push(lines[i]); i += 1; }
        html.push(`<pre>${escapeHtml(code.join('\n'))}</pre>`);
      } else if (line.trim().startsWith('|') && lines[i + 1]?.trim().startsWith('|')) {
        const table = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) { table.push(lines[i]); i += 1; }
        html.push(renderTable(table));
        continue;
      } else if (line.startsWith('### ')) {
        html.push(`<h4>${inlineMarkdown(line.slice(4))}</h4>`);
      } else if (line.startsWith('## ')) {
        html.push(`<h3>${inlineMarkdown(line.slice(3))}</h3>`);
      } else if (line.startsWith('# ')) {
        html.push(`<h2>${inlineMarkdown(line.slice(2))}</h2>`);
      } else if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
        const ordered = /^\d+\.\s/.test(line);
        const items = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* ') || /^\d+\.\s/.test(lines[i]))) {
          items.push(`<li>${inlineMarkdown(lines[i].replace(/^[-*]\s/, '').replace(/^\d+\.\s/, ''))}</li>`);
          i += 1;
        }
        html.push(ordered ? `<ol>${items.join('')}</ol>` : `<ul>${items.join('')}</ul>`);
        continue;
      } else if (line.startsWith('> ')) {
        html.push(`<p><strong>${inlineMarkdown(line.slice(2))}</strong></p>`);
      } else {
        html.push(`<p>${inlineMarkdown(line)}</p>`);
      }
      i += 1;
    }
    return html.join('');
  }

  function extractDecision(answer, fallback) {
    const text = String(answer || '');
    const decision = text.match(/Decision:\s*\*{0,2}([A-Z -]+)/i)?.[1]?.trim()
      || text.match(/##\s*Decision:\s*\*{0,2}([A-Z -]+)/i)?.[1]?.trim()
      || fallback?.decision
      || 'CHECKED';
    const risk = text.match(/Risk(?: level)?:\s*\*{0,2}([A-Z]+)/i)?.[1]?.trim()
      || fallback?.risk
      || (decision.includes('HOLD') ? 'HIGH' : decision.includes('CAUTION') ? 'MEDIUM' : 'REVIEW');
    return { decision: decision.replace(/[\-*|].*$/, '').trim(), risk };
  }

  function cleanLine(value) {
    return String(value || '')
      .replace(/^[-*]\s+/, '')
      .replace(/^\d+\.\s+/, '')
      .replace(/^[|\s]+|[|\s]+$/g, '')
      .replace(/\*\*/g, '')
      .trim();
  }

  function sectionText(answer, label) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = String(answer || '').match(new RegExp(`(?:^|\n)#{2,3}[^\n]*${escaped}[^\n]*\n([\s\S]*?)(?=\n#{2,3} |$)`, 'i'));
    return (match?.[1] || answer || '').trim();
  }

  function extractBrief(answer, data) {
    const text = String(answer || '');
    const blockers = Array.isArray(data.blockers) ? data.blockers.map(blocker => blocker.detail || blocker.label || blocker).filter(Boolean) : [];
    const actions = Array.isArray(data.actions) ? data.actions.map(action => action.detail || action.label || action).filter(Boolean) : [];
    const lines = text.split('\n').map(cleanLine).filter(Boolean);

    const issueLines = lines.filter(line => (
      /critical|blocker|expires|depends|rollout|circuit|missing|disabled|warning/i.test(line)
      && !/^#+/.test(line)
      && !/^decision:/i.test(line)
      && !/^risk:/i.test(line)
      && !/^mode:/i.test(line)
      && !/^table|flag|owner|status|check|result$/i.test(line)
      && line.length > 12
    ));

    const nextAction = actions[0]
      || lines.find(line => /extend|confirm|ramp|fix|obtain|verify|re-run|do not deploy|sign off/i.test(line))
      || 'Review blockers, confirm owner sign-off, then re-run the readiness check.';

    return {
      blockers: [...blockers, ...issueLines].slice(0, 3),
      nextAction,
    };
  }

  function showResult(data, message) {
    lastAnswer = data.answer || data.summary || 'Checker completed.';
    const { decision, risk } = extractDecision(lastAnswer, data);
    const brief = extractBrief(lastAnswer, data);
    const needsPayloadButtons = /github|jira|slack|payload/i.test(`${message}\n${lastAnswer}`);
    output.innerHTML = `
      <div class="cu-ai-widget-summary-strip">
        <span>Decision<strong>${escapeHtml(decision)}</strong></span>
        <span>Risk<strong>${escapeHtml(risk)}</strong></span>
        <span>Mode<strong>${escapeHtml(data.mode || 'checker')}</strong></span>
      </div>
      <div class="cu-ai-widget-brief">
        <strong>Top findings</strong>
        <ul>${brief.blockers.map(item => `<li>${inlineMarkdown(item)}</li>`).join('') || '<li>No hard blocker found in the response.</li>'}</ul>
        <div class="cu-ai-widget-next"><strong>Next:</strong> ${inlineMarkdown(brief.nextAction)}</div>
      </div>
      ${needsPayloadButtons ? `
        <div class="cu-ai-widget-copybar">
          <button type="button" data-copy-section="GitHub">Copy GitHub</button>
          <button type="button" data-copy-section="Jira">Copy Jira</button>
          <button type="button" data-copy-section="Slack">Copy Slack</button>
        </div>
      ` : ''}
      <details class="cu-ai-widget-report">
        <summary>View Full Report</summary>
        <div class="cu-ai-widget-rendered">${renderMarkdown(lastAnswer)}</div>
      </details>
      ${data.providerError ? `<div class="cu-ai-widget-meta">Provider fallback: ${escapeHtml(data.providerError)}</div>` : ''}
    `;
    output.querySelectorAll('[data-copy-section]').forEach(copyButton => {
      copyButton.addEventListener('click', async () => {
        const label = copyButton.dataset.copySection;
        await navigator.clipboard.writeText(sectionText(lastAnswer, label));
        copyButton.textContent = `Copied ${label}`;
        setTimeout(() => { copyButton.textContent = `Copy ${label}`; }, 1400);
      });
    });
  }

  function getWorkspace() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function fallbackFlags() {
    return [
      { key: 'checkout.express_pay', enabled: true, criticality: 'high', rollout: 45, owner: 'Growth', expiresAt: '2026-12-01', dependencies: ['payments.stripe_v4'] },
      { key: 'payments.stripe_v4', enabled: true, criticality: 'critical', rollout: 100, owner: 'Payments', expiresAt: '2026-11-30', dependencies: [] },
      { key: 'inventory.realtime_sync', enabled: true, criticality: 'high', rollout: 60, owner: 'Platform', expiresAt: '2026-11-28', dependencies: [] },
      { key: 'promos.flash_sale_engine', enabled: false, criticality: 'high', rollout: 0, owner: 'Growth', expiresAt: 'not set', dependencies: ['inventory.realtime_sync'] },
    ];
  }

  function buildChecks(flags, release) {
    const highRollout = flags.filter(flag => flag.enabled && ['high', 'critical'].includes(String(flag.criticality).toLowerCase()) && Number(flag.rollout || 0) >= 70);
    const missingExpiry = flags.filter(flag => flag.enabled && (!flag.expiresAt || flag.expiresAt === 'not set'));
    const brokenDeps = flags.filter(flag => flag.enabled && Array.isArray(flag.dependencies) && flag.dependencies.some(dep => !flags.find(item => item.key === dep && item.enabled)));
    return [
      { label: 'Change ticket attached', status: release?.changeTicket ? 'pass' : 'block', detail: release?.changeTicket || 'Missing change ticket' },
      { label: 'High-risk rollout exposure', status: highRollout.length ? 'warn' : 'pass', detail: highRollout.length ? `${highRollout.length} high-risk rollout(s) at 70%+` : 'No high-risk rollout over policy threshold' },
      { label: 'Flag expirations', status: missingExpiry.length ? 'block' : 'pass', detail: missingExpiry.length ? `${missingExpiry.length} enabled flag(s) missing expiration` : 'Expiration metadata present' },
      { label: 'Dependencies enabled', status: brokenDeps.length ? 'block' : 'pass', detail: brokenDeps.length ? `${brokenDeps.length} dependency gap(s)` : 'Dependency graph is satisfied' },
    ];
  }

  function currentPayload(message) {
    const workspace = getWorkspace();
    const flags = Array.isArray(workspace.flags) && workspace.flags.length ? workspace.flags : fallbackFlags();
    const release = workspace.release || { train: 'peak-sale-2026.11', environment: 'production', changeTicket: 'CHG-DEMO', window: 'next production deploy' };
    const context = workspace.context || { environment: 'production' };
    summary.textContent = `${flags.length} flag(s), ${flags.filter(flag => flag.enabled).length} enabled, ${release.changeTicket || 'no change ticket'}.`;
    return {
      message,
      release: {
        train: release.train || 'demo-release',
        environment: context.environment || release.environment || 'production',
        changeTicket: release.changeTicket || '',
        window: release.window || 'not set',
      },
      flags,
      checks: buildChecks(flags, release),
    };
  }

  async function ask(message) {
    output.innerHTML = '<div class="cu-ai-widget-empty">Checking this workspace...</div>';
    try {
      const response = await fetch(`${API_BASE}/api/v1/ai-devops/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPayload(message)),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      showResult(data, message);
    } catch (error) {
      const fallback = `## Decision: REVIEW\n\nRisk: UNKNOWN\n\nThe checker could not reach the backend yet. ${error.message}\n\n## Next Actions\n- Verify policy blockers.\n- Check high-risk rollouts.\n- Confirm missing expirations.\n- Validate dependency gaps and rollback evidence before launch.`;
      showResult({ answer: fallback, decision: 'REVIEW', risk: 'UNKNOWN', mode: 'offline-fallback' }, message);
    }
  }

  button.addEventListener('click', () => {
    panel.classList.toggle('is-open');
    currentPayload('summary');
  });
  panel.querySelector('.cu-ai-widget-close').addEventListener('click', () => panel.classList.remove('is-open'));
  panel.querySelectorAll('[data-prompt]').forEach(promptButton => {
    promptButton.addEventListener('click', () => {
      textarea.value = promptButton.dataset.prompt;
      ask(promptButton.dataset.prompt);
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const message = textarea.value.trim() || 'Run a live release readiness check.';
    ask(message);
  });

  currentPayload('summary');
})();