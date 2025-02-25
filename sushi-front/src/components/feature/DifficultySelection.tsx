import React, { useState, useEffect } from "react";
import Nishida from "./Nishida";
import { FaCog } from "react-icons/fa"; // 歯車アイコン
import { SushiList } from "@/types/sushiList";
import { defaultSushiList } from "@/utils/sushiList";
import WordManagementModal from "../ui/WordManagementModal";
import { generateSushiList } from "@/utils/generateSushiList";

const DifficultySelection = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("初級");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSilent, setIsSilent] = useState(false);
  const [sushiList, setSushiList] = useState<SushiList>([]);
  const [filteredSushiList, setFilteredSushiList] = useState<SushiList>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態

  const difficulties = [
    { name: "初級", description: "文字数：2〜10文字\n確率10%で長いワードが出現\n制限時間：60秒", animationRatio: 0.35 },
    { name: "中級", description: "文字数：8〜20文字\n確率30%で長いワードが出現\n制限時間：90秒", animationRatio: 0.3 },
    { name: "上級", description: "文字数：20〜50文字\n制限時間：120秒", animationRatio: 0.25 },
    { name: "超級", description: "文字数：40〜文字\n制限時間：180秒", animationRatio: 0.22 },
  ];

  // ローカルストレージからsushiListを取得
  useEffect(() => {
    const storedSushiList = localStorage.getItem("userCustomSushiList");
    if (storedSushiList) {
      setSushiList(JSON.parse(storedSushiList));
    } else {
      localStorage.setItem("userCustomSushiList", JSON.stringify(defaultSushiList));
      setSushiList(defaultSushiList);
    }
  }, []);

  const handleStart = (silent: boolean) => {
    setIsSilent(silent);
    // const selected = difficulties.find(d => d.name === selectedDifficulty);
    
    // 選択された難易度に応じたsushiListを生成
    const difficultySushiList = generateSushiList(selectedDifficulty, sushiList);
    
    setIsPlaying(true);

    console.log(difficultySushiList);
  
    setFilteredSushiList(difficultySushiList); // フィルタリングしたリストをセット
  };

  if (isPlaying) {
    const selected = difficulties.find(d => d.name === selectedDifficulty);
    return (
      <Nishida
        animationRatio={selected ? selected.animationRatio : 1}
        isSilent={isSilent}
        sushiList={filteredSushiList}
        onReset={() => setIsPlaying(false)}
      />
    );
  }

  return (
    <div className="bg-pink-200 min-h-screen flex flex-col items-center justify-center p-4 border-4 border-pink-500 relative">
      {/* 歯車ボタン（ワード管理） */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 text-3xl text-gray-700 hover:text-gray-900"
      >
        <FaCog />
      </button>

      {/* 難易度選択エリア */}
      <h1 className="text-pink-700 text-4xl font-bold mb-6">難易度を選んでください</h1>
      <div className="flex space-x-4 bg-pink-300 p-2 rounded-lg">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.name}
            className={`px-6 py-2 font-bold text-lg rounded-lg shadow-md ${
              selectedDifficulty === difficulty.name
                ? "bg-pink-500 text-white border-2 border-pink-700"
                : "bg-pink-100 text-pink-800 hover:bg-pink-200"
            }`}
            onClick={() => setSelectedDifficulty(difficulty.name)}
          >
            {difficulty.name}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md border-4 border-pink-400 text-pink-800 w-80 text-center">
        <h2 className="text-2xl font-bold mb-2">{selectedDifficulty}</h2>
        <p className="text-lg whitespace-pre-line">
          {difficulties.find(d => d.name === selectedDifficulty)?.description}
        </p>
      </div>
      <div className="mt-6 flex flex-col space-y-4">
        <button
          onClick={() => handleStart(false)}
          className="bg-pink-500 text-white text-xl font-bold px-6 py-3 rounded-lg shadow-md hover:bg-pink-600"
        >
          通常プレイ
        </button>
        <button
          onClick={() => handleStart(true)}
          className="bg-gray-500 text-white text-xl font-bold px-6 py-3 rounded-lg shadow-md hover:bg-gray-600"
        >
          静音プレイ
        </button>
      </div>

      {/* ワード管理モーダル */}
      <WordManagementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DifficultySelection;
