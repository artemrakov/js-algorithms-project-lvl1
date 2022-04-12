import { test, expect } from '@jest/globals';
import buildSearchEngine from '../index.js';

test('empty search', () => {
  const searchEngine = buildSearchEngine([]);

  expect(searchEngine.search('')).toEqual([]);
});

test('search match word even with punctuation', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const searchEngine = buildSearchEngine([doc1]);

  expect(searchEngine.search('pint')).toEqual(['doc1']);
  expect(searchEngine.search('pint!')).toEqual(['doc1']);
});

test('search', () => {
  const doc1 = { id: 'doc1', text: "I can't shoot straight unless I've had a pint!" };
  const doc2 = { id: 'doc2', text: "Don't shoot shoot shoot that thing at me." };
  const doc3 = { id: 'doc3', text: "I'm your shooter." };
  const searchEngine = buildSearchEngine([doc1, doc2, doc3]);

  expect(searchEngine.search('shoot')).toEqual(['doc1', 'doc2']);
});
