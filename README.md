# Seyeon Wallet (EVM Wallet)

EVM 호환 블록체인용 웹 지갑입니다. Creditcoin Network 메인넷 및 서브넷(테스트넷)을 지원합니다.

## 주요 기능

- **지갑 생성**: 새로운 니모닉 문구 생성
- **지갑 가져오기**: 기존 니모닉(12, 15, 18, 21, 24단어)으로 지갑 복구
- **지갑 목록**: 파생된 지갑 주소, 개인키, 잔액 조회
- **네트워크 전환**: 메인넷 ↔ 서브넷(테스트넷) 스위치
- **잔액 조회**: RPC를 통한 실시간 잔액 조회

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | React 19 |
| 언어 | TypeScript |
| 빌드 도구 | Vite 7 |
| 라우팅 | React Router DOM 7 |
| 상태 관리 | MobX |
| 블록체인 | ethers.js 6 |

## 프로젝트 구조

```
src/
├── pages/           # 페이지 컴포넌트
│   ├── Main.tsx     # 메인 (지갑 생성/가져오기 선택)
│   ├── Create.tsx   # 니모닉 생성
│   ├── Import.tsx   # 니모닉 가져오기
│   └── Wallets.tsx  # 지갑 목록
├── components/
│   ├── layout/      # PageLayout, Header
│   ├── ui/          # Button, Input, CopyButton
│   └── WalletTable.tsx
├── stores/
│   └── walletStore.ts   # MobX 지갑 상태
├── utils/
│   ├── createMnemonic.ts
│   ├── deriveWallet.ts
│   └── fetchBalance.ts
├── styles/
├── App.tsx
├── Routes.tsx
└── main.tsx
```

## HD 지갑 경로

- BIP-44 경로: `m/44'/60'/0'/0`
- 인덱스별 자식 지갑 파생 지원

## 예외 처리

### 니모닉 생성 (Create)

| 상황 | 처리 |
|------|------|
| `createMnemonic()` 실패 | `walletStore.mnemonicError`에 에러 메시지 저장 후 UI에 표시 |
| Error 타입 | `err.message` 사용 |
| 기타 throw | `'Failed to create mnemonic phrase'` 기본 메시지 |

### 지갑 가져오기 (Import)

| 상황 | 처리 |
|------|------|
| 단어 수 검증 실패 (12, 15, 18, 21, 24가 아님) | `'Mnemonic must be 12, 15, 18, 21, or 24 words.'` 표시, import 차단 |
| 입력 변경 시 | 에러 메시지 초기화 |

### 잔액 조회 (Wallets)

| 상황 | 처리 |
|------|------|
| RPC 호출 실패 | 해당 지갑의 `balanceError`에 에러 메시지 저장 |
| Error 타입 | `err.message` 사용 |
| 기타 throw | `'Failed to fetch balance'` 기본 메시지 |
| UI | Retry 버튼 표시로 재시도 가능 |

### 지갑 목록 페이지 접근 (Wallets)

| 상황 | 처리 |
|------|------|
| `mnemonic` 없음 (새로고침 등으로 초기화) | alert 후 메인(`/`)으로 리다이렉트 |

## 시작하기

### 사전 요구사항

- Node.js
- Yarn (또는 npm)

### 설치 및 실행

```bash
# 의존성 설치
yarn install

# 개발 서버 실행
yarn dev

# 빌드
yarn build

# 빌드 결과물 미리보기
yarn preview
```

## 주의사항

- 이 지갑은 **클라이언트 사이드**에서만 동작합니다. 니모닉과 개인키는 서버로 전송되지 않습니다.
- 니모닉 문구는 분실 시 복구가 불가능합니다.
