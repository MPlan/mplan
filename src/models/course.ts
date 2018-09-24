import * as Prerequisite from './prerequisite';
import * as Catalog from './catalog';
import * as User from './user';
import * as Degree from './degree';
import { memoizeAll } from 'utilities/memoize-all';
import { maxBy } from 'utilities/max-by';

type PrerequisiteTuple = [Course | string, 'CONCURRENT' | 'PREVIOUS'];

interface Course {
  id: string;
  name: string;
  subjectCode: string;
  courseNumber: string;
  description?: string;
  creditHours?: number | [number, number];
  restrictions?: string[];
  prerequisites?: Prerequisite.Model;
  corequisites?: [string, string][];
  crossList?: [string, string][];
  lastUpdateDate: number;
}
export { Course as Model };

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

export function parseCourseKey(courseKey: string) {
  const match = /(.*)__\|__(.*)/.exec(courseKey);
  if (!match) return undefined;
  const subjectCode = match[1];
  const courseNumber = match[2];

  return { subjectCode, courseNumber };
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
  if (Array.isArray(creditHours)) return `${creditHours[0]} - ${creditHours[1]} credits`;
  if (creditHours === 1) return '1 credit';
  return `${creditHours} credits`;
}

export function getCreditHoursString(self: Course) {
  const { creditHours } = self;

  if (!creditHours) return 'NA';
  if (Array.isArray(creditHours)) return `${creditHours[0]} - ${creditHours[1]}`;
  return creditHours.toString();
}

export const getPrerequisitesConsideringOverrides = memoizeAll(
  (self: Course, user: User.Model, prerequisiteOverrides: Prerequisite.Overrides) => {
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
  (self: Course, catalog: Catalog.Model): Set<Set<PrerequisiteTuple>> => {
    return disjunctiveNormalForm(self.prerequisites, catalog);
  },
);

export const getBestOption = memoizeAll(
  (self: Course, degree: Degree.Model, catalog: Catalog.Model) => {
    const bestOptionWithConcurrent = getBestOptionWithConcurrent(self, degree, catalog);
    const bestOption = new Set<Course>();
    for (const [course] of bestOptionWithConcurrent) {
      if (typeof course === 'string') continue;
      bestOption.add(course);
    }

    return bestOption;
  },
);

export const getBestOptionWithConcurrent = memoizeAll(
  (self: Course, degree: Degree.Model, catalog: Catalog.Model): Set<PrerequisiteTuple> => {
    const coursesInDegree = Degree.getAllCourses(degree, catalog);
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
          if (Degree.hasCourse(degree, course, catalog)) {
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

      const maxDepth = Array.from(option.values())
        .map(([course]) => {
          if (typeof course === 'string') return 0;
          return getMinDepth(course, catalog);
        })
        .reduce((max, next) => (/*if*/ next > max ? next : max), 0);

      const closure = Array.from(option.values()).reduce((closure, [course]) => {
        if (typeof course === 'string') return closure;

        closure.add(course);
        const courseClosure = getClosureFromCourse(course, catalog, degree);
        for (const courseInClosure of courseClosure) {
          closure.add(courseInClosure);
        }

        return closure;
      }, new Set<Course>());
      const closureCount = closure.size;

      return { maxDepth, intersectionCount, closureCount, option };
    });

    const best = maxBy(bestOptionMapping, ({ maxDepth, intersectionCount, closureCount }) => {
      return intersectionCount * 100000 - maxDepth * 1000 - closureCount;
    });
    if (!best) return new Set<PrerequisiteTuple>();

    return best.option;
  },
);

export function getIntersection(self: Course) {}

export const getFullClosure = memoizeAll(
  (self: Course, catalog: Catalog.Model): Set<Course> => {
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

export const getDepth = memoizeAll(
  (self: Course, catalog: Catalog.Model, degree: Degree.Model): number => {
    const bestOption = getBestOptionWithConcurrent(self, degree, catalog);

    let maxDepth = 0;
    for (const [course, previousOrConcurrent] of bestOption) {
      if (typeof course === 'string') continue;
      const courseDepth =
        getDepth(course, catalog, degree) - (previousOrConcurrent === 'CONCURRENT' ? 1 : 0);
      if (courseDepth > maxDepth) {
        maxDepth = courseDepth;
      }
    }

    return maxDepth + 1;
  },
);

export function getMinDepth(self: Course, catalog: Catalog.Model): number {
  const options = getOptions(self, catalog);
  if (options.size <= 0) return 1;

  let minDepthOfAllOptions = 999999;
  for (const option of options) {
    let maxDepthOfAllCourses = 0;

    for (const [course, previousOrConcurrent] of option) {
      if (typeof course === 'string') continue;

      const courseDepth =
        getMinDepth(course, catalog) - (previousOrConcurrent === 'CONCURRENT' ? 1 : 0);
      if (courseDepth > maxDepthOfAllCourses) {
        maxDepthOfAllCourses = courseDepth;
      }
    }

    if (maxDepthOfAllCourses < minDepthOfAllOptions) {
      minDepthOfAllOptions = maxDepthOfAllCourses;
    }
  }

  return minDepthOfAllOptions + 1;
}

export function getClosureFromCourse(
  self: Course,
  catalog: Catalog.Model,
  degree: Degree.Model,
): Set<Course> {
  const coursesInClosure = new Set<Course>();

  const bestOption = getBestOption(self, degree, catalog);
  for (const course of bestOption) {
    coursesInClosure.add(course);
    for (const subCourse of getClosureFromCourse(course, catalog, degree)) {
      coursesInClosure.add(subCourse);
    }
  }

  return coursesInClosure;
}

export function getPrerequisiteContainsConcurrent(
  self: Course,
  user: User.Model,
  prerequisiteOverrides: Prerequisite.Overrides,
) {
  const prerequisites = getPrerequisitesConsideringOverrides(self, user, prerequisiteOverrides);
  return _getPrerequisiteContainsConcurrent(prerequisites);
}

function _getPrerequisiteContainsConcurrent(prerequisite: Prerequisite.Model): boolean {
  if (!prerequisite) return false;
  if (Prerequisite.isStringPrerequisite(prerequisite)) return false;
  if (Prerequisite.isCoursePrerequisite(prerequisite)) {
    if (prerequisite[2] === 'CONCURRENT') return true;
  }

  const operands = Prerequisite.isAndPrerequisite(prerequisite)
    ? prerequisite.and
    : Prerequisite.isOrPrerequisite(prerequisite)
      ? prerequisite.or
      : [];

  if (operands.some(operand => _getPrerequisiteContainsConcurrent(operand))) return false;
  return false;
}

export function getPrerequisiteSatisfied(self: Course) {}

export function disjunctiveNormalForm(
  prerequisite: Prerequisite.Model,
  catalog: { [catalogId: string]: Course },
): Set<Set<PrerequisiteTuple>> {
  if (!prerequisite) return new Set<Set<PrerequisiteTuple>>();

  if (Prerequisite.isStringPrerequisite(prerequisite)) {
    return new Set<Set<PrerequisiteTuple>>().add(
      new Set<PrerequisiteTuple>().add([prerequisite, 'PREVIOUS']),
    );
  }

  if (Prerequisite.isCoursePrerequisite(prerequisite)) {
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

  if (Prerequisite.isAndPrerequisite(prerequisite)) {
    return allCombinations(
      prerequisite.and.map(subPrerequisite => disjunctiveNormalForm(subPrerequisite, catalog)),
    );
  }

  if (Prerequisite.isOrPrerequisite(prerequisite)) {
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
