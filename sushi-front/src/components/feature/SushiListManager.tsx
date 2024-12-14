'use client';

import { hiraToRomajiList } from '@/utils/hiraToRomajiList';
import React, { useState, useEffect } from 'react';

interface Sushi {
  japanese: string;
  hiragana: string;
  romaji: string[][];
}

const SushiListManager = () => {
  const [sushiList, setSushiList] = useState<Sushi[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingJapanese, setEditingJapanese] = useState<string>('');
  const [editingHiragana, setEditingHiragana] = useState<string>('');

  // 初回レンダリング時に寿司リストをAPIから取得
  useEffect(() => {
    const fetchSushiList = async () => {
      try {
        const response = await fetch('/api/manageSushiList');
        if (!response.ok) throw new Error('寿司リストの取得に失敗しました');
        const data: Sushi[] = await response.json();
        setSushiList(data);
      } catch (error) {
        console.error('エラー:', error);
      }
    };

    fetchSushiList();
  }, []);

  // 編集ボタンのクリック処理
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditingJapanese(sushiList[index].japanese);
    setEditingHiragana(sushiList[index].hiragana);
  };

  const createSushiList = (japanese: string, hiragana: string): Sushi => {
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
       throw new Error(`未対応のひらがなが含まれています: ${remainedHiragana}`);
     }
   }
 
   return {
     japanese,
     hiragana,
     romaji: romajiList,
   };
 };
 
  // 保存ボタンのクリック処理
  const handleSaveClick = async () => {
   if (editingIndex !== null) {
     try {
       // 新しい Sushi データを生成
       const updatedSushi = createSushiList(editingJapanese, editingHiragana);
 
       // PUTリクエストをAPIに送信してデータを更新
       const response = await fetch('/api/manageSushiList', {
         method: 'PUT',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ index: editingIndex, updatedSushi }),
       });
 
       if (!response.ok) throw new Error('寿司リストの更新に失敗しました');
 
       // UI上の状態を更新
       const updatedSushiList = [...sushiList];
       updatedSushiList[editingIndex] = updatedSushi;
       setSushiList(updatedSushiList);
       setEditingIndex(null);
     } catch (error) {
       console.error('エラー:', error);
     }
   }
 };
 

  // 削除ボタンのクリック処理
  const handleDeleteClick = async (index: number) => {
    try {
      // DELETEリクエストをAPIに送信してデータを削除
      const response = await fetch('/api/manageSushiList', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });

      if (!response.ok) throw new Error('寿司リストの削除に失敗しました');

      // UI上の状態を更新
      const updatedSushiList = sushiList.filter((_, i) => i !== index);
      setSushiList(updatedSushiList);
    } catch (error) {
      console.error('エラー:', error);
    }
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
