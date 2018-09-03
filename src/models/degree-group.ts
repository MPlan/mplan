import * as Degree from './degree';
import * as Course from './course';
import * as MasteredDegrees from './mastered-degrees';
import * as Catalog from './catalog';

interface DegreeGroup {
  id: string;
  masteredDegreeGroupId?: string;
  customName?: string;
  courseIds: string[];
  completedCourseIds: { [catalogId: string]: true };
  position: number;
}
export { DegreeGroup as Model };

export function getMasteredDegreeGroup(
  self: DegreeGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const { masteredDegreeGroupId } = self;
  if (!masteredDegreeGroupId) return undefined;

  const masteredDegree = Degree.getMasteredDegree(degree, masteredDegrees);
  if (!masteredDegree) return undefined;

  const masteredDegreeGroup = masteredDegree.masteredDegreeGroups[masteredDegreeGroupId];
  if (!masteredDegree) return undefined;

  return masteredDegreeGroup;
}

export function getDegreeGroupName(
  self: DegreeGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const masteredDegreeGroup = getMasteredDegreeGroup(self, degree, masteredDegrees);
  if (!masteredDegreeGroup) return 'Custom Group';
  return masteredDegreeGroup.name;
}

export function getDescriptionHtml(
  self: DegreeGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const masteredDegreeGroup = getMasteredDegreeGroup(self, degree, masteredDegrees);
  // Description html should always say this for  custom group. custom group don't have mastered
  // degree groups
  if (!masteredDegreeGroup) return 'Custom group.';
  return masteredDegreeGroup.name;
}

export function getCourses(self: DegreeGroup, catalog: Catalog.Model) {
  const { courseIds } = self;

  return courseIds.map(courseId => catalog[courseId]);
}

export function hasCourse(self: DegreeGroup, course: Course.Model) {
  const { courseIds } = self;
  return courseIds.includes(course.id);
}

export function addCourse(self: DegreeGroup, courseToAdd: Course.Model): DegreeGroup {
  const { courseIds } = self;
  const newCourseIds = [...courseIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function deleteCourse(self: DegreeGroup, courseToDelete: Course.Model): DegreeGroup {
  const { courseIds } = self;
  const newCourseIds = courseIds.filter(id => id !== courseToDelete.id);

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function toggleCourseCompletion(self: DegreeGroup, courseToToggle: Course.Model) {
  if (hasCourse(self, courseToToggle)) return deleteCourse(self, courseToToggle);
  return addCourse(self, courseToToggle);
}

export function reorderCourses(self: DegreeGroup): DegreeGroup {
  // TODO
  return self;
}
