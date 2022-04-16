type DictionaryType = Map<string, Map<string, number>>;
type CountType = { [key: string]: number };
type DocType = { id: string, text: string };
type TfIdf = Map<string, Map<string, number>>;

const search = (tfIdf: TfIdf, targets: string[]): string[] => {
  const result = targets.reduce((acc: {[key: string]: number}, target) => {
    const counts = tfIdf.get(target) ?? new Map();

    counts.forEach((count, id) => {
      acc[id] = (acc[id] ?? 0) + count;
    });

    return acc;
  }, {});

  return Object.keys(result).sort((a, b) => result[b] - result[a]);
};


const buildIndex = (docs: DocType[]): [DictionaryType, CountType] => {
  const index: [DictionaryType, CountType] = docs.reduce((acc, doc) => {
    const [documents, counts]: [DictionaryType, CountType] = acc
    const { id, text } = doc;
    const term: string[] = text.match(/\w+/g) ?? [];

    term.forEach((word) => {
      if (word.length < 2) {
        return;
      }

      if (documents.has(word)) {
        // https://github.com/microsoft/TypeScript/issues/9619
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const wordMap: Map<string, number> = documents.get(word)!;
        const prev: number = wordMap.get(id) ?? 0;
        wordMap.set(id, prev + 1);
        counts[word] += 1;
      } else {
        const idMap = new Map<string, number>();
        idMap.set(id, 1);
        documents.set(word, idMap);
        counts[word] = 1;
      }
    });

    return acc;
  }, [new Map<string, Map<string, number>>(), {}]);

  return index;
};

const calculateTfIdf = (index: DictionaryType, counts: CountType, totalNumberOfDocs: number): TfIdf => {
  const tfIdf = new Map<string, Map<string, number>>();

  index.forEach((documents, word) => {
    const inverseIndex = Math.log(totalNumberOfDocs / documents.size);

    const wordMap = new Map<string, number>();
    documents.forEach((countInDoc, key) => {
      const tf = countInDoc / counts[word];
      wordMap.set(key, tf * inverseIndex);
    });

    tfIdf.set(word, wordMap);
  });

  return tfIdf;
};

const buildSearchEngine = (docs: DocType[]) => {
  const [index, counts] = buildIndex(docs);
  const tfIdf = calculateTfIdf(index, counts, docs.length);

  return {
    search: (target: string) => {
      const term = target.match(/\w+/g) ?? [];
      return search(tfIdf, term);
    },
  };
};

export default buildSearchEngine;
