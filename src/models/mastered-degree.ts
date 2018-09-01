import { ObjectId } from 'utilities/object-id';
import { MasteredDegreeGroup } from './mastered-degree-group';

export interface MasteredDegree {
  id: string;
  name: string;
  descriptionHtml: string;
  minimumCredits: number;
  published: boolean;
  masteredDegreeGroups: { [groupId: string]: MasteredDegreeGroup };
}

export function createNewGroup(self: MasteredDegree): MasteredDegree {
  const { masteredDegreeGroups } = self;
  const newGroup: MasteredDegreeGroup = {
    allowListIds: [],
    creditMaximum: 6,
    creditMinimum: 6,
    defaultIds: [],
    descriptionHtml: 'No description provided',
    id: ObjectId(),
    name: 'New Degree Group',
  };

  const newMasteredDegreeGroups = [...masteredDegreeGroups, newGroup];

  return {
    ...self,
    masteredDegreeGroups: newMasteredDegreeGroups,
  };
}

export function deleteGroup(
  self: MasteredDegree,
  groupToDelete: MasteredDegreeGroup,
): MasteredDegree {
  const { masteredDegreeGroups } = self;

  const newMasteredDegreeGroups = masteredDegreeGroups.filter(
    group => group.id !== groupToDelete.id,
  );

  return {
    ...self,
    masteredDegreeGroups: newMasteredDegreeGroups,
  };
}
