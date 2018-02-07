import { pad, combineUniquely } from './utilities';

describe('shared utilities', () => {

  // the pad string function
  describe('pad', () => {
    it('from the right', () => {
      expect(pad('abc', 5)).toBe('  abc');
    });
    it('from the left', () => {
      expect(pad('abc', 5, true)).toBe('abc  ');
    });
    it('overflow', () => {
      expect(pad('abcdef', 5)).toBe('abcdef');
    });
  });

  describe('combineUniquely', () => {
    it('combines arrays together uniquely', () => {
      const arrA = ['one', 'two', 'three', 'one'];
      const arrB = ['one', 'two', 'two', 'four'];

      const combinedArr = combineUniquely(arrA, arrB).sort();
      expect(combinedArr).toEqual(['one', 'two', 'three', 'four'].sort());
    });
  });

});