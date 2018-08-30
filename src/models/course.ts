import { store } from './store';

export interface Course {
  id: string;
  name: string;
  subjectCode: string;
  courseNumber: string;
  description?: string;
  creditHours?: number | [number, number];
  restrictions?: string[];
  prerequisites?: any;
  corequisites?: [string, string][];
  crossList?: [string, string][];
  lastUpdateDate: number;
}

export function getCatalogId(self: Course) {
  const { subjectCode, courseNumber } = self;
  return `${subjectCode}__|__${courseNumber}`;
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
  const { user } = store.current;
  const {} = user;
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
