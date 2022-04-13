const search = (tfIdf, targets) => {
  const result = targets.reduce((acc, target) => {
    const counts = tfIdf[target] ?? {};

    Object.entries(counts).forEach(([id, count]) => {
      acc[id] = (acc[id] ?? 0) + count;
    });

    return acc;
  }, {});

  return Object.keys(result).sort((a, b) => result[b] - result[a]);
};

const buildIndex = (docs) => {
  const index = docs.reduce((acc, doc) => {
    const [documents, counts] = acc;
    const { id, text } = doc;
    const term = text.match(/\w+/g) ?? [];

    term.forEach((word) => {
      if (word.length < 2) {
        return;
      }

      if (word in documents) {
        documents[word][id] = (documents[word][id] ?? 0) + 1;
        counts[word] += 1;
      } else {
        documents[word] = { [id]: 1 };
        counts[word] = 1;
      }
    });

    return acc;
  }, [{}, {}]);

  return index;
};

const calculateTfIdf = (index, counts, totalNumberOfDocs) => {
  const tfIdf = Object.entries(index).reduce((acc, [word, documents]) => {
    const documentKeys = Object.keys(documents);
    const inverseIndex = Math.log(totalNumberOfDocs / documentKeys.length);

    acc[word] = {};
    documentKeys.forEach((key) => {
      const countInDocument = documents[key];
      const tf = countInDocument / counts[word];
      acc[word][key] = tf * inverseIndex;
    });

    return acc;
  }, {});

  return tfIdf;
};

const buildSearchEngine = (docs) => {
  const [index, counts] = buildIndex(docs);
  const tfIdf = calculateTfIdf(index, counts, docs.length);

  return {
    search: (target) => {
      const term = target.match(/\w+/g) ?? [];
      return search(tfIdf, term);
    },
  };
};

export default buildSearchEngine;
