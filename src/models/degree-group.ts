import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId } from './';
import { Course } from './course';
import { pointer } from './pointer';
import { App } from './app';

export class DegreeGroup extends Record.define({
  _id: ObjectId(),
  name: '',
  description: '',
  /** this can be either `subjectCode__|__courseNumber` or a string for placement exams */
  _courseIds: Immutable.List<string>(),
  completedCourseIds: Immutable.List<string>(),
}) {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }

  static updateStore(store: App, newThis: DegreeGroup) {
    return store.update('user', user => user.update('degree', degree => degree.setDegreeGroup(newThis)));
  }

  addCourse(course: string | Course) {
    if (this._courseIds.contains(course instanceof Course ? course.catalogId : course)) return this;
    return this.update('_courseIds', courseIds => courseIds.push(course instanceof Course ? course.catalogId : course));
  }

  deleteCourse(course: string | Course) {
    const idToDelete = course instanceof Course ? course.catalogId : course;
    return this.update('_courseIds', courseIds => courseIds.filter(courseId => courseId !== idToDelete));
  }

  courses() {
    const catalog = this.root.catalog;
    return this.getOrCalculate('courses', [catalog, this], () => {
      return this._courseIds
        .map(id => catalog.courseMap.get(id))
        .filter(x => !!x)
        .map(x => x!);
    });
  }

  hasCourse(course: string | Course) {
    const id = course instanceof Course ? course.id : course;
    return this._courseIds.includes(id);
  }

  toggleCourseCompletion(course: string | Course) {
    const id = course instanceof Course ? course.id : course;
    if (this.completedCourseIds.includes(id)) {
      return this.update('completedCourseIds', completedCourseIds => completedCourseIds.filter(i => i !== id));
    }
    return this.update('completedCourseIds', completedCourseIds => completedCourseIds.push(id));
  }
}
