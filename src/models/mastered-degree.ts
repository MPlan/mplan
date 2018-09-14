import { ObjectId } from 'utilities/object-id';
import * as MasteredCourseGroup from './mastered-course-group';
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
  masteredCourseGroups: { [groupId: string]: MasteredCourseGroup.Model };
  position: number;
}
export { MasteredDegree as Model };

const selectMasteredCourseGroups = (self: MasteredDegree) => self.masteredCourseGroups;

export const getCourseGroups = createSelector(selectMasteredCourseGroups, masteredCourseGroups => {
  return Object.values(masteredCourseGroups)
    .reduce(
      (courseGroupArray, group) => {
        courseGroupArray.push(group);
        return courseGroupArray;
      },
      [] as MasteredCourseGroup.Model[],
    )
    .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
});

export const getCourseGroupsColumnOne = createSelector(
  selectMasteredCourseGroups,
  masteredCourseGroups => {
    return Object.values(masteredCourseGroups)
      .reduce(
        (courseGroupArray, group) => {
          courseGroupArray.push(group);
          return courseGroupArray;
        },
        [] as MasteredCourseGroup.Model[],
      )
      .filter(group => group.column === 1)
      .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
  },
);

export const getCourseGroupsColumnTwo = createSelector(
  selectMasteredCourseGroups,
  masteredCourseGroups => {
    return Object.values(masteredCourseGroups)
      .reduce(
        (courseGroupArray, group) => {
          courseGroupArray.push(group);
          return courseGroupArray;
        },
        [] as MasteredCourseGroup.Model[],
      )
      .filter(group => group.column === 2)
      .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
  },
);

export const getCourseGroupsColumnThree = createSelector(
  selectMasteredCourseGroups,
  masteredCourseGroups => {
    return Object.values(masteredCourseGroups)
      .reduce(
        (courseGroupArray, group) => {
          courseGroupArray.push(group);
          return courseGroupArray;
        },
        [] as MasteredCourseGroup.Model[],
      )
      .filter(group => group.column === 3)
      .sort((a, b) => a.column * 1000 + a.position - (b.column * 1000 + b.position));
  },
);

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

export function rearrangeCourseGroups(
  self: MasteredDegree,
  _fromColumn: number,
  _toColumn: number,
  oldIndex: number,
  newIndex: number,
): MasteredDegree {
  const fromColumn = _fromColumn - 1;
  const toColumn = _toColumn - 1;

  const columnOne = getCourseGroupsColumnOne(self);
  const columnTwo = getCourseGroupsColumnTwo(self);
  const columnThree = getCourseGroupsColumnThree(self);

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
    masteredCourseGroups: {
      ...self.masteredCourseGroups,
      [groupWithNewPosition.id]: groupWithNewPosition,
    },
  };
}
