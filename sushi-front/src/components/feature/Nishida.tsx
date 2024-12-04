'use client';

import React, { useState, useEffect } from 'react';
import { sushiList } from '@/utils/sushiList';
import { audioPaths } from '@/utils/audioPath';

const TIMER = 60;

const Nishida = () => {
  // 入力文字関係
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // 現在の単語インデックス
  const [typedWord, setTypedWord] = useState(''); // 現在の入力

  // Romaji候補判定に使用する変数
  const [candidateIndex, setCandidateIndex] = useState(0); // romaji候補リストのインデックス
  const [typeCandidate, setTypeCandidate] = useState(""); // タイピングした候補文字列を一時保存
  const [candidateIndexList, setCandidateIndexList] = useState<number[]>([]); // showRomajiでどのローマ字候補を通ったかを保存する変数

  // タイマー
  const [timeLeft, setTimeLeft] = useState(TIMER); // 残り時間
  // 画面表示
  const [score, setScore] = useState(0); // スコア
  const [correctKeyCount, setCorrectKeyCount] = useState(0); // 正しいキー入力数
  const [mistypedKeyCount, setMistypedKeyCount] = useState(0); // ミスタイプ数
  const [message, setMessage] = useState('スペースかEnterキーを押してゲーム開始！');
  const [showRomaji, setShowRomaji] = useState('');
  // ゲーム管理
  const [isGameStarted, setIsGameStarted] = useState(false); // ゲームが開始しているか
  const [isCompleted, setIsCompleted] = useState(false); // ゲームが終了したか

  // Audio関数
  const playAudio = (type: 'correct' | 'miss' | 'typing') => {
    const audio = new Audio(audioPaths[type]);
    audio.play();
  };

  // TODO: 後できれいにする
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isGameStarted) {
      if (event.key === ' ' || event.key === 'Enter') {
        startGame();
      }
      return;
    }

    if (event.key === 'Escape') {
      handleReset();
    }

    if (isCompleted) return;

    const inputKey = event.key;
    const currentRomajiCandidates = sushiList[currentWordIndex].romaji[candidateIndex]; // ローマ字の候補リスト

    // 入力中の文字列を更新
    const nextInputAll = typedWord + inputKey; // 全体の文字列 
    const nextCandidateInput = typeCandidate + inputKey; //候補入力の文字列 例: choko なら 「cho」, 「ko」の部分

    console.log("入力", nextCandidateInput)

    // nextCandidateInputの入力の正解判定に使用
    let isCorrect = false;

    // fixme: nが優先されてnnが許容されない
    // 特別な処理: nの後にnnを許容
    if (nextInputAll.endsWith('n') && inputKey === 'n' && candidateIndex > 0 && candidateIndex < sushiList[currentWordIndex].romaji.length - 1) {
      const previousCandidateIndex = candidateIndex - 1
      const previousRomajiCandidates = sushiList[currentWordIndex].romaji[previousCandidateIndex]; // 前回のローマ字の候補リスト
      
      for (let romajiIndex = 0; romajiIndex < previousRomajiCandidates.length; romajiIndex++) {
        console.log(`候補 ${romajiIndex}: ${previousRomajiCandidates[romajiIndex]}`);
        const romajiCandidate = previousRomajiCandidates[romajiIndex];

        const extendedInput = "n" + inputKey;
        if (romajiCandidate.startsWith(extendedInput)) {
          setTypedWord(nextInputAll);
          setTypeCandidate(extendedInput);
          setCorrectKeyCount((prev) => prev + 1);
          playAudio('typing');

          isCorrect = true;

          // TODO: clean up
          const newCandidateIndexList = candidateIndexList.map((index, j) => (j === previousCandidateIndex ? romajiIndex : index))
          console.log("候補インデックスリスト", newCandidateIndexList)
          const newShowRomaji = newCandidateIndexList.map((index, i) => sushiList[currentWordIndex].romaji[i][index]).join('')
          setCandidateIndexList(newCandidateIndexList)
          setShowRomaji(newShowRomaji)

          // romajiCandidateが全て正しく入力されていたら次へ
          if (extendedInput.length === romajiCandidate.length) {
            setTypeCandidate('');
          }
        }
      }
    }

    for (let romajiIndex = 0; romajiIndex < currentRomajiCandidates.length; romajiIndex++) {
      console.log(`候補 ${romajiIndex}: ${currentRomajiCandidates[romajiIndex]}`);
      const romajiCandidate = currentRomajiCandidates[romajiIndex];

      // 正しい入力が部分一致するかチェック
      if (romajiCandidate.startsWith(nextCandidateInput)) {
        setTypedWord(nextInputAll);
        setTypeCandidate(nextCandidateInput);
        setCorrectKeyCount((prev) => prev + 1);
        playAudio('typing');

        isCorrect = true;

        // TODO: clean up
        const newCandidateIndexList = candidateIndexList.map((index, j) => (j === candidateIndex ? romajiIndex : index))
        console.log("候補インデックスリスト", newCandidateIndexList)
        const newShowRomaji = newCandidateIndexList.map((index, i) => sushiList[currentWordIndex].romaji[i][index]).join('')
        setCandidateIndexList(newCandidateIndexList)
        setShowRomaji(newShowRomaji)

        // romajiCandidateが全て正しく入力されていたら、次のRomaji候補へ進む
        if (nextCandidateInput.length === romajiCandidate.length) {
          setCandidateIndex((prev) => prev + 1)
          setTypeCandidate("")

          // 全単語の正解判定
          if (candidateIndex + 1 === sushiList[currentWordIndex].romaji.length) {
            setScore((prev) => prev + 1);
            playAudio('correct');
            moveToNextWord();
          }
        }
        // if文を通った時点で他の候補は判定不要
        break;
      }
    }

    // 間違ったキーが押された場合
    if (!isCorrect) {
      setMistypedKeyCount((prev) => prev + 1);
      playAudio('miss'); // ミスタイプ時にエラー音再生
    }
  };

  // ゲームスタート時の初期化関数
  const startGame = () => {
    setIsGameStarted(true);
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setCurrentWordIndex(0);
    setCandidateIndex(0);
    setTimeLeft(TIMER);
    setIsCompleted(false);
    moveToNextWord();
  };

  // 1つの単語が完了して、次の単語のセットアップ関数
  const moveToNextWord = () => {
    const nextIndex = Math.floor(Math.random() * sushiList.length);
    setCurrentWordIndex(nextIndex);
    setCandidateIndex(0);
    setTypedWord('');
    setMessage(`${sushiList[nextIndex].japanese}`);
    // setShowRomaji(`${sushiList[nextIndex].romaji}`);
    setShowRomaji(sushiList[nextIndex].romaji.map(str => str[0]).join(''))
    setCandidateIndexList(Array(sushiList[nextIndex].romaji.length).fill(0)) // romajiの長さ文の0配列で初期化
  };

  // リセット関数
  const handleReset = () => {
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setCurrentWordIndex(0);
    setCandidateIndex(0);
    setTimeLeft(TIMER);
    setMessage('スペースキーを押してゲーム開始！');
    setShowRomaji('');
    setIsGameStarted(false);
    setIsCompleted(false);
  };

  // タイマー処理
  useEffect(() => {
    if (!isGameStarted || isCompleted) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsCompleted(true);
      setMessage(`ゲーム終了！スコア: ${score}`);
    }
  }, [isGameStarted, timeLeft, isCompleted]);

  // windowは最初からは読み込めないのでuseEffectを用いる
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameStarted, typedWord, isCompleted]);

  // TODO: styleはchatGPTに本当に適当に任せた
  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        maxWidth: '800px',
        margin: 'auto',
        padding: '20px',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>西打</h1>
      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '20px 0' }}>
        残り時間: {timeLeft}秒
      </p>
      <p
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333',
          margin: '20px 0',
          wordWrap: 'break-word',
        }}
      >
        {message}
      </p>
      <div
        style={{
          fontSize: '48px',
          fontWeight: 'bold',
          marginTop: '20px',
          color: '#4CAF50',
          wordWrap: 'break-word',
        }}
      >
        <span>
          {showRomaji.split('').map((char, index) => (
            <span
              key={index}
              style={{
                color: index < typedWord.length ? 'green' : 'black',
                textDecoration: index === typedWord.length ? 'underline' : 'none',
              }}
            >
              {char}
            </span>
          ))}
        </span>
      </div>
      {/* デバック用 */} <h1 style={{ fontSize: '24px' }} >{typedWord} </h1>
      <p style={{ fontSize: '24px', marginTop: '20px', color: '#fff' }}>スコア: {score}</p>
      <p style={{ fontSize: '24px', marginTop: '20px', color: '#fff' }}>正しいキー入力数: {correctKeyCount}</p>
      <p style={{ fontSize: '24px', marginTop: '20px', color: '#fff' }}>ミスタイプ数: {mistypedKeyCount}</p>
      {isCompleted && (
        <button
          onClick={handleReset}
          style={{
            fontSize: '16px',
            padding: '10px',
            marginTop: '20px',
            borderRadius: '10px',
            background: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          リセット
        </button>
      )}
    </div>
  );
};

export default Nishida;
