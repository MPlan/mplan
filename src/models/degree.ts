import { MasteredDegrees, getMasteredDegree as _getMasteredDegree } from './mastered-degrees';
import { DegreeGroup, getCourses } from './degree-group';
import { flatten } from 'lodash';
import { Course, getCatalogId } from './course';
import { memoizeLast } from 'utilities/memoize-last';
import { Catalog } from './catalog';
import { ObjectId } from 'utilities/object-id';
import { maxBy } from 'utilities/max-by';

export interface Degree {
  masteredDegreeId?: string;
  degreeGroupData: { [degreeGroupId: string]: DegreeGroup };
}

export function degreeHasCourse(self: Degree, course: Course, catalog: Catalog) {
  const allCourses = getAllCourses(self, catalog);
  const courseCatalogId = getCatalogId(course);
  return !!Array.from(allCourses.values()).find(course => getCatalogId(course) === courseCatalogId);
}

export function getMasteredDegree(self: Degree, masteredDegrees: MasteredDegrees) {
  const { masteredDegreeId } = self;
  if (!masteredDegreeId) return undefined;
  return _getMasteredDegree(masteredDegrees, masteredDegreeId);
}

export function getDegreeName(self: Degree, masteredDegrees: MasteredDegrees) {
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
export function addNewDegreeGroup(self: Degree): Degree {
  const lastGroup = maxBy(Object.values(self.degreeGroupData), group => group.position);
  const position = lastGroup.position;
  const newDegreeGroup: DegreeGroup = {
    completedCourseIds: {},
    courseIds: [],
    id: ObjectId(),
    position,
  };

  return {
    ...self,
    degreeGroupData: {
      ...self.degreeGroupData,
      [newDegreeGroup.id]: newDegreeGroup,
    },
  };
}

export function deleteDegreeGroup(self: Degree, degreeGroupIdToDelete: string): Degree {
  const newDegreeGroupData = Object.entries(self.degreeGroupData)
    .filter(([degreeGroupId]) => degreeGroupIdToDelete)
    .reduce(
      (degreeGroupData, [degreeGroupId, degreeGroup]) => {
        degreeGroupData[degreeGroupId] = degreeGroup;
        return degreeGroupData;
      },
      {} as { [catalogId: string]: DegreeGroup },
    );

  return {
    ...self,
    degreeGroupData: newDegreeGroupData,
  };
}

export function updateDegreeGroup(
  self: Degree,
  degreeGroupIdToUpdate: string,
  update: (degreeGroup: DegreeGroup) => DegreeGroup,
): Degree {
  const degreeGroupToUpdate = self.degreeGroupData[degreeGroupIdToUpdate];
  if (!degreeGroupIdToUpdate) return self;

  return {
    ...self,
    degreeGroupData: {
      ...self.degreeGroupData,
      [degreeGroupIdToUpdate]: update(degreeGroupToUpdate),
    },
  };
}

export function reorderDegreeGroups(self: Degree) {}
