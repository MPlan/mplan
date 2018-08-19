import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { pointer } from './pointer';
import { App } from './app';
import { flatten } from 'lodash';

class PrerequisiteTuple extends Immutable.Record({
  course: '' as string | Course,
  canTakeConcurrently: false,
}) {}

export function allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<PrerequisiteTuple>>>,
) {
  return _allCombinations(listsOfLists)[0];
}

function _allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<PrerequisiteTuple>>>,
): Array<Immutable.Set<Immutable.Set<PrerequisiteTuple>>> {
  if (listsOfLists.length <= 1) {
    return listsOfLists;
  }
  let combined = Immutable.Set<Immutable.Set<PrerequisiteTuple>>();
  const listA = listsOfLists[0];
  const listB = listsOfLists[1];

  for (const a of listA) {
    for (const b of listB) {
      combined = combined.add(a.union(b));
    }
  }

  return _allCombinations([combined, ...listsOfLists.slice(2)]);
}

export function disjunctiveNormalForm(
  prerequisite: Model.Prerequisite | undefined,
  catalog: Catalog,
): Immutable.Set<Immutable.Set<PrerequisiteTuple>> {
  if (!prerequisite) return Immutable.Set();

  if (Model.isStringPrerequisite(prerequisite)) {
    return Immutable.Set<Immutable.Set<PrerequisiteTuple>>().add(
      Immutable.Set<PrerequisiteTuple>().add(
        new PrerequisiteTuple({ course: prerequisite, canTakeConcurrently: false }),
      ),
    );
  }

  if (Model.isCoursePrerequisite(prerequisite)) {
    const [subjectCode, courseNumber, previousOrConcurrent] = prerequisite;
    const course = catalog.getCourse(subjectCode, courseNumber);
    const canTakeConcurrently = previousOrConcurrent === 'CONCURRENT';

    if (!course) {
      const courseAsString = `${subjectCode} ${courseNumber}`.toUpperCase();
      return Immutable.Set<Immutable.Set<PrerequisiteTuple>>().add(
        Immutable.Set<PrerequisiteTuple>().add(
          new PrerequisiteTuple({
            course: courseAsString,
            canTakeConcurrently,
          }),
        ),
      );
    }

    return Immutable.Set<Immutable.Set<PrerequisiteTuple>>().add(
      Immutable.Set<PrerequisiteTuple>().add(
        new PrerequisiteTuple({
          course,
          canTakeConcurrently,
        }),
      ),
    );
  }

  if (Model.isAndPrerequisite(prerequisite)) {
    return allCombinations(
      prerequisite.and.map(subPrerequisite => disjunctiveNormalForm(subPrerequisite, catalog)),
    );
  }

  if (Model.isOrPrerequisite(prerequisite)) {
    return prerequisite.or
      .map(subPrerequisite => disjunctiveNormalForm(subPrerequisite, catalog))
      .reduce((combinedSetsOfSets, disjunct) =>
        disjunct.reduce((combined, set) => combined.add(set), combinedSetsOfSets),
      );
  }

  throw new Error('Unmet case when calculating disjunctive normal form.');
}

export class Course
  extends Record.define(
    {
      _id: ObjectId(),
      name: '',
      subjectCode: '',
      courseNumber: '',
      description: undefined as string | undefined | null,
      creditHours: undefined as [number, number] | number | undefined | null,
      restrictions: undefined as string[] | undefined | null,
      prerequisites: undefined as Model.Prerequisite | undefined,
      corequisites: undefined as Model.Corequisite[] | undefined,
      crossList: undefined as Array<[string, string]> | undefined,
      lastUpdateDate: 0,
      lastTermCode: '',
      fallSections: Record.SetOf(Section),
      winterSections: Record.SetOf(Section),
      summerSections: Record.SetOf(Section),
    },
    ['prerequisites', 'corequisites', 'crossList', 'creditHours'],
  )
  implements Model.Course {
  get root(): App {
    return pointer.store.current();
  }

  get id() {
    return this._id.toHexString();
  }
  get catalogId() {
    return `${this.subjectCode}__|__${this.courseNumber}`.toUpperCase();
  }
  get simpleName() {
    return `${this.subjectCode} ${this.courseNumber}`;
  }

  get creditHoursFullString() {
    if (!this.creditHours) return '';
    if (Array.isArray(this.creditHours))
      return `${this.creditHours[0]} - ${this.creditHours[1]} credit hours`;
    if (this.creditHours === 1) return '1 credit hour';
    return `${this.creditHours} credit hours`;
  }

  get creditHoursString() {
    if (!this.creditHours) return 'NA';
    if (Array.isArray(this.creditHours)) return `${this.creditHours[0]} - ${this.creditHours[1]}`;
    return this.creditHours.toString();
  }

  get prerequisitesConsideringOverrides() {
    const userOverride = this.root.user.userPrerequisiteOverrides[this.catalogId];
    if (userOverride) return userOverride;
    return this.prerequisites;
  }

  get prerequisiteOverrideType() {
    const userOverride = this.root.user.userPrerequisiteOverrides[this.catalogId];
    if (userOverride) return 'USER_OVERRIDE';
    return undefined;
  }

  static optionsMemo = new Map<any, any>();
  static bestOptionMemo = new Map<any, any>();
  static bestOptionWithPrerequisitesMemo = new Map<any, any>();
  static intersectionMemo = new Map<any, any>();
  static depthMemo = new Map<any, any>();
  static minDepthMemo = new Map<any, any>();
  static levelsMemo = new Map<any, any>();
  static closureMemo = new Map<any, any>();
  static fullClosureMemo = new Map<any, any>();
  static criticalMemo = new Map<any, any>();
  static priorityMemo = new Map<any, any>();
  static prerequisitesSatisfiedMemo = new Map<any, any>();
  static taughtByMemo = new Map<any, any>();
  static prerequisitesContainsConcurrentMemo = new Map<any, any>();

  static clearMemos() {
    this.optionsMemo.clear();
    this.bestOptionMemo.clear();
    this.bestOptionWithPrerequisitesMemo.clear();
    this.intersectionMemo.clear();
    this.depthMemo.clear();
    this.minDepthMemo.clear();
    this.levelsMemo.clear();
    this.closureMemo.clear();
    this.fullClosureMemo.clear();
    this.criticalMemo.clear();
    this.priorityMemo.clear();
    this.prerequisitesSatisfiedMemo.clear();
    this.taughtByMemo.clear();
    this.prerequisitesContainsConcurrentMemo.clear();
  }

  historicallyTaughtBy(): string[] {
    if (Course.taughtByMemo.has(this)) {
      return Course.taughtByMemo.get(this);
    }
    const summerProfessors = flatten(
      this.summerSections
        .valueSeq()
        .map(section => section.instructors)
        .toArray(),
    );

    const winterProfessors = flatten(
      this.winterSections
        .valueSeq()
        .map(section => section.instructors)
        .toArray(),
    );

    const fallProfessors = flatten(
      this.fallSections
        .valueSeq()
        .map(section => section.instructors)
        .toArray(),
    );

    const professors = Object.keys(
      [...summerProfessors, ...winterProfessors, ...fallProfessors].reduce(
        (acc, professor) => {
          acc[professor] = true;
          return acc;
        },
        {} as { [key: string]: true },
      ),
    );

    Course.taughtByMemo.set(this, professors);
    return professors;
  }

  priority(): number {
    const degree = this.root.user.degree;
    const catalog = this.root.catalog;
    const hash = hashObjects({ degree, catalog, course: this });
    if (Course.priorityMemo.has(hash)) {
      return Course.priorityMemo.get(hash);
    }

    const priority = this.depth() + this.criticalLevel();

    Course.priorityMemo.set(hash, priority);
    return priority;
  }

  criticalLevel(): number {
    const degree = this.root.user.degree;
    const catalog = this.root.catalog;
    const hash = hashObjects({ catalog, degree, course: this });
    if (Course.criticalMemo.has(hash)) {
      return Course.criticalMemo.get(hash);
    }

    const levels = degree.levels();
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
        .some(course => course.bestOption().has(this));

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
  options(): Immutable.Set<Immutable.Set<PrerequisiteTuple>> {
    const catalog = this.root.catalog;
    const hash = hashObjects({ catalog, course: this });
    if (Course.optionsMemo.has(hash)) {
      return Course.optionsMemo.get(hash);
    }
    if (!this.prerequisitesConsideringOverrides)
      return Immutable.Set<Immutable.Set<PrerequisiteTuple>>();
    const disjuncts = disjunctiveNormalForm(this.prerequisitesConsideringOverrides, catalog);
    Course.optionsMemo.set(hash, disjuncts);
    return disjuncts;
  }

  bestOption(): Immutable.Set<string | Course> {
    const bestOptionWithConcurrent = this.bestOptionWithConcurrent();
    const hash = hashObjects({ bestOptionWithConcurrent });
    if (Course.bestOptionMemo.has(hash)) {
      return Course.bestOptionMemo.get(hash);
    }
    const value = this.bestOptionWithConcurrent().map(tuple => tuple.course);
    Course.bestOptionMemo.set(hash, value);
    return value;
  }

  /**
   * given a set of preferred courses, this will return the best option has the most preferred
   * courses
   */
  bestOptionWithConcurrent(): Immutable.Set<PrerequisiteTuple> {
    const catalog = this.root.catalog;
    const preferredCourses = this.root.user.degree.preferredCourses();
    const hash = hashObjects({ catalog, preferredCourses, course: this });
    if (Course.bestOptionWithPrerequisitesMemo.has(hash)) {
      return Course.bestOptionWithPrerequisitesMemo.get(hash);
    }

    if (typeof preferredCourses.intersect !== 'function') {
      throw new Error('nope');
    }

    const options = this.options();
    const bestOptionMapping = options.map(option => {
      /**
       * the intersection of `preferredCourses` and the set of all course in the `prerequisites`
       * of this option. the "best option" is first decided by the option that has the most
       * `preferredCourses` in its closure.
       */
      const intersection = option
        .map(({ course }) => {
          let intersection = Immutable.Set<string | Course>();
          if (preferredCourses.has(course)) {
            intersection = intersection.add(course);
          }
          if (course instanceof Course) {
            intersection = intersection.union(preferredCourses.intersect(course.fullClosure()));
          }
          return intersection;
        })
        .reduce((intersection, set) => {
          return intersection.union(set);
        }, Immutable.Set<string | Course>());
      const intersectionCount = intersection.count();

      const maxDepth = option
        .map(({ course }) => {
          if (typeof course === 'string') {
            return 0;
          }
          return course.minDepth();
        })
        .reduce((max, next) => (/*if*/ next > max ? next : max), 0);

      const closure = option.reduce((fullClosure, { course }) => {
        if (course instanceof Course) {
          return fullClosure.add(course).union(course.closure());
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
      return Immutable.Set<PrerequisiteTuple>();
    }

    const bestOption = bestOptionResult.option;

    Course.bestOptionWithPrerequisitesMemo.set(hash, bestOption);
    return bestOption;
  }

  /**
   * finds the intersection of the given `preferredCourses` and the current course's prerequisite
   * tree.
   */
  intersection(): Immutable.Set<string | Course> {
    const preferredCourses = this.root.user.degree.preferredCourses();
    const catalog = this.root.catalog;
    const hash = hashObjects({ preferredCourses, catalog, course: this });
    if (Course.intersectionMemo.has(hash)) {
      return Course.intersectionMemo.get(hash);
    }

    const options = this.options();
    let foundCourses = Immutable.Set<string | Course>();
    if (preferredCourses.has(this)) {
      foundCourses = foundCourses.add(this);
    }

    for (const option of options) {
      for (const { course } of option) {
        if (preferredCourses.has(course)) {
          foundCourses = foundCourses.add(course);
        }
        if (course instanceof Course) {
          foundCourses = course
            .intersection()
            .reduce((foundCourses, next) => foundCourses.add(next), foundCourses);
        }
      }
    }

    Course.intersectionMemo.set(hash, foundCourses);
    return foundCourses;
  }

  fullClosure(): Immutable.Set<string | Course> {
    const catalog = this.root.catalog;
    const hash = hashObjects({ course: this, catalog });
    if (Course.fullClosureMemo.has(hash)) {
      return Course.fullClosureMemo.get(hash);
    }

    const mutableClosure = new Set<string | Course>();

    const options = this.options();

    for (const option of options) {
      for (const { course } of option) {
        mutableClosure.add(course);
        if (course instanceof Course) {
          const subClosure = course.fullClosure();
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
  depth(): number {
    const catalog = this.root.catalog;
    const preferredCourses = this.root.user.degree.preferredCourses();
    const hash = hashObjects({ catalog, preferredCourses, course: this });
    if (Course.depthMemo.has(hash)) {
      return Course.depthMemo.get(hash);
    }

    const bestOption = this.bestOptionWithConcurrent();

    let maxDepth = 0;
    for (const { course, canTakeConcurrently } of bestOption) {
      if (course instanceof Course) {
        const courseDepth = course.depth() - (canTakeConcurrently ? 1 : 0);
        if (courseDepth > maxDepth) {
          maxDepth = courseDepth;
        }
      }
    }

    const value = maxDepth + 1;
    Course.depthMemo.set(hash, value);
    return value;
  }

  minDepth(): number {
    const catalog = this.root.catalog;
    const hash = hashObjects({ catalog, course: this });
    if (Course.minDepthMemo.has(hash)) {
      return Course.minDepthMemo.get(hash);
    }

    const options = this.options();
    if (options.isEmpty()) {
      Course.minDepthMemo.set(hash, 1);
      return 1;
    }

    let minDepthOfAllOptions = 9999;

    for (const option of options) {
      let maxDepthOfAllCourses = 0;

      for (const { course, canTakeConcurrently } of option) {
        if (course instanceof Course) {
          const courseDepth = course.minDepth() - (canTakeConcurrently ? 1 : 0);
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

  closure(): Immutable.Set<string | Course> {
    const catalog = this.root.catalog;
    const preferredCourses = this.root.user.degree.preferredCourses();
    const hash = hashObjects({ course: this, catalog, preferredCourses });
    if (Course.closureMemo.has(hash)) {
      return Course.closureMemo.get(hash);
    }

    let coursesInClosure = Immutable.Set<string | Course>();
    coursesInClosure = coursesInClosure.add(this);

    const bestOption = this.bestOption();
    for (const course of bestOption) {
      coursesInClosure = coursesInClosure.add(course);
      if (course instanceof Course) {
        coursesInClosure = coursesInClosure.union(course.closure());

        // if (course.corequisites) {
        //   coursesInClosure = course.corequisites.reduce((coursesInClosure, corequisite) => {
        //     const [subjectCode, courseNumber] = corequisite;
        //     const corequisiteCourse = catalog.getCourse(subjectCode, courseNumber);
        //     if (!corequisiteCourse) return coursesInClosure.add(`${subjectCode} ${courseNumber}`);
        //     return coursesInClosure.add(corequisiteCourse);
        //   }, coursesInClosure);
        // }
      }
    }

    Course.closureMemo.set(hash, coursesInClosure);
    return coursesInClosure;
  }

  prerequisitesContainConcurrent(): boolean {
    if (!this.prerequisitesConsideringOverrides) return false;

    if (Course.prerequisitesContainsConcurrentMemo.has(this)) {
      return Course.prerequisitesContainsConcurrentMemo.get(this);
    }

    const value = this._prerequisitesContainConcurrent(this.prerequisitesConsideringOverrides);
    Course.prerequisitesContainsConcurrentMemo.set(this, value);
    return value;
  }

  _prerequisitesContainConcurrent(prerequisite: Model.Prerequisite) {
    if (Model.isStringPrerequisite(prerequisite)) return false;
    if (Model.isCoursePrerequisite(prerequisite)) {
      if (prerequisite[2] === 'CONCURRENT') return true;
    }
    const operands = Model.isAndPrerequisite(prerequisite)
      ? prerequisite.and
      : Model.isOrPrerequisite(prerequisite)
        ? prerequisite.or
        : [];

    if (operands.some(operand => this._prerequisitesContainConcurrent(operand))) {
      return true;
    }

    return false;
  }

  prerequisitesSatisfied(previousCourses: Immutable.Set<string | Course>): boolean {
    const catalog = this.root.catalog;
    const hash = hashObjects({ catalog, previousCourses, course: this });
    if (Course.prerequisitesSatisfiedMemo.has(hash)) {
      return Course.prerequisitesSatisfiedMemo.get(hash);
    }
    const value = this._prerequisitesSatisfied(previousCourses);
    Course.prerequisitesSatisfiedMemo.set(hash, value);
    return value;
  }

  private _prerequisitesSatisfied(previousCourses: Immutable.Set<string | Course>): boolean {
    const options = this.options();
    if (options.isEmpty()) return true;
    for (const option of options) {
      if (option.every(({ course }) => previousCourses.has(course))) {
        return true;
      }
    }
    return false;
  }
}
