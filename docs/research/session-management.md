# 세션 관리 방식 비교

## 쿠키 기반 서버 세션 vs JWT

### 동작 방식

**쿠키 기반 서버 세션**
```
로그인
  └─ 서버: 세션 생성 → DB/메모리에 저장 → session_id 쿠키 발급

요청마다
  └─ 브라우저: 쿠키 자동 전송
  └─ 서버: session_id로 DB 조회 → 유저 확인
```

**JWT**
```
로그인
  └─ 서버: 유저 정보를 서명해서 토큰 발급 (DB 저장 없음)

요청마다
  └─ 프론트: Authorization 헤더에 토큰 첨부
  └─ 서버: 서명 검증만 → 유저 확인 (DB 조회 없음)
```

### 핵심 차이

**세션**: 서버가 상태를 기억 (Stateful)
```
서버: "session_id abc123은 홍길동이야" → 기억하고 있음
```

**JWT**: 서버가 상태를 기억 안 함 (Stateless)
```
서버: "이 토큰 서명이 맞으면 토큰 안에 적힌 사람이 맞아" → DB 조회 없음
```

### 장단점

| | 쿠키 기반 서버 세션 | JWT |
|---|---|---|
| **서버 부하** | 요청마다 DB 조회 발생 | 서명 검증만 (DB 조회 없음) |
| **확장성** | 서버 여러 대면 세션 공유 필요 (Redis 등) | 서버 어디서든 검증 가능, MSA에 유리 |
| **로그아웃** | 서버에서 세션 삭제 → 즉시 무효화 | 토큰 만료 전까지 강제 무효화 어려움 |
| **보안** | httpOnly 쿠키 → XSS 안전 | 저장 위치에 따라 XSS 취약 가능 |
| **CSRF** | 쿠키 자동 전송 → CSRF 취약 (방어 필요) | 헤더 직접 첨부 → CSRF 안전 |
| **구현 복잡도** | 단순 | Access Token + Refresh Token 구조 필요 |
| **토큰 크기** | session_id만 전송 (가벼움) | 페이로드 포함으로 상대적으로 무거움 |

### 어떤 걸 쓸지

**세션이 나은 경우**
- 단일 서버, 소규모 서비스
- 즉각적인 로그아웃/강제 차단이 중요한 경우 (관리자 기능, 금융 등)

**JWT가 나은 경우**
- 서버 여러 대 (MSA, 수평 확장)
- 모바일 앱 + 웹 동시 지원
- 외부 서비스에 인증 위임 (OAuth 등)

---

## 실무 표준 구현 패턴

### JWT + Refresh Token 구조

```
Access Token  → 짧은 만료 (15분 ~ 1시간), 메모리(Zustand)에 저장
Refresh Token → 긴 만료 (7일 ~ 30일), httpOnly 쿠키에 저장 (서버가 발급)
```

**흐름**
```
로그인
  └─ 서버: Access Token + Refresh Token 발급
  └─ 프론트: Access Token → Zustand / Refresh Token → 쿠키 (서버가 Set-Cookie)

API 요청
  └─ Authorization: Bearer {Access Token}

Access Token 만료 (401)
  └─ Refresh Token으로 /auth/refresh 요청 (쿠키 자동 전송)
  └─ 서버: 새 Access Token 발급
  └─ 원래 요청 재시도

Refresh Token도 만료
  └─ 로그아웃 처리 → 로그인 페이지 이동
```

### 저장 위치별 보안 비교

```
localStorage    → XSS에 취약, 토큰 저장 금지
sessionStorage  → 탭 닫으면 사라짐, 토큰 저장에 부적합
메모리(Zustand) → XSS 안전, 새로고침 시 사라짐 → Refresh Token으로 복원
httpOnly Cookie → JS 접근 불가, XSS 안전, CSRF만 방어하면 됨
```

### 이 구조를 쓰는 이유

| 문제 | 해결 |
|---|---|
| Access Token을 localStorage에 저장하면 XSS에 취약 | 메모리(Zustand)에만 저장 |
| 메모리 저장이면 새로고침 시 사라짐 | Refresh Token(httpOnly 쿠키)으로 복원 |
| Refresh Token도 XSS에 노출되면 안 됨 | httpOnly 쿠키 → JS 접근 불가 |
| CSRF 공격으로 쿠키 악용 가능 | Access Token은 헤더로 전송 → CSRF 방어 |

### 고도화 방향

서버 규모가 커지면 Refresh Token을 DB에도 저장해서 강제 로그아웃이나 기기별 세션 관리를 추가하는 방식으로 확장.
