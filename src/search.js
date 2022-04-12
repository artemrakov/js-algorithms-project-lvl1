/* Релевантность документа оценивается следующим образом: для каждого уникального слова из запроса
*  берётся число его вхождений в документ, полученные числа для всех слов из запроса суммируются.
*  Итоговая сумма и является релевантностью документа. Чем больше сумма,
*  тем больше документ подходит под запрос. */

const search = (index, targets) => {
  const result = {};

  for (let i = 0; i < targets.length; i += 1) {
    const target = targets[i];
    const counts = index[target];

    Object.entries(counts).forEach(([id, count]) => {
      result[id] = (result[id] ?? 0) + count;
    });
  }

  return Object.keys(result).sort((a, b) => {
    return result[b] === result[a] ? b - a : result[b] - result[a];
  });
};

const buildIndex = (docs) => {
  // const stopWords = ['a', 'for', ]

  const index = docs.reduce((acc, doc) => {
    const { id, text } = doc;
    const term = text.match(/\w+/g);

    term.forEach((word) => {
      if (word.length < 2) {
        return;
      }

      if (word in acc) {
        acc[word][id] = (acc[word][id] ?? 0) + 1;
      } else {
        acc[word] = { [id]: 1 };
      }
    });

    return acc;
  }, {});

  return index;
};

const buildSearchEngine = (docs) => {
  const index = buildIndex(docs);
  console.log(index);

  return {
    search: (target) => {
      const term = target.match(/\w+/g);

      if (!term) {
        return [];
      }

      return search(index, term);
    },
  };
};

export default buildSearchEngine;
