import * as Immutable from 'immutable';
import { ObjectID as _ObjectId } from 'bson';
import { Prerequisite, Corequisite } from '../sync/catalog-umd-umich/models';
export { Prerequisite, Corequisite };

export function ObjectId(id?: string | number | _ObjectId) {
  return (_ObjectId as any)(id) as _ObjectId;
}

export function hashObjects(objects: { [key: string]: any }) {
  return Immutable.Map(objects).hashCode();
}

export * from './app';
export * from './course';
export * from './degree-group';
export * from './draggables';
export * from './mastered-degree-group';
export * from './mastered-degree';
export * from './plan';
export * from './user';
export * from './store';
export { Report, JoinedCatalog, SyncStatus, courseKey, parseCourseKey } from './models';
