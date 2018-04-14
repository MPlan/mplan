import * as Record from '../recordize';
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
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseCode, course]) => {
    const { _id, sections: rawSections, ...restOfCourse } = course;

    const sections = Object.entries(rawSections).reduce((sections, [_season, sectionList]) => {
      const season = _season as 'Fall' | 'Winter' | 'Summer';
      const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
        const section = new Section({ ...rawSection });
        return sectionSet.add(section);
      }, Immutable.Set<Section>());

      return sections.set(season, sectionSet);
    }, Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Section>>());

    const courseRecord = new Course({
      ...restOfCourse,
      _id: ObjectId(course._id),
      fallSections: sections.get('Fall') || Immutable.Set<Section>(),
      winterSections: sections.get('Winter') || Immutable.Set<Section>(),
      summerSections: sections.get('Summer') || Immutable.Set<Section>(),
    });
    return catalogRecord.set(courseCode, courseRecord);
  }, Immutable.Map<string, Course>());

  const catalog = new Catalog({ courseMap });
  return catalog;
}

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

export function hashObjects(objects: { [key: string]: any }) {
  return Immutable.Map(objects).hashCode();
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
    remaining: 0,
  })
  implements Model.Section {
  get id() {
    return this._id.toHexString();
  }
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
      this.depth(catalog, degree.preferredCourses(catalog)) + this.criticalLevel(degree, catalog);

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
        .some(course => course.bestOption(catalog, degree.preferredCourses(catalog)).has(this));

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

export class Semester extends Record.define({
  _id: ObjectId(),
  /** these are in the form `__subjectCode|courseNumber__` */
  _courseIds: Immutable.List<string>(),
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
  year: 0,
}) {
  get id() {
    return this._id.toHexString();
  }

  get position() {
    const seasonNumber =
      /*if*/ this.season === 'Winter' ? 0 : /*if*/ this.season === 'Summer' ? 1 / 3 : 2 / 3;
    return seasonNumber + this.year;
  }

  get name() {
    return `${this.season} ${this.year}`;
  }

  get shortName() {
    return `${this.season.substring(0, 1)}${this.year}`;
  }

  get courseCount() {
    return this.getOrCalculate('courseCount', () => {
      return this._courseIds.count();
    });
  }

  totalCredits(catalog: Catalog) {
    return this.courses(catalog)
      .map(course => course.credits || 0)
      .reduce((sum, next) => sum + next, 0);
  }

  courses(catalog: Catalog) {
    return this.getOrCalculate('courses', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!);
    });
  }

  courseArray(catalog: Catalog) {
    return this.getOrCalculate('courseArray', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!).toArray();
    });
  }

  addCourse(course: Course) {
    return this.update('_courseIds', courseIds => courseIds.push(course.catalogId));
  }

  deleteCourse(courseToDelete: Course) {
    return this.update('_courseIds', courseIds => {
      return courseIds.filter(courseId => courseToDelete.catalogId !== courseId);
    });
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
}

export class Catalog extends Record.define({
  courseMap: Record.MapOf(Course),
}) {
  getCourse(subjectCode: string, courseNumber: string) {
    return this.courseMap.get(`${subjectCode}__|__${courseNumber}`.toUpperCase());
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
        .sortBy(course => `${course.subjectCode} ${course.courseNumber} ${course.name}`);
    });
  }

  search(query: string): Immutable.Seq.Indexed<Course> {
    if (query === '') return Immutable.Seq.Indexed();
    const querySplit = query.toLowerCase().split(' ');
    const results = this.courseMap
      .valueSeq()
      .sortBy(course => {
        const rank = querySplit
          .map(part => {
            if (course.subjectCode.toLowerCase().includes(part)) return 3;
            if (course.courseNumber.toLowerCase().includes(part)) return 3;
            if (course.name.toLowerCase().includes(part)) return 2;
            if (course.description && course.description.toLowerCase().includes(part)) return 1;
            return 0;
          })
          .reduce((sum, next) => sum + next, 0 as number);
        return rank;
      })
      .reverse();
    return results;
  }
}

export class DegreeGroup extends Record.define({
  _id: ObjectId(),
  name: '',
  description: '',
  /** this can be either `__subjectCode|courseNumber__` or a string for placement exams */
  _courseIds: Immutable.List<string>(),
}) {
  get id() {
    return this._id.toHexString();
  }
  addCourse(course: string | Course) {
    if (this._courseIds.contains(course instanceof Course ? course.catalogId : course)) return this;
    return this.update('_courseIds', courseIds =>
      courseIds.push(course instanceof Course ? course.catalogId : course),
    );
  }

  deleteCourse(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('_courseIds', courseIds =>
      courseIds.filter(courseId => courseId !== idToDelete),
    );
  }

  courses(catalog: Catalog) {
    return this.getOrCalculate('courses', [catalog, this], () => {
      return this._courseIds.map(id => catalog.courseMap.get(id) || id);
    });
  }
}

export function printSchedule(schedule: Immutable.List<Immutable.Set<Course>>) {
  const totalCourses = schedule.reduce((total, semester) => total + semester.count(), 0);
  console.log('semesters:', schedule.count(), 'course count:', totalCourses);

  const prettySchedule = schedule
    .map(semester =>
      semester
        .map(
          course =>
            /*if*/ course instanceof Course
              ? `${course.simpleName} (${course.credits || course.creditHours || 0})`
              : course,
        )
        .join(', '),
    )
    .join('\n');

  console.log(prettySchedule);
  console.log('-------');
}

export function generatePlans(degree: Degree, catalog: Catalog) {
  // === DEFINE CONSTANTS ===
  const creditHourCap = 14;
  const semesterCap = 15;

  // === DEFINE STATE VARIABLES ===
  let currentSchedule = Immutable.List<Immutable.Set<Course>>();
  let currentSemester = Immutable.Set<Course>();
  let processedCourses = Immutable.Set<string | Course>();
  let unplacedCourses = Immutable.Set<Course>();
  let scheduleCount = 0;

  // === INITIALIZE WITH INITIAL STATE ===
  const closure = degree.closure(catalog);
  processedCourses = closure.filter(prerequisite => typeof prerequisite === 'string');
  unplacedCourses = closure
    .filter(prerequisite => prerequisite instanceof Course)
    .map(c => c as Course);

  /**
   * returns whether a course can be placed in a semester
   */
  function canPlace(course: Course, semester: Immutable.Set<Course>) {
    const totalCredits = semester.reduce(
      (sum, course) => sum + (course.credits || course.creditHours || 0),
      0,
    );
    const newCourseCredits = course.credits || course.creditHours || 0;

    if (totalCredits + newCourseCredits > creditHourCap) return false;
    if (!course.prerequisitesSatisfied(catalog, processedCourses)) return false;
    return true;
  }

  /**
   * the recursive backtracking function
   */
  function _generatePlan(): boolean {
    const unplacedCount = unplacedCourses.count();
    if (unplacedCount <= 0) {
      scheduleCount += 1;
      currentSchedule = currentSchedule.push(currentSemester);
      return true;
    }

    const unplacedCoursesSorted = unplacedCourses.toList().sortBy(c => c.priority(degree, catalog));
    for (let i = 0; i < unplacedCount; i += 1) {
      const course = unplacedCoursesSorted.get(i)!;
      if (canPlace(course, currentSemester)) {
        currentSemester = currentSemester.add(course);
        unplacedCourses = unplacedCourses.remove(course);

        if (_generatePlan()) return true;
      }
    }

    if (currentSchedule.count() < semesterCap) {
      const oldSemester = currentSemester;
      processedCourses = processedCourses.union(oldSemester);
      currentSchedule = currentSchedule.push(oldSemester);
      currentSemester = Immutable.Set<Course>();

      if (_generatePlan()) return true;
    }

    return false;
  }

  _generatePlan();

  return currentSchedule;
}

export class Degree extends Record.define({
  degreeGroups: Record.ListOf(DegreeGroup),
}) {
  static preferredCoursesMemo = new Map<any, any>();
  static closureMemo = new Map<any, any>();
  static levelsMemo = new Map<any, any>();

  preferredCourses(catalog: Catalog) {
    const hash = hashObjects({
      degree: this,
      catalog,
    });
    if (Degree.preferredCoursesMemo.has(hash)) {
      return Degree.preferredCoursesMemo.get(hash) as Immutable.Set<string | Course>;
    }

    const combined = this.degreeGroups.reduce(
      (combined, group) => combined.union(group.courses(catalog)),
      Immutable.Set<string | Course>(),
    );
    Degree.preferredCoursesMemo.set(hash, combined);
    return combined;
  }

  closure(catalog: Catalog): Immutable.Set<string | Course> {
    const hash = hashObjects({ catalog, degree: this });
    if (Degree.closureMemo.has(hash)) {
      return Degree.closureMemo.get(hash);
    }

    const preferredCourses = this.preferredCourses(catalog);

    const closure = preferredCourses
      .map(
        course =>
          /*if*/ course instanceof Course
            ? course.closure(catalog, preferredCourses)
            : Immutable.Set<string | Course>().add(course),
      )
      .reduce(
        (closure, courseClosure) => closure.union(courseClosure),
        Immutable.Set<string | Course>(),
      );

    Degree.closureMemo.set(hash, closure);
    return closure;
  }

  levels(catalog: Catalog): Immutable.List<Immutable.Set<string | Course>> {
    const hash = hashObjects({ degree: this, catalog });
    if (Degree.levelsMemo.has(hash)) {
      return Degree.levelsMemo.get(hash);
    }

    const closure = this.closure(catalog);
    const levelsMutable = [] as Array<Set<string | Course>>;
    const preferredCourses = this.preferredCourses(catalog);

    for (const course of closure) {
      if (course instanceof Course) {
        const depth = course.depth(catalog, preferredCourses);
        const set = levelsMutable[depth] || new Set<string | Course>();
        set.add(course);
        levelsMutable[depth] = set;
      }
    }

    const levels = levelsMutable.reduce(
      (levelsImmutable, mutableLevel) =>
        levelsImmutable.push(Immutable.Set<string | Course>(mutableLevel)),
      Immutable.List<Immutable.Set<string | Course>>(),
    );

    Degree.levelsMemo.set(hash, levels);
    return levels;
  }

  totalCredits(catalog: Catalog): number {
    return this.getOrCalculate('totalCredits', [catalog, this], () => {
      return this.degreeGroups.reduce(
        (totalCredits, group) =>
          totalCredits +
          group
            .courses(catalog)
            .reduce(
              (totalCredits, course) =>
                totalCredits +
                (course instanceof Course ? course.credits || course.creditHours || 0 : 0),
              0,
            ),
        0,
      );
    });
  }

  completedCredits(catalog: Catalog): number {
    return 0;
  }

  percentComplete(catalog: Catalog) {
    return this.completedCredits(catalog) / this.totalCredits(catalog);
  }

  generatePlan(catalog: Catalog) {
    const plan = generatePlans(this, catalog);
    const semesterMap = plan
      .map(
        (set, i) =>
          new Semester({
            _id: ObjectId(),
            season: ['Winter', 'Summer', 'Fall'][i % 3] as any,
            year: Math.floor(i / 3) + 2018,
            _courseIds: set.map(course => course.catalogId).toList(),
          }),
      )
      .reduce((semesterMap, semester) => {
        return semesterMap.set(semester.id, semester);
      }, Immutable.Map<string, Semester>());

    return new Plan({
      semesterMap,
    });
  }

  addDegreeGroup(group: DegreeGroup) {
    return this.update('degreeGroups', groups => groups.push(group));
  }

  deleteDegreeGroup(group: DegreeGroup) {
    return this.update('degreeGroups', groups => groups.filter(g => g !== group));
  }

  updateDegreeGroup(group: DegreeGroup, update: (group: DegreeGroup) => DegreeGroup) {
    return this.update('degreeGroups', groups => {
      const index = groups.findIndex(g => g === group);
      return groups.update(index, update);
    });
  }
}

export class Plan extends Record.define({
  semesterMap: Record.MapOf(Semester),
}) {
  static unplacedCoursesMemo = new Map<any, any>();
  updateSemester(id: string, updater: (semester: Semester) => Semester) {
    return this.update('semesterMap', map => map.update(id, updater));
  }

  lastSemester() {
    return this.semesterMap
      .valueSeq()
      .sortBy(semester => semester.position)
      .reverse()
      .first();
  }

  createNewSemester() {
    const lastSemester = this.lastSemester();
    if (!lastSemester) {
      return this;
    }
    const nextSemester = lastSemester.nextSemester();
    const newSemester = new Semester({
      _id: ObjectId(),
      year: nextSemester.year,
      season: nextSemester.season,
    });
    return this.update('semesterMap', map => map.set(newSemester.id, newSemester));
  }

  unplacedCourses(degree: Degree, catalog: Catalog): Course[] {
    ``;
    const hash = hashObjects({ plan: this, degree, catalog });
    if (Plan.unplacedCoursesMemo.has(hash)) {
      return Plan.unplacedCoursesMemo.get(hash);
    }

    const closure = degree
      .closure(catalog)
      .filter(course => course instanceof Course) as Immutable.Set<Course>;
    const coursesInPlan = this.semesterMap
      .map(semester => semester.courses(catalog))
      .reduce((coursesInPlan, courses) => coursesInPlan.union(courses), Immutable.Set<Course>());

    const unplacedCourses = closure
      .subtract(coursesInPlan)
      .sortBy(c => c.priority(degree, catalog))
      .toArray();
    Plan.unplacedCoursesMemo.set(hash, unplacedCourses);
    return unplacedCourses;
  }

  // TODO:
  // validate() {
    
  // }
}

export class User extends Record.define({
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
}) implements Model.User {
  updateDegree(updater: (degree: Degree) => Degree) {
    return this.update('degree', updater);
  }

  updatePlan(updater: (plan: Plan) => Plan) {
    return this.update('plan', updater);
  }

  // TODO
  validate() {
    const validationErrors = [] as string[];
    // if (!this.username) validationErrors.push('User name was falsy');
    // if (!this.name) validationErrors.push('Name was falsy');
    // if (!this.registerDate) validationErrors.push('Register date was falsy');
    // if (!this.lastLoginDate) validationErrors.push('lastLoginDate was falsy');
    
  }
}

export class Draggables extends Record.define({
  selectedDraggableId: '',
  selectedElementId: '',
  selectedDropzoneId: '',
  startingDropzoneId: '',
  startingIndex: 0,
  aboveMidpoint: false,
  dragging: false,
  height: 0,
  closestElementId: '',
}) {}

export class Ui extends Record.define({
  draggables: new Draggables(),
  showToolbox: true,
}) {}

export class App extends Record.define({
  catalog: new Catalog(),
  user: new User(),
  ui: new Ui(),
}) {
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
}
