import { Course } from './course';
import { Catalog } from './catalog';

export interface MasteredDegreeGroup {
  id: string;
  name: string;
  descriptionHtml: string;
  defaultIds: string[];
  allowListIds: string[];
  creditMinimum: number;
  creditMaximum: number;
  position: number;
  column: 1 | 2 | 3;
}

export function getDefaultCourses(self: MasteredDegreeGroup, catalog: Catalog) {
  const { defaultIds } = self;

  return defaultIds.map(id => catalog[id]);
}

export function getAllowedCourses(self: MasteredDegreeGroup, catalog: Catalog) {
  const { allowListIds } = self;

  return allowListIds.map(id => catalog[id]);
}

export function addToDefaults(self: MasteredDegreeGroup, courseToAdd: Course) {
  const { defaultIds } = self;

  const newDefaultIds = [...defaultIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredDegreeGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function deleteFromDefaults(self: MasteredDegreeGroup, courseToDelete: Course) {
  const { defaultIds } = self;

  const newDefaultIds = defaultIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredDegreeGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function adddToAllowList(self: MasteredDegreeGroup, courseToAdd: Course) {
  const { allowListIds } = self;

  const newAllowListIds = [...allowListIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredDegreeGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}

export function deleteFromAllowList(self: MasteredDegreeGroup, courseToDelete: Course) {
  const { allowListIds } = self;

  const newAllowListIds = allowListIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredDegreeGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}
