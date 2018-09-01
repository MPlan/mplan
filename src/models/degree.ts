import { MasteredDegrees, getMasteredDegree as _getMasteredDegree } from './mastered-degrees';
import { DegreeGroup, getCourses } from './degree-group';
import { flatten } from 'lodash';
import { Course, getCatalogId } from './course';
import { memoizeLast } from 'utilities/memoize-last';
import { Catalog } from './catalog';

export interface Degree {
  masteredDegreeId?: string;
  degreeGroupData: { [degreeGroupId: string]: DegreeGroup };
}

export function degreeHasCourse(self: Degree, course: Course, catalog: Catalog) {
  const allCourses = getAllCourses(self, catalog);
  const courseCatalogId = getCatalogId(course);
  return !!allCourses[courseCatalogId];
}

export function getMasteredDegree(self: Degree, masteredDegrees: MasteredDegrees) {
  const { masteredDegreeId } = self;
  if (!masteredDegreeId) return undefined;
  return _getMasteredDegree(masteredDegrees, masteredDegreeId);
}

export function getName(self: Degree, masteredDegrees: MasteredDegrees) {
  const masteredDegree = getMasteredDegree(self, masteredDegrees);

  if (masteredDegree) return masteredDegree.name;
  return '';
}

export const getAllCourses = memoizeLast((self: Degree, catalog: Catalog) => {
  const { degreeGroupData } = self;

  const courseArr = flatten(
    Object.values(degreeGroupData).map(degreeGroup => getCourses(degreeGroup, catalog)),
  );

  const courses = new Set<Course>();
  for (const course of courseArr) {
    courses.add(course);
  }

  return courses;
});

export function getClosure(self: Degree) {}
export function getLevels(self: Degree) {}
export function getTotalCredits(self: Degree) {}
export function getCompletedCredits(self: Degree) {}
export function getPercentComplete(self: Degree) {}
// export function generatePlan()
export function addNewDegreeGroup(self: Degree) {}
export function addDegreeGroup(self: Degree) {}
export function deleteDegreeGroup(self: Degree) {}
export function updateDegreeGroup(self: Degree) {}
export function setDegreeGroup(self: Degree) {}
export function reorderDegreeGroups(self: Degree) {}
