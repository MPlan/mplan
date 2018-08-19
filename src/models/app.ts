import * as Record from '../recordize';
import * as Model from 'models';
import { Catalog } from './catalog';
import { User } from './user';
import { Ui } from './ui';
import { Degree } from './degree';
import { Plan } from './plan';
import { MasteredDegree } from './mastered-degree';
import { MasteredDegreeGroup } from './mastered-degree-group';
import { pointer } from './pointer';
import { CatalogUi } from './catalog-ui';
import { DegreePage } from './degree-page';
import { Search } from './search';
import { ObjectId } from './';
import { Course } from './course';

export class App extends Record.define(
  {
    catalog: new Catalog(),
    user: new User(),
    ui: new Ui(),
    masteredDegrees: Record.MapOf(MasteredDegree),
    catalogUi: new CatalogUi(),
    degreePage: new DegreePage(),
    search: new Search(),
    admins: [] as string[],
    prerequisiteOverrides: {} as { [courseKey: string]: Model.Prerequisite },
  },
  ['admins', 'prerequisiteOverrides'],
) {
  static masteredDegreeGroupsMemo = new WeakMap<any, any>();

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
          descriptionHtml: 'No description provided.',
          minimumCredits: 120,
          published: false,
        }),
      ),
    );
  }

  getMasteredDegreeGroup(masteredDegreeGroupId: string) {
    const lookup = this.masteredDegreeGroupLookup();
    return lookup[masteredDegreeGroupId] as MasteredDegreeGroup | undefined;
  }

  masteredDegreeGroupLookup(): { [key: string]: MasteredDegreeGroup } {
    if (App.masteredDegreeGroupsMemo.has(this.masteredDegrees)) {
      return App.masteredDegreeGroupsMemo.get(this.masteredDegrees);
    }

    const lookup = this.masteredDegrees.reduce(
      (lookup, next) => {
        return next.masteredDegreeGroups.reduce((lookup, group) => {
          lookup[group.id] = group;
          return lookup;
        }, lookup);
      },
      {} as { [key: string]: MasteredDegreeGroup },
    );

    App.masteredDegreeGroupsMemo.set(this.masteredDegrees, lookup);
    return lookup;
  }

  addPrerequisiteOverride(course: Course, prerequisite: Model.Prerequisite) {
    return this.update('prerequisiteOverrides', prerequisiteOverrides => ({
      ...prerequisiteOverrides,
      [course.catalogId]: prerequisite,
    }));
  }

  removePrerequisiteOverride(course: Course) {
    const courseKeyToRemove = course.catalogId;
    return this.update('prerequisiteOverrides', prerequisiteOverrides => {
      return Object.entries(prerequisiteOverrides)
        .filter(([courseKey]) => courseKey !== courseKeyToRemove)
        .reduce(
          (acc, [courseKey, prerequisite]) => {
            acc[courseKey] = prerequisite;
            return acc;
          },
          {} as {
            [courseKey: string]: Model.Prerequisite;
          },
        );
    });
  }
}
