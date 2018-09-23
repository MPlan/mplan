import * as Course from './course';
import * as Catalog from './catalog';

interface MasteredCourseGroup {
  id: string;
  name: string;
  descriptionHtml: string;
  defaultIds: string[];
  recommendedIds: string[];
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

export function getRecommendedCourses(self: MasteredCourseGroup, catalog: Catalog.Model) {
  const { recommendedIds } = self;

  return recommendedIds.map(id => catalog[id]);
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

export function addToRecommendedList(self: MasteredCourseGroup, courseToAdd: Course.Model) {
  const { recommendedIds } = self;

  const newRecommendedIds = [...recommendedIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  const newSelf: MasteredCourseGroup = {
    ...self,
    recommendedIds: newRecommendedIds,
  };
  return newSelf;
}

export function deleteFromRecommended(self: MasteredCourseGroup, courseToDelete: Course.Model) {
  const { recommendedIds } = self;

  const newRecommendedIds = recommendedIds.filter(id => id !== courseToDelete.id);

  const newSelf: MasteredCourseGroup = {
    ...self,
    recommendedIds: newRecommendedIds,
  };
  return newSelf;
}
