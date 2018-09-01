export function maxBy<T>(list: T[], by: (t: T) => number) {
  let maxIndex = 0;
  let maxValue = Number.MIN_SAFE_INTEGER;
  const values = list.map(by);
  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    if (value > maxValue) {
      maxIndex = i;
      maxValue = value;
    }
  }

  return list[maxIndex];
}
