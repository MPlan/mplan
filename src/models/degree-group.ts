import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { Course } from './course';

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
