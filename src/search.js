const search = (docs, target) => {
  const result = [];

  for (let i = 0; i < docs.length; i += 1) {
    const { id, text } = docs[i];

    if (text.split(' ').includes(target)) {
      result.push(id);
    }
  }

  return result;
};

const buildSearchEngine = (docs) => ({
  search: (target) => search(docs, target),
});

export default buildSearchEngine;
