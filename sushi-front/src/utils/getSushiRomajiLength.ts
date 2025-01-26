export function getSushiRomajiLength(sushi: any) {
  let totalLength = 0;
  for (let i = 0; i < sushi.romaji.length; i++) {
    if (sushi.romaji[i].length == 0) {
      totalLength += sushi.romaji[i][0].length;
    } else {
      totalLength += calcMinimamLength(sushi.romaji[i]);
    }
  }
  return totalLength;
}

export function calcMinimamLength(array: Array<String>) {
  /**
   * 配列内の最小の長さの文字列を取得
   */
  return array.reduce((min: any, str: any) => {
    return Math.min(min, str.length);
  }, Infinity);
}
