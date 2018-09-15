import { isEqual } from 'lodash';

export function returnPreviousIfUnchanged<T>(
  calculate: (...args: any[]) => T,
  _compare?: (a: T, b: T) => boolean,
) {
  let previousValue: any;
  const compare = _compare || isEqual;

  return (...args: any[]) => {
    const newValue = calculate(...args);
    if (compare(newValue, previousValue)) return previousValue;

    previousValue = newValue;
    return newValue;
  };
}
