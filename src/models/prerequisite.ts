export type Prerequisite =
  | { and: Prerequisite[] }
  | { or: Prerequisite[] }
  | [string, string, 'CONCURRENT' | 'PREVIOUS']
  | string;

export function isAndPrerequisite(
  prerequisite: Prerequisite,
): prerequisite is { and: Prerequisite[] } {
  return !!(prerequisite as any).and;
}

export function isOrPrerequisite(
  prerequisite: Prerequisite,
): prerequisite is { or: Prerequisite[] } {
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
