import * as RequirementGroup from './mastered-course-group';
import { createSelector } from 'reselect';
import { get } from 'utilities/get';
import { maxBy } from 'utilities/max-by';
import { max, min } from 'lodash';

interface MasteredDegree {
  id: string;
  name: string;
  descriptionHtml: string;
  minimumCredits: number;
  published: boolean;
  requirementGroups: { [groupId: string]: RequirementGroup.Model };
  position: number;
}
export { MasteredDegree as Model };

const selectRequirementGroups = (self: MasteredDegree) => self.requirementGroups;

export function getGroup(self: MasteredDegree, groupId: string) {
  return self.requirementGroups[groupId] as RequirementGroup.Model | undefined;
}

export const getCourseGroups = createSelector(selectRequirementGroups, requirementGroups => {
  return Object.values(requirementGroups)
    .reduce(
      (courseGroupArray, group) => {
        courseGroupArray.push(group);
        return courseGroupArray;
      },
      [] as RequirementGroup.Model[],
    )
    .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
});

export const getGroupsColumnOne = createSelector(selectRequirementGroups, requirementGroups => {
  return Object.values(requirementGroups)
    .reduce(
      (courseGroupArray, group) => {
        courseGroupArray.push(group);
        return courseGroupArray;
      },
      [] as RequirementGroup.Model[],
    )
    .filter(group => group.column === 1)
    .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
});

export const getGroupsColumnTwo = createSelector(selectRequirementGroups, requirementGroups => {
  return Object.values(requirementGroups)
    .reduce(
      (courseGroupArray, group) => {
        courseGroupArray.push(group);
        return courseGroupArray;
      },
      [] as RequirementGroup.Model[],
    )
    .filter(group => group.column === 2)
    .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
});

export const getGroupsColumnThree = createSelector(selectRequirementGroups, requirementGroups => {
  return Object.values(requirementGroups)
    .reduce(
      (courseGroupArray, group) => {
        courseGroupArray.push(group);
        return courseGroupArray;
      },
      [] as RequirementGroup.Model[],
    )
    .filter(group => group.column === 3)
    .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
});

export function createNewMasteredDegree(
  degreeName: string,
  lastPosition: number,
  id: string,
): MasteredDegree {
  const newDegree: MasteredDegree = {
    descriptionHtml: 'No description provided.',
    id,
    requirementGroups: {},
    minimumCredits: 120,
    name: degreeName,
    published: false,
    position: Math.ceil(lastPosition) + 2,
  };

  return newDegree;
}

export function getNewCourseGroupPosition(self: MasteredDegree, column: number) {
  const { requirementGroups } = self;
  const courseGroupPositions = Object.values(requirementGroups).filter(
    group => group.column === column,
  );
  const lastGroup = maxBy(courseGroupPositions, group => group.position);
  if (!lastGroup) return 0;
  return Math.ceil(lastGroup.position) + 2;
}

export function createNewGroup(
  self: MasteredDegree,
  name: string,
  column: number,
  id: string,
): MasteredDegree {
  const { requirementGroups } = self;
  const newGroup: RequirementGroup.Model = {
    name,
    column,
    id,
    courses: {},
    courseValidationEnabled: false,
    creditMaximum: 6,
    creditMinimum: 6,
    descriptionHtml: 'No description provided',
    position: getNewCourseGroupPosition(self, 1),
  };

  const newRequirementGroups = { ...requirementGroups, [newGroup.id]: newGroup };

  return {
    ...self,
    requirementGroups: newRequirementGroups,
  };
}

export function deleteGroup(self: MasteredDegree, groupIdToDelete: string): MasteredDegree {
  const { requirementGroups } = self;

  const newRequirementGroups = Object.entries(requirementGroups)
    .filter(([groupId]) => groupId !== groupIdToDelete)
    .reduce(
      (newRequirementGroups, [groupId, value]) => {
        newRequirementGroups[groupId] = value;
        return newRequirementGroups;
      },
      {} as {
        [groupId: string]: RequirementGroup.Model;
      },
    );

  return {
    ...self,
    requirementGroups: newRequirementGroups,
  };
}

export function updateGroup(
  self: MasteredDegree,
  groupId: string,
  update: (group: RequirementGroup.Model) => RequirementGroup.Model,
): MasteredDegree {
  const group = self.requirementGroups[groupId];
  if (!group) return self;

  return {
    ...self,
    requirementGroups: {
      ...self.requirementGroups,
      [groupId]: update(group),
    },
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

export function rearrangeGroups(
  self: MasteredDegree,
  _fromColumn: number,
  _toColumn: number,
  oldIndex: number,
  newIndex: number,
): MasteredDegree {
  const fromColumn = _fromColumn - 1;
  const toColumn = _toColumn - 1;

  const columnOne = getGroupsColumnOne(self);
  const columnTwo = getGroupsColumnTwo(self);
  const columnThree = getGroupsColumnThree(self);

  const columns = [columnOne, columnTwo, columnThree];
  const group = columns[fromColumn][oldIndex];

  const firstPositionInFromColumn = min(columns[toColumn].map(group => group.position)) || 0;
  const lastPositionInToColumn = max(columns[toColumn].map(group => group.position)) || 1000;

  const offset = oldIndex > newIndex ? -1 : 1;
  const positionCurrent = get(columns, _ => _[toColumn][newIndex].position);
  const positionOffset = get(columns, _ => _[toColumn][newIndex + offset].position);

  const newPosition =
    positionCurrent === undefined
      ? lastPositionInToColumn + 10
      : positionOffset === undefined
        ? oldIndex > newIndex
          ? firstPositionInFromColumn - 10
          : lastPositionInToColumn + 10
        : (positionCurrent + positionOffset) / 2;

  const groupWithNewPosition = {
    ...group,
    position: newPosition,
    column: toColumn + 1,
  };

  return {
    ...self,
    requirementGroups: {
      ...self.requirementGroups,
      [groupWithNewPosition.id]: groupWithNewPosition,
    },
  };
}
