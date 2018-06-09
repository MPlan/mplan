import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId } from './';
import { pointer } from './pointer';
import { App } from './app';

export class Section
  extends Record.define({
    _id: ObjectId(),
    lastUpdateDate: 0,
    lastTermCode: '',
    courseId: ObjectId(),
    termCode: '',
    courseRegistrationNumber: '',
    instructors: [] as string[],
    scheduleTypes: [] as string[],
    times: [] as string[],
    days: [] as string[],
    locations: [] as string[],
    capacity: 0,
    remaining: 0,
  })
  implements Model.Section {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }
}
