## Библиотеки

* https://www.npmjs.com/package/react-big-calendar - Большой календарь для постинга
* http://react-day-picker.js.org/examples/selected-range-enter - Выбор даты или периода дат
* https://www.npmjs.com/package/text-emoji-parser
* https://www.npmjs.com/package/rich-markdown-editor
* https://www.npmjs.com/package/react-in-viewport
* react-clamp-lines - обрезка текста
* https://github.com/godmodelabs/flora-ql - Синтаксический анализатор запроса
* https://www.npmjs.com/package/@k3rn31p4nic/google-translate-api - перевод
* data-forge - работа с данными


const colorSet = [
  "#FFAB91",
  "#80DEEA",
  "#EF9A9A",
  "#CE93D8",
  "#AED581",
  "#9FA7DF",
  "#BCAAA4",
  "#FFE082",
  "#F48FB1",
  "#DCE775"
];

const getUniqueColor = (string: string, colorSet: string[]) => {
  const getNumericHash = (string: string) => {
    let hash = 0;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
  const modulo = colorSet.length;
  const colorIndex = ((getNumericHash(string) % modulo) + modulo) % modulo;
  return colorSet[colorIndex];
};
