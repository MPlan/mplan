import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { Degree } from './degree';

export function allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<string | Course>>>,
) {
  return _allCombinations(listsOfLists)[0];
}

function _allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<string | Course>>>,
): Array<Immutable.Set<Immutable.Set<string | Course>>> {
  if (listsOfLists.length <= 1) {
    return listsOfLists;
  }
  let combined = Immutable.Set<Immutable.Set<string | Course>>();
  const listA = listsOfLists[0];
  const listB = listsOfLists[1];

  for (const a of listA) {
    for (const b of listB) {
      combined = combined.add(a.union(b));
    }
  }

  return _allCombinations([combined, ...listsOfLists.slice(2)]);
}

function flattenPrerequisites(
  prerequisite: Model.Prerequisite,
  catalog: Catalog,
): Immutable.Set<Immutable.Set<string | Course>> {
  if (!prerequisite) {
    return Immutable.Set<Immutable.Set<string | Course>>();
  }
  if (typeof prerequisite === 'string') {
    return Immutable.Set<Immutable.Set<string | Course>>().add(
      Immutable.Set<string | Course>().add(prerequisite),
    );
  }
  if (Array.isArray(prerequisite)) {
    const subjectCode = prerequisite[0];
    const courseNumber = prerequisite[1];
    const course =
      catalog.getCourse(subjectCode, courseNumber) ||
      `${subjectCode} ${courseNumber}`.toUpperCase();

    return Immutable.Set<Immutable.Set<string | Course>>().add(
      Immutable.Set<string | Course>().add(course),
    );
  }
  if (typeof prerequisite === 'object') {
    if (prerequisite.g === '&') {
      const operandsPrerequisites = prerequisite.o.map(operand =>
        flattenPrerequisites(operand, catalog),
      );
      return allCombinations(operandsPrerequisites);
    } else if (prerequisite.g === '|') {
      const operandSetsFlattened = prerequisite.o
        .map(operand => flattenPrerequisites(operand, catalog))
        .reduce(
          (combinedSetOfSets, flattenedOperand) =>
            flattenedOperand.reduce((combinedSet, set) => combinedSet.add(set), combinedSetOfSets),
          Immutable.Set<Immutable.Set<string | Course>>(),
        );
      return operandSetsFlattened;
    }
  }

  throw new Error(`Could not flatten prerequisite because its type could not be matched.`);
}

export class Course
  extends Record.define(
    {
      _id: ObjectId(),
      name: '',
      subjectCode: '',
      courseNumber: '',
      description: undefined as string | undefined | null,
      credits: undefined as number | undefined | null,
      creditsMin: undefined as number | undefined | null,
      creditHours: undefined as number | undefined | null,
      creditHoursMin: undefined as number | undefined | null,
      restrictions: undefined as string | undefined | null,
      prerequisites: undefined as Model.Prerequisite,
      corequisites: undefined as Model.Prerequisite,
      crossList: undefined as Array<[string, string]> | undefined | null,
      scheduleTypes: [] as string[],
      lastUpdateDate: 0,
      lastTermCode: '',
      fallSections: Record.SetOf(Section),
      winterSections: Record.SetOf(Section),
      summerSections: Record.SetOf(Section),
    },
    ['prerequisites', 'corequisites', 'crossList', 'scheduleTypes'],
  )
  implements Model.Course {
  get id() {
    return this._id.toHexString();
  }
  get catalogId() {
    return `${this.subjectCode}__|__${this.courseNumber}`;
  }
  get simpleName() {
    return `${this.subjectCode} ${this.courseNumber}`;
  }

  get creditsString() {
    const max = this.credits || this.creditHours || 0;
    const min = this.creditsMin || this.creditHoursMin || max;

    if (min === max) {
      return `${min} credits`;
    }
    return `${min} - ${max} credits`;
  }

  static optionsMemo = new Map<any, any>();
  static bestOptionMemo = new Map<any, any>();
  static intersectionMemo = new Map<any, any>();
  static depthMemo = new Map<any, any>();
  static minDepthMemo = new Map<any, any>();
  static levelsMemo = new Map<any, any>();
  static closureMemo = new Map<any, any>();
  static fullClosureMemo = new Map<any, any>();
  static criticalMemo = new Map<any, any>();
  static priorityMemo = new Map<any, any>();
  static prerequisitesSatisfiedMemo = new Map<any, any>();

  priority(degree: Degree, catalog: Catalog): number {
    const hash = hashObjects({ degree, catalog, course: this });
    if (Course.priorityMemo.has(hash)) {
      return Course.priorityMemo.get(hash);
    }

    const priority =
      this.depth(catalog, degree.preferredCourses()) + this.criticalLevel(degree, catalog);

    Course.priorityMemo.set(hash, priority);
    return priority;
  }

  criticalLevel(degree: Degree, catalog: Catalog): number {
    const hash = hashObjects({ catalog, degree, course: this });
    if (Course.criticalMemo.has(hash)) {
      return Course.criticalMemo.get(hash);
    }

    const levels = degree.levels(catalog);
    const levelCount = levels.count();
    const levelIndex = levels.findIndex(level => level.has(this));
    if (levelIndex <= -1) {
      Course.criticalMemo.set(hash, -1);
      return -1;
    }

    let criticalLevel = 0;

    while (levelIndex + criticalLevel + 1 < levelCount) {
      const nextLevel = levels.get(levelIndex + criticalLevel + 1);
      if (!nextLevel) {
        continue;
      }

      const levelHasCourse = nextLevel
        .filter(course => course instanceof Course)
        .map(x => x as Course)
        .some(course => course.bestOption(catalog, degree.preferredCourses()).has(this));

      if (levelHasCourse) {
        Course.criticalMemo.set(hash, criticalLevel);
        return criticalLevel;
      }
      criticalLevel += 1;
    }

    Course.criticalMemo.set(hash, criticalLevel);
    return criticalLevel;
  }

  /**
   * calculates all possible options of prerequisites. e.g. for CIS 350, you can take either
   * (CIS 200 and CIS 275 and MATH 115) or (IMSE 200 and CIS 275 and MATH 115)
   */
  options(catalog: Catalog): Immutable.Set<Immutable.Set<string | Course>> {
    const hash = hashObjects({ catalog, course: this });
    if (Course.optionsMemo.has(hash)) {
      return Course.optionsMemo.get(hash);
    }
    const flattened = flattenPrerequisites(this.prerequisites, catalog);
    Course.optionsMemo.set(hash, flattened);
    return flattened;
  }

  /**
   * given a set of preferred courses, this will return the best option has the most preferred
   * courses
   */
  bestOption(
    catalog: Catalog,
    preferredCourses: Immutable.Set<string | Course>,
  ): Immutable.Set<string | Course> {
    const hash = hashObjects({ catalog, preferredCourses, course: this });
    if (Course.bestOptionMemo.has(hash)) {
      return Course.bestOptionMemo.get(hash);
    }

    const options = this.options(catalog);
    const bestOptionMapping = options.map(option => {
      /**
       * the intersection of `preferredCourses` and the set of all course in the `prerequisites`
       * of this option. the "best option" is first decided by the option that has the most
       * `preferredCourses` in its closure.
       */
      const intersection = option
        .map(course => {
          let intersection = Immutable.Set<string | Course>();
          if (preferredCourses.has(course)) {
            intersection = intersection.add(course);
          }
          if (course instanceof Course) {
            intersection = intersection.union(
              preferredCourses.intersect(course.fullClosure(catalog)),
            );
          }
          return intersection;
        })
        .reduce((intersection, set) => {
          return intersection.union(set);
        }, Immutable.Set<string | Course>());
      const intersectionCount = intersection.count();

      const maxDepth = option
        .map(course => {
          if (typeof course === 'string') {
            return 0;
          }
          return course.minDepth(catalog);
        })
        .reduce((max, next) => (/*if*/ next > max ? next : max), 0);

      const closure = option.reduce((fullClosure, course) => {
        if (course instanceof Course) {
          return fullClosure.add(course).union(course.closure(catalog, preferredCourses));
        }
        return fullClosure.add(course);
      }, Immutable.Set<string | Course>());
      const closureCount = closure.count();
      return { maxDepth, intersectionCount, option, closureCount };
    });

    const bestOptionResult = bestOptionMapping.maxBy(
      ({ maxDepth, intersectionCount, closureCount }) => {
        return intersectionCount * 100000 - maxDepth * 1000 - closureCount;
      },
    );

    if (!bestOptionResult) {
      return Immutable.Set<string | Course>();
    }

    const bestOption = bestOptionResult.option;

    Course.bestOptionMemo.set(hash, bestOption);
    return bestOption;
  }

  /**
   * finds the intersection of the given `preferredCourses` and the current course's prerequisite
   * tree.
   */
  intersection(
    preferredCourses: Immutable.Set<string | Course>,
    catalog: Catalog,
  ): Immutable.Set<string | Course> {
    const hash = hashObjects({ preferredCourses, catalog, course: this });
    if (Course.intersectionMemo.has(hash)) {
      return Course.intersectionMemo.get(hash);
    }

    const options = this.options(catalog);
    let foundCourses = Immutable.Set<string | Course>();
    if (preferredCourses.has(this)) {
      foundCourses = foundCourses.add(this);
    }

    for (const option of options) {
      for (const course of option) {
        if (preferredCourses.has(course)) {
          foundCourses = foundCourses.add(course);
        }
        if (course instanceof Course) {
          foundCourses = course
            .intersection(preferredCourses, catalog)
            .reduce((foundCourses, next) => foundCourses.add(next), foundCourses);
        }
      }
    }

    Course.intersectionMemo.set(hash, foundCourses);
    return foundCourses;
  }

  fullClosure(catalog: Catalog): Immutable.Set<string | Course> {
    const hash = hashObjects({ course: this, catalog });
    if (Course.fullClosureMemo.has(hash)) {
      return Course.fullClosureMemo.get(hash);
    }

    const mutableClosure = new Set<string | Course>();

    const options = this.options(catalog);

    for (const option of options) {
      for (const course of option) {
        mutableClosure.add(course);
        if (course instanceof Course) {
          const subClosure = course.fullClosure(catalog);
          for (const subCourse of subClosure) {
            mutableClosure.add(subCourse);
          }
        }
      }
    }

    const closure = Immutable.Set<string | Course>(mutableClosure);

    Course.fullClosureMemo.set(hash, closure);
    return closure;
  }

  /**
   * finds the depth of the prerequisite tree using the `bestOption`
   */
  depth(catalog: Catalog, preferredCourses: Immutable.Set<string | Course>): number {
    const hash = hashObjects({ catalog, preferredCourses, course: this });
    if (Course.depthMemo.has(hash)) {
      return Course.depthMemo.get(hash);
    }

    const bestOption = this.bestOption(catalog, preferredCourses);

    let maxDepth = 0;
    for (const course of bestOption) {
      if (course instanceof Course) {
        const courseDepth = course.depth(catalog, preferredCourses);
        if (courseDepth > maxDepth) {
          maxDepth = courseDepth;
        }
      }
    }

    const value = maxDepth + 1;
    Course.depthMemo.set(hash, value);
    return value;
  }

  minDepth(catalog: Catalog): number {
    const hash = hashObjects({ catalog, course: this });
    if (Course.minDepthMemo.has(hash)) {
      return Course.minDepthMemo.get(hash);
    }

    const options = this.options(catalog);
    if (options.isEmpty()) {
      Course.minDepthMemo.set(hash, 1);
      return 1;
    }

    let minDepthOfAllOptions = 9999;
    for (const option of options) {
      let maxDepthOfAllCourses = 0;
      for (const course of option) {
        if (course instanceof Course) {
          const courseDepth = course.minDepth(catalog);
          if (courseDepth > maxDepthOfAllCourses) {
            maxDepthOfAllCourses = courseDepth;
          }
        }
      }
      if (maxDepthOfAllCourses < minDepthOfAllOptions) {
        minDepthOfAllOptions = maxDepthOfAllCourses;
      }
    }

    const value = minDepthOfAllOptions + 1;
    Course.minDepthMemo.set(hash, value);
    return value;
  }

  closure(
    catalog: Catalog,
    preferredCourses: Immutable.Set<string | Course>,
  ): Immutable.Set<string | Course> {
    const hash = hashObjects({ course: this, catalog, preferredCourses });
    if (Course.closureMemo.has(hash)) {
      return Course.closureMemo.get(hash);
    }

    let coursesInClosure = Immutable.Set<string | Course>();
    coursesInClosure = coursesInClosure.add(this);

    const bestOption = this.bestOption(catalog, preferredCourses);
    for (const course of bestOption) {
      coursesInClosure = coursesInClosure.add(course);
      if (course instanceof Course) {
        coursesInClosure = coursesInClosure.union(course.closure(catalog, preferredCourses));
      }
    }

    Course.closureMemo.set(hash, coursesInClosure);
    return coursesInClosure;
  }

  prerequisitesSatisfied(
    catalog: Catalog,
    previousCourses: Immutable.Set<string | Course>,
  ): boolean {
    const hash = hashObjects({ catalog, previousCourses, course: this });
    if (Course.prerequisitesSatisfiedMemo.has(hash)) {
      return Course.prerequisitesSatisfiedMemo.get(hash);
    }
    const value = this._prerequisitesSatisfied(catalog, previousCourses);
    Course.prerequisitesSatisfiedMemo.set(hash, value);
    return value;
  }

  private _prerequisitesSatisfied(
    catalog: Catalog,
    previousCourses: Immutable.Set<string | Course>,
  ): boolean {
    const options = this.options(catalog);
    if (options.isEmpty()) return true;
    for (const option of options) {
      if (option.every(course => previousCourses.has(course))) {
        return true;
      }
    }
    return false;
  }
}
