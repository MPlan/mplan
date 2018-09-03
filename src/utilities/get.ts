/**
 * Exclude null and undefined from T
 */
type NonUndefined<T> = T extends undefined ? never : T;

/**
 * this creates a "nominal" type in typescript
 */
class RecursiveNonNullableNominalType {
  private _RecursiveNonNullableNominalType: RecursiveNonNullableNominalType | undefined;
}

type RecursiveNonNullable<T> = { [K in keyof T]: RecursiveNonNullable<NonUndefined<T[K]>> } &
  RecursiveNonNullableNominalType;

export function get<T, R, D = undefined>(
  subject: T,
  pick: ((t: RecursiveNonNullable<T>) => R),
  defaultValue?: D,
): D | (R extends RecursiveNonNullable<infer U> ? U : never) {
  try {
    const value = pick(subject as any);
    if (value === undefined) return defaultValue as any;
    return value as any;
  } catch {
    return defaultValue as any;
  }
}
