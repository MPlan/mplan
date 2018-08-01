import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId } from './';
import { pointer } from './pointer';
import { App } from './app';

export class Section
  extends Record.define(
    {
      _id: ObjectId(),
      instructors: [],
      times: [],
      days: [],
      locations: [],
      courseRegistrationNumber: '',
      crossList: [],
      capacity: 0,
      remaining: 0,
      subjectCode: '',
      courseNumber: '',
      termCode: '',
      lastUpdateDate: 0,
      season: 'unknown' as 'unknown',
    },
    ['instructors', 'times', 'days', 'locations', 'crossList'],
  )
  implements Model.Section {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }
}
