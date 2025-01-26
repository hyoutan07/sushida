export const validateInput = (inputJapanese: string, inputHiragana: string, setAlertMessage: (message: string) => void) => {
  if (!inputJapanese.trim() || !inputHiragana.trim()) {
    setAlertMessage('日本語とひらがなは空白では登録できません。');
    return false;
  }

  if (!/^[ぁ-んー\s]+$/.test(inputHiragana)) {
    setAlertMessage('ひらがな入力にはひらがなのみ使用してください。');
    return false;
  }

  if (inputJapanese.length > 1000 || inputHiragana.length > 1000) {
    setAlertMessage('日本語またはひらがなの入力は1000文字以下にしてください。');
    return false;
  }

  return true;
};