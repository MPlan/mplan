import { pad } from './utilities';

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

});