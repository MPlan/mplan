import * as Immutable from 'immutable';
import { Equatable } from './store';
import { ObjectID as _ObjectId } from 'bson';

export function ObjectId(id?: string | number | _ObjectId) {
  return (_ObjectId as any)(id) as _ObjectId;
}

export function MapOf<T>(constructor: new (...params: any[]) => T) {
  return new MapPlaceholder(constructor);
}
class MapPlaceholder<T> {
  __mapConstructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__mapConstructor = otherConstructor;
  }
}

export function SetOf<T>(constructor: new (...params: any[]) => T) {
  return new SetPlaceholder(constructor);
}
class SetPlaceholder<T> {
  __setConstructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__setConstructor = otherConstructor;
  }
}

export function ListOf<T>(constructor: new (...params: any[]) => T) {
  return new ListPlaceholder(constructor);
}
class ListPlaceholder<T> {
  __listConstructor: new (...params: any[]) => T;
  constructor(otherConstructor: new (...params: any[]) => T) {
    this.__listConstructor = otherConstructor;
  }
}

// prettier-ignore
export type RecordNoPlaceholders<T> = {
  [P in keyof T]:
    T[P] extends MapPlaceholder<infer U> ? Immutable.Map<string, U> :
    T[P] extends ListPlaceholder<infer U> ? Immutable.List<U> :
    T[P] extends SetPlaceholder<infer U> ? Immutable.Set<U> :
    T[P]
};

/**
 * if `dontConvertKeys` is present, those keys will not be converted to immutable types during
 * serialization
 */
export function define<T>(rawRecordDefault: T, _dontConvertKeys?: string[]) {
  const dontConvertKeys = _dontConvertKeys || [];
  type Record = RecordNoPlaceholders<T>;

  const recordDefault = Object.entries(rawRecordDefault).reduce(
    (recordDefault, [key, value]) => {
      if (value instanceof MapPlaceholder) {
        recordDefault[key] = Immutable.Map<string, any>();
      } else if (value instanceof SetPlaceholder) {
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
        mapConstructors[key] = value.__mapConstructor;
      }
      return mapConstructors;
    },
    {} as any,
  );

  const setConstructors = Object.entries(rawRecordDefault).reduce(
    (setConstructors, [key, value]) => {
      if (value instanceof SetPlaceholder) {
        setConstructors[key] =
          (value as any).__setConstructor || (value as any).__setOfStringOrTConstructor;
      }
      return setConstructors;
    },
    {} as any,
  );

  const listConstructors = Object.entries(rawRecordDefault).reduce(
    (listConstructors, [key, value]) => {
      if (value instanceof ListPlaceholder) {
        listConstructors[key] = value.__listConstructor;
      }
      return listConstructors;
    },
    {} as any,
  );

  const recordConstructors = Object.entries(rawRecordDefault).reduce(
    (recordConstructors, [key, value]) => {
      if (Immutable.Record.isRecord(value)) {
        recordConstructors[key] = value.constructor;
      }
      return recordConstructors;
    },
    {} as any,
  );

  const RecordBaseClass = Immutable.Record(recordDefault) as new (
    defaultValues?: Partial<Record>,
  ) => Immutable.Record<Record>;

  class RecordClass extends RecordBaseClass {
    getOrCalculate<V>(name: string, calculate: () => V): V;
    getOrCalculate<V>(name: string, dependencies: Equatable[], calculate: () => V): V;
    getOrCalculate<V>(name: string, a: Equatable[] | (() => V), b?: () => V) {
      const calculate = typeof a === 'function' ? a : b;
      if (!calculate) throw new Error('Calculate was not function');
      return calculate();
    }
  }

  function fromJS<U extends RecordClass>(this: new (...params: any[]) => U, js: any): U {
    return Object.entries(js).reduce((record, [key, value]) => {
      if (key === '_id') {
        return record.set('_id' as any, ObjectId(value as any) as any);
      } else if (mapConstructors[key]) {
        const transformedValue = Object.entries(value).reduce((map, [nestedKey, subValue]) => {
          if (typeof subValue === 'string') {
            return map.set(nestedKey, subValue);
          }
          const immutableValue = mapConstructors[key].fromJS(subValue);
          return map.set(nestedKey, immutableValue);
        }, Immutable.Map<any, any>());

        return record.set(key as any, transformedValue as any);
      } else if (setConstructors[key]) {
        const transformedValue = (value as any[]).reduce((set, item) => {
          if (typeof item === 'string') {
            return set.add(item);
          }
          const immutableValue = setConstructors[key].fromJS(item);
          return set.add(immutableValue);
        }, Immutable.Set<any>());

        return record.set(key as any, transformedValue as any);
      } else if (listConstructors[key]) {
        const transformedValue = (value as any[]).reduce((list, item) => {
          if (typeof item === 'string') {
            return list.push(item);
          }
          const immutableValue = listConstructors[key].fromJS(item);
          return list.push(immutableValue);
        }, Immutable.List<any>());

        return record.set(key as any, transformedValue as any);
      } else if (recordConstructors[key]) {
        const transformedValue = recordConstructors[key].fromJS(value);

        return record.set(key as any, transformedValue);
      }
      if (dontConvertKeys.includes(key)) {
        return record.set(key as any, value as any);
      }
      return record.set(key as any, Immutable.fromJS(value as any));
    }, new this());
  }

  const staticAdditions = {
    recordDefault,
    fromJS,
  };

  const _recordClass = Object.assign(RecordClass, staticAdditions);

  return (_recordClass as any) as typeof staticAdditions &
    (new (defaultValues?: Partial<Record>) => Immutable.Record<Record> &
      Readonly<Record> &
      RecordClass);
}
