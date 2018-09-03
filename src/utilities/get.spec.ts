import { get } from './get';

describe('get', () => {
  it('gets nested values if they exist', () => {
    const obj = { one: { two: { buckle: { shoe: 'heyo' } } } };
    const value = get(obj, obj => obj.one.two.buckle.shoe);

    expect(value).toBe('heyo');
  });

  it("works with typed branches and returns undefined if it doesn't exist", () => {
    function f(condition: boolean) {
      if (condition) return { a: 'apple' };
      return { b: { more: { stuff: 'some string' } } };
    }

    const obj = { one: { two: { split: f(true) } } };

    const shouldBeTypedAsString = get(obj, obj => obj.one.two.split.a);
    shouldBeTypedAsString as string;

    const shouldBeTypedAsObject = get(obj, obj => obj.one.two.split.b);
    shouldBeTypedAsObject as {};

    expect(shouldBeTypedAsString).toBe('apple');
    expect(shouldBeTypedAsObject).toBeUndefined();
  });

  it('works with a default value', () => {
    function f(condition: boolean) {
      if (condition) return { a: 'apple' };
      return { b: { more: { stuff: 'some string' } } };
    }

    const obj = { one: { two: { split: f(false) } } };

    const shouldBeTypedAsString = get(obj, obj => obj.one.two.split.a, 'default value');

    expect(shouldBeTypedAsString).toBe('default value');
  });

  it('returns null instead of default value', () => {
    const obj = { one: { two: null } };
    const value = get(obj, obj => obj.one.two, 'default value');

    expect(value).toBe(null);
  });

  it('returns 0 instead of default value', () => {
    const obj = { one: { two: 0 } };
    const value = get(obj, obj => obj.one.two, 'default value');

    expect(value).toBe(0);
  });

  it('returns empty string instead of default value', () => {
    const obj = { one: { two: '' } };
    const value = get(obj, obj => obj.one.two, 'default value');

    expect(value).toBe('');
  });
});
