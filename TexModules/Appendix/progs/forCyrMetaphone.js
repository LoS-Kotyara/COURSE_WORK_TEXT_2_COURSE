export const normalize = (str: string) =>
  (str = str.toUpperCase().replace(/Ъ|Ь|-/g, ''));

export const removeDuplicates = (str: string) => str.replace(/(.)\1/gi, '$1');

export const IOtoI = (str: string) => str.replace(/ЙО|ИО|ЙЕ|ИЕ/g, 'И');

export const OtoA = (str: string) => str.replace(/О|Ы|Я/g, 'А');

export const EtoI = (str: string) => str.replace(/Е|Ё|Э/g, 'И');

export const UtoY = (str: string) => str.replace(/Ю/g, 'У');

export const BtoP = (str: string) =>
  (str = str
    .replace(/Б(Б|В|Г|Д|Ж|З|Й|К|П|С|Т|Ф|Х|Ц|Ч|Ш|Щ)/g, 'П$1')
    .replace(/Б$/, 'П'));

export const ZtoS = (str: string) =>
  (str = str
    .replace(/З(Б|В|Г|Д|Ж|З|Й|К|П|С|Т|Ф|Х|Ц|Ч|Ш|Щ)/g, 'С$1')
    .replace(/З$/, 'С'));

export const DtoT = (str: string) =>
  (str = str
    .replace(/Д(Б|В|Г|Д|Ж|З|Й|К|П|С|Т|Ф|Х|Ц|Ч|Ш|Щ)/g, 'Т$1')
    .replace(/Д$/, 'Т'));

export const VtoF = (str: string) =>
  (str = str
    .replace(/В(Б|В|Г|Д|Ж|З|Й|К|П|С|Т|Ф|Х|Ц|Ч|Ш|Щ)/g, 'Ф$1')
    .replace(/В$/, 'Ф'));

export const GtoK = (str: string) =>
  (str = str
    .replace(/Г(Б|В|Г|Д|Ж|З|Й|К|П|С|Т|Ф|Х|Ц|Ч|Ш|Щ)/g, 'К$1')
    .replace(/Г$/, 'К'));

export const TStoC = (str: string) => str.replace(/ТС|ДС/g, 'Ц');
