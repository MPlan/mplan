import * as Record from '../recordize';
import { Catalog } from './catalog';
import { User } from './user';
import { Ui } from './ui';
import { Degree } from './degree';
import { Plan } from './plan';
import { MasteredDegree } from './mastered-degree';
import { pointer } from './pointer';
import { CatalogUi } from './catalog-ui';
import { DegreePage } from './degree-page';
import { Search } from './search';
import { ObjectId } from './';

export class App extends Record.define({
  catalog: new Catalog(),
  user: new User(),
  ui: new Ui(),
  masteredDegrees: Record.MapOf(MasteredDegree),
  catalogUi: new CatalogUi(),
  degreePage: new DegreePage(),
  search: new Search(),
}) {
  get root(): App {
    return pointer.store.current();
  }

  updateUi(updater: (ui: Ui) => Ui) {
    return this.update('ui', updater);
  }

  updateUser(updater: (user: User) => User) {
    return this.update('user', updater);
  }

  updateDegree(updater: (degree: Degree) => Degree) {
    return this.updateUser(user => user.updateDegree(updater));
  }

  updatePlan(updater: (plan: Plan) => Plan) {
    return this.updateUser(user => user.updatePlan(updater));
  }

  createMasteredDegree() {
    const id = ObjectId();
    return this.update('masteredDegrees', masteredDegrees =>
      masteredDegrees.set(
        id.toHexString(),
        new MasteredDegree({
          _id: id,
          name: 'New degree',
          descriptionHtml: 'Default description. Please change!',
          minimumCredits: 120,
          published: false,
        }),
      ),
    );
  }
}
