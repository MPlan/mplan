export type Prerequisite =
  | { and: Prerequisite[] }
  | { or: Prerequisite[] }
  | [string, string, 'CONCURRENT' | 'PREVIOUS']
  | string;

export type Corequisite = [string, string] | string;

export interface Course {
  subjectCode: string;
  courseNumber: string;
  name: string;
  description: string;
  creditHours: number | [number, number];
  restrictions?: string[];
  prerequisites?: Prerequisite;
  corequisites?: Corequisite[];
}

export interface Subject {
  name: string;
  code: string;
  href: string;
}

export function isAndPrerequisite(
  prerequisite: Prerequisite,
): prerequisite is { and: Prerequisite[] } {
  return !!(prerequisite as any).and;
}

export function isOrPrerequisite(
  prerequisite: Prerequisite,
): prerequisite is { and: Prerequisite[] } {
  return !!(prerequisite as any).or;
}

export function isCoursePrerequisite(
  prerequisite: Prerequisite,
): prerequisite is [string, string, 'CONCURRENT' | 'PREVIOUS'] {
  return Array.isArray(prerequisite);
}

export function isStringPrerequisite(prerequisite: Prerequisite): prerequisite is string {
  return typeof prerequisite === 'string';
}
