import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId } from './';
import { Degree } from './degree';
import { Plan } from './plan';
import { pointer } from './pointer';
import { App } from './app';
import { Course } from './course';

export class User
  extends Record.define(
    {
      _id: ObjectId(),
      username: '',
      name: '',
      picture: '',
      registerDate: 0,
      lastLoginDate: 0,
      lastUpdateDate: 0,
      lastTermCode: '',
      chosenDegree: false,
      plan: new Plan(),
      degree: new Degree(),
      isAdmin: false,
      userPrerequisiteOverrides: {} as { [courseKey: string]: Model.Prerequisite },
    },
    ['userPrerequisiteOverrides'],
  )
  implements Model.User {
  get root(): App {
    return pointer.store.current();
  }

  static updateStore(store: App, newThis: User) {
    return store.set('user', newThis);
  }

  updateDegree(updater: (degree: Degree) => Degree) {
    return this.update('degree', updater);
  }

  updatePlan(updater: (plan: Plan) => Plan) {
    return this.update('plan', updater);
  }

  resetDegree() {
    return this.set('degree', new Degree()).set('chosenDegree', false);
  }

  setPrerequisiteOverride(course: Course, prerequisite: Model.Prerequisite) {
    return this.update('userPrerequisiteOverrides', overrides => ({
      ...overrides,
      [course.catalogId]: prerequisite,
    }));
  }

  removePrerequisiteOverride(course: Course) {
    return this.update('userPrerequisiteOverrides', overrides => {
      return Object.entries(overrides)
        .filter(([key]) => course.catalogId !== key)
        .reduce(
          (newOverrides, [key, value]) => {
            newOverrides[key] = value;
            return newOverrides;
          },
          {} as { [courseKey: string]: Model.Prerequisite },
        );
    });
  }
}
