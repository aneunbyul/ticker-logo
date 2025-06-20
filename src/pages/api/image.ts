import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: '이미지 이름을 입력하세요.' });
  }

  const localImagePath = path.join(process.cwd(), 'public', 'images', `${name}.png`);
  
  // 로컬 파일 존재 여부 확인
  if (fs.existsSync(localImagePath)) {
    const imageUrl = `/images/${name}.png`;
    return res.status(200).json({ url: imageUrl });
  }

  // 로컬 파일이 없으면 외부 URL에서 다운로드
  try {
    const externalUrl = `https://thumb.tossinvest.com/image/resized/48x0/https%3A%2F%2Fstatic.toss.im%2Fpng-icons%2Fsecurities%2Ficn-sec-fill-${name}.png`;
    
    const response = await fetch(externalUrl);
    
    if (!response.ok) {
      return res.status(404).json({ error: '이미지를 찾을 수 없습니다.' });
    }

    const imageBuffer = await response.arrayBuffer();
    
    // 다운로드한 이미지를 로컬에 저장
    fs.writeFileSync(localImagePath, Buffer.from(imageBuffer));
    
    // 저장된 이미지 URL 반환
    const imageUrl = `/images/${name}.png`;
    return res.status(200).json({ url: imageUrl });
    
  } catch (error) {
    console.error('이미지 다운로드 실패:', error);
    return res.status(500).json({ error: '이미지 다운로드에 실패했습니다.' });
  }
} 