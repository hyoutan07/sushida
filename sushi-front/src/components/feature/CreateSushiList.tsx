'use client';

import { hiraToRomajiList } from '@/utils/hiraToRomajiList';
import { useState } from 'react';

interface newSushiList {
	 japanese: string;
	 hiragana: string;
	 romaji: string[][];
 }
 
const createSushiList = (japanese: string, hiragana: string, setAlertMessage: (message: string) =>void): newSushiList => {

	let remainedHiragana = hiragana;
	const romajiList: string[][] = [];
 
	while (remainedHiragana.length > 0) {
	let isMatched = false;
 
		for (const key in hiraToRomajiList) {
			if (remainedHiragana.startsWith(key)) {
				romajiList.push(hiraToRomajiList[key]);
				remainedHiragana = remainedHiragana.slice(key.length);
				isMatched = true;
				break;
			}
		}
		// TODO: 候補にない時、すでに登録されているときはエラーを吐かせる
		if (!isMatched) {
			const errorMessage = `ひらがなを入力してください。「${remainedHiragana[0]}」が無効です`;
      	setAlertMessage(errorMessage);
			// remainedHiragana = '';
			throw new Error(errorMessage);
		}
	}
 
	return {
		japanese,
		hiragana,
		romaji: romajiList,
	};
 };

 export default createSushiList;