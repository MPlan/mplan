import { pad, combineUniquely, removeEmptyKeys, combineObjects } from './utilities';

describe('shared utilities', () => {

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

  describe('removeKeysWhereValueIsUndefined', () => {
    it('removes keys where value is undefined', () => {
      const obj = {
        foo: 'something',
        bar: undefined,
        baz: null,
      };

      const objWithout = removeEmptyKeys(obj);

      expect(objWithout).toEqual({
        foo: 'something',
      } as any);
    });
  });

  describe('combineObjects', () => {
    it('combines objects where the keys are missing', () => {
      interface Something {
        a: string | null | undefined,
        b: string | null | undefined,
        c: number | null | undefined,
      }
  
      const objA: Something = {
        a: 'one',
        b: 'two',
        c: undefined,
      };
  
      const objB: Something = {
        a: null,
        b: 'something else',
        c: 3
      };
  
      const combined = combineObjects(objA, objB);
  
      expect(combined).toEqual({
        a: 'one',
        b: 'something else',
        c: 3
      });
    });
  });
});