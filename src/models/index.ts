import * as Immutable from 'immutable';
import { ObjectID as _ObjectId } from 'bson';
import { Prerequisite, Corequisite } from 'sync/catalog-umd-umich/models';
export { Prerequisite, Corequisite };

export function ObjectId(id?: string | number | _ObjectId) {
  return (_ObjectId as any)(id) as _ObjectId;
}

export function hashObjects(objects: { [key: string]: any }) {
  return Immutable.Map(objects).hashCode();
}

export * from './app';
export * from './catalog';
export * from './course';
export * from './degree-group';
export * from './degree';
export * from './draggables';
export * from './mastered-degree-group';
export * from './mastered-degree';
export * from './plan';
export * from './section';
export * from './semester';
export * from './ui';
export * from './user';
export * from './store';
export * from './catalog-ui';
export * from './degree-page';
export * from './search';
export { Report, JoinedCatalog, SyncStatus, courseKey } from './models';
