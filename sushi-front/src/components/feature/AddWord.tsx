'use client';

import React, { useState } from 'react';
import { hiraToRomajiList } from '@/utils/hiraToRomajiList';

interface newSushiList {
  japanese: string;
  hiragana: string;
  romaji: string[][];
}

const createSushiList = (japanese: string, hiragana: string): newSushiList => {
  let remainedHiragana = hiragana;
  const romajiList: string[][] = [];

  while (remainedHiragana.length > 0) {
    let isMatched = false;

    for (const key in hiraToRomajiList) {
      if (remainedHiragana.startsWith(key)) {
        romajiList.push(hiraToRomajiList[key]);
        remainedHiragana = remainedHiragana.slice(key.length);
        isMatched = true;
        break;
      }
    }
    // TODO: 候補にない時、すでに登録されているときはエラーを吐かせる
    if (!isMatched) {
    }
  }

  return {
    japanese,
    hiragana,
    romaji: romajiList,
  };
};

const AddWord = () => {
  // 入力値を管理するstate
  const [inputJapanese, setInputJapanese] = useState<string>('');
  const [inputHiragana, setInputHiragana] = useState<string>('');
  const [newSushiList, setNewSushiList] = useState<newSushiList | null>(null);

  //入力の変更を監視
  const handleJapaneseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputJapanese(e.target.value);
  };
  const handleHiraganaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHiragana(e.target.value);
  };

  const handleButtonClick  = async () => {
    console.log("入力されたJap:", inputJapanese);
    console.log("入力されたHira:", inputHiragana);

    // 変換結果を取得してstateに保存
    const result = createSushiList(inputJapanese, inputHiragana);
    setNewSushiList(result);

   // APIルートにPOSTリクエストを送信してファイルを更新
   try {
      const response = await fetch('/api/updateSushiList', {
         method: 'POST',
         headers: {
         'Content-Type': 'application/json',
         },
         body: JSON.stringify(result),
      });

      if (!response.ok) {
         throw new Error('ファイルの更新に失敗しました。');
      }

      const data = await response.json();
      console.log(data.message);
   } catch (error) {
      console.error('エラー:', error);
   }
   };

  return (
    <div className="flex items-center justify-center">
      <div>
        <input
          type="text"
          value={inputJapanese}
          onChange={handleJapaneseChange}
          placeholder="例えばこんな悪口です"
          className="border p-2 mb-4 w-full"
        />
        <input
          type="text"
          value={inputHiragana}
          onChange={handleHiraganaChange}
          placeholder="たとえばこんなわるぐちです"
          className="border p-2 mb-4 w-full"
        />
        <button
          onClick={handleButtonClick}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          送信
        </button>

        {newSushiList && (
          <div className="mt-4">
            <h3>変換結果:</h3>
            <p>日本語: {newSushiList.japanese}</p>
            <p>ひらがな: {newSushiList.hiragana}</p>
            <p>ローマ字変換:</p>
            <ul>
              {newSushiList.romaji.map((romajiList, index) => (
                <li key={index}>
                  {romajiList.join(', ')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWord;
