const search = (index, targets) => {
  const result = targets.reduce((acc, target) => {
    const counts = index[target] ?? {};

    Object.entries(counts).forEach(([id, count]) => {
      acc[id] = (acc[id] ?? 0) + count;
    });

    return acc;
  }, {});

  return Object.keys(result).sort((a, b) => result[b] - result[a]);
};

const buildIndex = (docs) => {
  const index = docs.reduce((acc, doc) => {
    const { id, text } = doc;
    const term = text.match(/\w+/g) ?? [];

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

// const calculateTfIdf = (index, totalNumberOfDocs) => {
//   return Object.entries(index).reduce((acc, [word, documents]) => {
//     const inverseIndex = totalNumberOfDocs / documents.length;
//   }, {});
// }

const buildSearchEngine = (docs) => {
  const index = buildIndex(docs);
  // const tfIdf = calculateTfIdf(index, docs.length);

  return {
    search: (target) => {
      const term = target.match(/\w+/g) ?? [];
      return search(index, term);
    },
  };
};

export default buildSearchEngine;
