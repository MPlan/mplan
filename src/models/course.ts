import {
  Prerequisite,
  PrerequisiteOverrides,
  isStringPrerequisite,
  isCoursePrerequisite,
  isAndPrerequisite,
  isOrPrerequisite,
} from './prerequisite';
import { Catalog } from './catalog';
import { User } from './user';
import { Degree, getAllCourses, degreeHasCourse } from './degree';
import { memoizeAll } from 'utilities/memoize-all';

type PrerequisiteTuple = [Course | string, 'CONCURRENT' | 'PREVIOUS'];

export interface Course {
  id: string;
  name: string;
  subjectCode: string;
  courseNumber: string;
  description?: string;
  creditHours?: number | [number, number];
  restrictions?: string[];
  prerequisites?: Prerequisite;
  corequisites?: [string, string][];
  crossList?: [string, string][];
  lastUpdateDate: number;
}

export function isCourse(maybe: any): maybe is Course {
  if (!maybe) return false;
  if (maybe.name === undefined) return false;
  if (maybe.subjectCode === undefined) return false;
  if (maybe.courseNumber === undefined) return false;
  return true;
}

export function makeCatalogId(subjectCode: string, courseNumber: string) {
  return `${subjectCode}__|__${courseNumber}`;
}

export function getCatalogId(self: Course) {
  const { subjectCode, courseNumber } = self;
  return makeCatalogId(subjectCode, courseNumber);
}

export function getSimpleName(self: Course) {
  const { subjectCode, courseNumber } = self;
  return `${subjectCode} ${courseNumber}`;
}

export function getCreditHoursFullString(self: Course) {
  const { creditHours } = self;

  if (!creditHours) return '';
  if (Array.isArray(creditHours)) return `${creditHours[0]} - ${creditHours[1]} credit hours`;
  if (creditHours === 1) return '1 credit hours';
  return `${creditHours} credit hours`;
}

export function getCreditHoursString(self: Course) {
  const { creditHours } = self;

  if (!creditHours) return 'NA';
  if (Array.isArray(creditHours)) return `${creditHours[0]} - ${creditHours[1]}`;
  return creditHours.toString();
}

export const getPrerequisitesConsideringOverrides = memoizeAll(
  (self: Course, user: User, prerequisiteOverrides: PrerequisiteOverrides) => {
    const userPrerequisiteOverride = user.userPrerequisiteOverrides[getCatalogId(self)];
    if (userPrerequisiteOverride) return userPrerequisiteOverride;

    const prerequisiteOverride = prerequisiteOverrides[getCatalogId(self)];
    if (prerequisiteOverride) return prerequisiteOverride;

    return self.prerequisites;
  },
);

export function getHistoricallyTaughtBy(self: Course) {}

export function getPriority(self: Course) {}

export function getCriticalLevel(self: Course) {}

export const getOptions = memoizeAll(
  (self: Course, catalog: Catalog): Set<Set<PrerequisiteTuple>> => {
    return disjunctiveNormalForm(self.prerequisites, catalog);
  },
);

export function getBestOption(self: Course) {}

export const getBestOptionWithConcurrent = memoizeAll(
  (self: Course, degree: Degree, catalog: Catalog) => {
    const coursesInDegree = getAllCourses(degree, catalog);
    const options = getOptions(self, catalog);

    const bestOptionMapping = Array.from(options.values()).map(option => {
      /**
       * the intersection of courses in the user's degree and the set of all courses in
       * all prerequisites
       *
       * intersection count is used to  the "best option" is first decided by the option that has
       * the largest count of degree courses in its closure.
       */
      const intersection = Array.from(option.values())
        .map(([course]) => {
          if (typeof course === 'string') return new Set<Course>();

          const intersection = new Set<Course>();
          if (degreeHasCourse(degree, course, catalog)) {
            intersection.add(course);
          }

          const courseFullClosure = getFullClosure(course, catalog);
          for (const intersectedCourse of intersect(coursesInDegree, courseFullClosure)) {
            intersection.add(intersectedCourse);
          }

          return intersection;
        })
        .reduce((intersection, next) => {
          for (const course of next) {
            intersection.add(course);
          }
          return intersection;
        }, new Set<Course>());
      const intersectionCount = intersection.size;

      const maxDepth = 0;
    });
  },
);

export function getIntersection(self: Course) {}

export const getFullClosure = memoizeAll(
  (self: Course, catalog: Catalog): Set<Course> => {
    const fullClosure = new Set<Course>();
    const options = getOptions(self, catalog);

    for (const option of options) {
      for (const [course] of option) {
        if (typeof course === 'string') continue;

        fullClosure.add(course);
        const subClosure = getFullClosure(course, catalog);
        for (const subCourse of subClosure) {
          fullClosure.add(subCourse);
        }
      }
    }
    return fullClosure;
  },
);

export function getDepth(self: Course) {}

export function getMinDepth(self: Course) {}

export function getClosure(self: Course) {}

export function getPrerequisiteContainsConcurrent(self: Course) {}

export function getPrerequisiteSatisfied(self: Course) {}

export function disjunctiveNormalForm(
  prerequisite: Prerequisite,
  catalog: { [catalogId: string]: Course },
): Set<Set<PrerequisiteTuple>> {
  if (!prerequisite) return new Set<Set<PrerequisiteTuple>>();

  if (isStringPrerequisite(prerequisite)) {
    return new Set<Set<PrerequisiteTuple>>().add(
      new Set<PrerequisiteTuple>().add([prerequisite, 'PREVIOUS']),
    );
  }

  if (isCoursePrerequisite(prerequisite)) {
    const [subjectCode, courseNumber, previousOrConcurrent] = prerequisite;
    const catalogId = makeCatalogId(subjectCode, courseNumber);
    const course = catalog[catalogId];

    if (!course) {
      const courseAsString = `${subjectCode} ${courseNumber}`.toUpperCase();

      return new Set<Set<PrerequisiteTuple>>().add(
        new Set<PrerequisiteTuple>().add([courseAsString, previousOrConcurrent]),
      );
    }

    return new Set<Set<PrerequisiteTuple>>().add(
      new Set<PrerequisiteTuple>().add([course, previousOrConcurrent]),
    );
  }

  if (isAndPrerequisite(prerequisite)) {
    return allCombinations(
      prerequisite.and.map(subPrerequisite => disjunctiveNormalForm(subPrerequisite, catalog)),
    );
  }

  if (isOrPrerequisite(prerequisite)) {
    return prerequisite.or
      .map(subPrerequisite => disjunctiveNormalForm(subPrerequisite, catalog))
      .reduce((combinedSetsOfSets, disjunct) =>
        Array.from(disjunct.values()).reduce(
          (combined, set) => combined.add(set),
          combinedSetsOfSets,
        ),
      );
  }

  throw new Error('Unmet case when calculating disjunctive normal form.');
}

export function allCombinations(listsOfLists: Array<Set<Set<PrerequisiteTuple>>>) {
  return _allCombinations(listsOfLists)[0];
}

function union<T>(a: Set<T>, b: Set<T>) {
  const union = new Set<T>();

  for (const i of a) {
    union.add(i);
  }
  for (const j of b) {
    union.add(j);
  }

  return union;
}

function intersect<T>(a: Set<T>, b: Set<T>) {
  const intersection = new Set<T>();

  for (const i of a) {
    intersection.add(i);
  }
  for (const j of b) {
    intersection.delete(j);
  }

  return intersection;
}

function _allCombinations(
  listsOfLists: Array<Set<Set<PrerequisiteTuple>>>,
): Array<Set<Set<PrerequisiteTuple>>> {
  if (listsOfLists.length <= 1) return listsOfLists;

  const combined = new Set<Set<PrerequisiteTuple>>();
  const listA = listsOfLists[0];
  const listB = listsOfLists[1];

  for (const a of listA) {
    for (const b of listB) {
      combined.add(union(a, b));
    }
  }

  return _allCombinations([combined, ...listsOfLists.slice(2)]);
}
