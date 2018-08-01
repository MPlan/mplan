export type ValueOf<T> = T[keyof T];
export type TypeIn<T, U extends keyof T> = ValueOf<Pick<T, U>>;
export type RemoveProps<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;
