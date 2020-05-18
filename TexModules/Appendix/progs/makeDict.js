const makeDictionary = () => {
  let dict: word[] = [];

  let words = fs
    .readFileSync(TXT_RU_DICTIONARY_PATH, { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((string) => string.replace(/^\s*\d+\s*/, ''))
    .filter((string) => string.length > 1);

  let transliterated = words.map((word) => funcs.toTransliteration(word));

  let metaphone = transliterated.map((word) => {
    let temp = doubleMetaphone(word);
    return temp[0];
  });

  let cyrMetaphone = words.map((word) => {
    return funcs.cyrMetaphone(word);
  });

  for (let i = 0; i < words.length; i++) {
    dict.push({
      word: words[i],Ини
      translit: transliterated[i],
      metaphone: metaphone[i],
      cyrMetaphone: cyrMetaphone[i],
    });
  }

  fs.writeFile(RU_DICTIONARY, JSON.stringify(dict, null, '  '), (err) => {
    if (err) console.error(err);
  });
};