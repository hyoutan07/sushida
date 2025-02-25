import { SushiList } from "@/types/sushiList";

export const generateSushiList = (difficulty: string, sushiList: SushiList): SushiList => {
  let filteredList: SushiList = [];
  let extraWords: SushiList = [];

  // 文字数の条件に応じてフィルタリング
  switch (difficulty) {
    case "初級":
      filteredList = sushiList.filter(sushi => sushi.wordLength >= 2 && sushi.wordLength <= 10);
      extraWords = sushiList.filter(sushi => sushi.wordLength > 10);
      break;
      
    case "中級":
      filteredList = sushiList.filter(sushi => sushi.wordLength >= 8 && sushi.wordLength <= 20);
      extraWords = sushiList.filter(sushi => sushi.wordLength > 20);
      break;
      
    case "上級":
      filteredList = sushiList.filter(sushi => sushi.wordLength > 20 && sushi.wordLength <= 50);
      break;
    case "超級":
      filteredList = sushiList.filter(sushi => sushi.wordLength > 40);
      break;
  }

  // 初級の場合、最初の5ワードは短いワードに限定
  let finalList: SushiList = [];
  finalList = filteredList.slice(0, 5);

  // 10%分の長いワードを追加（最初の5ワードには含めない）
  if (difficulty === "初級" && extraWords.length > 0) {
    const numExtraWords = Math.floor(filteredList.length * 0.1);
    for (let i = 0; i < numExtraWords; i++) {
      const randomExtraWord = extraWords[Math.floor(Math.random() * extraWords.length)];
      finalList.push(randomExtraWord);
    }
  }

  // 追加分も考慮して最大30ワードに制限
  finalList = finalList.concat(filteredList.slice(5)).slice(0, 30);

  // リストをランダムにシャッフル
  return finalList.sort(() => Math.random() - 0.5);
};
