import * as Course from './course';
import * as Catalog from './catalog';

interface MasteredDegreeGroup {
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
export { MasteredDegreeGroup as Model };

export function getDefaultCourses(self: MasteredDegreeGroup, catalog: Catalog.Model) {
  const { defaultIds } = self;

  return defaultIds.map(id => catalog[id]);
}

export function getAllowedCourses(self: MasteredDegreeGroup, catalog: Catalog.Model) {
  const { allowListIds } = self;

  return allowListIds.map(id => catalog[id]);
}

export function addToDefaults(self: MasteredDegreeGroup, courseToAdd: Course.Model) {
  const { defaultIds } = self;

  const newDefaultIds = [...defaultIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredDegreeGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function deleteFromDefaults(self: MasteredDegreeGroup, courseToDelete: Course.Model) {
  const { defaultIds } = self;

  const newDefaultIds = defaultIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredDegreeGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function adddToAllowList(self: MasteredDegreeGroup, courseToAdd: Course.Model) {
  const { allowListIds } = self;

  const newAllowListIds = [...allowListIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredDegreeGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}

export function deleteFromAllowList(self: MasteredDegreeGroup, courseToDelete: Course.Model) {
  const { allowListIds } = self;

  const newAllowListIds = allowListIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredDegreeGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}
