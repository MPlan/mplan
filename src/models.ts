import * as Record from 'recordize';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4'

export class Course extends Record.define({
  id: '',
  name: '',
  position: 0,
}) { }

export class Semester extends Record.define({
  id: '',
  courseIds: Immutable.Set<string>(),
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
  year: 0
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

  courseList(courses: Immutable.Set<Course>) {
    return courses.filter(course => this.courseIds.has(course.id)).toArray();
  }
}

const cis427id = uuid();

export class App extends Record.define({
  courses: Immutable.Set<Course>([
    new Course({ id: cis427id, name: 'CIS 427', position: 0 }),
    new Course({ id: uuid(), name: 'CIS 4691', position: 1 }),
    new Course({ id: uuid(), name: 'MATH 227', position: 2 }),
    new Course({ id: uuid(), name: 'CIS 476', position: 2 }),
  ]),
  semesters: Immutable.Set<Semester>([
    new Semester({ id: uuid(), season: 'Fall', year: 2017, courseIds: Immutable.Set([cis427id]) }),
    new Semester({ id: uuid(), season: 'Winter', year: 2018 }),
    new Semester({ id: uuid(), season: 'Summer', year: 2018 }),
    new Semester({ id: uuid(), season: 'Fall', year: 2019 }),
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
      .map(course => course.id)
      .subtract(courseIdsInSemesters)
    );

    return this.courses.filter(course => courseIdsNotInSemesters.has(course.id));
  }

  get semesterList() {
    return this.semesters.sortBy(semester => semester.position).toArray();
  }

  get courseList() {
    return this.courses.sortBy(course => course.position).toArray();
  }

  get bucketList() {
    return this.bucket.sortBy(course => course.position).toArray();
  }

  get selectedCourse() {
    return this.courses.find(course =>
      course.id === this.selectedCourseId
    ) || this.courses.first() || new Course();
  }
}

export const store = Record.createStore(new App());