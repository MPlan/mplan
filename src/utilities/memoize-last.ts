const neverCalculated = Symbol();

/**
 * `memoizeLast` is similar to reselect's `createSelector` but the difference
 * is that this doesn't take in selector functions. instead you just pass in
 * references in an array and a `calculate` function
 *
 * see the tests for examples
 */
export function memoizeLast<T extends Function>(calculate: T): T {
  let previousInputs: any;
  let last = neverCalculated as any;

  function shouldCalculate(inputs: any[]) {
    if (last === neverCalculated) return true;

    for (let i = 0; i < inputs.length; i += 1) {
      const input = inputs[i];
      const previousInput = previousInputs[i];

      if (!Object.is(input, previousInput)) return true;
    }
    return false;
  }

  function getOrCalculate(...inputs: any[]) {
    if (!shouldCalculate(inputs)) return last;
    last = calculate(...inputs);
    previousInputs = inputs;
    return last;
  }

  return getOrCalculate as any;
}
