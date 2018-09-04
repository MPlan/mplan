import { searchList } from './search-list';

describe('searchList', () => {
  it('finds words that start with any part of the query', () => {
    const list = ['one two', 'buckle shoe', 'three four', 'close door', 'more three'];
    const result = searchList(list, x => x, 'thr');
    expect(result).toEqual(['three four', 'more three']);
  });
  it('ranks words that match exactly higher than the ones that partially match', () => {
    const list = ['apple blah blah', 'one two', 'buckle shoe', 'app blah', 'close door'];
    const result = searchList(list, x => x, 'app');
    expect(result).toEqual(['app blah', 'apple blah blah']);
  });
});
