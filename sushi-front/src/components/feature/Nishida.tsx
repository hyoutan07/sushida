'use client';

import React, { useState, useEffect } from 'react';
import { sushiList } from '@/utils/sushiList';
import { audioPaths } from '@/utils/audioPath';

const TIMER = 6;

const Nishida = () => {
  // 入力文字関係
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // 現在の単語インデックス
  const [typedWord, setTypedWord] = useState(''); // 現在の入力
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

    const inputKey = event.key;
    const currentRomaji = sushiList[currentWordIndex].romaji[0]; // 最初のローマ字だけを使う
    // TODO: 「ちょ」cho tyoのような2通りの入力問題は、リストで管理ではなく、正規表現とかでできそうと思ったため一旦後回し

    // 入力中の文字列を更新
    const nextInput = typedWord + inputKey;

    if (isCompleted) return;

    // 正しい入力が部分一致するかチェック
    if (currentRomaji.startsWith(nextInput)) {
      setTypedWord(nextInput);
      setCorrectKeyCount((prev) => prev + 1);
      playAudio('typing'); // 正しいキー入力時にタイピング音再生

      // 完全一致した場合
      if (currentRomaji === nextInput) {
        setScore((prev) => prev + 1);
        playAudio('correct'); // 正解時に正解音再生
        moveToNextWord();
      }
    } else if (inputKey === ' ' || inputKey === 'Escape' || inputKey === 'Enter'){
    } else {
      // 間違ったキーが押された場合
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
    setTimeLeft(TIMER);
    setIsCompleted(false);
    moveToNextWord();
   };

  // 1つの単語が完了して、次の単語のセットアップ関数
  const moveToNextWord = () => {
    const nextIndex = Math.floor(Math.random() * sushiList.length);
    setCurrentWordIndex(nextIndex);
    setTypedWord('');
    setMessage(`${sushiList[nextIndex].japanese}`);
    setShowRomaji(`${sushiList[nextIndex].romaji[0]}`);
  };

  // リセット関数
  const handleReset = () => {
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setCurrentWordIndex(0);
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
