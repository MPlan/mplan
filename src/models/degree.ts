import { store } from './store';
import { MasteredDegree } from './mastered-degree';
import { DegreeGroup, getCourses } from './degree-group';
import { createMultimap } from 'utilities/multimap';
import { flatten } from 'lodash';
import { Course, getCatalogId } from './course';

export interface Degree {
  masteredDegreeId?: string;
  degreeGroupData: { [degreeGroupId: string]: DegreeGroup };
}

export function getMasteredDegree(self: Degree) {
  const { masteredDegrees } = store.current;
  const { masteredDegreeId } = self;
  if (!masteredDegreeId) return undefined;
  return masteredDegrees[masteredDegreeId] as MasteredDegree | undefined;
}

export function getName(self: Degree) {
  const masteredDegree = getMasteredDegree(self);

  if (masteredDegree) return masteredDegree.name;
  return '';
}

const allCoursesMemo = createMultimap<{ [catalogId: string]: Course }>();
export function getAllCourses(self: Degree) {
  const { degreeGroupData } = self;
  const { catalog } = store.current;

  const valueFromMemo = allCoursesMemo.get([catalog, degreeGroupData]);
  if (valueFromMemo) return valueFromMemo;

  const courseArr = flatten(
    Object.values(degreeGroupData).map(degreeGroup => getCourses(degreeGroup)),
  );

  const courses = courseArr.reduce(
    (courses, course) => {
      courses[getCatalogId(course)] = course;
      return courses;
    },
    {} as { [catalogId: string]: Course },
  );

  allCoursesMemo.set([catalog, degreeGroupData], courses);
  return courses;
}

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
