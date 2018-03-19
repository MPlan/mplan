import * as Record from 'recordize';
import * as Model from './models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';
import { ObjectID as _ObjectId } from 'bson';
import { oneLine } from 'common-tags';
import { flatten } from '../utilities/utilities';

export function ObjectId(id?: string | number | _ObjectId) {
  return (_ObjectId as any)(id) as _ObjectId;
}

export function convertCatalogJsonToRecord(courses: Model.Catalog) {
  const courseMap = Object.entries(courses).reduce(
    (catalogRecord, [courseCode, course]) => {
      const { _id, sections: rawSections, ...restOfCourse } = course;

      const sections = Object.entries(rawSections).reduce(
        (sections, [_season, sectionList]) => {
          const season = _season as 'Fall' | 'Winter' | 'Summer';
          const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
            const section = new Section({ ...rawSection });
            return sectionSet.add(section);
          }, Immutable.Set<Section>());

          return sections.set(season, sectionSet);
        },
        Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Section>>()
      );

      const courseRecord = new Course({
        ...restOfCourse,
        _id: ObjectId(course._id),
        sections
      });
      return catalogRecord.set(courseCode, courseRecord);
    },
    Immutable.Map<string, Course>()
  );

  const catalog = new Catalog({ courseMap });
  return catalog;
}

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
    remaining: 0
  })
  implements Model.Section {
  get id() {
    return this._id.toHexString();
  }
}

export function allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<string | Course>>>
) {
  return _allCombinations(listsOfLists)[0];
}

function _allCombinations(
  listsOfLists: Array<Immutable.Set<Immutable.Set<string | Course>>>
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
  catalog: Catalog
): Immutable.Set<Immutable.Set<string | Course>> {
  if (!prerequisite) {
    return Immutable.Set<Immutable.Set<string | Course>>();
  }
  if (typeof prerequisite === 'string') {
    return Immutable.Set<Immutable.Set<string | Course>>().add(
      Immutable.Set<string | Course>().add(prerequisite)
    );
  }
  if (Array.isArray(prerequisite)) {
    const subjectCode = prerequisite[0];
    const courseNumber = prerequisite[1];
    const course =
      catalog.getCourse(subjectCode, courseNumber) ||
      `${subjectCode} ${courseNumber}`.toUpperCase();

    return Immutable.Set<Immutable.Set<string | Course>>().add(
      Immutable.Set<string | Course>().add(course)
    );
  }
  if (typeof prerequisite === 'object') {
    if (prerequisite.g === '&') {
      const operandsPrerequisites = prerequisite.o.map(operand =>
        flattenPrerequisites(operand, catalog)
      );
      return allCombinations(operandsPrerequisites);
    } else if (prerequisite.g === '|') {
      const operandSetsFlattened = prerequisite.o
        .map(operand => flattenPrerequisites(operand, catalog))
        .reduce(
          (combinedSetOfSets, flattenedOperand) =>
            flattenedOperand.reduce(
              (combinedSet, set) => combinedSet.add(set),
              combinedSetOfSets
            ),
          Immutable.Set<Immutable.Set<string | Course>>()
        );
      return operandSetsFlattened;
    }
  }

  throw new Error(
    `Could not flatten prerequisite because its type could not be matched.`
  );
}

function hashObjects(objects: { [key: string]: any }) {
  return Immutable.Map(objects).hashCode();
}

export class Course
  extends Record.define({
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
    sections: Immutable.Map<string, Immutable.Set<Section>>()
  })
  implements Model.Course {
  get id() {
    return this._id.toHexString();
  }
  get simpleName() {
    return `${this.subjectCode} ${this.courseNumber}`;
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

  priority(user: User, catalog: Catalog): number {
    const hash = hashObjects({ user, catalog, course: this });
    if (Course.priorityMemo.has(hash)) {
      return Course.priorityMemo.get(hash);
    }

    const priority =
      this.depth(catalog, user.preferredCourses) +
      this.criticalLevel(user, catalog);

    Course.priorityMemo.set(hash, priority);
    return priority;
  }

  criticalLevel(user: User, catalog: Catalog): number {
    const hash = hashObjects({ catalog, user, course: this });
    if (Course.criticalMemo.has(hash)) {
      return Course.criticalMemo.get(hash);
    }

    const levels = user.levels(catalog);
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
        .some(course =>
          course.bestOption(catalog, user.preferredCourses).has(this)
        );

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
    preferredCourses: Immutable.Set<string | Course>
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
              preferredCourses.intersect(course.fullClosure(catalog))
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
          return fullClosure
            .add(course)
            .union(course.closure(catalog, preferredCourses));
        }
        return fullClosure.add(course);
      }, Immutable.Set<string | Course>());
      const closureCount = closure.count();
      return { maxDepth, intersectionCount, option, closureCount };
    });

    const bestOptionResult = bestOptionMapping.maxBy(
      ({ maxDepth, intersectionCount, closureCount }) => {
        return intersectionCount * 100000 - maxDepth * 1000 - closureCount;
      }
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
    catalog: Catalog
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
            .reduce(
              (foundCourses, next) => foundCourses.add(next),
              foundCourses
            );
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
  depth(
    catalog: Catalog,
    preferredCourses: Immutable.Set<string | Course>
  ): number {
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
    preferredCourses: Immutable.Set<string | Course>
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
        coursesInClosure = coursesInClosure.union(
          course.closure(catalog, preferredCourses)
        );
      }
    }

    Course.closureMemo.set(hash, coursesInClosure);
    return coursesInClosure;
  }
}

export class Semester extends Record.define({
  _id: ObjectId(),
  courseSet: Immutable.Set<Course>(),
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
  year: 0
}) {
  get id() {
    return this._id.toHexString();
  }

  get position() {
    const seasonNumber =
      /*if*/ this.season === 'Winter'
        ? 0
        : /*if*/ this.season === 'Summer' ? 1 / 3 : 2 / 3;
    return seasonNumber + this.year;
  }

  get name() {
    return `${this.season} ${this.year}`;
  }

  get courseCount() {
    return this.getOrCalculate('courseCount', () => {
      return this.courseSet.count();
    });
  }

  get courses() {
    return this.getOrCalculate('courses', () => {
      return this.courseSet.toArray();
    });
  }

  addCourse(course: Course) {
    this.update('courseSet', courseSet => courseSet.add(course));
  }

  private _previousSemesterSeason() {
    if (this.season === 'Winter') {
      return 'Fall';
    }
    if (this.season === 'Fall') {
      return 'Summer';
    }
    if (this.season === 'Summer') {
      return 'Winter';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _previousSemesterYear() {
    if (this.season === 'Winter') {
      return this.year - 1;
    }
    return this.year;
  }

  private _nextSemesterSeason() {
    if (this.season === 'Winter') {
      return 'Summer';
    }
    if (this.season === 'Fall') {
      return 'Winter';
    }
    if (this.season === 'Summer') {
      return 'Fall';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _nextSemesterYear() {
    if (this.season === 'Fall') {
      return this.year + 1;
    }
    return this.year;
  }

  previousSemester(): { season: 'Fall' | 'Winter' | 'Summer'; year: number } {
    const season = this._previousSemesterSeason();
    const year = this._previousSemesterYear();
    return { season, year };
  }

  nextSemester(): { season: 'Fall' | 'Winter' | 'Summer'; year: number } {
    const season = this._nextSemesterSeason();
    const year = this._nextSemesterYear();
    return { season, year };
  }

  warningsNeverRanDuringCurrentSeason(catalog: Catalog) {
    return this.getOrCalculate(
      'warningsNeverRanDuringCurrentSeason',
      [catalog, this],
      () => {
        const warnings = this.courseSet
          .valueSeq()
          .map(course => {
            const sectionSet = course.sections.get(this.season);
            const hasNeverRan = oneLine`
          ${course.subjectCode} ${course.courseNumber} has never ran in the ${
              this.season
            } past
          three years. Check with your advisor to see if this course will run in the future.
        `;
            if (!sectionSet) {
              return hasNeverRan;
            }

            const sortedSections = sectionSet
              .sortBy(section => parseInt(section.termCode))
              .toArray();

            for (let i = 0; i < sortedSections.length - 1; i += 1) {
              const currentSection = sortedSections[i];
              const nextSection = sortedSections[i + 1];

              const currentSectionYearCode = parseInt(
                currentSection.termCode.substring(0, 4)
              );
              const nextSectionYearCode = parseInt(
                nextSection.termCode.substring(0, 4)
              );

              if (Math.abs(currentSectionYearCode - nextSectionYearCode) > 1) {
                return oneLine`
              ${course.subjectCode} ${
                  course.courseNumber
                } has previously ran in the ${this.season}
              but there was a gap of offerings between ${currentSectionYearCode} and
              ${nextSectionYearCode}.
            `;
              }
            }
          })
          .filter(x => !!x)
          .toArray() as string[];
        return warnings;
      }
    );
  }
}

export class Catalog extends Record.define({
  courseMap: Immutable.Map<string, Course>()
}) {
  getCourse(subjectCode: string, courseNumber: string) {
    return this.courseMap.get(
      `${subjectCode}__|__${courseNumber}`.toUpperCase()
    );
  }

  get courses() {
    return this.getOrCalculate('courses', [this.coursesSorted], () => {
      return this.coursesSorted.toArray();
    });
  }

  get coursesSorted() {
    return this.getOrCalculate('coursesSorted', [this.courseMap], () => {
      return this.courseMap
        .valueSeq()
        .sortBy(
          course =>
            `${course.subjectCode} ${course.courseNumber} ${course.name}`
        );
    });
  }
}

export class User extends Record.define({
  _id: ObjectId(),
  username: '',
  name: '',
  picture: '',
  registerDate: 0,
  lastLoginDate: 0,
  boxMap: Immutable.Map<string, Course>(),
  semesters: Immutable.Set<Semester>(),
  degree: Immutable.Set<string | Course>(),
  additionalCourses: Immutable.Set<string | Course>()
}) {
  static preferredCoursesMemo = new Map<any, any>();
  static closureMemo = new Map<any, any>();
  static levelsMemo = new Map<any, any>();

  addToDegree(course: Course) {
    return this.update('degree', degree => degree.add(course));
  }

  addToAdditionalCourses(course: Course) {
    return this.update('additionalCourses', additionalCourses =>
      additionalCourses.add(course)
    );
  }

  removeCourseFromBox(course: Course) {
    return this.update('boxMap', boxMap => boxMap.remove(course.id));
  }

  get box() {
    return this.getOrCalculate('box', [this.boxMap], () => {
      return this.boxMap.valueSeq().toArray();
    });
  }

  // get semestersSorted() {
  //   return this.semesterSet.valueSeq().sortBy(semester => semester.position);
  // }

  // get semesters() {
  //   return this.getOrCalculate('semesters', [this.semestersSorted], () => {
  //     return this.semestersSorted.toArray();
  //   });
  // }

  selectedCourse(selectedCourseId: string, catalog: Catalog) {
    return catalog.courseMap.get(selectedCourseId);
  }

  addToBox(course: Course) {
    return this.update('boxMap', boxMap => boxMap.set(course.id, course));
  }

  get preferredCourses() {
    const hash = hashObjects({
      degree: this.degree,
      additionalCourses: this.additionalCourses
    });
    if (User.preferredCoursesMemo.has(hash)) {
      return User.preferredCoursesMemo.get(hash) as Immutable.Set<
        string | Course
      >;
    }

    const combined = this.degree.union(this.additionalCourses);
    User.preferredCoursesMemo.set(hash, combined);
    return combined;
  }

  closure(catalog: Catalog) {
    const hash = hashObjects({ catalog, user: this });
    if (User.closureMemo.has(hash)) {
      return User.closureMemo.get(hash);
    }

    const closure = this.degree
      .map(
        course =>
          /*if*/ course instanceof Course
            ? course.closure(catalog, this.preferredCourses)
            : Immutable.Set<string | Course>().add(course)
      )
      .reduce(
        (closure, courseClosure) => closure.union(courseClosure),
        Immutable.Set<string | Course>()
      );

    User.closureMemo.set(hash, closure);
    return closure;
  }

  levels(catalog: Catalog): Immutable.List<Immutable.Set<string | Course>> {
    const hash = hashObjects({ course: this, catalog });
    if (Course.levelsMemo.has(hash)) {
      return Course.levelsMemo.get(hash);
    }

    const closure = this.closure(catalog);
    const levelsMutable = [] as Array<Set<string | Course>>;

    for (const course of closure) {
      if (course instanceof Course) {
        const depth = course.depth(catalog, this.preferredCourses);
        const set = levelsMutable[depth] || new Set<string | Course>();
        set.add(course);
        levelsMutable[depth] = set;
      }
    }

    const levels = levelsMutable.reduce(
      (levelsImmutable, mutableLevel) =>
        levelsImmutable.push(Immutable.Set<string | Course>(mutableLevel)),
      Immutable.List<Immutable.Set<string | Course>>()
    );

    Course.levelsMemo.set(hash, levels);
    return levels;
  }

  assignCoursesToSemesters(
    catalog: Catalog
  ): Immutable.List<Immutable.Set<string | Course>> {
    const coursesSorted = this.degree
      .sort(
        course =>
          course instanceof Course ? course.priority(this, catalog) : 99999
      )
      .toArray();

    let semesters = Immutable.List<Immutable.Set<string | Course>>();
    let currentSemester = Immutable.Set<string | Course>();

    for (const course of coursesSorted) {
      if (currentSemester.count() >= 4) {
        semesters = semesters.push(currentSemester);
        currentSemester = Immutable.Set<string | Course>();
      }
      currentSemester = currentSemester.add(course);
    }

    return semesters;
  }
}

export class Ui extends Record.define({
  dragging: false,
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
  mouseIsOverSemester: false,
  lastMouseOverSemester: undefined as Semester | undefined,
  selectedCourse: undefined as Course | undefined,
  search: '',
  currentPageIndex: 0
}) {
  setSearch(newSearch: string) {
    return this.set('search', newSearch);
  }
}

export class App extends Record.define({
  catalog: new Catalog(),
  user: new User(),
  ui: new Ui()
}) {
  updateUi(updater: (ui: Ui) => Ui) {
    return this.update('ui', updater);
  }

  get levels() {
    return this.getOrCalculate('levels', () => {
      return this.user
        .levels(this.catalog)
        .map(level => level.toArray())
        .toArray();
    });
  }
}
