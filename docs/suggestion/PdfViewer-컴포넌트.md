# PdfViewer 컴포넌트

## 요구사항
- `src/components/PdfViewer.tsx` 생성
- 기능: 파일 업로드, 페이지 이동(이전/다음), 줌 인/아웃, 페이지 번호 표시

## 라이브러리
- `react-pdf@10.4.1`
- `pdfjs-dist@5.4.296` (react-pdf 내부 버전과 일치시켜 worker 버전 불일치 방지)

## 접근

### 상태 설계
관련 state 4개(file, numPages, currentPage, scale)를 **Object State Pattern** 으로 관리

```typescript
type PdfViewerState = {
  file: File | null;
  numPages: number;
  currentPage: number;
  scale: number;
};
```

### Worker 설정
CDN 대신 Vite의 `new URL()` 방식으로 로컬 worker 파일 참조
- pdfjs-dist를 직접 의존성으로 설치 후 react-pdf 내부 버전(5.4.296)과 맞춤

### 파일 업로드
`useRef` DOM 접근 없이 `<label>` 로 `<input type="file">` 을 감싸는 HTML 네이티브 방식 사용

## 결과
- `src/components/PdfViewer.tsx` 생성 완료
- Arrow Function 형태 (UI Component 규칙 준수)
- 줌 범위: 50% ~ 300% (0.2 단위)
