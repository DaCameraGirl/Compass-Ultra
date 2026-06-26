# 🧭 Compass Ultra 

> **Intelligence sulle release per i team che rilasciano dietro feature flag.**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-6366f1?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra è una sala di controllo delle release per software basato su feature flag. Rivedi lo stato dei flag, i gate di policy, il rischio di rollout, i diff degli snapshot, l'analisi del rischio assistita dall'AI e la prova di release pronta per l'audit — prima che le modifiche in produzione vadano live.

[🚀 App live](https://www.compassultra.com) · [🎮 Prova la demo](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ Perché Compass Ultra?

Le feature flag dovrebbero rendere le release più sicure.

Ma col tempo possono diventare una superficie di release a sé stante:

* 🧟 Flag obsoleti o scaduti
* 🎲 Percentuali di rollout rischiose
* 👤 Proprietari e approvatori mancanti
* 🕸️ Dipendenze nascoste tra flag
* 🚨 Override in produzione
* 💬 Thread Slack che fanno finta di essere audit trail
* 🧩 Decisioni di release sparse su troppi strumenti

**Compass Ultra trasforma il caos delle feature flag in un flusso di revisione release ripetibile.**

Invece di chiedersi:

> "Possiamo rilasciare?"

Il team può rispondere:

* ✅ Cosa è abilitato?
* 👥 Chi è coinvolto?
* 🔄 Cosa è cambiato?
* 💥 Cosa può rompersi?
* 🖊️ Chi l'ha approvato?
* 🧯 Cosa va corretto prima?
* 📄 Quale prova possiamo consegnare a QA, DevOps, leadership o compliance?

---

## ⚡ La versione breve

Compass Ultra aiuta i team a rivedere e dimostrare la readiness della release prima del deploy.

Una revisione release tipica funziona così:

1. 📦 Carica o importa un workspace di release.
2. 👤 Valuta i flag rispetto a un contesto utente reale.
3. 🛡️ Esegui gate di policy e analisi del rischio.
4. 🔍 Confronta gli snapshot di release.
5. 📄 Esporta un runbook di release.
6. 🚀 Condividi la prova prima che le modifiche in produzione vadano live.

---

## 🎮 Demo live

La demo funziona senza account:

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

La demo simula una release retail rischiosa (vigilia del Black Friday, `peak-sale-2026.11`) con:

* 🏁 10 feature flag su LaunchDarkly, Statsig e Firebase
* 🛒 Flag ad alto rischio per checkout, flash sale e spedizione in giornata
* 🚧 Blocchi e avvisi di policy (lacune nelle dipendenze, violazioni canary)
* 🔗 Controlli del grafo delle dipendenze
* 🧾 Confronto snapshot
* 📄 Esportazione runbook PDF
* 🔌 Generazione payload GitHub, Jira e Slack
* 🧯 Flusso di rollback kill-switch per lo stato demo
* 💰 Stima dell'impatto finanziario per la finestra di deploy a traffico di picco

---

## 🧠 Funzionalità principali

### 🚦 Analizzatore del rischio di release

Compass Ultra rivede il workspace di release corrente e restituisce una valutazione pratica:

* ✅ **Rilascia**
* 🟡 **In attesa**
* 🔴 **Correggi prima**

Alimentato da un servizio AI live con fallback deterministico — l'analisi non viene mai bloccata anche quando il servizio AI non è disponibile.

Può rilevare problemi come:

* 🔥 Flag attivi ad alto rischio
* 🔗 Conflitti di dipendenze
* 👻 Approvatori mancanti
* ⏰ Flag scaduti o senza proprietario
* 🐤 Violazioni del rollout canary
* 🚨 Override in produzione
* 🧾 Pattern di rollout sensibili per la compliance
* 💰 Stime dell'impatto finanziario per finestre di deploy a traffico di picco

---

### 🎯 Motore di valutazione dei flag

Valuta ogni flag rispetto a un contesto utente specifico.

| Campo | Descrizione |
| --- | --- |
| 👤 User key | Identificatore utente univoco |
| 📧 Email | Indirizzo email utente |
| 🏢 Tenant | Tenant cliente o account |
| 💳 Plan | Piano tariffario o di entitlement |
| 🛂 Role | Ruolo utente o gruppo di permessi |
| 🌎 Region | Regione geografica o infrastrutturale |
| 🏳️ Country | Targeting a livello paese |
| 📱 Device | Tipo di dispositivo o piattaforma |
| 🌐 Environment | Sviluppo, staging, produzione o ambiente personalizzato |

Ogni flag mostra:

* 🎚️ Valore valutato
* 🧠 Motivo della risoluzione (match regola, bucket rollout, default o override)
* 🧩 Regola o condizione corrispondente
* 📌 Contesto rilevante usato durante la valutazione

Passa tra preset di contesto salvati — Production admin, EU customer, Mobile guest — per vedere come i flag si comportano per segmento.

---

### 🛡️ Gate di policy enterprise (9 controlli)

Compass Ultra esegue controlli automatici di release ad ogni cambiamento dello stato del workspace.

| 🔒 Gate | Cosa controlla |
| --- | --- |
| 🎟️ Ticket di change allegato | Ticket CHG o Jira presente prima della produzione |
| 👥 Flag critici con approvatori | Tutti i flag attivi ad alto/critico rischio hanno approvatori nominati |
| 🧬 Ogni flag ha tracciabilità | Tutti i flag hanno ID Jira/change |
| ⏳ Nessun flag scaduto abilitato | Nessun flag abilitato oltre la scadenza |
| 🚫 Disciplina override in produzione | Nessun override manuale attivo in produzione |
| 🐤 Limite rollout canary | I flag che richiedono canary restano entro il 50% di rollout |
| 🔗 Dipendenze abilitate | Nessun flag abilitato ha una dipendenza disabilitata |
| 🔌 Adapter provider live configurati | Almeno un token provider connesso |
| 📤 Hook DevOps outbound configurati | Endpoint GitHub/Jira/Slack impostati |

---

### 🤖 Widget chat AI DevOps

Un assistente chat AI flottante incorporabile in qualsiasi pagina con un singolo tag script:

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 Fai domande sulle release in linguaggio naturale
* 🔍 Legge automaticamente lo stato live del workspace
* 📊 Contatore sessione mostra quanti visitatori l'hanno usato
* ⚡ Fallback elegante quando il servizio AI non è disponibile
* 🧠 Mantiene la cronologia chat tra i messaggi nella stessa sessione

Provalo live: [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 Integrazioni provider (sincronizzazione read-only)

Importa lo stato live dei flag dal tuo provider tramite un token read-only di proprietà del cliente attraverso il proxy server.

| 🏴 Provider | Tipo |
| --- | --- |
| 🚀 LaunchDarkly | Sincronizzazione provider |
| 📊 Statsig | Sincronizzazione provider |
| 🔓 Unleash | Sincronizzazione provider |
| 🏳️ Flagsmith | Sincronizzazione provider |
| 🔥 Firebase Remote Config | Sincronizzazione provider |

🔒 Le chiavi API non lasciano mai il proxy backend. Il browser chiama solo l'API Compass Ultra.

---

### 📤 Integrazioni DevOps outbound

Copia payload con un clic o POST verso i tuoi strumenti esistenti:

| 🔌 Integrazione | Tipo |
| --- | --- |
| 🐙 GitHub Issues | Issue di evidenza release |
| 🎫 Jira Change | Aggiornamento ticket CHG |
| 💬 Slack War Room | Blocchi release / messaggio ricco |

---

### 🔍 Snapshot Diff

Confronta due checkpoint di release e vedi esattamente cosa è cambiato.

I diff possono identificare:

* ➕ Flag aggiunti
* ➖ Flag rimossi
* 📈 Modifiche al rollout
* 🚨 Modifiche alla criticità
* 👤 Modifiche a proprietario o approvatore
* 🛠️ Modifiche agli override

---

### 📄 Runbook e certificati PDF di release

Esporta PDF pronti per CAB per QA, leadership, DevOps o revisione audit.

I runbook includono:

* 🏷️ Metadati release e finestra di deploy
* 🎯 Valutazioni flag e stati di rollout
* 🛡️ Risultati dei gate di policy
* 🧠 Riepilogo rischi e impatto finanziario
* 🧯 Note di rollback per flag
* ✍️ Elenco firme approvatori
* 🧾 Cronologia audit

---

### 🐙 Gate CI GitHub Action

Blocca i deploy in CI quando il rischio di release supera una soglia configurata:

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 L'action fa fallire automaticamente il workflow se vengono trovati blocker — niente più "ci siamo dimenticati di controllare i flag prima del merge."

---

### 👥 RBAC (4 ruoli)

| 🎭 Ruolo | Permessi |
| --- | --- |
| 🔑 Admin | Accesso completo — flag, release, team, integrazioni |
| ✅ Approver | Approva release, visualizza tutto |
| 🛠️ Operator | Modifica flag e metadati release |
| 👁️ Viewer | Solo lettura |

Tutte le azioni bloccate vengono registrate con attore, ruolo, gate attivato e timestamp esatto.

---

## 🧭 Posizionamento del prodotto

Compass Ultra **non** è un provider di feature flag.

È il **layer di revisione release** intorno alle feature flag.

Usalo quando ti serve una risposta chiara a:

> "Possiamo rilasciare in sicurezza questa release con feature flag, e possiamo dimostrarlo?"

---

## 💸 Prezzi

| Piano | Prezzo | Posti | Ideale per |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | Solo locale | Provare il workspace e la revisione release locale |
| 🧍 Solo | $49/mese | 1 posto | Operatori singoli che necessitano sync cloud, analisi rischi, snapshot ed export |
| 🚀 Pro | $149/mese | Fino a 5 posti | Piccoli team che necessitano revisione release condivisa e diff |
| 👥 Team | $299/mese | Fino a 15 posti | Team release che necessitano RBAC, export audit, alert e workflow organizzativi |
| 🏢 Enterprise | Personalizzato | Personalizzato | Security review, onboarding, termini personalizzati e integrazioni |

I piani a pagamento iniziano con una **prova gratuita di 7 giorni**.

Nessuna carta di credito richiesta. Le prove tornano automaticamente a Free a meno che il cliente non si abboni.

---

## 🛠️ Stack tecnologico

| Layer | Tecnologia |
| --- | --- |
| ⚛️ Frontend | React, Vite |
| 🧭 Routing | React Router |
| ✂️ Code splitting | React.lazy + Suspense |
| 🎨 UI icons | Lucide React |
| 📄 PDF export | jsPDF |
| 🔐 Auth | Auth0 |
| 💳 Payments | Stripe |
| 📈 Analytics | Vercel Analytics |
| 🔒 Security headers | X-Frame-Options, CSP, HSTS, cache control |
| 🧱 Backend | Express API in the backend repo |
| 🐘 Database | PostgreSQL through backend |
| 🤖 AI risk analysis | Backend AI service with deterministic fallback |
| ☁️ Hosting | Vercel (frontend) · Railway (backend) |

---

## 📦 Codice sorgente

Questo repository pubblico contiene la pagina di lancio Compass Ultra, la documentazione, gli asset GitHub Pages e i materiali pubblici del progetto.

L'applicazione di produzione e il backend sono mantenuti separatamente. Gli utenti pubblici possono esplorare l'app live e la demo senza accesso ai repository di implementazione privati.

---

## 🔒 Modello di sicurezza

Compass Ultra è progettato come layer di revisione release.

* 🧪 La demo locale funziona senza login.
* 🔐 Gli snapshot cloud richiedono autenticazione.
* 🔌 La sincronizzazione provider usa token read-only attraverso il proxy backend — le chiavi API non passano mai dal browser.
* 🛡️ Header di sicurezza su tutte le risposte: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
* 💳 Stripe gestisce i dati delle carte.
* 🪪 Auth0 è il provider di identità.
* 🔗 I link di condivisione codificano lo stato del workspace e non vanno usati per segreti.
* 🏢 I clienti enterprise dovrebbero usare security review e termini personalizzati prima del rollout provider live.

---

## 🗺️ Roadmap

* 🧾 Limiti posti completamente applicati dal backend
* 🧪 Automazione ciclo di vita prova senza carta
* 🚦 Controlli anti-abuso prova per email, dominio e utilizzo
* 👥 Flusso invito team
* 🏢 Workspace organizzazione
* 🔌 Più adapter provider
* 💬 Workflow app Slack
* 🐙 Espansione gate release GitHub Action
* 📤 Più formati di export
* 🔒 Pacchetto security review per Enterprise
* 📊 Conteggi sessioni e messaggi backend live per widget AI DevOps

---

## ✅ Stato

Compass Ultra è live:

**Produzione:** [https://www.compassultra.com](https://www.compassultra.com)

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker:** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 Pensato per

Team che rilasciano velocemente e hanno comunque bisogno di prova prima della produzione.

**Rilascia con fiducia. Rivedi con evidenza. Dimostra ogni release.** 🧭