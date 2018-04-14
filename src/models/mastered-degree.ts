import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { Degree } from './degree';
import { Course } from './course';
import { MasteredDegreeGroup } from './mastered-degree-group';

export class MasteredDegree extends Record.define({
  _id: ObjectId(),
  name: '',
  descriptionHtml: '',
  minimumCredits: 0,
  masteredDegreeGroups: Record.ListOf(MasteredDegreeGroup),
}) {
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
