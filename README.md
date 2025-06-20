# Ticker Logo API

주식 티커 로고 이미지를 제공하는 Next.js API 서비스입니다.

## 배포

### Vercel 배포 (권장)

1. [Vercel](https://vercel.com)에 가입
2. GitHub 저장소 연결
3. 자동 배포 완료

### 수동 배포

```bash
npm run build
npm start
```

## API 사용법

### 1. 이미지 직접 응답 (권장)

```
GET /api/image?name={이미지명}
```

이 API는 이미지 파일을 직접 반환합니다.

#### 사용 예시

```javascript
// HTML img 태그에서 직접 사용
<img src="https://your-domain.vercel.app/api/image?name=032820" alt="티커 로고" />

// React에서 사용
<img src={`https://your-domain.vercel.app/api/image?name=${tickerName}`} alt="티커 로고" />
```

### 2. 이미지 URL 조회

```
GET /api/image-url?name={이미지명}
```

이 API는 이미지 URL을 JSON 형태로 반환합니다.

#### 응답 예시

```json
{
  "url": "/api/image?name=032820"
}
```

#### 사용 예시

```javascript
// 다른 프로젝트에서 사용
const response = await fetch('https://your-domain.vercel.app/api/image-url?name=032820');
const data = await response.json();
console.log(data.url); // "/api/image?name=032820"
```

### 동작 방식

1. **로컬 파일 확인**: `public/images/{이미지명}.png` 파일 존재 여부 확인
2. **로컬 파일 있음**: 바로 이미지 반환
3. **로컬 파일 없음**: 
   - Toss Invest API에서 이미지 다운로드
   - 로컬에 저장 후 이미지 반환

## 개발

```bash
npm install
npm run dev
```

서버가 http://localhost:3000 에서 실행됩니다.

## 테스트

브라우저에서 다음 URL로 테스트할 수 있습니다:
- http://localhost:3000/api/image?name=032820
- http://localhost:3000/api/image-url?name=032820 