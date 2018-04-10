import * as Immutable from 'immutable';

export interface Equatable {
  hashCode(): number;
  equals(other: any): boolean;
}

export function MapOf<T>(constructor: new (...params: any[]) => T) {
  return new MapPlaceholder(constructor);
}
class MapPlaceholder<T> {
  __constructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__constructor = otherConstructor;
  }
}

export function SetOf<T>(constructor: new (...params: any[]) => T) {
  return new SetPlaceholder(constructor);
}
class SetPlaceholder<T> {
  __constructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__constructor = otherConstructor;
  }
}

export function SetOfStringOr<T>(constructor: new (...params: any[]) => T) {
  return new SetOfStringOrTPlaceholder(constructor);
}
class SetOfStringOrTPlaceholder<T> {
  __constructor: new (...params: any[]) => T | string;
  constructor(otherConstructor: new (...params: any[]) => T | string) {
    this.__constructor = otherConstructor;
  }
}

export function ListOf<T>(constructor: new (...params: any[]) => T) {
  return new ListPlaceholder(constructor);
}
class ListPlaceholder<T> {
  __constructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__constructor = otherConstructor;
  }
}

// prettier-ignore
export type RecordNoPlaceholders<T> = {
  [P in keyof T]:
    T[P] extends MapPlaceholder<infer U> ? U :
    T[P] extends ListPlaceholder<infer U> ? U :
    T[P] extends SetPlaceholder<infer U> ? U :
    T[P] extends SetOfStringOrTPlaceholder<infer U> ? U | string :
    T[P]
};

export type Infer<T> = T extends Immutable.Record<infer U> ? U : any;

export function define<T>(rawRecordDefault: T) {
  const recordDefault = Object.entries(rawRecordDefault).reduce(
    (recordDefault, [key, value]) => {
      if (value instanceof MapPlaceholder) {
        recordDefault[key] = Immutable.Map<string, any>();
      } else {
        recordDefault[key] = value;
      }
      return recordDefault;
    },
    {} as any,
  ) as RecordNoPlaceholders<T>;
  type Record = RecordNoPlaceholders<T>;

  const RecordBaseClass = Immutable.Record(recordDefault) as new (
    defaultValues?: Partial<Record>,
  ) => Immutable.Record<Record>;

  class RecordClass extends RecordBaseClass {
    getOrCalculate<V>(name: string, calculate: () => V): V;
    getOrCalculate<V>(name: string, dependencies: Equatable[], calculate: () => V): V;
    getOrCalculate<V>(name: string, a: Equatable[] | (() => V), b?: () => V) {}
  }

  return Object.assign(RecordClass, { recordDefault });
}
