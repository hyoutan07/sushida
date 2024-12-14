'use client';

import React, { useState } from 'react';
import createSushiList from './CreateSushiList';

const AddWord = () => {
  const [inputJapanese, setInputJapanese] = useState<string>('');
  const [inputHiragana, setInputHiragana] = useState<string>('');

  const handleJapaneseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputJapanese(e.target.value);
  };
  const handleHiraganaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHiragana(e.target.value);
  };

  const handleButtonClick  = async () => {
    const result = createSushiList(inputJapanese, inputHiragana);

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
      </div>
    </div>
  );
};

export default AddWord;
