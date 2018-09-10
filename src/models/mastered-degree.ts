import { ObjectId } from 'utilities/object-id';
import * as MasteredCourseGroup from './mastered-course-group';
import { maxBy } from 'utilities/max-by';

interface MasteredDegree {
  id: string;
  name: string;
  descriptionHtml: string;
  minimumCredits: number;
  published: boolean;
  masteredCourseGroups: { [groupId: string]: MasteredCourseGroup.Model };
  position: number;
}
export { MasteredDegree as Model };

export function createNewMasteredDegree(degreeName: string, lastPosition: number): MasteredDegree {
  const newDegree: MasteredDegree = {
    descriptionHtml: 'No description provided.',
    id: ObjectId(),
    masteredCourseGroups: {},
    minimumCredits: 120,
    name: degreeName,
    published: false,
    position: Math.ceil(lastPosition) + 2,
  };

  return newDegree;
}

export function getNewCourseGroupPosition(self: MasteredDegree, column: number) {
  const { masteredCourseGroups } = self;
  const courseGroupPositions = Object.values(masteredCourseGroups).filter(
    group => group.column === column,
  );
  const lastGroup = maxBy(courseGroupPositions, group => group.position);
  if (!lastGroup) return 0;
  return Math.ceil(lastGroup.position) + 2;
}

export function createNewGroup(self: MasteredDegree, name: string, column: number): MasteredDegree {
  const { masteredCourseGroups } = self;
  const newGroup: MasteredCourseGroup.Model = {
    name,
    column,
    id: ObjectId(),
    allowListIds: [],
    creditMaximum: 6,
    creditMinimum: 6,
    defaultIds: [],
    descriptionHtml: 'No description provided',
    position: getNewCourseGroupPosition(self, 1),
  };

  const newMasteredCourseGroups = { ...masteredCourseGroups, [newGroup.id]: newGroup };

  return {
    ...self,
    masteredCourseGroups: newMasteredCourseGroups,
  };
}

export function deleteGroup(
  self: MasteredDegree,
  groupToDelete: MasteredCourseGroup.Model,
): MasteredDegree {
  const { masteredCourseGroups } = self;

  const newMasteredCourseGroups = Object.entries(masteredCourseGroups)
    .filter(([groupId]) => groupId !== groupToDelete.id)
    .reduce(
      (newMasteredCourseGroups, [groupId, value]) => {
        newMasteredCourseGroups[groupId] = value;
        return newMasteredCourseGroups;
      },
      {} as {
        [groupId: string]: MasteredCourseGroup.Model;
      },
    );

  return {
    ...self,
    masteredCourseGroups: newMasteredCourseGroups,
  };
}

export function changeDescription(self: MasteredDegree, newDescription: string): MasteredDegree {
  return {
    ...self,
    descriptionHtml: newDescription,
  };
}

export function changeName(self: MasteredDegree, newName: string): MasteredDegree {
  return {
    ...self,
    name: newName,
  };
}

export function changeMinimumCredits(
  self: MasteredDegree,
  newMinimumCredits: number,
): MasteredDegree {
  return {
    ...self,
    minimumCredits: newMinimumCredits,
  };
}
