'use client';

import React, { useState, useEffect } from 'react';
import createSushiList from '../../utils/createSushiList';
import { validateInput } from '@/utils/sushiVadationInput';

interface SushiList {
  japanese: string;
  hiragana: string;
  romaji: string[][];
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
    <div>
      <h2>Sushi List Manager</h2>
      <ul>
        {sushiList.length > 0 ? (
          sushiList.map((sushi, index) => (
            <li key={index} className="mb-4">
              {editingIndex === index ? (
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex flex-col w-6/12 gap-2">
                    <textarea
                      value={editingJapanese}
                      onChange={(e) => setEditingJapanese(e.target.value)}
                      className="border p-2 w-full h-24 resize-y"
                    />
                    <textarea
                      value={editingHiragana}
                      onChange={(e) => setEditingHiragana(e.target.value)}
                      className="border p-2 w-full h-24 resize-y"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleSaveClick}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      キャンセル
                    </button>
                    {alertMessage && <div className="text-red-500">{alertMessage}</div>}
                  </div>
                </div>
              ) : (
                <div>
                  <span className="mr-4">{sushi.japanese}</span>
                  <button
                    onClick={() => handleEditClick(index)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700 mr-2"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteClick(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    削除
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>寿司リストがありません。</p>
        )}
      </ul>
    </div>
  );
};

export default SushiListManager;
