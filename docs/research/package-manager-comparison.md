# 패키지 매니저 비교: npm vs pnpm vs yarn

## npm

### 특장점
- Node.js 기본 내장, 별도 설치 불필요
- 가장 넓은 생태계와 커뮤니티
- 러닝 커브가 낮아 진입 장벽이 없음
- `package-lock.json` 으로 의존성 고정

### 단점
- **Hoisting 방식** — 모든 패키지를 `node_modules` 루트에 flat하게 올려 유령 의존성(ghost dependency) 문제 발생 가능
- 속도가 세 가지 중 가장 느림
- `node_modules` 용량이 크고 중복 저장이 많음

---

## pnpm

### 특장점
- **글로벌 스토어 + 하드링크** 방식으로 동일 패키지를 디스크에 한 번만 저장 → 디스크 사용량 대폭 절감
- 설치 속도가 가장 빠름
- **엄격한 격리** — 직접 선언한 의존성만 접근 가능해 유령 의존성 원천 차단
- Monorepo 지원에 강점 (workspace 기능)

### 단점
- 엄격한 격리로 인해 transitive dependency를 직접 참조할 때 별도 설치 필요
- React 같은 singleton 패키지 사용 시 인스턴스 중복 문제가 발생할 수 있어 overrides 설정 필요
- 일부 구버전 라이브러리와 호환성 이슈 존재
- npm에 비해 러닝 커브가 있음

---

## yarn (Classic v1 / Berry v2+)

### 특장점
- npm 대비 빠른 속도 (병렬 설치)
- `yarn.lock` 으로 안정적인 의존성 고정
- **Workspaces** 기능으로 Monorepo 지원
- Berry(v2+)의 **Plug'n'Play(PnP)** 모드 — `node_modules` 없이 동작, 설치 속도 극단적으로 빠름

### 단점
- Classic(v1)과 Berry(v2+) 간 큰 차이로 혼란 발생
- Berry의 PnP 모드는 일부 라이브러리와 호환성 문제
- npm scripts와 미묘한 동작 차이 존재
- 팀 내 버전 통일이 안 되면 lock 파일 충돌 발생

---

## 요약 비교

| 항목 | npm | pnpm | yarn |
|------|-----|------|------|
| 설치 속도 | 느림 | 빠름 | 보통 |
| 디스크 효율 | 낮음 | 높음 | 보통 |
| 유령 의존성 방지 | X | O | X (PnP는 O) |
| Monorepo 지원 | 보통 | 강함 | 강함 |
| 생태계 호환성 | 최고 | 보통 | 높음 |
| 러닝 커브 | 낮음 | 보통 | 보통 |

## 결론
- **빠른 시작 · 단순 프로젝트** → npm
- **디스크 효율 · 엄격한 의존성 관리 · Monorepo** → pnpm
- **Monorepo · 팀 표준화** → yarn
