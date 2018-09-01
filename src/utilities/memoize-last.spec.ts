import { memoizeLast } from './memoize-last';

describe('memoizeLast', () => {
  it("only calculates once if the references don't change", () => {
    let calculateCount = 0;
    const a = { someKey: 'some value' };
    const b = ['one', 'two'];

    const getOrCalculateExample = memoizeLast((valueA: any, valueB: any) => {
      calculateCount += 1;
      return `${valueA.someKey} ${valueB.join(' ')}`;
    });
    const result = getOrCalculateExample(a, b);
    const result2 = getOrCalculateExample(a, b);

    expect(calculateCount).toBe(1);
    expect(result).toBe('some value one two');
    expect(result2).toBe(result);
  });
  it('recalculates if the references do change', () => {
    let calculateCount = 0;
    const a = { someKey: 'some value' };
    const b = ['one', 'two'];
    const aCopy = { ...a };

    const getOrCalculateExample = memoizeLast((valueA: any, valueB: any) => {
      calculateCount += 1;
      return `${valueA.someKey} ${valueB.join(' ')}`;
    });

    getOrCalculateExample(a, b);
    getOrCalculateExample(a, b);
    getOrCalculateExample(a, b);
    getOrCalculateExample(aCopy, b);
    getOrCalculateExample(aCopy, b);
    getOrCalculateExample(aCopy, b);

    expect(calculateCount).toBe(2);
  });
  it('works with primitives/value types', () => {
    const a = 'some string';
    const b = 5;

    let calculateCount = 0;

    const getOrCalculateExample = memoizeLast((valueA: any, valueB: any) => {
      calculateCount += 1;
      return valueA.length + valueB;
    });

    let result = getOrCalculateExample(a, b);
    result = getOrCalculateExample('some string', 5);
    result = getOrCalculateExample('some string', 5);
    result = getOrCalculateExample('some string', 5);
    result = getOrCalculateExample('some string', 5);
    result = getOrCalculateExample('some string', 5);
    result = getOrCalculateExample('some string', 5);

    expect(calculateCount).toBe(1);
    expect(result).toBe(16);
  });
});
