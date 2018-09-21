import * as Course from './course';
import { memoizeLast } from 'utilities/memoize-last';

interface Catalog {
  [catalogId: string]: Course.Model;
}
export { Catalog as Model };

export function getCourse(self: Catalog, subjectCode: string, courseNumber: string) {
  const catalogId = Course.makeCatalogId(subjectCode, courseNumber);
  return self[catalogId] as Course.Model | undefined;
}

export const getCoursesAsArray = memoizeLast((self: Catalog) => {
  return Object.values(self);
});

export const getSearchResults = memoizeLast((self: Catalog, query: string) => {
  const courses = getCoursesAsArray(self);

  if (!query) return [];

  const querySplit = query
    .toLowerCase()
    .split(' ')
    .filter(x => x);

  return courses
    .map(course => {
      const rank = querySplit
        .map(part => {
          if (course.subjectCode.toLowerCase() === part) return 3;
          if (course.courseNumber.toLowerCase() === part) return 3;
          if (
            Course.getSimpleName(course)
              .toLowerCase()
              .includes(part)
          )
            return 1;
          if (course.name.toLowerCase().includes(part)) return 2;
          if (course.description && course.description.toLowerCase().includes(part)) return 1;
          return 0;
        })
        .reduce((sum, next) => sum + next, 0 as number);
      return { rank, course };
    })
    .filter(({ rank }) => rank > 0)
    .sort((a, b) => {
      const valueA = a.rank * 10000 - parseInt(a.course.courseNumber.replace(/[^\d]/g, ''), 10);
      const valueB = b.rank * 10000 - parseInt(b.course.courseNumber.replace(/[^\d]/g, ''), 10);

      return valueB - valueA;
    })
    .map(({ course }) => course);
});
