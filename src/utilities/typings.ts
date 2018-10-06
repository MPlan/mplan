export type ValueOf<T> = T[keyof T];
export type TypeIn<T, U extends keyof T> = ValueOf<Pick<T, U>>;
export type RemoveProps<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;

type NonFunctionPropNames<T> = { [K in keyof T]: T[K] extends Function ? never : K }[keyof T];
export type NonFunctionProps<T> = Pick<T, NonFunctionPropNames<T>>;

type FunctionPropNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
export type FunctionProps<T> = Pick<T, FunctionPropNames<T>>;
