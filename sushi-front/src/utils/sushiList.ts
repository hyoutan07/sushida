// // 寿司ネタのリストとローマ字の対応
// export const sushiList = [
//   //20241127の処理方法だと途中のnn処理が曖昧になります。
//   { japanese: "バカ",
//     romaji  : ["baka"] },
//   { japanese: "アホ",
//     romaji  : ["aho"] },
//   { japanese: "親不孝でモラハラ気質でか行の滑舌が終わっている",
//     romaji  : ["oyahukoudemoraharakisitudekagyounokatuzetugaowatteiru"] },
//   { japanese: "間抜け",
//     romaji  : ["manuke"] },
//   { japanese: "薄毛",
//     romaji  : ["usuge"] },
//   { japanese: "肥満",
//     romaji  : ["himann"] },
//   { japanese: "粗チン",
//     romaji  : ["sotinn", "sochinn"] },
//   { japanese: "又吉さんとの対談で明らかに又吉さんの雰囲気に飲み込まれ自分も文化人の雰囲気を出していた",
//     romaji  : ["matayosisanntonotaidanndeakirakanimatayosisannnohunnikininomikomarezibunnmobunnkazinnnohunnikiwodasiteita"] },
//   { japanese: "中退男",
//     romaji  : ["tyuutaiotoko", "xhuutaiotoko"] },
//   { japanese: "留年男",
//     romaji  : ["ryuunennotoko"] },
//   { japanese: "浪人男",
//     romaji  : ["rouninnotoko"] },
//   { japanese: "過去の恋愛の話をしないのはシンプルにパイが少ないからなのに忘れたとカッコつけることで自分のプライドを守っている",
//     romaji  : ["kakonorenainohanasiwosinainohasinnpurunipaigasukunaikarananoniwasuretatokakkotukerukotodezibunnnopuraidowomamotteiru"] },
// ];

export const sushiList = [
  // {
  //   japanese: "中退男",
  //   hiragana: "ちゅうたいおとこ",
  //   romaji: [
  //     ["tyu", "chu", "tixyu", "tilyu"],
  //     ["u"],
  //     ["ta"],
  //     ["i"],
  //     ["o"],
  //     ["to"],
  //     ["ko"]
  //   ]
  // },
  // {
  //   japanese: "浪人男",
  //   hiragana: "ろうにんおとこ",
  //   romaji: [
  //     ["ro"],
  //     ["u"],
  //     ["ni"],
  //     ["nn"],
  //     ["o"],
  //     ["to"],
  //     ["ko"],
  //   ]
  // },
  {//showWordIndex
    japanese: "マンこ", 
    hiragana: "まんこ",
    romaji: [
      ["ma"],//hiraganaIndex
      [
        "nko", //candidateIndex
        "nnko" 
      ]
    ]
  },
  // {
  //   japanese: "肥満",
  //   hiragana: "ひまん",
  //   romaji: [
  //     ["hi"],
  //     ["ma"],
  //     ["nn"]
  //   ]
  // },
  {
    japanese: "バッカじゃないの",
    hiragana: "ばっかじゃないの",
    romaji: [
      ["ba"],
      ["k", "xtu", "ltu"],
      ["ka"],
      ["ja", "zya", "zixya", "zilya"],
      ["na"],
      ["i"],
      ["no"]
    ]
  }
]


// export const sushiList = [
//   {
//     japanese: "バカ",
//     hiragana: "ばか",
//     romaji: [
//       ["ba"],
//       ["ka"]
//     ]
//   },
//   {
//     japanese: "アホ",
//     hiragana: "あほ",
//     romaji: [
//       ["a"],
//       ["ho"]
//     ]
//   },
//   {
//     japanese: "親不孝でモラハラ気質でか行の滑舌が終わっている",
//     hiragana: "おやふこうでもらはらきしつでかぎょうのかつぜつがおわっている",
//     romaji: [
//       ["o"],
//       ["ya"],
//       ["hu", "fu"],
//       ["ko"],
//       ["u"],
//       ["de"],
//       ["mo"],
//       ["ra"],
//       ["ha"],
//       ["ra"],
//       ["ki"],
//       ["si", "shi"],
//       ["tu", "tsu"],
//       ["de"],
//       ["ka"],
//       ["gyo"],
//       ["u"],
//       ["no"],
//       ["ka"],
//       ["tu", "tsu"],
//       ["ze"],
//       ["tu", "tsu"],
//       ["ga"],
//       ["o"],
//       ["wa"],
//       ["t"],
//       ["te"],
//       ["i"],
//       ["ru"]
//     ]
//   },
//   {
//     japanese: "間抜け",
//     hiragana: "まぬけ",
//     romaji: [
//       ["ma"],
//       ["nu"],
//       ["ke"]
//     ]
//   },
//   {
//     japanese: "薄毛",
//     hiragana: "うすげ",
//     romaji: [
//       ["u"],
//       ["su"],
//       ["ge"]
//     ]
//   },
//   {
//     japanese: "肥満",
//     hiragana: "ひまん",
//     romaji: [
//       ["hi"],
//       ["ma"],
//       ["nn"]
//     ]
//   },
//   {
//     japanese: "粗チン",
//     hiragana: "そちん",
//     romaji: [
//       ["so"],
//       ["ti", "chi"],
//       ["nn"]
//     ]
//   },
//   {
//     japanese: "又吉さんとの対談で明らかに又吉さんの雰囲気に飲み込まれ自分も文化人の雰囲気を出していた",
//     hiragana: "またよしさんとのたいだんであきらかにまたよしさんのふんいきにのみこまれじぶんもぶんかじんのふんいきをだしていた",
//     romaji: [
//       ["ma"],
//       ["ta"],
//       ["yo"],
//       ["si", "shi"],
//       ["sa"],
//       ["n", "nn"],
//       ["to"],
//       ["no"],
//       ["ta"],
//       ["i"],
//       ["da"],
//       ["n"],
//       ["de"],
//       ["a"],
//       ["ki"],
//       ["ra"],
//       ["ka"],
//       ["ni"],
//       ["ma"],
//       ["ta"],
//       ["yo"],
//       ["si", "shi"],
//       ["sa"],
//       ["nn"],
//       ["no"],
//       ["hu", "fu"],
//       ["nn"],
//       ["i"],
//       ["ki"],
//       ["ni"],
//       ["no"],
//       ["mi"],
//       ["ko"],
//       ["ma"],
//       ["re"],
//       ["zi", "ji"],
//       ["bu"],
//       ["n", "nn"],
//       ["mo"],
//       ["bu"],
//       ["n"],
//       ["ka"],
//       ["zi", "ji"],
//       ["nn"],
//       ["no"],
//       ["hu", "fu"],
//       ["nn"],
//       ["i"],
//       ["ki"],
//       ["wo"],
//       ["da"],
//       ["si", "shi"],
//       ["te"],
//       ["i"],
//       ["ta"]
//     ]
//   },
//   {
//     japanese: "中退男",
//     hiragana: "ちゅうたいおとこ",
//     romaji: [
//       ["chu", "tyu", "tixyu"],
//       ["u"],
//       ["ta"],
//       ["i"],
//       ["o"],
//       ["to"],
//       ["ko"]
//     ]
//   },
//   {
//     japanese: "留年男",
//     hiragana: "りゅうねんおとこ",
//     romaji: [
//       ["ryu"],
//       ["ne"],
//       ["n", "nn"],
//       ["o"],
//       ["to"],
//       ["ko"]
//     ]
//   },
//   {
//     japanese: "浪人男",
//     hiragana: "ろうにんおとこ",
//     romaji: [
//       ["ro"],
//       ["u"],
//       ["ni"],
//       ["n", "nn"],
//       ["o"],
//       ["to"],
//       ["ko"]
//     ]
//   },
//   {
//     japanese: "過去の恋愛の話をしないのはシンプルにパイが少ないからなのに忘れたとカッコつけることで自分のプライドを守っている",
//     hiragana: "かこのれんあいのはなしをしないのはしんぷるにぱいがすくないからなのにわすれたとかっこつけることでじぶんのぷらいどをまもっている",
//     romaji: [
//       ["ka"],
//       ["ko"],
//       ["no"],
//       ["re"],
//       ["nn"],
//       ["a"],
//       ["i"],
//       ["no"],
//       ["ha"],
//       ["na"],
//       ["si", "shi"],
//       ["wo"],
//       ["si", "shi"],
//       ["na"],
//       ["i"],
//       ["no"],
//       ["ha"],
//       ["si", "shi"],
//       ["n"],
//       ["pu"],
//       ["ru"],
//       ["ni"],
//       ["pa"],
//       ["i"],
//       ["ga"],
//       ["su"],
//       ["ku"],
//       ["na"],
//       ["i"],
//       ["ka"],
//       ["ra"],
//       ["na"],
//       ["no"],
//       ["ni"],
//       ["wa"],
//       ["su"],
//       ["re"],
//       ["ta"],
//       ["to"],
//       ["ka"],
//       ["k", "ltu", "xtu"],
//       ["ko"],
//       ["tu", "tsu"],
//       ["ke"],
//       ["ru"],
//       ["ko"],
//       ["to"],
//       ["de"],
//       ["zi", "ji"],
//       ["bu"],
//       ["n"],
//       ["no"],
//       ["pu"],
//       ["ra"],
//       ["i"],
//       ["do"],
//       ["wo"],
//       ["ma"],
//       ["mo"],
//       ["t", "xtu", "ltu"],
//       ["te"],
//       ["i"],
//       ["ru"]
//     ]
//   }
// ];
