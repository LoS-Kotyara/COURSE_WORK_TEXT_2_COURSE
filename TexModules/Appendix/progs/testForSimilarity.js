import { cyrMetaphone, toTransliteration } from '../funcs';
import { damerauLevenshtein } from '../levenshtein';
const doubleMetaphone = require('double-metaphone');

const sortByKey = (_this, that) => {
  if (_this.lev.similarity > that.lev.similarity) return 1;
  if (_this.lev.similarity < that.lev.similarity) return -1;
  return 0;
};
let findInObject = (word, dictionary) => {
  for (let el of dictionary) {
    if (el.word == word) {
      return true;
    }
  }
  return false;
};
const testForSimilarity = (Word, dictionary) => {
  const word = Word.toLowerCase();
  const translit = toTransliteration(word);
  const _word = {
    word: word,
    metaphone: doubleMetaphone(translit)[0],
    cyrMetaphone: cyrMetaphone(word),
    translit: translit,
  };
  let metaphones = [];
  dictionary.forEach((word) => {
    if (Math.abs(word.word.length - _word.word.length) > 1) return;
    const metaphone = damerauLevenshtein(_word.metaphone, word.metaphone);
    const cyrMetaphone = damerauLevenshtein(
      _word.cyrMetaphone,
      word.cyrMetaphone
    );
    const wordDif = damerauLevenshtein(word.word.toLowerCase(), _word.word);
    if (wordDif.steps <= 1 || wordDif.similarity >= 0.9) {
      metaphones.push({ word: word.word, lev: wordDif });
    } else {
      if (cyrMetaphone.similarity >= 0.9) {
        metaphones.push({ word: word.word, lev: cyrMetaphone });
      } else {
        if (metaphone.similarity >= 0.9) {
          metaphones.push({ word: word.word, lev: metaphone });
        }
      }
    }
  });
  return metaphones
    .filter((item) => item.word !== word)
    .sort(sortByKey)
    .slice(0, 5)
    .map((word) => word.word);
};


const testForSimilarityEntireData = (data, dictionary) => {
  return data.map((word) => {
    if (word.length == 1 || findInObject(word.toLowerCase(), dictionary))
      return {
        word: word,
        correct: true,
        suggestions: [],
        spellChecked: true,
      };
    return {
      word: word,
      correct: false,
      suggestions: testForSimilarity(word, dictionary),
      spellChecked: true,
    };
  });
};
