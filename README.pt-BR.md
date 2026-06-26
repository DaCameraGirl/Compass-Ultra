# 🧭 Compass Ultra 

> **Inteligência de release para equipes que entregam por trás de feature flags.**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-6366f1?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-131a26?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra é uma sala de controle de release para software com feature flags. Revise o estado das flags, portões de política, risco de rollout, diffs de snapshot, análise de risco assistida por IA e prova de release pronta para auditoria — antes que mudanças em produção entrem no ar.

[🚀 App ao vivo](https://www.compassultra.com) · [🎮 Experimente a demo](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ Por que Compass Ultra?

Feature flags deveriam tornar os releases mais seguros.

Mas, com o tempo, elas podem virar uma superfície de release por si só:

* 🧟 Flags obsoletas ou expiradas
* 🎲 Percentuais de rollout arriscados
* 👤 Responsáveis e aprovadores ausentes
* 🕸️ Dependências ocultas entre flags
* 🚨 Overrides em produção
* 💬 Threads no Slack fingindo ser trilhas de auditoria
* 🧩 Decisões de release espalhadas em ferramentas demais

**Compass Ultra transforma o caos de feature flags em um fluxo repetível de revisão de release.**

Em vez de perguntar:

> "Podemos fazer o deploy?"

Sua equipe pode responder:

* ✅ O que está habilitado?
* 👥 Quem é afetado?
* 🔄 O que mudou?
* 💥 O que pode quebrar?
* 🖊️ Quem aprovou?
* 🧯 O que precisa ser corrigido primeiro?
* 📄 Que prova podemos entregar para QA, DevOps, liderança ou compliance?

---

## ⚡ A versão curta

Compass Ultra ajuda equipes a revisar e comprovar a prontidão de release antes do deploy.

Uma revisão típica de release funciona assim:

1. 📦 Carregar ou importar um workspace de release.
2. 👤 Avaliar flags com base em um contexto real de usuário.
3. 🛡️ Executar portões de política e análise de risco.
4. 🔍 Comparar snapshots de release.
5. 📄 Exportar um runbook de release.
6. 🚀 Compartilhar a prova antes que mudanças em produção entrem no ar.

---

## 🎮 Demo ao vivo

A demo funciona sem conta:

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

A demo simula um release arriscado no varejo (véspera da Black Friday, `peak-sale-2026.11`) com:

* 🏁 10 feature flags em LaunchDarkly, Statsig e Firebase
* 🛒 Flags de alto risco em checkout, flash sale e entrega no mesmo dia
* 🚧 Bloqueadores e avisos de política (lacunas de dependência, violações de canary)
* 🔗 Verificações do grafo de dependências
* 🧾 Comparação de snapshots
* 📄 Exportação de runbook em PDF
* 🔌 Geração de payloads para GitHub, Jira e Slack
* 🧯 Fluxo de rollback com kill-switch para o estado da demo
* 💰 Estimativa de impacto financeiro para janela de deploy em pico de tráfego

---

## 🧠 Recursos principais

### 🚦 Analisador de risco de release

Compass Ultra revisa o workspace de release atual e retorna uma avaliação prática:

* ✅ **Ship**
* 🟡 **Hold**
* 🔴 **Fix first**

Alimentado por um serviço de IA ao vivo com fallback determinístico — a análise nunca fica bloqueada, mesmo quando o serviço de IA está indisponível.

Ele pode detectar problemas como:

* 🔥 Flags ativas de alto risco
* 🔗 Conflitos de dependência
* 👻 Aprovadores ausentes
* ⏰ Flags expiradas ou sem responsável
* 🐤 Violações de rollout canary
* 🚨 Overrides em produção
* 🧾 Padrões de rollout sensíveis a compliance
* 💰 Estimativas de impacto financeiro para janelas de deploy em pico de tráfego

---

### 🎯 Motor de avaliação de flags

Avalie cada flag com base em um contexto específico de usuário.

| Campo | Descrição |
| --- | --- |
| 👤 User key | Identificador único do usuário |
| 📧 Email | Endereço de e-mail do usuário |
| 🏢 Tenant | Tenant do cliente ou conta |
| 💳 Plan | Plano de preço ou entitlement |
| 🛂 Role | Papel ou grupo de permissão do usuário |
| 🌎 Region | Região geográfica ou de infraestrutura |
| 🏳️ Country | Segmentação por país |
| 📱 Device | Tipo de dispositivo ou plataforma |
| 🌐 Environment | Desenvolvimento, staging, produção ou ambiente personalizado |

Cada flag mostra:

* 🎚️ Valor avaliado
* 🧠 Motivo da resolução (regra correspondente, bucket de rollout, padrão ou override)
* 🧩 Regra ou condição correspondente
* 📌 Contexto relevante usado durante a avaliação

Alterne entre presets de contexto salvos — Production admin, EU customer, Mobile guest — para ver como as flags se comportam por segmento.

---

### 🛡️ Portões de política enterprise (9 verificações)

Compass Ultra executa verificações automatizadas de release em cada mudança de estado do workspace.

| 🔒 Portão | O que verifica |
| --- | --- |
| 🎟️ Change ticket attached | Ticket CHG ou Jira presente antes de produção |
| 👥 Critical flags have approvers | Todas as flags ativas de alta/crítica têm aprovadores nomeados |
| 🧬 Every flag has traceability | Todas as flags têm IDs Jira/change |
| ⏳ No expired flags enabled | Nenhuma flag habilitada está expirada |
| 🚫 Production override discipline | Nenhum override manual ativo em produção |
| 🐤 Canary rollout limit | Flags que exigem canary permanecem dentro de 50% de rollout |
| 🔗 Dependencies enabled | Nenhuma flag habilitada tem dependência desabilitada |
| 🔌 Live provider adapters configured | Pelo menos um token de provider está conectado |
| 📤 Outbound DevOps hooks configured | Endpoints GitHub/Jira/Slack estão configurados |

---

### 🤖 Widget de chat AI DevOps

Um assistente de chat com IA flutuante que pode ser incorporado em qualquer página com uma única tag de script:

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 Faça perguntas sobre release em linguagem natural
* 🔍 Lê automaticamente o estado ao vivo do workspace
* 📊 Contador de sessão mostra quantos visitantes usaram
* ⚡ Fallback elegante quando o serviço de IA está indisponível
* 🧠 Mantém o histórico de chat entre mensagens na mesma sessão

Experimente ao vivo: [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 Integrações de providers (sincronização somente leitura)

Importe o estado ao vivo das flags do seu provider via token somente leitura de propriedade do cliente, através do proxy do servidor.

| 🏴 Provider | Tipo |
| --- | --- |
| 🚀 LaunchDarkly | Provider sync |
| 📊 Statsig | Provider sync |
| 🔓 Unleash | Provider sync |
| 🏳️ Flagsmith | Provider sync |
| 🔥 Firebase Remote Config | Provider sync |

🔒 Chaves de API nunca saem do proxy do backend. O navegador só chama a API do Compass Ultra.

---

### 📤 Integrações DevOps de saída

Copie o payload com um clique ou faça POST para suas ferramentas existentes:

| 🔌 Integração | Tipo |
| --- | --- |
| 🐙 GitHub Issues | Issue de evidência de release |
| 🎫 Jira Change | Atualização de ticket CHG |
| 💬 Slack War Room | Bloqueios de release / mensagem rica |

---

### 🔍 Diff de snapshot

Compare dois checkpoints de release e veja exatamente o que mudou.

Os diffs podem identificar:

* ➕ Flags adicionadas
* ➖ Flags removidas
* 📈 Mudanças de rollout
* 🚨 Mudanças de criticidade
* 👤 Mudanças de responsável ou aprovador
* 🛠️ Mudanças de override

---

### 📄 Runbooks e certificados de release em PDF

Exporte PDFs prontos para CAB para QA, liderança, DevOps ou revisão de auditoria.

Runbooks incluem:

* 🏷️ Metadados de release e janela de deploy
* 🎯 Avaliações de flags e estados de rollout
* 🛡️ Resultados dos portões de política
* 🧠 Resumo de risco e impacto financeiro
* 🧯 Notas de rollback por flag
* ✍️ Lista de assinaturas dos aprovadores
* 🧾 Histórico de auditoria

---

### 🐙 Portão CI com GitHub Action

Bloqueie deploys no CI quando o risco de release exceder um limite configurado:

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 A action falha o workflow automaticamente se bloqueadores forem encontrados — chega de "esquecemos de verificar as flags antes do merge".

---

### 👥 RBAC (4 papéis)

| 🎭 Papel | Permissões |
| --- | --- |
| 🔑 Admin | Acesso total — flags, release, equipe, integrações |
| ✅ Approver | Aprovar releases, visualizar tudo |
| 🛠️ Operator | Editar flags e metadados de release |
| 👁️ Viewer | Somente leitura |

Todas as ações bloqueadas são registradas com ator, papel, portão acionado e timestamp exato.

---

## 🧭 Posicionamento do produto

Compass Ultra **não** é um provider de feature flags.

É a **camada de revisão de release** em torno de feature flags.

Use quando precisar de uma resposta clara para:

> "Podemos fazer o deploy com segurança deste release com feature flags e comprovar isso?"

---

## 💸 Preços

| Plano | Preço | Assentos | Ideal para |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | Somente local | Experimentar o workspace e revisão local de release |
| 🧍 Solo | $49/mo | 1 assento | Operadores solo que precisam de sync na nuvem, análise de risco, snapshots e exportações |
| 🚀 Pro | $149/mo | Até 5 assentos | Equipes pequenas que precisam de revisão compartilhada de release e diffing |
| 👥 Team | $299/mo | Até 15 assentos | Equipes de release que precisam de RBAC, exportação de auditoria, alertas e fluxos organizacionais |
| 🏢 Enterprise | Custom | Custom | Revisão de segurança, onboarding, termos personalizados e integrações |

Planos pagos começam com **7 dias de teste grátis**.

Não é necessário cartão de crédito. Os testes voltam automaticamente para Free, a menos que o cliente assine.

---

## 🛠️ Stack tecnológica

| Camada | Tecnologia |
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
| 🧱 Backend | Express API no repositório de backend |
| 🐘 Database | PostgreSQL via backend |
| 🤖 AI risk analysis | Serviço de IA no backend com fallback determinístico |
| ☁️ Hosting | Vercel (frontend) · Railway (backend) |

---

## 📦 Código-fonte

Este repositório público contém a página de lançamento do Compass Ultra, documentação, assets do GitHub Pages e materiais públicos do projeto.

A aplicação de produção e o backend são mantidos separadamente. Usuários públicos podem explorar o app ao vivo e a demo sem precisar de acesso a repositórios privados de implementação.

---

## 🔒 Modelo de segurança

Compass Ultra foi projetado como uma camada de revisão de release.

* 🧪 A demo local funciona sem login.
* 🔐 Snapshots na nuvem exigem autenticação.
* 🔌 A sincronização de providers usa tokens somente leitura via proxy do backend — chaves de API nunca passam pelo navegador.
* 🛡️ Cabeçalhos de segurança em todas as respostas: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
* 💳 O Stripe processa dados de cartão.
* 🪪 Auth0 é o provedor de identidade.
* 🔗 Links de compartilhamento codificam o estado do workspace e não devem ser usados para segredos.
* 🏢 Clientes Enterprise devem fazer revisão de segurança e termos personalizados antes do rollout de providers ao vivo.

---

## 🗺️ Roadmap

* 🧾 Limites de assentos totalmente aplicados no backend
* 🧪 Automação do ciclo de teste sem cartão
* 🚦 Controles contra abuso de trial por e-mail, domínio e uso
* 👥 Fluxo de convite para equipe
* 🏢 Workspaces organizacionais
* 🔌 Mais adaptadores de providers
* 💬 Fluxo de app Slack
* 🐙 Expansão do portão de release com GitHub Action
* 📤 Mais formatos de exportação
* 🔒 Pacote de revisão de segurança para Enterprise
* 📊 Contagens ao vivo de sessão e mensagens no backend para o widget AI DevOps

---

## ✅ Status

Compass Ultra está no ar:

**Produção:** [https://www.compassultra.com](https://www.compassultra.com)

**Demo:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker:** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 Feito para

Equipes que entregam rápido e ainda precisam de prova antes da produção.

**Faça deploy com confiança. Revise com evidências. Comprove cada release.** 🧭