import shallowEqual from 'recompose/shallowEqual';

function removeFunctions<T>(obj: T): { [P in keyof T]: T[P] extends Function ? never : T[P] } {
  return Object.entries(obj)
    .filter(([_, value]) => typeof value !== 'function')
    .reduce(
      (obj, [key, value]) => {
        obj[key as keyof T] = value;
        return obj;
      },
      {} as { [P in keyof T]: T[P] extends Function ? never : T[P] },
    );
}

export function shallowEqualNoFunctions<T>(a: T, b: T) {
  return shallowEqual(removeFunctions(a), removeFunctions(b));
}
