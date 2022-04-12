const search = (docs, target) => {
  const result = [];

  for (let i = 0; i < docs.length; i += 1) {
    const { id, text } = docs[i];
    const term = text.match(/\w+/g);

    if (term.includes(target)) {
      result.push(id);
    }
  }

  return result;
};

const buildSearchEngine = (docs) => ({
  search: (target) => {
    const term = target.match(/\w+/g);

    if (!term) {
      return [];
    }

    return search(docs, term.join(''));
  },
});

export default buildSearchEngine;
