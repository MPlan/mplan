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

  updateStore = (store: App) => {
    return store.update('masteredDegrees', masteredDegrees => {
      const thisMasteredDegree = masteredDegrees.get(this.id);
      if (!thisMasteredDegree) {
        console.warn(`could nto find mastered degree with id "${this.id}"`);
        return masteredDegrees;
      }
      return masteredDegrees.set(thisMasteredDegree.id, this);
    });
  };

  get id() {
    return this._id.toHexString();
  }

  createNewGroup() {
    return this.update('masteredDegreeGroups', masteredDegreeGroups =>
      masteredDegreeGroups.push(
        new MasteredDegreeGroup({
          _id: ObjectId(),
          name: 'New degree group',
          descriptionHtml: 'Default description. Please change!',
          creditMaximum: 6,
          creditMinimum: 6,
        }),
      ),
    );
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
