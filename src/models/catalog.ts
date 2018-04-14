import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Course } from './course';

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
