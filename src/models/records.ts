import * as Record from 'recordize';
import * as Model from './models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';
import { ObjectID as _ObjectId } from 'bson';
import { oneLine } from 'common-tags';
import { flatten } from '../utilities/utilities';
import { zip } from 'lodash';

export function convertCatalogJsonToRecord(courses: Model.Catalog) {
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseCode, course]) => {
    const { _id, sections: rawSections, ...restOfCourse } = course;

    const sections = (Object
      .entries(rawSections)
      .reduce((sections, [_season, sectionList]) => {
        const season = _season as 'Fall' | 'Winter' | 'Summer';
        const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
          const section = new Section({ ...rawSection });
          return sectionSet.add(section);
        }, Immutable.Set<Section>());

        return sections.set(season, sectionSet);
      }, Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Section>>())
    );

    const courseRecord = new Course({
      ...restOfCourse,
      _id: ObjectId(course._id),
      sections,
    });
    return catalogRecord.set(courseCode, courseRecord);
  }, Immutable.Map<string, Course>());

  const catalog = new Catalog({ courseMap });
  return catalog;
}

export function ObjectId(id?: string | number | _ObjectId) {
  return (_ObjectId as any)(id) as _ObjectId;
}

export class Section extends Record.define({
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
}) implements Model.Section {
  get id() { return this._id.toHexString(); }
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
      combined = combined.add(a.union(b))
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
    return Immutable.Set<Immutable.Set<string | Course>>()
      .add(Immutable.Set<string | Course>().add(prerequisite));
  }
  if (Array.isArray(prerequisite)) {
    const subjectCode = prerequisite[0];
    const courseNumber = prerequisite[1];
    const course = catalog.getCourse(
      subjectCode, courseNumber
    ) || `${subjectCode} ${courseNumber}`.toUpperCase();

    return Immutable.Set<Immutable.Set<string | Course>>()
      .add(Immutable.Set<string | Course>()
        .add(course));
  }
  if (typeof prerequisite === 'object') {
    if (prerequisite.g === '&') {
      const operandsPrerequisites = prerequisite.o.map(operand => flattenPrerequisites(operand, catalog));
      return allCombinations(operandsPrerequisites);
    } else if (prerequisite.g === '|') {
      const operandSetsFlattened = (prerequisite.o
        .map(operand => flattenPrerequisites(operand, catalog))
        .reduce((combinedSetOfSets, flattenedOperand) =>
          flattenedOperand.reduce((combinedSet, set) =>
            combinedSet.add(set),
            combinedSetOfSets
          ), Immutable.Set<Immutable.Set<string | Course>>())
      );
      return operandSetsFlattened;
    }
  }

  throw new Error(`Could not flatten prerequisite because its type could not be matched.`);
}

const memo = new WeakMap<any, any>();
const depthMemo = new WeakMap<any, any>();
const preferredCoursesMemo = new WeakMap<any, any>();

export class Course extends Record.define({
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
  sections: Immutable.Map<string, Immutable.Set<Section>>(),
}) implements Model.Course {
  get id() { return this._id.toHexString(); }
  get simpleName() { return `${this.subjectCode} ${this.courseNumber}`; }

  prerequisitesFlattened(catalog: Catalog): Immutable.Set<Immutable.Set<string | Course>> {
    if (memo.has(this)) {
      return memo.get(this);
    }
    const flattened = flattenPrerequisites(this.prerequisites, catalog);
    memo.set(this, flattened);
    return flattened;
  }

  preferredSequence(catalog: Catalog, preferredCourses: Immutable.Set<string | Course>) {
    const options = this.prerequisitesFlattened(catalog);
    let bestOption = Immutable.Set<string | Course>();
    let mostCourses = 0;

    for (const option of options) {
      let intersectingCourses = Immutable.Set<string | Course>();
      for (const course of option) {
        if (preferredCourses.has(course)) {
          intersectingCourses = intersectingCourses.add(course);
        }
        if (course instanceof Course) {
          intersectingCourses = (course
            .findPreferredCourses(catalog, preferredCourses)
            .reduce((intersectingCourses, next) =>
              intersectingCourses.add(next), intersectingCourses
            )
          );
        }
      }
      const courseCount = intersectingCourses.count();
      if (courseCount > mostCourses) {
        bestOption = option;
        mostCourses = courseCount;
      }
    }

    return bestOption;
  }

  preferredCoursesCount(catalog: Catalog, preferredCourses: Immutable.Set<string | Course>) {
    return this.findPreferredCourses(catalog, preferredCourses).count();
  }

  findPreferredCourses(
    catalog: Catalog,
    preferredCourses: Immutable.Set<string | Course>,
  ): Immutable.Set<string | Course> {

    if (preferredCoursesMemo.has(this)) {
      return preferredCoursesMemo.get(this);
    }

    const options = this.prerequisitesFlattened(catalog);
    let foundCourses = Immutable.Set<string | Course>();

    for (const option of options) {
      for (const course of option) {
        if (preferredCourses.has(course)) {
          foundCourses = foundCourses.add(course);
        }
        if (course instanceof Course) {
          foundCourses = (course
            .findPreferredCourses(catalog, preferredCourses)
            .reduce((foundCourses, next) => foundCourses.add(next), foundCourses)
          );
        }
      }
    }

    preferredCoursesMemo.set(this, foundCourses);

    return foundCourses;
  }

  // prerequisiteDepth(catalog: Catalog): number {
  //   if (depthMemo.has(this)) {
  //     return depthMemo.get(this);
  //   }

  //   const options = this.prerequisitesFlattened(catalog);


  //   const value = min + 1;
  //   depthMemo.set(this, value);
  //   return value;
  // }
}

export class Semester extends Record.define({
  _id: ObjectId(),
  courseMap: Immutable.Map<string, Course>(),
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
  year: 0,
}) {

  get id() { return this._id.toHexString(); }

  get position() {
    const seasonNumber = (/*if*/ this.season === 'Winter'
      ? 0
      : /*if*/ this.season === 'Summer' ? (1 / 3) : (2 / 3)
    );
    return seasonNumber + this.year;
  }

  get name() {
    return `${this.season} ${this.year}`
  }

  get courseCount() {
    return this.getOrCalculate('courseCount', () => {
      return this.courseMap.count();
    });
  }

  get courses() {
    return this.getOrCalculate('courses', () => {
      return this.courseMap.valueSeq().toArray();
    });
  }

  private _previousSemesterSeason() {
    if (this.season === 'Winter') { return 'Fall'; }
    if (this.season === 'Fall') { return 'Summer'; }
    if (this.season === 'Summer') { return 'Winter'; }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _previousSemesterYear() {
    if (this.season === 'Winter') { return this.year - 1; }
    return this.year;
  }

  private _nextSemesterSeason() {
    if (this.season === 'Winter') { return 'Summer'; }
    if (this.season === 'Fall') { return 'Winter'; }
    if (this.season === 'Summer') { return 'Fall'; }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _nextSemesterYear() {
    if (this.season === 'Fall') { return this.year + 1; }
    return this.year;
  }

  previousSemester(): { season: 'Fall' | 'Winter' | 'Summer', year: number } {
    const season = this._previousSemesterSeason();
    const year = this._previousSemesterYear();
    return { season, year };
  }

  nextSemester(): { season: 'Fall' | 'Winter' | 'Summer', year: number } {
    const season = this._nextSemesterSeason();
    const year = this._nextSemesterYear();
    return { season, year };
  }

  warningsNeverRanDuringCurrentSeason(catalog: Catalog) {
    return this.getOrCalculate('warningsNeverRanDuringCurrentSeason', [catalog, this], () => {
      const warnings = this.courseMap.valueSeq().map(course => {
        const sectionSet = course.sections.get(this.season);
        const hasNeverRan = oneLine`
          ${course.subjectCode} ${course.courseNumber} has never ran in the ${this.season} past
          three years. Check with your advisor to see if this course will run in the future.
        `;
        if (!sectionSet) { return hasNeverRan; }

        const sortedSections = sectionSet.sortBy(section => parseInt(section.termCode)).toArray();

        for (let i = 0; i < sortedSections.length - 1; i += 1) {
          const currentSection = sortedSections[i];
          const nextSection = sortedSections[i + 1];

          const currentSectionYearCode = parseInt(currentSection.termCode.substring(0, 4));
          const nextSectionYearCode = parseInt(nextSection.termCode.substring(0, 4));

          if (Math.abs(currentSectionYearCode - nextSectionYearCode) > 1) {
            return oneLine`
              ${course.subjectCode} ${course.courseNumber} has previously ran in the ${this.season}
              but there was a gap of offerings between ${currentSectionYearCode} and
              ${nextSectionYearCode}.
            `;
          }
        }
      }).filter(x => !!x).toArray() as string[];
      return warnings;
    });
  }
}

export function includes(strA: string, strB: string) {
  return strA.trim().toLowerCase().includes(strB.trim().toLowerCase());
}

export class Catalog extends Record.define({
  courseMap: Immutable.Map<string, Course>(),
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
      console.log('calculated courses');
      return this.courseMap
        .valueSeq()
        .sortBy(course => `${course.subjectCode} ${course.courseNumber} ${course.name}`);
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
  degreeMap: Immutable.Map<string, Course>(),
  semesterMap: Immutable.Map<string, Semester>(),
}) {
  removeCourseFromBox(course: Course) {
    return this.update('boxMap', boxMap => boxMap.remove(course.id));
  }

  get box() {
    return this.getOrCalculate('box', [this.boxMap], () => {
      return this.boxMap.valueSeq().toArray();
    });
  }

  get semestersSorted() {
    return this.getOrCalculate('semestersSorted', [this.semesterMap], () => {
      return this.semesterMap.valueSeq().sortBy(semester => semester.position);
    });
  }

  get semesters() {
    return this.getOrCalculate('semesters', [this.semestersSorted], () => {
      return this.semestersSorted.toArray();
    });
  }

  selectedCourse(selectedCourseId: string, catalog: Catalog) {
    return catalog.courseMap.get(selectedCourseId);
  }

  addToBox(course: Course) {
    return this.update('boxMap', boxMap => boxMap.set(course.id, course));
  }

  get coursesInDegree() {
    return this.getOrCalculate('degree', [this.degreeMap], () => {
      return this.degreeMap.valueSeq().toArray();
    });
  }
}

export class Ui extends Record.define({
  dragging: false,
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
  mouseIsOverSemester: false,
  lastMouseOverSemesterId: '',
  selectedCourseId: '',
}) { }

export class App extends Record.define({
  catalog: new Catalog(),
  user: new User(),
  ui: new Ui(),
}) { }
