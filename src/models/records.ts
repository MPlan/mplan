import * as Record from 'recordize';
import * as Model from './models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';
import { ObjectID as _ObjectId } from 'bson';

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
}) implements Model.Section { }

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
}) implements Model.Course { }

export class Semester extends Record.define({
  _id: ObjectId(),
  courseIds: Immutable.Set<string>(),
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
  year: 0,
}) {
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
  count() {
    return this.courseIds.count();
  }

  courseList(courses: Immutable.Map<string, Course>) {
    return courses.filter(course => this.courseIds.has(course._id.toHexString())).toArray();
  }
}

export function includes(strA: string, strB: string) {
  return strA.trim().toLowerCase().includes(strB.trim().toLowerCase());
}

export class Catalog extends Record.define({
  courseMap: Immutable.Map<string, Course>(),
  search: '',
  currentPageIndex: 0,
  coursesPerPage: 5,
}) {
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

  get coursesOnCurrentPage() {
    return this.getOrCalculate('coursesOnCurrentPage', () => {
      const start = this.currentPageIndex * this.coursesPerPage;
      const end = (this.currentPageIndex + 1) * this.coursesPerPage;

      return this.filteredCourses.slice(start, end).toArray();
    });
  }

  get totalPages() {
    return this.getOrCalculate('totalPages', () => {
      return Math.ceil(this.filteredCourses.count() / this.coursesPerPage);
    });
  }

  get filteredCourses() {
    return this.getOrCalculate('filteredCourses', () => {
      console.log('calculated filtered courses');
      return this.coursesSorted.filter(course => {
        const searchTerms = this.search.split(' ').map(t => t.trim()).filter(t => !!t);
        return searchTerms.every(searchTerm => {
          if (includes(course.subjectCode, searchTerm)) { return true; }
          if (includes(course.courseNumber, searchTerm)) { return true; }
          if (includes(course.name, searchTerm)) { return true; }
          const description = course.description;
          if (description && includes(description, searchTerm)) { return true; }
          return false;
        });
      });
    });
  }
}

const id0 = ObjectId();
const id1 = ObjectId();
const id2 = ObjectId();
const id3 = ObjectId();

export class App extends Record.define({
  catalog: new Catalog(),
  courses: Immutable.Map<string, Course>(),
  semesters: Immutable.Map<string, Semester>([
    [id0.toHexString(), new Semester({
      _id: id0,
      courseIds: Immutable.Set<string>(),
      season: 'Fall',
      year: 2018,
    })]
  ]),
  selectedCourseId: '',
  dragging: false,
  x: 0,
  y: 0,
  offsetX: 0,
  offsetY: 0,
  mouseIsOverSemester: false,

}) {
  get bucket() {
    const courseIdsInSemesters = (this.semesters
      .map(semester => semester.courseIds)
      .reduce((flattened, courseIds) => {
        return flattened.union(courseIds);
      }, Immutable.Set<string>())
    );

    const courseIdsNotInSemesters = (this.courses
      .map(course => course._id.toHexString())
      .toSet()
      .subtract(courseIdsInSemesters)
    );

    return this.courses.filter(course => courseIdsNotInSemesters.has(course._id.toHexString()));
  }

  get semesterList() {
    return this.semesters.sortBy(semester => semester.position).toArray();
  }

  get courseList() {
    return this.courses.toArray();//.sortBy(course => course.position).toArray();
  }

  get bucketList() {
    return this.bucket.toArray();//.sortBy(course => course.position).toArray();
  }

  get selectedCourse() {
    return this.courses.find(course =>
      course._id.toHexString() === this.selectedCourseId
    ) || this.courses.first() || new Course();
  }
}
