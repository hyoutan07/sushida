import { SushiList } from "@/types/sushiList";

export const generateSushiList = (difficulty: string, sushiList: SushiList): SushiList => {
  let filteredList: SushiList = [];
  let extraWords: SushiList = [];

  // 文字数の条件に応じてフィルタリング
  switch (difficulty) {
    case "初級":
      filteredList = sushiList.filter(sushi => sushi.wordLen >= 2 && sushi.wordLen <= 10);
      extraWords = sushiList.filter(sushi => sushi.wordLen > 10);
      break;
      
    case "中級":
      filteredList = sushiList.filter(sushi => sushi.wordLen >= 5 && sushi.wordLen <= 15);
      extraWords = sushiList.filter(sushi => sushi.wordLen > 20);
      break;
      
    case "上級":
      filteredList = sushiList.filter(sushi => sushi.wordLen > 15);
      break;
  }

  // 確率的に長いワードを追加（初回には含めない）
  if (difficulty === "初級" && Math.random() < 0.1) {
    filteredList.push(extraWords[Math.floor(Math.random() * extraWords.length)]);
  }
  if (difficulty === "中級" && Math.random() < 0.25) {
    filteredList.push(extraWords[Math.floor(Math.random() * extraWords.length)]);
  }

  // リストをランダムにシャッフル
  return filteredList.sort(() => Math.random() - 0.5);
};
