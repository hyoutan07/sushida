'use client';

import React, { useState, useEffect } from 'react';
import { sushiList } from '@/utils/sushiList'; // 提供されたsushiListをインポート
import { audioPaths } from '@/utils/audioPath'; // 提供されたaudioPathsをインポート

const Nishida = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // 現在の単語インデックス
  const [typedWord, setTypedWord] = useState(''); // 現在の入力
  const [score, setScore] = useState(0); // スコア
  const [timeLeft, setTimeLeft] = useState(60); // 残り時間
  const [correctKeyCount, setCorrectKeyCount] = useState(0); // 正しいキー入力数
  const [mistypedKeyCount, setMistypedKeyCount] = useState(0); // ミスタイプ数
  const [message, setMessage] = useState('スペースキーを押してゲーム開始！');
  const [isGameStarted, setIsGameStarted] = useState(false); // ゲームが開始しているか
  const [isCompleted, setIsCompleted] = useState(false); // ゲームが終了したか

  const playAudio = (type: 'correct' | 'miss' | 'typing') => {
    const audio = new Audio(audioPaths[type]);
    audio.play();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isGameStarted) {
      if (event.key === ' ') {
        startGame();
      }
      return;
    }

    if (isCompleted) return; // ゲームが終了していたら無視

    const key = event.key;
    const currentRomaji = sushiList[currentWordIndex].romaji[0]; // 最初のローマ字だけを使う

    // 入力中の文字列を更新
    const nextInput = typedWord + key;

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
    } else {
      // 間違ったキーが押された場合
      setMistypedKeyCount((prev) => prev + 1);
      playAudio('miss'); // ミスタイプ時にエラー音再生
    }
  };

  const startGame = () => {
    setIsGameStarted(true);
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setCurrentWordIndex(0);
    setTimeLeft(60);
    setIsCompleted(false);
    setMessage(`${sushiList[0].japanese}`);
  };

  const moveToNextWord = () => {
    const nextIndex = (currentWordIndex + 1) % sushiList.length;
    setCurrentWordIndex(nextIndex);
    setTypedWord('');
    setMessage(`${sushiList[nextIndex].japanese}`);
  };

  const handleReset = () => {
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setCurrentWordIndex(0);
    setTimeLeft(60);
    setMessage('スペースキーを押してゲーム開始！');
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameStarted, typedWord, isCompleted]);

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
          {sushiList[currentWordIndex].romaji[0].split('').map((char, index) => (
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