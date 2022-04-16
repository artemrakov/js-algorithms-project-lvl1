type DictionaryType = Map<string, Map<string, number>>;
type CountType = {[key: string]: number};
type DocType = { id: string, text: string };

const search = (tfIdf, targets) => {
  const result = targets.reduce((acc, target) => {
    const counts = tfIdf.get(target) ?? new Map();

    counts.forEach((count, id) => {
      acc[id] = (acc[id] ?? 0) + count;
    });

    return acc;
  }, {});

  return Object.keys(result).sort((a, b) => result[b] - result[a]);
};


const buildIndex = (docs: DocType[]): [DictionaryType, CountType]  => {
  const index = docs.reduce((acc, doc) => {
    // const [documents, counts] = acc;
    const documents: DictionaryType = acc[0];
    const counts: CountType = acc[1];
    const { id, text } = doc;
    const term: string[] = text.match(/\w+/g) ?? [];

    term.forEach((word) => {
      if (word.length < 2) {
        return;
      }

      if (documents.has(word)) {
        const wordMap: Map<string, number> = documents.get(word);
        const prev = wordMap.get(id) ?? 0;
        wordMap.set(id, prev + 1);
        counts[word] = (counts[word] ?? 0) + 1;
      } else {
        const idMap = new Map<string, number>();
        idMap.set(id, 1);
        documents.set(word, idMap);
        counts[word] = 1;
      }
    });

    return acc;
  }, [new Map<string, Map<string, number>>(), {}]);

  return [index[0], index[1]];
};

const calculateTfIdf = (index, counts, totalNumberOfDocs) => {
  const tfIdf = new Map();

  index.forEach((documents, word) => {
    const inverseIndex = Math.log(totalNumberOfDocs / documents.size);

    const wordMap = new Map();
    documents.forEach((countInDoc, key) => {
      const tf = countInDoc / counts[word];
      wordMap.set(key, tf * inverseIndex);
    });

    tfIdf.set(word, wordMap);
  });

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
