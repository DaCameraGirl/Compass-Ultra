# 🧭 Compass Ultra 

> **기능 플래그 뒤에서 배포하는 팀을 위한 릴리스 인텔리전스.**

<p align="center">
  <a href="README.md"><img src="https://img.shields.io/badge/🇺🇸_English-131a26?style=for-the-badge&labelColor=0f131a" alt="English"/></a>
  <a href="README.es.md"><img src="https://img.shields.io/badge/🇪🇸_Español-131a26?style=for-the-badge&labelColor=0f131a" alt="Español"/></a>
  <a href="README.fr.md"><img src="https://img.shields.io/badge/🇫🇷_Français-131a26?style=for-the-badge&labelColor=0f131a" alt="Français"/></a>
  <a href="README.de.md"><img src="https://img.shields.io/badge/🇩🇪_Deutsch-131a26?style=for-the-badge&labelColor=0f131a" alt="Deutsch"/></a>
  <a href="README.pt-BR.md"><img src="https://img.shields.io/badge/🇧🇷_Português-131a26?style=for-the-badge&labelColor=0f131a" alt="Português"/></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/🇨🇳_中文-131a26?style=for-the-badge&labelColor=0f131a" alt="中文"/></a>
  <a href="README.ja.md"><img src="https://img.shields.io/badge/🇯🇵_日本語-131a26?style=for-the-badge&labelColor=0f131a" alt="日本語"/></a>
  <a href="README.ko.md"><img src="https://img.shields.io/badge/🇰🇷_한국어-6366f1?style=for-the-badge&labelColor=0f131a" alt="한국어"/></a>
  <a href="README.it.md"><img src="https://img.shields.io/badge/🇮🇹_Italiano-131a26?style=for-the-badge&labelColor=0f131a" alt="Italiano"/></a>
  <a href="README.ar.md"><img src="https://img.shields.io/badge/🇸🇦_العربية-131a26?style=for-the-badge&labelColor=0f131a" alt="العربية"/></a>
</p>

Compass Ultra는 기능 플래그 기반 소프트웨어를 위한 릴리스 컨트롤 룸입니다. 프로덕션 변경이 라이브되기 전에 플래그 상태, 정책 게이트, 롤아웃 위험, 스냅샷 diff, AI 지원 위험 분석, 감사 준비 릴리스 증빙을 검토하세요.

[🚀 라이브 앱](https://www.compassultra.com) · [🎮 데모 체험](https://www.compassultra.com/app?demo=true) · [🤖 AI DevOps Checker](https://www.compassultra.com/ai-devops)

![demo](docs/demo.gif)

---

## ✨ Compass Ultra를 선택하는 이유

기능 플래그는 릴리스를 더 안전하게 만들기 위한 것입니다.

하지만 시간이 지나면 그 자체가 릴리스 표면이 될 수 있습니다:

* 🧟 오래되거나 만료된 플래그
* 🎲 위험한 롤아웃 비율
* 👤 누락된 소유자와 승인자
* 🕸️ 숨겨진 플래그 의존성
* 🚨 프로덕션 오버라이드
* 💬 감사 추적을 대신하는 Slack 스레드
* 🧩 너무 많은 도구에 흩어진 릴리스 결정

**Compass Ultra는 기능 플래그 혼란을 반복 가능한 릴리스 검토 워크플로로 바꿉니다.**

다음과 같이 묻는 대신:

> "배포해도 괜찮을까?"

팀은 다음에 답할 수 있습니다:

* ✅ 무엇이 활성화되어 있나?
* 👥 누가 영향을 받나?
* 🔄 무엇이 변경되었나?
* 💥 무엇이 깨질 수 있나?
* 🖊️ 누가 승인했나?
* 🧯 무엇을 먼저 수정해야 하나?
* 📄 QA, DevOps, 리더십 또는 컴플라이언스에 어떤 증빙을 제공할 수 있나?

---

## ⚡ 요약

Compass Ultra는 배포 전에 릴리스 준비 상태를 검토하고 증명하는 데 도움을 줍니다.

일반적인 릴리스 검토는 다음과 같습니다:

1. 📦 릴리스 워크스페이스를 로드하거나 가져옵니다.
2. 👤 실제 사용자 컨텍스트에 대해 플래그를 평가합니다.
3. 🛡️ 정책 게이트와 위험 분석을 실행합니다.
4. 🔍 릴리스 스냅샷을 비교합니다.
5. 📄 릴리스 런북을 내보냅니다.
6. 🚀 프로덕션 변경이 라이브되기 전에 증빙을 공유합니다.

---

## 🎮 라이브 데모

데모는 계정 없이 사용할 수 있습니다:

**데모:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

데모는 위험한 리테일 릴리스(블랙 프라이데이 전날, `peak-sale-2026.11`)를 시뮬레이션합니다:

* 🏁 LaunchDarkly, Statsig, Firebase에 걸친 10개의 기능 플래그
* 🛒 고위험 체크아웃, 플래시 세일, 당일 배송 플래그
* 🚧 정책 차단 요소 및 경고(의존성 누락, 카나리 위반)
* 🔗 의존성 그래프 검사
* 🧾 스냅샷 비교
* 📄 PDF 런북 내보내기
* 🔌 GitHub, Jira, Slack 페이로드 생성
* 🧯 데모 상태용 킬 스위치 롤백 플로우
* 💰 피크 트래픽 배포 윈도우에 대한 재무 영향 추정

---

## 🧠 핵심 기능

### 🚦 릴리스 위험 분석기

Compass Ultra는 현재 릴리스 워크스페이스를 검토하고 실용적인 릴리스 평가를 반환합니다:

* ✅ **배포**
* 🟡 **보류**
* 🔴 **먼저 수정**

실시간 AI 서비스와 결정론적 폴백으로 구동됩니다 — AI 서비스를 사용할 수 없을 때도 분석이 차단되지 않습니다.

다음과 같은 문제를 감지할 수 있습니다:

* 🔥 고위험 활성 플래그
* 🔗 의존성 충돌
* 👻 누락된 승인자
* ⏰ 만료되었거나 소유자 없는 플래그
* 🐤 카나리 롤아웃 위반
* 🚨 프로덕션 오버라이드
* 🧾 컴플라이언스에 민감한 롤아웃 패턴
* 💰 피크 트래픽 배포 윈도우에 대한 재무 영향 추정

---

### 🎯 플래그 평가 엔진

특정 사용자 컨텍스트에 대해 모든 플래그를 평가합니다.

| 필드 | 설명 |
| --- | --- |
| 👤 사용자 키 | 고유 사용자 식별자 |
| 📧 이메일 | 사용자 이메일 주소 |
| 🏢 테넌트 | 고객 또는 계정 테넌트 |
| 💳 플랜 | 가격 또는 권한 플랜 |
| 🛂 역할 | 사용자 역할 또는 권한 그룹 |
| 🌎 리전 | 지리적 또는 인프라 리전 |
| 🏳️ 국가 | 국가 수준 타겟팅 |
| 📱 디바이스 | 디바이스 또는 플랫폼 유형 |
| 🌐 환경 | 개발, 스테이징, 프로덕션 또는 사용자 정의 환경 |

각 플래그는 다음을 표시합니다:

* 🎚️ 평가된 값
* 🧠 해석 이유(규칙 일치, 롤아웃 버킷, 기본값 또는 오버라이드)
* 🧩 일치하는 규칙 또는 조건
* 📌 평가 중 사용된 관련 컨텍스트

저장된 컨텍스트 프리셋 — Production admin, EU customer, Mobile guest — 사이를 전환하여 세그먼트별 플래그 동작을 확인하세요.

---

### 🛡️ 엔터프라이즈 정책 게이트 (9가지 검사)

Compass Ultra는 워크스페이스 상태가 변경될 때마다 자동 릴리스 검사를 실행합니다.

| 🔒 게이트 | 검사 항목 |
| --- | --- |
| 🎟️ 변경 티켓 첨부 | 프로덕션 전 CHG 또는 Jira 티켓 존재 |
| 👥 중요 플래그에 승인자 있음 | 모든 고위험/중요 활성 플래그에 지정된 승인자 |
| 🧬 모든 플래그에 추적 가능성 | 모든 플래그에 Jira/변경 ID |
| ⏳ 만료된 플래그 비활성화 | 만료된 활성 플래그 없음 |
| 🚫 프로덕션 오버라이드 규율 | 프로덕션에서 수동 오버라이드 없음 |
| 🐤 카나리 롤아웃 한도 | 카나리 필수 플래그가 50% 롤아웃 이내 |
| 🔗 의존성 활성화 | 활성화된 플래그에 비활성화된 의존성 없음 |
| 🔌 라이브 프로바이더 어댑터 구성 | 최소 하나의 프로바이더 토큰 연결 |
| 📤 아웃바운드 DevOps 훅 구성 | GitHub/Jira/Slack 엔드포인트 설정 |

---

### 🤖 AI DevOps 채팅 위젯

단일 스크립트 태그로 모든 페이지에 임베드할 수 있는 플로팅 AI 채팅 어시스턴트:

```html
<script src="https://www.compassultra.com/ai-devops-widget.js"></script>
```

* 💬 자연어로 릴리스 질문
* 🔍 라이브 워크스페이스 상태 자동 읽기
* 📊 세션 카운터로 사용 방문자 수 표시
* ⚡ AI 서비스 불가 시 우아한 폴백
* 🧠 동일 세션 내 메시지 간 채팅 기록 유지

라이브 체험: [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

### 🔌 프로바이더 통합 (읽기 전용 동기화)

서버 프록시를 통해 고객 소유 읽기 전용 토큰으로 플래그 프로바이더에서 라이브 플래그 상태를 가져옵니다.

| 🏴 프로바이더 | 유형 |
| --- | --- |
| 🚀 LaunchDarkly | 프로바이더 동기화 |
| 📊 Statsig | 프로바이더 동기화 |
| 🔓 Unleash | 프로바이더 동기화 |
| 🏳️ Flagsmith | 프로바이더 동기화 |
| 🔥 Firebase Remote Config | 프로바이더 동기화 |

🔒 API 키는 백엔드 프록시를 벗어나지 않습니다. 브라우저는 Compass Ultra API만 호출합니다.

---

### 📤 아웃바운드 DevOps 통합

기존 도구에 원클릭 페이로드 복사 또는 POST:

| 🔌 통합 | 유형 |
| --- | --- |
| 🐙 GitHub Issues | 릴리스 증빙 이슈 |
| 🎫 Jira Change | CHG 티켓 업데이트 |
| 💬 Slack War Room | 릴리스 차단 / 리치 메시지 |

---

### 🔍 스냅샷 Diff

두 릴리스 체크포인트를 비교하고 정확히 무엇이 변경되었는지 확인합니다.

Diff는 다음을 식별할 수 있습니다:

* ➕ 추가된 플래그
* ➖ 제거된 플래그
* 📈 롤아웃 변경
* 🚨 중요도 변경
* 👤 소유자 또는 승인자 변경
* 🛠️ 오버라이드 변경

---

### 📄 PDF 릴리스 런북 및 인증서

QA, 리더십, DevOps 또는 감사 검토를 위한 CAB 준비 PDF를 내보냅니다.

런북에는 다음이 포함됩니다:

* 🏷️ 릴리스 메타데이터 및 배포 윈도우
* 🎯 플래그 평가 및 롤아웃 상태
* 🛡️ 정책 게이트 결과
* 🧠 위험 요약 및 재무 영향
* 🧯 플래그별 롤백 메모
* ✍️ 승인자 서명 목록
* 🧾 감사 기록

---

### 🐙 GitHub Action CI 게이트

릴리스 위험이 구성된 임계값을 초과하면 CI에서 배포를 차단합니다:

```yaml
- uses: ./.github/actions/compass-check
  with:
    compass_api_key: ${{ secrets.COMPASS_API_KEY }}
    risk_threshold: high
```

🚦 차단 요소가 발견되면 워크플로가 자동으로 실패합니다 — 더 이상 "머지 전에 플래그 확인을 잊었다"는 일이 없습니다.

---

### 👥 RBAC (4가지 역할)

| 🎭 역할 | 권한 |
| --- | --- |
| 🔑 Admin | 전체 액세스 — 플래그, 릴리스, 팀, 통합 |
| ✅ Approver | 릴리스 승인, 전체 보기 |
| 🛠️ Operator | 플래그 및 릴리스 메타데이터 편집 |
| 👁️ Viewer | 읽기 전용 |

모든 차단된 작업은 행위자, 역할, 트리거된 게이트, 정확한 타임스탬프와 함께 기록됩니다.

---

## 🧭 제품 포지셔닝

Compass Ultra는 기능 플래그 **프로바이더가 아닙니다**.

기능 플래그를 둘러싼 **릴리스 검토 레이어**입니다.

다음에 대한 명확한 답이 필요할 때 사용하세요:

> "이 기능 플래그 릴리스를 안전하게 배포할 수 있고, 증명할 수 있을까?"

---

## 💸 가격

| 플랜 | 가격 | 시트 | 최적 대상 |
| --- | ---: | ---: | --- |
| 🆓 Free | $0 | 로컬 전용 | 워크스페이스 및 로컬 릴리스 검토 체험 |
| 🧍 Solo | $49/월 | 1 시트 | 클라우드 동기화, 위험 분석, 스냅샷, 내보내기가 필요한 단독 운영자 |
| 🚀 Pro | $149/월 | 최대 5 시트 | 공유 릴리스 검토 및 diff가 필요한 소규모 팀 |
| 👥 Team | $299/월 | 최대 15 시트 | RBAC, 감사 내보내기, 알림, 조직 워크플로가 필요한 릴리스 팀 |
| 🏢 Enterprise | 맞춤 | 맞춤 | 보안 검토, 온보딩, 맞춤 약관, 통합 |

유료 플랜은 **7일 무료 체험**으로 시작합니다.

신용카드 불필요. 고객이 구독하지 않으면 체험은 자동으로 Free로 다운그레이드됩니다.

---

## 🛠️ 기술 스택

| 레이어 | 기술 |
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

## 📦 소스 코드

이 공개 저장소에는 Compass Ultra 런치 페이지, 문서, GitHub Pages 자산, 공개 프로젝트 자료가 포함되어 있습니다.

프로덕션 애플리케이션과 백엔드는 별도로 유지 관리됩니다. 공개 사용자는 비공개 구현 저장소에 대한 액세스 없이 라이브 앱과 데모를 탐색할 수 있습니다.

---

## 🔒 보안 모델

Compass Ultra는 릴리스 검토 레이어로 설계되었습니다.

* 🧪 로컬 데모는 로그인 없이 작동합니다.
* 🔐 클라우드 스냅샷에는 인증이 필요합니다.
* 🔌 프로바이더 동기화는 백엔드 프록시를 통한 읽기 전용 토큰을 사용합니다 — API 키는 브라우저를 거치지 않습니다.
* 🛡️ 모든 응답에 보안 헤더: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options`.
* 💳 Stripe가 카드 데이터를 처리합니다.
* 🪪 Auth0가 ID 프로바이더입니다.
* 🔗 공유 링크는 워크스페이스 상태를 인코딩하며 비밀에 사용해서는 안 됩니다.
* 🏢 엔터프라이즈 고객은 라이브 프로바이더 롤아웃 전에 보안 검토 및 맞춤 약관을 사용해야 합니다.

---

## 🗺️ 로드맵

* 🧾 백엔드 강제 시트 한도 완전 구현
* 🧪 카드 없는 체험 라이프사이클 자동화
* 🚦 이메일, 도메인, 사용량별 체험 남용 제어
* 👥 팀 초대 플로우
* 🏢 조직 워크스페이스
* 🔌 더 많은 프로바이더 어댑터
* 💬 Slack 앱 워크플로
* 🐙 GitHub Action 릴리스 게이트 확장
* 📤 더 많은 내보내기 형식
* 🔒 엔터프라이즈용 보안 검토 패키지
* 📊 AI DevOps 위젯용 라이브 백엔드 세션 및 메시지 수

---

## ✅ 상태

Compass Ultra는 라이브 상태입니다:

**프로덕션:** [https://www.compassultra.com](https://www.compassultra.com)

**데모:** [https://www.compassultra.com/app?demo=true](https://www.compassultra.com/app?demo=true)

**AI DevOps Checker:** [https://www.compassultra.com/ai-devops](https://www.compassultra.com/ai-devops)

---

## 🚀 대상

빠르게 배포하면서도 프로덕션 전에 증빙이 필요한 팀.

**자신 있게 배포하세요. 증빙으로 검토하세요. 모든 릴리스를 증명하세요.** 🧭