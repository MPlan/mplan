import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { Course } from './course';
import { pointer } from './pointer';

export interface SearchResults {
  count: number;
  results: Immutable.Seq.Indexed<Course>;
}

export class Catalog extends Record.define({
  courseMap: Record.MapOf(Course),
}) {
  get root() {
    return pointer.store.current();
  }

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

  search(query: string, dontRemove = false): SearchResults {
    if (query === '') {
      return { count: 0, results: Immutable.Seq.Indexed() };
    }
    const querySplit = query
      .toLowerCase()
      .split(' ')
      .filter(x => x);
    const results = this.courseMap
      .valueSeq()
      .map(course => {
        const rank = querySplit
          .map(part => {
            if (course.subjectCode.toLowerCase() === part) return 3;
            if (course.courseNumber.toLowerCase() === part) return 3;
            if (course.simpleName.toLowerCase().includes(part)) return 1;
            if (course.name.toLowerCase().includes(part)) return 2;
            if (course.description && course.description.toLowerCase().includes(part)) return 1;
            return 0;
          })
          .reduce((sum, next) => sum + next, 0 as number);
        return { rank, course };
      })
      .filter(({ rank }) => rank > 0)
      .sortBy(
        ({ rank, course }) =>
          rank * 10000 - parseInt(course.courseNumber.replace(/[^\d]/g, ''), 10),
      )
      .map(({ course }) => course)
      .reverse();
    return { count: results.count(), results };
  }
}
