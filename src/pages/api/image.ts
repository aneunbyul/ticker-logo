import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    console.log('API 호출: 이미지 이름이 없음');
    return res.status(400).json({ error: '이미지 이름을 입력하세요.' });
  }

  console.log(`API 호출: 이미지 이름 = ${name}`);
  const localImagePath = path.join(process.cwd(), 'public', 'images', `${name}.png`);
  console.log(`로컬 이미지 경로: ${localImagePath}`);
  
  // 로컬 파일 존재 여부 확인
  if (fs.existsSync(localImagePath)) {
    console.log(`로컬 파일 존재: ${localImagePath}`);
    const imageBuffer = fs.readFileSync(localImagePath);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1년 캐시
    return res.status(200).send(imageBuffer);
  }

  console.log(`로컬 파일 없음, 외부에서 다운로드 시도: ${name}`);
  // 로컬 파일이 없으면 외부 URL에서 다운로드
  try {
    const externalUrl = `https://thumb.tossinvest.com/image/resized/48x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${name}.png`;
    console.log(`외부 URL: ${externalUrl}`);
    
    const response = await fetch(externalUrl);
    console.log(`외부 응답 상태: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log(`외부 이미지 다운로드 실패: ${response.status}`);
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }

    const imageBuffer = await response.arrayBuffer();
    console.log(`이미지 다운로드 완료, 크기: ${imageBuffer.byteLength} bytes`);
    
    // 다운로드한 이미지를 로컬에 저장
    fs.writeFileSync(localImagePath, Buffer.from(imageBuffer));
    console.log(`로컬에 저장 완료: ${localImagePath}`);
    
    // 이미지 직접 응답
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1년 캐시
    return res.status(200).send(Buffer.from(imageBuffer));
    
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    return res.status(500).json({ error: '이미지 다운로드에 실패했습니다.' });
  }
} 