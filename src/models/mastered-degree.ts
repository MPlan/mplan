import { ObjectId } from 'utilities/object-id';
import * as MasteredDegreeGroup from './mastered-degree-group';
import { maxBy } from 'utilities/max-by';

interface MasteredDegree {
  id: string;
  name: string;
  descriptionHtml: string;
  minimumCredits: number;
  published: boolean;
  masteredDegreeGroups: { [groupId: string]: MasteredDegreeGroup.Model };
  position: number;
}
export { MasteredDegree as Model };

export function createNewMasteredDegree(degreeName: string, lastPosition: number): MasteredDegree {
  const newDegree: MasteredDegree = {
    descriptionHtml: 'No description provided.',
    id: ObjectId(),
    masteredDegreeGroups: {},
    minimumCredits: 120,
    name: degreeName,
    published: false,
    position: Math.ceil(lastPosition) + 2,
  };

  return newDegree;
}

export function getNewDegreeGroupPosition(self: MasteredDegree, column: 1 | 2 | 3) {
  const { masteredDegreeGroups } = self;
  const degreeGroupPositions = Object.values(masteredDegreeGroups).filter(
    group => group.column === column,
  );
  const lastGroup = maxBy(degreeGroupPositions, group => group.position);
  if (!lastGroup) return 0;
  return Math.ceil(lastGroup.position) + 2;
}

export function createNewGroup(self: MasteredDegree): MasteredDegree {
  const { masteredDegreeGroups } = self;
  const newGroup: MasteredDegreeGroup.Model = {
    allowListIds: [],
    creditMaximum: 6,
    creditMinimum: 6,
    defaultIds: [],
    descriptionHtml: 'No description provided',
    id: ObjectId(),
    name: 'New Degree Group',
    column: 1,
    position: getNewDegreeGroupPosition(self, 1),
  };

  const newMasteredDegreeGroups = { ...masteredDegreeGroups, [newGroup.id]: newGroup };

  return {
    ...self,
    masteredDegreeGroups: newMasteredDegreeGroups,
  };
}

export function deleteGroup(
  self: MasteredDegree,
  groupToDelete: MasteredDegreeGroup.Model,
): MasteredDegree {
  const { masteredDegreeGroups } = self;

  const newMasteredDegreeGroups = Object.entries(masteredDegreeGroups)
    .filter(([groupId]) => groupId !== groupToDelete.id)
    .reduce(
      (newMasteredDegreeGroups, [groupId, value]) => {
        newMasteredDegreeGroups[groupId] = value;
        return newMasteredDegreeGroups;
      },
      {} as {
        [groupId: string]: MasteredDegreeGroup.Model;
      },
    );

  return {
    ...self,
    masteredDegreeGroups: newMasteredDegreeGroups,
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
