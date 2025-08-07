# Ticker Logo API

주식 티커 로고 이미지를 제공하는 Next.js API 서비스입니다. KOSPI 상장 기업들의 로고 이미지를 자동으로 다운로드하고 API로 제공합니다.

## 📁 프로젝트 구조

```
ticker-logo/
├── src/
│   ├── data/
│   │   └── kospi-tickers.ts    # KOSPI 티커 목록
│   └── pages/
│       └── api/
│           ├── image.ts        # 이미지 직접 제공 API
│           └── image-url.ts    # 이미지 URL 제공 API
├── scripts/
│   └── download-all-kospi-images.ts  # 이미지 다운로드 스크립트
├── public/
│   └── images/                 # 다운로드된 이미지 저장소
└── package.json
```

## 🔄 동작 방식

### 이미지 제공 프로세스

1. **로컬 파일 확인**: `public/images/{티커명}.png` 파일 존재 여부 확인
2. **로컬 파일 있음**: 바로 이미지 반환 (캐시 히트)
3. **로컬 파일 없음**: 
   - Toss Invest API에서 이미지 다운로드
   - 로컬에 저장 후 이미지 반환
   - 다음 요청부터는 캐시에서 제공

##  스크립트 실행 명령어

### 필수 패키지 설치

```bash
npm install --save-dev ts-node
```

### KOSPI 이미지 다운로드

```bash
npm run download-kospi
```

또는 직접 실행:

```bash
npx ts-node scripts/download-kospi-images.ts
```

### NASDAQ 이미지 다운로드

```bash
npm run download-nasdaq
```

또는 직접 실행:

```bash
npx ts-node scripts/download-nasdaq-images.ts
```

### 스크립트 특징

- **점진적 다운로드**: 성공한 티커는 배열에서 제거되어 다음 실행 시 재시도하지 않음
- **서버 부하 방지**: 요청 간 100ms 지연으로 서버 부하 최소화
- **에러 처리**: 실패한 다운로드는 기록하고 다음 실행 시 재시도
- **진행률 표시**: 실시간 진행률과 성공/실패 개수 표시
```