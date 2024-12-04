'use client';

import React, { useState, useEffect } from 'react';
import { sushiList } from '@/utils/sushiList';
import { audioPaths } from '@/utils/audioPath';

const TIMER = 60;

const Nishida = () => {
  // 入力文字関係
  const [showWordIndex, setShowWordIndex] = useState(0); // 現在の単語インデックス
  const [typedWord, setTypedWord] = useState(''); // 現在の入力

  // Romaji候補判定に使用する変数
  // GroupAlp GroupAlphabetの略
  const [groupAlpIndex, setGroupAlpIndex] = useState(0); //　ひらがな候補リストのインデックス
  const [typeGroupAlp, setTypeGroupAlp] = useState(""); // タイピングした候補文字列を一時保存
  const [recordCandidateIndexList, setRecordCandidateIndexList] = useState<number[]>([]); // showRomajiでどのローマ字候補を通ったかを保存する変数
  //showWordIndex[]
  //  romaji
  //  groupAlpIndex[]
  //    candidateIndex[]

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
  const [isGameCompleted, setIsGameCompleted] = useState(false); // ゲームが終了したか

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
      return;
    }

    if (isGameCompleted) return;

    const inputKey = event.key;
    const currentGroupAlpList = sushiList[showWordIndex].romaji[groupAlpIndex]; // ローマ字の候補リスト

    if (inputKey === ' ' || inputKey === 'Enter') return;

    // 入力中の文字列を更新
    const wordInputAll = typedWord + inputKey; // 全体の文字列 
    const groupAlpInput = typeGroupAlp + inputKey; //候補入力の文字列 例: choko なら 「cho」, 「ko」の部分

    // groupAlpInputの入力の正解判定に使用
    let isInputCorrect = false;

    for (let candidateIndex = 0; candidateIndex < currentGroupAlpList.length; candidateIndex++) {
      const candidateGroupAlp = currentGroupAlpList[candidateIndex];

      // 正しい入力が部分一致するかチェック
      if (candidateGroupAlp.startsWith(groupAlpInput)) {
        setTypedWord(wordInputAll);
        setTypeGroupAlp(groupAlpInput);
        setCorrectKeyCount((prev) => prev + 1);
        playAudio('typing');
        isInputCorrect = true;

        // ローマ字の候補によって、表示をリアルタイムに変更
        const newCandidateIndexList = recordCandidateIndexList.map((index, j) => (j === groupAlpIndex ? candidateIndex : index))
        const newShowRomaji = newCandidateIndexList.map((index, i) => sushiList[showWordIndex].romaji[i][index]).join('')
        setRecordCandidateIndexList(newCandidateIndexList)
        setShowRomaji(newShowRomaji)

        // romajiCandidateが全て正しく入力されていたら、次のRomaji候補へ進む
        if (groupAlpInput.length === candidateGroupAlp.length) {
          setGroupAlpIndex((prev) => prev + 1)
          setTypeGroupAlp("")

          // 全単語の正解判定
          if (groupAlpIndex + 1 === sushiList[showWordIndex].romaji.length) {
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
    if (!isInputCorrect) {
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
    setShowWordIndex(0);
    setGroupAlpIndex(0);
    setTimeLeft(TIMER);
    setIsGameCompleted(false);
    setTypeGroupAlp("")
    moveToNextWord();
  };

  // 1つの単語が完了して、次の単語のセットアップ関数
  const moveToNextWord = () => {
    // const nextIndex = Math.floor(Math.random() * sushiList.length);
    const nextIndex = (showWordIndex + 1) % sushiList.length; // 順番通りに取得
    setShowWordIndex(nextIndex);
    setGroupAlpIndex(0);
    setTypedWord('');
    setMessage(`${sushiList[nextIndex].japanese}`);
    // setShowRomaji(`${sushiList[nextIndex].romaji}`);
    setShowRomaji(sushiList[nextIndex].romaji.map(str => str[0]).join(''))
    setRecordCandidateIndexList(Array(sushiList[nextIndex].romaji.length).fill(0)) // romajiの長さ分の0配列で初期化
  };

  // リセット関数
  const handleReset = () => {
    setTypedWord('');
    setScore(0);
    setCorrectKeyCount(0);
    setMistypedKeyCount(0);
    setShowWordIndex(0);
    setGroupAlpIndex(0);
    setTimeLeft(TIMER);
    setMessage('スペースキーを押してゲーム開始！');
    setShowRomaji('');
    setIsGameStarted(false);
    setIsGameCompleted(false);
    setTypeGroupAlp("")
  };

  // タイマー処理
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
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isGameStarted, typedWord, isGameCompleted]);

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
      {isGameCompleted && (
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
