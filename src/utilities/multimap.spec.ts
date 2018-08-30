import { createMultimap } from './multimap';

describe('multimap', () => {
  it('allows using multiple keys to save', () => {
    const multimap = createMultimap();

    const objA = {};
    const objB = {};
    const objC = {};
    const value = 'test value';
    const keys = [objA, objB, objC];

    multimap.save(keys, value);

    const valueFromMultimap = multimap.get(keys);

    expect(valueFromMultimap).toBe(value);
  });
  it('keeps the values even when its been called with different values', () => {
    const multimap = createMultimap();

    const a = {};
    const b = {};
    const c = {};

    const valueABC = 'abc';
    const valueCBA = 'cba';
    const valueAAB = 'aab';

    multimap.save([a, b, c], valueABC);
    multimap.save([c, b, a], valueCBA);
    multimap.save([a, a, b], valueAAB);

    expect(multimap.get([a, b, c])).toBe(valueABC);
    expect(multimap.get([c, b, a])).toBe(valueCBA);
    expect(multimap.get([a, a, b])).toBe(valueAAB);

    expect(multimap.get([a, a, b])).toBe(valueAAB);
    expect(multimap.get([c, b, a])).toBe(valueCBA);
    expect(multimap.get([a, b, c])).toBe(valueABC);
  });
});
