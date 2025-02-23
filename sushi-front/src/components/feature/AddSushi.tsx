'use client';

import React, { useState } from 'react';
import createSushiList from '../../utils/createSushiList';
import { validateInput } from '@/utils/sushiVadationInput';

const AddSushi = () => {
  const [inputJapanese, setInputJapanese] = useState<string>('');
  const [inputHiragana, setInputHiragana] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  const handleJapaneseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJapanese(e.target.value);
  };

  const handleHiraganaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="bg-pink-200 min-h-screen flex items-center justify-center p-6">
      {/* 幅を広げる */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-pink-500 text-center w-[800px]">
        <h1 className="text-pink-600 text-3xl font-bold mb-4">ワード登録</h1>

        <label className="block text-left text-gray-700 font-bold mb-2">日本語の単語</label>
        <textarea
          value={inputJapanese}
          onChange={handleJapaneseChange}
          placeholder="例えばこんな悪口です"
          className="w-full h-32 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg mb-4"
        />

        <label className="block text-left text-gray-700 font-bold mb-2">ひらがな</label>
        <textarea
          value={inputHiragana}
          onChange={handleHiraganaChange}
          placeholder="たとえばこんなわるぐちです"
          className="w-full h-32 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg mb-4"
        />

        <button
          onClick={handleButtonClick}
          className="bg-pink-500 text-white text-lg font-bold px-6 py-3 rounded-lg shadow-md hover:bg-pink-600 w-full"
        >
          送信
        </button>

        {alertMessage && <div className="text-red-500 mt-4">{alertMessage}</div>}
      </div>
    </div>
  );
};

export default AddSushi;
