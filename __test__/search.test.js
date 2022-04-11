import { test, expect } from '@jest/globals';
import buildSearchEngine from '../index.js';

test('empty search', () => {
  const searchEngine = buildSearchEngine([]);

  expect(searchEngine.search('')).toEqual([]);
});
