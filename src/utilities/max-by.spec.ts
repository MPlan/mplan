import { maxBy } from './max-by';

describe('maxBy', () => {
  it('grabs the max values of the picked prop', () => {
    const max = { value: 9999 };
    let list = [{ value: 3 }, max, { value: 3 }, { value: 6 }, { value: 8 }, { value: 2 }];

    expect(maxBy(list, i => i.value)).toBe(max);
  });
});
