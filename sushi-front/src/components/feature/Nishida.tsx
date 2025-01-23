"use client";

import React, { useState, useEffect } from "react";
import { sushiList } from "@/utils/sushiList";
import { audioPaths } from "@/utils/audioPath";
import Image from "next/image";
import { bombImageItemList } from "@/consts/bombImageItemList";

const TIMER = 13; // 1ゲームのゲーム時間
const DEFAULT_ANIMATION_TIME = 5; // 1つの問題の時間

const Nishida = () => {
  // 入力文字関係
  const [showWordIndex, setShowWordIndex] = useState(0); // 現在の単語インデックス
  const [typedWord, setTypedWord] = useState(""); // 現在の入力

  // Romaji候補判定に使用する変数
  // GroupAlp GroupAlphabetの略
  const [groupAlpIndex, setGroupAlpIndex] = useState(0); //　ひらがな候補リストのインデックス
  const [typeGroupAlp, setTypeGroupAlp] = useState(""); // タイピングした候補文字列を一時保存
  const [recordCandidateIndexList, setRecordCandidateIndexList] = useState<
    number[]
  >([]); // showRomajiでどのローマ字候補を通ったかを保存する変数
  //showWordIndex[]
  //  romaji
  //  groupAlpIndex[]
  //    candidateIndex[]

  // タイマー
  const [timeLeft, setTimeLeft] = useState(TIMER); // 残り時間
  const [animationTimeLeft, setAnimationTimeLeft] = useState(0); //アニメーションタイマー監視用

  // 画面表示
  const [score, setScore] = useState(0); // スコア
  const [correctKeyCount, setCorrectKeyCount] = useState(0); // 正しいキー入力数
  const [mistypedKeyCount, setMistypedKeyCount] = useState(0); // ミスタイプ数
  const [message, setMessage] = useState(
    "スペースかEnterキーを押してゲーム開始！"
  );
  const [showRomaji, setShowRomaji] = useState("");

  // ゲーム管理
  const [isGameStarted, setIsGameStarted] = useState(false); // ゲームが開始しているか
  const [isGameCompleted, setIsGameCompleted] = useState(false); // ゲームが終了したか

  // アニメーション任意時間実行
  const [animationTime, setAnimationTime] = useState(DEFAULT_ANIMATION_TIME); // デフォルトの時間（秒）
  const [bombImageIndex, setBombImageIndex] = useState(0); // 爆弾イメージリストのインデックス (アニメーションの再実行のkeyに指定)

  // Audio関数
  const playAudio = (type: "correct" | "miss" | "typing") => {
    const audio = new Audio(audioPaths[type]);
    audio.play();
  };

  // TODO: 後できれいにする
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isGameStarted) {
      if (event.key === " " || event.key === "Enter") {
        startGame();
      }
      return;
    }

    if (event.key === "Escape") {
      handleReset();
      return;
    }

    if (isGameCompleted) return;

    const inputKey = event.key;
    const currentGroupAlpList = sushiList[showWordIndex].romaji[groupAlpIndex]; // ローマ字の候補リスト

    if (inputKey === " " || inputKey === "Enter") return;

    // 入力中の文字列を更新
    const wordInputAll = typedWord + inputKey; // 全体の文字列
    const groupAlpInput = typeGroupAlp + inputKey; //候補入力の文字列 例: choko なら 「cho」, 「ko」の部分

    // groupAlpInputの入力の正解判定に使用
    let isInputCorrect = false;

    for (
      let candidateIndex = 0;
      candidateIndex < currentGroupAlpList.length;
      candidateIndex++
    ) {
      const candidateGroupAlp = currentGroupAlpList[candidateIndex];

      // 正しい入力が部分一致するかチェック
      if (candidateGroupAlp.startsWith(groupAlpInput)) {
        setTypedWord(wordInputAll);
        setTypeGroupAlp(groupAlpInput);
        setCorrectKeyCount((prev) => prev + 1);
        playAudio("typing");
        isInputCorrect = true;

        // ローマ字の候補によって、表示をリアルタイムに変更
        const newCandidateIndexList = recordCandidateIndexList.map((index, j) =>
          j === groupAlpIndex ? candidateIndex : index
        );
        const newShowRomaji = newCandidateIndexList
          .map((index, i) => sushiList[showWordIndex].romaji[i][index])
          .join("");
        setRecordCandidateIndexList(newCandidateIndexList);
        setShowRomaji(newShowRomaji);

        // romajiCandidateが全て正しく入力されていたら、次のRomaji候補へ進む
        if (groupAlpInput.length === candidateGroupAlp.length) {
          setGroupAlpIndex((prev) => prev + 1);
          setTypeGroupAlp("");

          // 全単語の正解判定
          if (groupAlpIndex + 1 === sushiList[showWordIndex].romaji.length) {
            setScore((prev) => prev + 1);
            playAudio("correct");
            moveToNextWord();
          }
        }
        // if文を通った時点で他の候補は判定不要
        break;
      }
    }

    // 間違ったキーが押された場合
    if (!isInputCorrect) {
      setMistypedKeyCount((prev) => prev + 1);
      playAudio("miss"); // ミスタイプ時にエラー音再生
    }
  };

  // ゲームスタート時の初期化関数
  const startGame = () => {
    setIsGameStarted(true);
    setTypedWord("");
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setShowWordIndex(0);
    setGroupAlpIndex(0);
    setTimeLeft(TIMER);
    setIsGameCompleted(false);
    setTypeGroupAlp("");
    moveToNextWord();
  };

  // 1つの単語が完了して、次の単語のセットアップ関数
  const moveToNextWord = () => {
    // const nextIndex = Math.floor(Math.random() * sushiList.length);
    const nextIndex = (showWordIndex + 1) % sushiList.length; // 順番通りに取得
    setShowWordIndex(nextIndex);
    setGroupAlpIndex(0);
    setTypeGroupAlp("");
    setTypedWord("");
    setMessage(`${sushiList[nextIndex].japanese}`);
    // setShowRomaji(`${sushiList[nextIndex].romaji}`);
    setShowRomaji(sushiList[nextIndex].romaji.map((str) => str[0]).join(""));
    setRecordCandidateIndexList(
      Array(sushiList[nextIndex].romaji.length).fill(0)
    ); // romajiの長さ分の0配列で初期化
    setBombImageIndex((prevKey) => (prevKey + 1) % bombImageItemList.length); //animationKeyを変更することでアニメーション再スタート
    setAnimationTimeLeft(0);
  };

  // リセット関数
  const handleReset = () => {
    setTypedWord("");
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setShowWordIndex(0);
    setGroupAlpIndex(0);
    setTimeLeft(TIMER);
    setMessage("スペースキーを押してゲーム開始！");
    setShowRomaji("");
    setIsGameStarted(false);
    setIsGameCompleted(false);
    setTypeGroupAlp("");
  };

  // タイマー処理：ゲーム自体のタイマー 　長めの時間を計測
  useEffect(() => {
    if (!isGameStarted || isGameCompleted) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsGameCompleted(true);
      setMessage(`ゲーム終了！スコア: ${score}`);
    }
  }, [isGameStarted, timeLeft, isGameCompleted]);

  // windowは最初からは読み込めないのでuseEffectを用いる
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isGameStarted, typedWord, isGameCompleted, showWordIndex]);

  // 出題アイテムタイマー処理：1つのワードにかけられる時間を計測
  useEffect(() => {
    if (!isGameStarted || isGameCompleted) return;

    if (animationTimeLeft < DEFAULT_ANIMATION_TIME) {
      const timer = setTimeout(() => {
        setAnimationTimeLeft((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      moveToNextWord();
    }
  }, [isGameStarted, animationTimeLeft, isGameCompleted]);

  return (
    <div className="text-center mt-12 max-w-3xl mx-auto p-5 rounded-2xl bg-gradient-to-br from-pink-300 to-pink-200 shadow-lg">
      <h1 className="text-4xl font-bold text-white">西打</h1>
      <p className="text-2xl font-bold text-white my-5">
        残り時間: {timeLeft}秒
      </p>
      <div className="m-5 p-5 flex gap-8 justify-center items-center">
        <div>
          サーヤ
          <Image
            src="/animations/saya.png"
            width={200}
            height={200}
            alt="Picture of the author"
          />
        </div>
        <div className="relative w-full">
          <div className="w-full h-20 bg-gray-200 shadow-2xl"></div>
          <div
            key={bombImageIndex} // アニメーションを再実行するためのキー
            className="absolute top-4 z-30"
            style={{
              animation: `roll-in-left 0.6s ease both, scroll-item ${animationTime}s linear 0.6s, roll-out-right 0.6s ease ${
                animationTime + 0.6
              }s`,
            }}
          >
            {isGameStarted && !isGameCompleted ? (
              <Image
                src={`${bombImageItemList[bombImageIndex].path}`}
                width={100}
                height={100}
                alt="Picture of the author"
                className="rounded-xl"
              />
            ) : (
              <></>
            )}
          </div>
          <section className="wrapper">
            <div className="flex loop loop-right-double">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  <div className="w-20 h-16 bg-gray-400 border-r-2 border-gray-900 rounded-r-full"></div>
                  <div className="w-20 h-6 bg-gray-500 border-l-2 border-gray-900"></div>
                </span>
              ))}
            </div>
            <div className="flex loop loop-right-double">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  <div className="relative w-20 h-16 bg-gray-400 border-r-2 border-gray-900 rounded-r-full"></div>
                  <div className="w-20 h-6 bg-gray-500 border-l-2 border-gray-900"></div>
                </span>
              ))}
            </div>
          </section>
          <div className="conveyor-belt-below w-full h-28 bg-gray-300"></div>
          <div className="w-full h-20 bg-gray-400"></div>
        </div>
        <div>
          <div className="shadow-2xl">ニシダ</div>
          <Image
            src="/animations/nishida.png"
            width={200}
            height={200}
            alt="Picture of the author"
          />
        </div>
      </div>

      <div className="p-10 border-8 border-white rounded-xl bg-gray-500">
        <p className="text-3xl font-bold text-white my-5 break-words">
          {message}
        </p>
        <div className="text-6xl font-bold mt-5 text-white break-words">
          <span>
            {showRomaji.split("").map((char, index) => (
              <span
                key={index}
                className={`${
                  index < typedWord.length ? "text-green-500" : "text-gray"
                } ${index === typedWord.length ? "underline" : ""}`}
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      </div>

      <div className="flex gap-8 justify-center items-center">
        <p className="text-2xl mt-5 text-white">スコア: {score}</p>
        <p className="text-2xl mt-5 text-white">
          正しいキー入力数: {correctKeyCount}
        </p>
        <p className="text-2xl mt-5 text-white">
          ミスタイプ数: {mistypedKeyCount}
        </p>
      </div>

      {isGameCompleted && (
        <button
          onClick={handleReset}
          className="text-lg px-4 py-2 mt-5 rounded-lg bg-green-500 text-white border-none cursor-pointer"
        >
          リセット
        </button>
      )}
    </div>
  );
};

export default Nishida;
