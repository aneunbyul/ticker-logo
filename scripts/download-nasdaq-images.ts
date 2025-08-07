import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// 1. 다운로드할 ticker 배열 관리
// src/data/nasdaq-tiacker.ts 파일에서 ticker 목록을 가져옴
import { nasdaqTickers as tickers } from '../src/data/nasdaq-tiacker';

const imagesDir = path.join(process.cwd(), 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 2. 이미지 폴더에 있는지 확인하고 아직 다운하지 않은 ticker만 남김
function getExistingImages(): Set<string> {
  if (!fs.existsSync(imagesDir)) {
    return new Set();
  }
  
  const files = fs.readdirSync(imagesDir);
  const existingImages = new Set<string>();
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const ticker = file.replace('.png', '');
      existingImages.add(ticker);
    }
  }
  
  return existingImages;
}

// 3. 이미지 다운로드 실행
async function downloadImage(ticker: string) {
  try {
    const url = `https://thumb.tossinvest.com/image/resized/48x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${ticker}.png`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!res.ok) {
      console.log(`${ticker} 다운로드 실패: ${res.status}`);
      return false;
    }
    
    const buffer = await res.buffer();
    fs.writeFileSync(path.join(imagesDir, `${ticker}.png`), buffer);
    console.log(`${ticker} 저장 완료`);
    return true;
  } catch (error) {
    console.log(`${ticker} 다운로드 실패: ${error}`);
    return false;
  }
}

// 메인 실행 함수
(async () => {
  console.log('=== 나스닥 종목 이미지 다운로드 ===');
  console.log('1. 기존 이미지 파일 확인 중...');
  const existingImages = getExistingImages();
  console.log(`   기존 이미지 파일: ${existingImages.size}개`);
  
  // 다운로드할 이미지 목록 필터링 (기존에 없는 것만)
  const imagesToDownload = tickers.filter(ticker => !existingImages.has(ticker));
  
  console.log(`2. 다운로드 대상: ${imagesToDownload.length}개`);
  console.log(`   건너뛸 이미지: ${tickers.length - imagesToDownload.length}개`);
  
  if (imagesToDownload.length === 0) {
    console.log('✅ 모든 이미지가 이미 존재합니다. 다운로드할 이미지가 없습니다.');
    
    // 모든 ticker를 제거하고 빈 배열로 업데이트
    const content = `export const nasdaqTickers: string[] = [

];

export default nasdaqTickers;
`;
    fs.writeFileSync('src/data/nasdaq-tiacker.ts', content);
    console.log('�� 모든 ticker가 이미지로 생성되었으므로 배열을 비웠습니다.');
    return;
  }
  
  console.log('3. 이미지 다운로드 시작...');
  let successCount = 0;
  let failCount = 0;
  const successfulTickers: string[] = [];
  const failedTickers: string[] = [];
  
  for (let i = 0; i < imagesToDownload.length; i++) {
    const ticker = imagesToDownload[i];
    const success = await downloadImage(ticker);
    
    if (success) {
      successCount++;
      successfulTickers.push(ticker);
    } else {
      failCount++;
      failedTickers.push(ticker);
    }
    
    // 진행률 표시
    if ((i + 1) % 10 === 0) {
      console.log(`   진행률: ${i + 1}/${imagesToDownload.length} (${Math.round((i + 1) / imagesToDownload.length * 100)}%)`);
    }
    
    // API 호출 간격 조절 (서버 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n=== 다운로드 완료 ===');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`📁 총 이미지 파일: ${existingImages.size + successCount}개`);
  
  // 성공한 ticker들을 배열에서 제거하고 파일 업데이트
  const allSuccessfulTickers = [...existingImages, ...successfulTickers];
  const remainingTickers = tickers.filter(ticker => !allSuccessfulTickers.includes(ticker));
  
  const content = `export const nasdaqTickers: string[] = [
${remainingTickers.map(t => `  "${t}",`).join('\n')}
];

export default nasdaqTickers;
`;
  
  fs.writeFileSync('src/data/nasdaq-tiacker.ts', content);
  console.log('\n📝 파일 업데이트 완료');
  console.log(`   제거된 ticker: ${allSuccessfulTickers.length}개 (기존: ${existingImages.size}개, 새로 성공: ${successfulTickers.length}개)`);
  console.log(`   실패한 ticker: ${failedTickers.length}개 (다음 실행 시 재시도)`);
  console.log(`   남은 ticker: ${remainingTickers.length}개`);
})(); 