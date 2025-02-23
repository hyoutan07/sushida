'use client';

import React, { useState, useEffect } from 'react';
import createSushiList from '../../utils/createSushiList';
import { validateInput } from '@/utils/sushiVadationInput';

interface SushiList {
  japanese: string;
  hiragana: string;
  romaji: string[][];
  wordLen: number;
}

const SushiListManager = () => {
  const [sushiList, setSushiList] = useState<SushiList[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingJapanese, setEditingJapanese] = useState<string>('');
  const [editingHiragana, setEditingHiragana] = useState<string>('');
  const [alertMessage, setAlertMessage] = useState<string>('');

  // ローカルストレージから寿司リストを取得
  useEffect(() => {
    const storedSushiList = localStorage.getItem('userCustomSushiList');
    if (storedSushiList) {
      setSushiList(JSON.parse(storedSushiList));
    }
  }, []);

  // 編集モードのセット
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingJapanese(sushiList[index].japanese);
    setEditingHiragana(sushiList[index].hiragana);
  };

  // 編集内容を保存
  const handleSaveClick = () => {
    if (!validateInput(editingJapanese, editingHiragana, setAlertMessage)) {
      return; // バリデーション失敗時は処理を中断
    }

    if (editingIndex !== null) {
      const updatedSushi = createSushiList(editingJapanese, editingHiragana, setAlertMessage);
      const updatedSushiList = [...sushiList];
      updatedSushiList[editingIndex] = updatedSushi;

      // ローカルストレージに保存
      localStorage.setItem('userCustomSushiList', JSON.stringify(updatedSushiList));
      setSushiList(updatedSushiList);

      setEditingIndex(null);
      setAlertMessage('寿司リストが正常に更新されました！');
    }
  };

  // リストからアイテムを削除
  const handleDeleteClick = (index: number) => {
    const updatedSushiList = sushiList.filter((_, i) => i !== index);

    // ローカルストレージに保存
    localStorage.setItem('userCustomSushiList', JSON.stringify(updatedSushiList));
    setSushiList(updatedSushiList);
  };

  return (
    <div className="bg-pink-200 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border-4 border-pink-500 text-center w-[1200px]">
        <h1 className="text-pink-600 text-3xl font-bold mb-4">ワード管理</h1>

        {sushiList.length > 0 ? (
          <ul className="space-y-4">
            {sushiList.map((sushi, index) => (
              <li key={index} className="bg-pink-100 p-4 rounded-lg shadow-md border border-pink-300">
                {editingIndex === index ? (
                  <div className="flex flex-col space-y-4">
                    <label className="text-gray-700 font-bold text-left">日本語の単語</label>
                    <textarea
                      value={editingJapanese}
                      onChange={(e) => setEditingJapanese(e.target.value)}
                      className="w-full h-24 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
                    />

                    <label className="text-gray-700 font-bold text-left">ひらがな</label>
                    <textarea
                      value={editingHiragana}
                      onChange={(e) => setEditingHiragana(e.target.value)}
                      className="w-full h-24 p-3 border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
                    />

                    <div className="flex space-x-4 mt-2">
                      <button
                        onClick={handleSaveClick}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 w-full"
                      >
                        保存
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600 w-full"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">{sushi.japanese}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(index)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">寿司リストがありません。</p>
        )}

        {alertMessage && <div className="text-red-500 mt-4">{alertMessage}</div>}
      </div>
    </div>
  );
};

export default SushiListManager;
