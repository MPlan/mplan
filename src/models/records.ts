import * as Record from 'recordize';
import * as Model from './models';
import * as Immutable from 'immutable';
import * as uuid from 'uuid/v4';
import * as Mongo from 'mongodb';

export class Course extends Record.define({
  _id: new Mongo.ObjectId(),
  name: '',
  subjectCode: '',
  courseNumber: '',
  description: undefined,
  credits: undefined,
  creditsMin: undefined,
  restrictions: undefined,
  prerequisites: undefined,
  corequisites: undefined,
  crossList: undefined,
  scheduleTypes: [],
  lastUpdateDate: 0,
  lastTermCode: '',
}) implements Model.Course { }

export class Semester extends Record.define({
  _id: new Mongo.ObjectId(),
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


const id0 = new Mongo.ObjectId();
const id1 = new Mongo.ObjectId();
const id2 = new Mongo.ObjectId();
const id3 = new Mongo.ObjectId();

;

export class App extends Record.define({
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

export const store = Record.createStore(new App());
