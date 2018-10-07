export function createMultimap<T>() {
  const topMap = new Map<any, any>();

  function set(keys: any[], value: T) {
    let returnValue: any = topMap;
    for (let i = 0; i < keys.length - 1; i += 1) {
      const key = keys[i];
      const next = returnValue.get(key) || new Map<any, any>();
      returnValue.set(key, next);
      returnValue = next;
    }

    returnValue.set(keys[keys.length - 1], value);
  }

  function get(keys: any[]): T | undefined {
    let map: any = topMap;

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      const value = map.get(key);
      if (value === undefined) return undefined;
      map = value;
    }

    return map;
  }

  return { set, get };
}
