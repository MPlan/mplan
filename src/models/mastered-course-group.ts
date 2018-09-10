import * as Course from './course';
import * as Catalog from './catalog';

interface MasteredCourseGroup {
  id: string;
  name: string;
  descriptionHtml: string;
  defaultIds: string[];
  allowListIds: string[];
  creditMinimum: number;
  creditMaximum: number;
  position: number;
  column: number;
}
export { MasteredCourseGroup as Model };

export function getDefaultCourses(self: MasteredCourseGroup, catalog: Catalog.Model) {
  const { defaultIds } = self;

  return defaultIds.map(id => catalog[id]);
}

export function getAllowedCourses(self: MasteredCourseGroup, catalog: Catalog.Model) {
  const { allowListIds } = self;

  return allowListIds.map(id => catalog[id]);
}

export function addToDefaults(self: MasteredCourseGroup, courseToAdd: Course.Model) {
  const { defaultIds } = self;

  const newDefaultIds = [...defaultIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredCourseGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function deleteFromDefaults(self: MasteredCourseGroup, courseToDelete: Course.Model) {
  const { defaultIds } = self;

  const newDefaultIds = defaultIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredCourseGroup = {
    ...self,
    defaultIds: newDefaultIds,
  };
  return newSelf;
}

export function adddToAllowList(self: MasteredCourseGroup, courseToAdd: Course.Model) {
  const { allowListIds } = self;

  const newAllowListIds = [...allowListIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredCourseGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}

export function deleteFromAllowList(self: MasteredCourseGroup, courseToDelete: Course.Model) {
  const { allowListIds } = self;

  const newAllowListIds = allowListIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredCourseGroup = {
    ...self,
    allowListIds: newAllowListIds,
  };
  return newSelf;
}
