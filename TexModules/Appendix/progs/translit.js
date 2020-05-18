const toTransliteration = (string: string): string => {
  interface StringMap {
    [key: string]: string;
  }

  let ruEngMatches: StringMap = {
    а: 'a',
    б: 'b',
    в: 'v',
    г: 'g',
    д: 'd',
    е: 'e',
    ё: 'e',
    ж: 'j',
    з: 'z',
    и: 'i',
    й: 'i',
    к: 'k',
    л: 'l',
    м: 'm',
    н: 'n',
    о: 'o',
    п: 'p',
    р: 'r',
    с: 's',
    т: 't',
    у: 'u',
    ф: 'f',
    х: 'h',
    ц: 'c',
    ч: 'ch',
    ш: 'sh',
    щ: 'sc',
    ъ: '',
    ы: 'y',
    ь: '',
    э: 'e',
    ю: 'iu',
    я: 'ia',
  };

  let newString: string = '';
  [...string].forEach((char) => {
    let newChar: string =
      ruEngMatches[char] ||
      (ruEngMatches[char.toLowerCase()] == undefined && char) ||
      ruEngMatches[char.toLowerCase()].toUpperCase();

    newString += newChar;
  });
  return newString;
};
