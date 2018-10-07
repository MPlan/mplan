import { isEqual } from 'lodash';

export function returnPreviousIfUnchanged<T extends Function>(calculate: T, _compare?: any): T {
  let previousValue: any;
  const compare = _compare || isEqual;

  return (((...args: any[]) => {
    const newValue = calculate(...args);
    if (compare(newValue, previousValue)) return previousValue;

    previousValue = newValue;
    return newValue;
  }) as any) as T;
}
