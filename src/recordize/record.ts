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
    T[P] extends MapPlaceholder<infer U> ? Immutable.Map<string, U> :
    T[P] extends ListPlaceholder<infer U> ? Immutable.List<U> :
    T[P] extends SetPlaceholder<infer U> ? Immutable.Set<U> :
    T[P] extends SetOfStringOrTPlaceholder<infer U> ? Immutable.Set<U | string> :
    T[P]
};

export type Infer<T> = T extends Immutable.Record<infer U> ? U : any;

export function define<T>(rawRecordDefault: T) {
  type Record = RecordNoPlaceholders<T>;

  const recordDefault = Object.entries(rawRecordDefault).reduce(
    (recordDefault, [key, value]) => {
      if (value instanceof MapPlaceholder) {
        recordDefault[key] = Immutable.Map<string, any>();
      } else if (value instanceof SetPlaceholder || value instanceof SetOfStringOrTPlaceholder) {
        recordDefault[key] = Immutable.Set<any>();
      } else if (value instanceof ListPlaceholder) {
        recordDefault[key] = Immutable.List<any>();
      } else {
        recordDefault[key] = value;
      }
      return recordDefault;
    },
    {} as any,
  ) as Record;

  const mapConstructors = Object.entries(rawRecordDefault).reduce(
    (mapConstructors, [key, value]) => {
      if (value instanceof MapPlaceholder) {
        mapConstructors[key] = value.__constructor;
      }
      return mapConstructors;
    },
    {} as any,
  );

  const setConstructors = Object.entries(rawRecordDefault).reduce(
    (setConstructors, [key, value]) => {
      if (value instanceof SetPlaceholder || value instanceof SetOfStringOrTPlaceholder) {
        setConstructors[key] = value.__constructor;
      }
      return setConstructors;
    },
    {} as any,
  );

  const listConstructors = Object.entries(rawRecordDefault).reduce(
    (listConstructors, [key, value]) => {
      if (value instanceof ListPlaceholder) {
        listConstructors[key] = value.__constructor;
      }
      return listConstructors;
    },
    {} as any,
  );

  const RecordBaseClass = Immutable.Record(recordDefault) as new (
    defaultValues?: Partial<Record>,
  ) => Immutable.Record<Record>;

  class RecordClass extends RecordBaseClass {
    getOrCalculate<V>(name: string, calculate: () => V): V;
    getOrCalculate<V>(name: string, dependencies: Equatable[], calculate: () => V): V;
    getOrCalculate<V>(name: string, a: Equatable[] | (() => V), b?: () => V) {}
  }

  function fromJS<U extends RecordClass>(this: new (...params: any[]) => U, js: any): U {
    Object.entries(js).reduce((record, [key, value]) => {
      if (mapConstructors[key]) {
      }
      return record;
    }, new this());
    return new this();
  }

  const staticAdditions = {
    recordDefault,
    fromJS,
  };

  const _recordClass = Object.assign(RecordClass, staticAdditions);

  Object.assign(_recordClass, {
    __mapConstructors: mapConstructors,
    __setConstructors: setConstructors,
    __listConstructors: listConstructors,
  });

  return (_recordClass as any) as typeof staticAdditions &
    (new (defaultValues?: Partial<Record>) => Immutable.Record<Record> &
      Readonly<Record> &
      RecordClass);
}
