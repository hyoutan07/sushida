'use client';

import React, { useState } from 'react';
import createSushiList from '../../utils/createSushiList';
import { validateInput } from '@/utils/sushiVadationInput';

const AddSushi = () => {
  const [inputJapanese, setInputJapanese] = useState<string>('');
  const [inputHiragana, setInputHiragana] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleJapaneseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputJapanese(e.target.value);
  };

  const handleHiraganaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputHiragana(e.target.value);
  };

  const handleButtonClick = () => {
    if (!validateInput(inputJapanese, inputHiragana, setAlertMessage)) {
      return; // バリデーション失敗時は処理を中断
    }

    const newSushi = createSushiList(inputJapanese, inputHiragana, setAlertMessage);

    try {
      // ローカルストレージから既存のリストを取得
      const existingList = localStorage.getItem('userCustomSushiList');
      const sushiList = existingList ? JSON.parse(existingList) : [];

      // 新しい寿司リストを追加
      sushiList.push(newSushi);

      // ローカルストレージに保存
      localStorage.setItem('userCustomSushiList', JSON.stringify(sushiList));

      // console.log('ローカルストレージに保存しました:', sushiList);

      // フィールドをリセット
      setInputJapanese('');
      setInputHiragana('');
      setAlertMessage('寿司リストが正常に追加されました！');
    } catch (error) {
      console.error('ローカルストレージの操作中にエラーが発生しました:', error);
      setAlertMessage('エラーが発生しました。もう一度試してください。');
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
        {alertMessage && <div className="text-red-500">{alertMessage}</div>}
      </div>
    </div>
  );
};

export default AddSushi;
