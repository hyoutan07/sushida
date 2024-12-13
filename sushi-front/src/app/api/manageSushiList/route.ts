import { NextRequest, NextResponse } from 'next/server';
import { sushiList } from '@/utils/sushiList';
import fs from 'fs';
import path from 'path';

const sushiListPath = path.join(process.cwd(), 'src', 'utils', 'sushiList.ts');

export async function GET(req: NextRequest) {
  // GETリクエストで寿司リストを取得
  try {
    return NextResponse.json(sushiList);
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  // PUTリクエストで寿司リストを更新
  try {
    const { index, updatedSushi } = await req.json();

    if (index >= 0 && index < sushiList.length) {
      sushiList[index] = updatedSushi;

      // ファイルを書き換え
      const updatedContent = `export const sushiList = ${JSON.stringify(sushiList, null, 2)};`;
      fs.writeFileSync(sushiListPath, updatedContent, 'utf8');

      return NextResponse.json({ message: 'sushiListが正常に更新されました' });
    } else {
      return NextResponse.json({ message: '不正なインデックスです' }, { status: 400 });
    }
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // DELETEリクエストで寿司リストから指定のエントリを削除
  try {
    const { index } = await req.json();

    if (index >= 0 && index < sushiList.length) {
      sushiList.splice(index, 1);

      // ファイルを書き換え
      const updatedContent = `export const sushiList = ${JSON.stringify(sushiList, null, 2)};`;
      fs.writeFileSync(sushiListPath, updatedContent, 'utf8');

      return NextResponse.json({ message: 'sushiListからエントリが削除されました' });
    } else {
      return NextResponse.json({ message: '不正なインデックスです' }, { status: 400 });
    }
  } catch (error) {
    console.error('エラー:', error);
    return NextResponse.json({ message: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
