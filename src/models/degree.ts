import * as MasteredDegrees from './mastered-degrees';
import * as DegreeGroup from './degree-group';
import * as Catalog from './catalog';
import * as Course from './course';
import { flatten } from 'lodash';
import { memoizeLast } from 'utilities/memoize-last';
import { ObjectId } from 'utilities/object-id';
import { maxBy } from 'utilities/max-by';

interface Degree {
  masteredDegreeId?: string;
  degreeGroupData: { [degreeGroupId: string]: DegreeGroup.Model };
}
export { Degree as Model };

export function hasCourse(self: Degree, course: Course.Model, catalog: Catalog.Model) {
  const allCourses = getAllCourses(self, catalog);
  const courseCatalogId = Course.getCatalogId(course);
  return !!Array.from(allCourses.values()).find(
    course => Course.getCatalogId(course) === courseCatalogId,
  );
}

export function getMasteredDegree(self: Degree, masteredDegrees: MasteredDegrees.Model) {
  const { masteredDegreeId } = self;
  if (!masteredDegreeId) return undefined;
  return MasteredDegrees.getMasteredDegree(masteredDegrees, masteredDegreeId);
}

export function getDegreeName(self: Degree, masteredDegrees: MasteredDegrees.Model) {
  const masteredDegree = getMasteredDegree(self, masteredDegrees);

  if (masteredDegree) return masteredDegree.name;
  return '';
}

export const getAllCourses = memoizeLast((self: Degree, catalog: Catalog.Model) => {
  const { degreeGroupData } = self;

  const courseArr = flatten(
    Object.values(degreeGroupData).map(degreeGroup => DegreeGroup.getCourses(degreeGroup, catalog)),
  );

  const courses = new Set<Course.Model>();
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
  const newDegreeGroup: DegreeGroup.Model = {
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
      {} as { [catalogId: string]: DegreeGroup.Model },
    );

  return {
    ...self,
    degreeGroupData: newDegreeGroupData,
  };
}

export function updateDegreeGroup(
  self: Degree,
  degreeGroupIdToUpdate: string,
  update: (degreeGroup: DegreeGroup.Model) => DegreeGroup.Model,
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
