export type ValueOf<T> = T[keyof T];
export type TypeIn<T, U extends keyof T> = ValueOf<Pick<T, U>>;
