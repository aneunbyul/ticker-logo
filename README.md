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

### 이미지 다운로드 프로세스

1. **기존 이미지 확인**: `public/images/` 폴더의 기존 파일 스캔
2. **필터링**: 아직 다운로드되지 않은 티커만 선택
3. **다운로드**: Toss Invest API에서 순차적으로 다운로드
4. **저장**: 성공한 이미지를 `public/images/`에 저장
5. **업데이트**: 성공한 티커를 목록에서 제거하