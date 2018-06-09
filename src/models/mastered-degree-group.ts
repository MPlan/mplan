import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId } from './';
import { Course } from './course';
import { pointer } from './pointer';
import { App } from './app';

export class MasteredDegreeGroup extends Record.define({
  _id: ObjectId(),
  name: '',
  descriptionHtml: '',
  /** catalog ids */
  defaultIds: Immutable.List<string>(),
  /** catalog ids */
  allowListIds: Immutable.List<string>(),
  creditMinimum: 0,
  creditMaximum: 0,
}) {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }

  defaultCourses() {
    const catalog = this.root.catalog;
    return this.defaultIds
      .map(id => catalog.courseMap.get(id)!)
      .filter(x => !!x)
      .toArray();
  }

  allowedCourses() {
    const catalog = this.root.catalog;
    return this.allowListIds
      .map(id => catalog.courseMap.get(id)!)
      .filter(x => !!x)
      .toArray();
  }

  addToDefaults(course: string | Course) {
    const id = course instanceof Course ? course.catalogId : course;
    if (this.defaultIds.includes(id)) {
      return this;
    }
    return this.update('defaultIds', defaults => defaults.push(id));
  }

  deleteFromDefaults(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('defaultIds', defaults => defaults.filter(id => id !== idToDelete));
  }

  addToAllowList(course: string | Course) {
    const id = course instanceof Course ? course.catalogId : course;
    if (this.allowListIds.includes(id)) {
      return this;
    }
    return this.update('allowListIds', allowList => allowList.push(id));
  }

  deleteFromAllowList(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('allowListIds', allowList => allowList.filter(id => id !== idToDelete));
  }
}
