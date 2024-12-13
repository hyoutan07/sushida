import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { japanese, hiragana, romaji } = body;

    const sushiListPath = path.join(process.cwd(), 'src', 'utils', 'sushiList.ts');

    let currentContent = '';
    if (fs.existsSync(sushiListPath)) {
      currentContent = fs.readFileSync(sushiListPath, 'utf8');
    }

    let sushiList = [];

    if (currentContent.includes('export const sushiList = [')) {
      const sushiListString = currentContent.match(/export const sushiList = \[([\s\S]*?)\];/)?.[1];
      if (sushiListString) {
        try {
          sushiList = eval(`[${sushiListString}]`);
        } catch (e) {
          console.error('既存のsushiListのパース中にエラーが発生しました:', e);
          throw new Error('sushiListのパースに失敗しました');
        }
      }
    }

    sushiList.push({
      japanese,
      hiragana,
      romaji,
    });

    //TODO: evalの回避
    // 新しい内容を組み立て
    let updatedContent = `export const sushiList = [\n`;
    sushiList.forEach((item: { romaji: string[][]; japanese: string; hiragana: string; }) => {
    const formattedRomaji = item.romaji
      .map((innerArray: string[]) => `[${innerArray.map((value: string) => `'${value}'`).join(', ')}]`)
      .join(', ');

    updatedContent += `  {\n    japanese: '${item.japanese}',\n    hiragana: '${item.hiragana}',\n    romaji: [${formattedRomaji}]\n  },\n`;
    });
    updatedContent += `];`;

    fs.writeFileSync(sushiListPath, updatedContent, 'utf8');

    return NextResponse.json({ message: 'sushiList.tsが正常に更新されました！' });
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ message: 'ファイルの更新中にエラーが発生しました。' }, { status: 500 });
  }
}
