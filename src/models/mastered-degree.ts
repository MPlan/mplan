import * as Record from '../recordize';
import { ObjectId } from './';
import { MasteredDegreeGroup } from './mastered-degree-group';
import { pointer } from './pointer';
import { App } from './app';

export class MasteredDegree extends Record.define({
  _id: ObjectId(),
  name: '',
  descriptionHtml: '',
  minimumCredits: 0,
  masteredDegreeGroups: Record.ListOf(MasteredDegreeGroup),
  published: false,
}) {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }

  addGroup(group: MasteredDegreeGroup) {
    if (this.masteredDegreeGroups.includes(group)) {
      return this;
    }
    return this.update('masteredDegreeGroups', groups => groups.push(group));
  }

  deleteGroup(groupToDelete: MasteredDegreeGroup) {
    return this.update('masteredDegreeGroups', groups =>
      groups.filter(group => group !== groupToDelete),
    );
  }

  // TODO:
  warnings() {}
}
