/**
 * it's possible that the calculated value is actually `undefined` or `null`, so it's best to use a
 * symbol as an initial value to denote that the value has never been calculated before
 */
const neverCalculated = Symbol();

/**
 * `getOrCalculate` is similar to reselect's `createSelector` but the difference is that this
 * doesn't take in selector functions. instead you just pass in references in an array and a
 * `calculate` function
 *
 * see the tests for examples
 */
export function createGetOrCalculate<A, B, C, D, R>(calculate: (a: A, b: B, c: C, d: D) => R) {
  let previousInputs: any[];
  let value = neverCalculated as any;

  function shouldCalculate(inputs: any[]) {
    if (value === neverCalculated) return true;
    if (previousInputs.length !== inputs.length) {
      throw new Error("`getOrCalculate`'s pointers' length should never change");
    }
    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      const previousInput = previousInputs[i];

      if (!Object.is(input, previousInput)) return true;
    }
    return false;
  }

  function getOrCalculate(a: A, b?: B, c?: C, d?: D): R;
  function getOrCalculate(...inputs: any[]) {
    if (!shouldCalculate(inputs)) return value;
    value = calculate.apply(undefined, inputs); // using `apply` because of a typescript limitation
    previousInputs = inputs;
    return value;
  }

  return getOrCalculate;
}
