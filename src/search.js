/* Релевантность документа оценивается следующим образом: для каждого уникального слова из запроса
*  берётся число его вхождений в документ, полученные числа для всех слов из запроса суммируются.
*  Итоговая сумма и является релевантностью документа. Чем больше сумма,
*  тем больше документ подходит под запрос. */

const search = (docs, targets) => {
  // keep track of min count 5th item
  const result = [];

  for (let i = 0; i < docs.length; i += 1) {
    const { id, text } = docs[i];
    const term = text.match(/\w+/g);

    const count = term.reduce((acc, word) => {
      if (targets.include(word)) {
        return acc + 1;
      }

      return acc;
    }, 0);

    if (count !== 0) {
      result.push({ count, id });
    }
  }

  return result.sort((a, b) => b.count - a.count).map((doc) => doc.id);
};

const buildSearchEngine = (docs) => ({
  search: (target) => {
    const term = target.match(/\w+/g);

    if (!term) {
      return [];
    }

    return search(docs, term);
  },
});

export default buildSearchEngine;
