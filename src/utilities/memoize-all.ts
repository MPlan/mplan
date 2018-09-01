import { createMultimap } from './multimap';

export function memoizeAll<T extends Function>(calculate: T): T {
  let memo = createMultimap();

  function getOrCalculate(...args: any[]) {
    const valueFromMemo = memo.get(args);
    if (valueFromMemo !== undefined) return valueFromMemo;
    const value = calculate(...args);
    memo.set(args, value);
    return value;
  }

  return getOrCalculate as any;
}
