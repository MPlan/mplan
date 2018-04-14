import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { Degree } from './degree';
import { Course } from './course';

export class MasteredDegreeGroup extends Record.define({
  _id: ObjectId(),
  name: '',
  descriptionHtml: '',
  whitelistedIds: Immutable.List<string>(),
  blacklistedIds: Immutable.List<string>(),
  creditMinimum: 0,
  creditMaximum: 0,
}) {
  get id() {
    return this._id.toHexString();
  }

  addToWhitelist(course: string | Course) {
    const id = course instanceof Course ? course.catalogId : course;
    if (this.whitelistedIds.includes(id)) {
      return this;
    }
    return this.update('whitelistedIds', whitelist => whitelist.push(id));
  }

  deleteFromWhitelist(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('whitelistedIds', whitelist => whitelist.filter(id => id !== idToDelete));
  }

  addToBlacklist(course: string | Course) {
    const idToAdd = course instanceof Course ? course.catalogId : course;
    if (this.blacklistedIds.includes(idToAdd)) {
      return this;
    }
    return this.update('blacklistedIds', blacklist => blacklist.push(idToAdd));
  }

  deleteFromBlacklist(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('blacklistedIds', blacklist => blacklist.filter(id => id !== idToDelete));
  }
}
