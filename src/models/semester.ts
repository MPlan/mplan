import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId } from './';
import { Course } from './course';
import { pointer } from './pointer';
import { App } from './app';
const { floor } = Math;

export class Semester extends Record.define({
  _id: ObjectId(),
  _courseIds: Immutable.List<string>(),
}) {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }

  get season() {
    const plan = this.root.user.plan;
    const semesterIndex = plan.semesters.findIndex(semester => semester.id === this.id);
    if (semesterIndex === -1) throw new Error('season not found in plan');

    const seasonValue = (plan.anchorValue + semesterIndex) % 3;

    if (seasonValue === 0) return 'winter';
    if (seasonValue === 1) return 'summer';
    if (seasonValue === 2) return 'fall';
    throw new Error('unhit season case while trying to compute season for a semester');
  }

  get year() {
    const plan = this.root.user.plan;
    const semesterIndex = plan.semesters.findIndex(semester => semester.id === this.id);
    if (semesterIndex === -1) throw new Error('season not found in plan');

    return floor((plan.anchorValue + semesterIndex) / 3);
  }

  get name() {
    const seasonFirstLetter = this.season.substring(0, 1).toUpperCase();
    const seasonRest = this.season.substring(1);
    return `${seasonFirstLetter}${seasonRest} ${this.year}`;
  }

  get shortName() {
    return `${this.season.substring(0, 1).toUpperCase()}${this.year}`;
  }

  get courseCount() {
    return this.getOrCalculate('courseCount', () => {
      return this._courseIds.count();
    });
  }

  // todo this should use the credit hours pickers eventually
  totalCredits() {
    return this.courses()
      .map(
        course =>
          Array.isArray(course.creditHours) ? course.creditHours[1] : course.creditHours || 0,
      )
      .reduce((sum, next) => sum + next, 0);
  }

  courses() {
    const catalog = this.root.catalog;
    return this.getOrCalculate('courses', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!);
    });
  }

  courseArray() {
    const catalog = this.root.catalog;
    return this.getOrCalculate('courseArray', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!).toArray();
    });
  }

  addCourse(course: Course) {
    return this.update('_courseIds', courseIds =>
      courseIds.filter(courseId => course.catalogId !== courseId).push(course.catalogId),
    );
  }

  deleteCourse(courseToDelete: Course) {
    return this.update('_courseIds', courseIds => {
      return courseIds.filter(courseId => courseToDelete.catalogId !== courseId);
    });
  }

  clearCourses() {
    return this.update('_courseIds', courseIds => courseIds.clear());
  }
}
