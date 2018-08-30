import { store } from './store';
import { getMasteredDegree } from './degree';
import { Course } from './course';

export interface DegreeGroup {
  id: string;
  masteredDegreeGroupId?: string;
  customName?: string;
  courseIds: string[];
  completedCourseIds: { [catalogId: string]: true };
  position: number;
}

export function getMasteredDegreeGroup(self: DegreeGroup) {
  const { masteredDegreeGroupId } = self;
  if (!masteredDegreeGroupId) return undefined;

  const { degree } = store.current.user;

  const masteredDegree = getMasteredDegree(degree);
  if (!masteredDegree) return undefined;

  const masteredDegreeGroup = masteredDegree.masteredDegreeGroups[masteredDegreeGroupId];
  if (!masteredDegree) return undefined;

  return masteredDegreeGroup;
}

export function getName(self: DegreeGroup) {
  const masteredDegreeGroup = getMasteredDegreeGroup(self);
  if (!masteredDegreeGroup) return 'Custom Group';
  return masteredDegreeGroup.name;
}

export function getDescriptionHtml(self: DegreeGroup) {
  const masteredDegreeGroup = getMasteredDegreeGroup(self);
  // Description html should always say this for  custom group. custom group don't have mastered
  // degree groups
  if (!masteredDegreeGroup) return 'Custom group.';
  return masteredDegreeGroup.name;
}

export function getCourses(self: DegreeGroup) {
  const { courseIds } = self;
  const { catalog } = store.current;

  return courseIds.map(courseId => catalog[courseId]);
}

export function hasCourse(self: DegreeGroup, course: Course) {
  const { courseIds } = self;
  return courseIds.includes(course.id);
}

export function addCourse(self: DegreeGroup, courseToAdd: Course): DegreeGroup {
  const { courseIds } = self;
  const newCourseIds = [...courseIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function deleteCourse(self: DegreeGroup, courseToDelete: Course): DegreeGroup {
  const { courseIds } = self;
  const newCourseIds = courseIds.filter(id => id !== courseToDelete.id);

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function toggleCourseCompletion(self: DegreeGroup, courseToToggle: Course) {
  if (hasCourse(self, courseToToggle)) return deleteCourse(self, courseToToggle);
  return addCourse(self, courseToToggle);
}

export function reorderCourses(self: DegreeGroup): DegreeGroup {
  // TODO
  return self;
}
