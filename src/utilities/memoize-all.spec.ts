import { memoizeAll } from './memoize-all';

describe('memoizeAll', () => {
  it('memoizes over the memory references', () => {
    let calculateCount = 0;

    const f = memoizeAll((objA: { a: number }, objB: { b: number }) => {
      calculateCount += 1;
      return objA.a + objB.b;
    });

    const objA = { a: 5 };
    const objB = { b: 7 };
    const altObjB = { b: 7 };

    f(objA, objB);
    f(objA, altObjB);
    f(objA, objB);
    f(objA, altObjB);
    f(objA, objB);
    f(objA, altObjB);
    f(objA, objB);
    f(objA, altObjB);
    f(objA, objB);
    f(objA, altObjB);

    expect(calculateCount).toBe(2);
  });
});
