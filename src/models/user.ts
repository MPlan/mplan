import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId } from './';
import { Degree } from './degree';
import { Plan } from './plan';
import { pointer } from './pointer';
import { App } from './app';

export class User
  extends Record.define({
    _id: ObjectId(),
    username: '',
    name: '',
    picture: '',
    registerDate: 0,
    lastLoginDate: 0,
    lastUpdateDate: 0,
    lastTermCode: '',
    plan: new Plan(),
    degree: new Degree(),
  })
  implements Model.User {
  get root(): App {
    return pointer.store.current();
  }
  updateDegree(updater: (degree: Degree) => Degree) {
    return this.update('degree', updater);
  }

  updatePlan(updater: (plan: Plan) => Plan) {
    return this.update('plan', updater);
  }

  // TODO
  validate() {
    // const validationErrors = [] as string[];
    // if (!this.username) validationErrors.push('User name was falsy');
    // if (!this.name) validationErrors.push('Name was falsy');
    // if (!this.registerDate) validationErrors.push('Register date was falsy');
    // if (!this.lastLoginDate) validationErrors.push('lastLoginDate was falsy');
  }
}
