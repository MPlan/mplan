import { store } from './store';
import {
  Prerequisite,
  isStringPrerequisite,
  isCoursePrerequisite,
  isAndPrerequisite,
  isOrPrerequisite,
} from './prerequisite';

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

export function getPrerequisitesConsideringOverrides(self: Course) {
  const { userPrerequisiteOverrides } = store.current.user;
  const userPrerequisiteOverride = userPrerequisiteOverrides[getCatalogId(self)];
  if (userPrerequisiteOverride) return userPrerequisiteOverride;

  const { prerequisiteOverrides } = store.current;
  const prerequisiteOverride = prerequisiteOverrides[getCatalogId(self)];
  if (prerequisiteOverride) return prerequisiteOverride;

  return self.prerequisites;
}

export function getHistoricallyTaughtBy(self: Course) {}

export function getPriority(self: Course) {}

export function getCriticalLevel(self: Course) {}

export function getOptions(self: Course) {}

export function getBestOption(self: Course) {}

export function getBestOptionWithConcurrent(self: Course) {}

export function getIntersection(self: Course) {}

export function getFullClosure(self: Course) {}

export function getDepth(self: Course) {}

export function getMinDepth(self: Course) {}

export function getClosure(self: Course) {}

export function getPrerequisiteContainsConcurrent(self: Course) {}

export function getPrerequisiteSatisfied(self: Course) {}

export function disjunctiveNormalForm(
  prerequisite: Prerequisite | undefined,
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
