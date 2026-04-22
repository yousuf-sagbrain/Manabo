import type { KanaChar } from './types'

export type HiraganaChar = KanaChar

export const hiragana: HiraganaChar[] = [
  // あ行 (a-row)
  { char: 'あ', romaji: 'a',   aliases: [] },
  { char: 'い', romaji: 'i',   aliases: [] },
  { char: 'う', romaji: 'u',   aliases: [] },
  { char: 'え', romaji: 'e',   aliases: [] },
  { char: 'お', romaji: 'o',   aliases: [] },

  // か行 (ka-row)
  { char: 'か', romaji: 'ka',  aliases: [] },
  { char: 'き', romaji: 'ki',  aliases: [] },
  { char: 'く', romaji: 'ku',  aliases: [] },
  { char: 'け', romaji: 'ke',  aliases: [] },
  { char: 'こ', romaji: 'ko',  aliases: [] },

  // さ行 (sa-row)  — shi accepts si
  { char: 'さ', romaji: 'sa',  aliases: [] },
  { char: 'し', romaji: 'shi', aliases: ['si'] },
  { char: 'す', romaji: 'su',  aliases: [] },
  { char: 'せ', romaji: 'se',  aliases: [] },
  { char: 'そ', romaji: 'so',  aliases: [] },

  // た行 (ta-row)  — chi accepts ti; tsu accepts tu
  { char: 'た', romaji: 'ta',  aliases: [] },
  { char: 'ち', romaji: 'chi', aliases: ['ti'] },
  { char: 'つ', romaji: 'tsu', aliases: ['tu'] },
  { char: 'て', romaji: 'te',  aliases: [] },
  { char: 'と', romaji: 'to',  aliases: [] },

  // な行 (na-row)
  { char: 'な', romaji: 'na',  aliases: [] },
  { char: 'に', romaji: 'ni',  aliases: [] },
  { char: 'ぬ', romaji: 'nu',  aliases: [] },
  { char: 'ね', romaji: 'ne',  aliases: [] },
  { char: 'の', romaji: 'no',  aliases: [] },

  // は行 (ha-row)  — fu accepts hu
  { char: 'は', romaji: 'ha',  aliases: [] },
  { char: 'ひ', romaji: 'hi',  aliases: [] },
  { char: 'ふ', romaji: 'fu',  aliases: ['hu'] },
  { char: 'へ', romaji: 'he',  aliases: [] },
  { char: 'ほ', romaji: 'ho',  aliases: [] },

  // ま行 (ma-row)
  { char: 'ま', romaji: 'ma',  aliases: [] },
  { char: 'み', romaji: 'mi',  aliases: [] },
  { char: 'む', romaji: 'mu',  aliases: [] },
  { char: 'め', romaji: 'me',  aliases: [] },
  { char: 'も', romaji: 'mo',  aliases: [] },

  // や行 (ya-row)  — 3 characters
  { char: 'や', romaji: 'ya',  aliases: [] },
  { char: 'ゆ', romaji: 'yu',  aliases: [] },
  { char: 'よ', romaji: 'yo',  aliases: [] },

  // ら行 (ra-row)
  { char: 'ら', romaji: 'ra',  aliases: [] },
  { char: 'り', romaji: 'ri',  aliases: [] },
  { char: 'る', romaji: 'ru',  aliases: [] },
  { char: 'れ', romaji: 're',  aliases: [] },
  { char: 'ろ', romaji: 'ro',  aliases: [] },

  // わ行 (wa-row) + を
  { char: 'わ', romaji: 'wa',  aliases: [] },
  { char: 'を', romaji: 'wo',  aliases: ['o'] },

  // ん
  { char: 'ん', romaji: 'n',   aliases: ['nn'] },
]
