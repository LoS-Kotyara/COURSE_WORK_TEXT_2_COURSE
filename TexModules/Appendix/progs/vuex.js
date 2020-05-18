import Vue from 'vue';
import Vuex from 'vuex';

/// <reference path="typedefs.js" />

import { spellCheck } from './../assets/js/dict';

import axios from 'axios';
let dictionary = '';
let getDict = async function() {
  dictionary = await axios.get('dict.json').then((response) => response.data);
};

spellCheck;
dictionary;

let flag = false;

export const UP_TO_DATE = 'up to date';
export const OUTDATED = 'outdated';
export const EMPTY_WORD = {
  word: '',
  correct: true,
  suggestions: [],
  status: UP_TO_DATE,
};

/**
 *
 * @param {string} string Строка
 * @returns {string[]} Массив из слов строки
 */
let getWords = (string) => {
  return string
    .replace(/['!"#$%&\\'()*+,\-./:;<=>?@[\\\]^_`{|}~']/g, '')
    .split(/\s+/)
    .map((el) => {
      return {
        word: el,
        correct: false,
        suggestions: [],
        status: OUTDATED,
      };
    });
};

/**
 *
 * @param {{
    words: {
      word: string;
      correct: boolean;
      suggestions: string[];
      status: string;
  }[];
  value: string;
  preWords: {
      word: string;
      correct: boolean;
      suggestions: string[];
      status: string;
  }[];
}} string
 */
let makeSpellChecked = (string) => {
  let spellChecked = spellCheck(
    string.words.map((word) => word.word),
    dictionary
  );
  let result = {
    value: string.value,
    words: spellChecked.map((word) => {
      return {
        word: word.word,
        status: UP_TO_DATE,
        correct: word.correct,
        suggestions: word.suggestions,
      };
    }),
    preWords: string.preWords,
  };
  return result;
};

/**
 * @param {string} newString - Новая строка
 * @param {word[]} words - имеющийся массив слов
 * @returns {word} новый массив слов с изменёнными статусами
 */
let updateData = (newString, words) => {
  let newWords = newString
    .replace(/['!"#$%&\\'()*+,\-./:;<=>?@[\\\]^_`{|}~']/g, '')
    .split(/\s+/);

  const length = newWords.length;

  for (let i = 0; i < length; i++) {
    if (!words[i]) {
      words[i] = {
        word: newWords[i],
        correct: false,
        status: OUTDATED,
        suggestions: [],
      };

      continue;
    }
    if (words[i].word == newWords[i]) {
      words[i].status = UP_TO_DATE;
    } else {
      words[i].word = newWords[i];
      words[i].status = OUTDATED;
    }
  }

  return words;
};

let getValueLength = (state) => {
  return state.strings.length;
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    strings: [{ value: '', words: [EMPTY_WORD], preWords: [EMPTY_WORD] }],
  },
  getters: {
    getValueById: (state) => (id) => {
      if (state.strings[id]) return state.strings[id].value;
      return '';
    },
    getValueLength: (state) => {
      return getValueLength(state);
    },
    getValue: (state) => state.strings.map((string) => string.value),
    getValueLengthById: (state) => (id) => state.strings[id].value.length,
    getPreWords: (state) => (id) => {
      if (state.strings[id])
        return state.strings[id].preWords.map((word) => word.word);
    },
    getSuggestions: (state) => (id, jd) => {
      return state.strings[id].words[jd].suggestions;
    },
    /**
     * @param {state} state
     */
    getStrings: (state) => {
      return state.strings.map((string) => string.words);
    },
    getSeparators: (state) => (id) => [
      ...state.strings[id].value.matchAll(/[^a-zA-Zа-яА-ЯЁё]+/g),
    ],
  },
  mutations: {
    insertNewParagraph: (state, id) => {
      state.strings.splice(id + 1, 0, {
        value: '',
        words: getWords(''),
        preWords: getWords(''),
      });
    },
    /**
     * @param {state} state
     * @param {{id: number, newValue: string}} object
     */
    editParagraph: (state, { id, newValue }) => {
      if (newValue) {
        state.strings[id].preWords = state.strings[id].words;
        state.strings[id].value = newValue;

        state.strings[id].words = updateData(
          newValue,
          state.strings[id].preWords
        );
      } else {
        state.strings[id].value = '';
        state.strings[id].words = getWords(state.strings[id].value);
        state.strings[id].preWords = state.strings[id].words;
      }
    },
    /**
     * @param {state} state
     * @param {id: number} id
     */
    deleteParagraph: (state, id) => {
      if (state.strings[id].value == undefined) {
        state.strings[id].value = '';
        state.strings[id].words = getWords(state.strings[id].value);
        state.strings[id].preWords = state.strings[id].words;
      }

      try {
        if (state.strings[id + 1].preWords.map((el) => el.word) == '') {
          state.strings.splice(id + 1, 1);
        } else {
          state.strings[id + 1].words = getWords(state.strings[id + 1].value);
          let words = state.strings[id + 1].words.map((el) => el.word).join('');
          let preWords = state.strings[id + 1].preWords
            .map((el) => el.word)
            .join('');

          if (
            (words == '' && preWords == '') ||
            (words == preWords && flag == true) ||
            (words == '' && preWords.length >= 1 && flag == true)
          ) {
            state.strings[id].value += state.strings[id + 1].value;
            state.strings[id].words = updateData(
              state.strings[id].value,
              state.strings[id].preWords
            );
            state.strings[id + 1].value = '';
            state.strings[id + 1].words = getWords(state.strings[id + 1].value);

            state.strings[id + 1].preWords = state.strings[id].words;
            flag = false;
            state.strings.splice(id + 1, 1);
          } else if (
            (words == preWords && flag != true) ||
            (words == '' && flag == false)
          ) {
            flag = true;
          }
        }
      } catch {
        return;
      }
    },
    /**
     * @param {state} state
     * @param {id: number} id
     */
    backspaceParagraph: (state, id) => {
      if (state.strings[id].value == undefined) {
        state.strings[id].value = '';
        state.strings[id].words = [EMPTY_WORD];
        state.strings[id].preWords = [EMPTY_WORD];
      }

      try {
        if (state.strings[id].preWords.map((el) => el.word) == '') {
          state.strings.splice(id, 1);
        } else {
          state.strings[id].words = getWords(state.strings[id].value);
          let words = state.strings[id].words.map((el) => el.word).join('');
          let preWords = state.strings[id].preWords
            .map((el) => el.word)
            .join('');

          if (
            (words == '' && preWords == '') ||
            (words == preWords && flag == true) ||
            (words == '' && preWords.length >= 1 && flag == true)
          ) {
            state.strings[id - 1].value += state.strings[id].value;
            state.strings[id - 1].words = updateData(
              state.strings[id - 1].value,
              state.strings[id - 1].preWords
            );
            state.strings[id].value = '';
            state.strings[id].words = getWords(state.strings[id].value);

            state.strings[id].preWords = state.strings[id].words;
            flag = false;
            state.strings.splice(id, 1);
          } else if (
            (words == preWords && flag != true) ||
            (words == '' && flag == false)
          ) {
            flag = true;
          }
        }
      } catch {
        return;
      }
    },
    updateStrings: (state, { result }) => {
      state.strings = result;
    },
  },
  actions: {
    getDict: (state, { el }) => {
      getDict();
      setInterval(() => {
        let result = state.state.strings.map((string) =>
          makeSpellChecked(string)
        );
        state.commit('updateStrings', { result });
        el.$forceUpdate();
      }, 4000);
    },
  },
  modules: {},
});
