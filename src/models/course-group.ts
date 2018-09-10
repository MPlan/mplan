import * as Degree from './degree';
import * as Course from './course';
import * as MasteredDegrees from './mastered-degrees';
import * as Catalog from './catalog';

interface CourseGroup {
  id: string;
  masteredCourseGroupId?: string;
  customName?: string;
  courseIds: string[];
  completedCourseIds: { [catalogId: string]: true };
  position: number;
}
export { CourseGroup as Model };

export function getMasteredCourseGroup(
  self: CourseGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const { masteredCourseGroupId } = self;
  if (!masteredCourseGroupId) return undefined;

  const masteredDegree = Degree.getMasteredDegree(degree, masteredDegrees);
  if (!masteredDegree) return undefined;

  const masteredCourseGroup = masteredDegree.masteredCourseGroups[masteredCourseGroupId];
  if (!masteredDegree) return undefined;

  return masteredCourseGroup;
}

export function getCourseGroupName(
  self: CourseGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const masteredCourseGroup = getMasteredCourseGroup(self, degree, masteredDegrees);
  if (!masteredCourseGroup) return 'Custom Group';
  return masteredCourseGroup.name;
}

export function getDescriptionHtml(
  self: CourseGroup,
  degree: Degree.Model,
  masteredDegrees: MasteredDegrees.Model,
) {
  const masteredCourseGroup = getMasteredCourseGroup(self, degree, masteredDegrees);
  // Description html should always say this for  custom group. custom group don't have mastered
  // degree groups
  if (!masteredCourseGroup) return 'Custom group.';
  return masteredCourseGroup.name;
}

export function getCourses(self: CourseGroup, catalog: Catalog.Model) {
  const { courseIds } = self;

  return courseIds.map(courseId => catalog[courseId]);
}

export function hasCourse(self: CourseGroup, course: Course.Model) {
  const { courseIds } = self;
  return courseIds.includes(course.id);
}

export function addCourse(self: CourseGroup, courseToAdd: Course.Model): CourseGroup {
  const { courseIds } = self;
  const newCourseIds = [...courseIds.filter(id => id !== courseToAdd.id), courseToAdd.id];

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function deleteCourse(self: CourseGroup, courseToDelete: Course.Model): CourseGroup {
  const { courseIds } = self;
  const newCourseIds = courseIds.filter(id => id !== courseToDelete.id);

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function toggleCourseCompletion(self: CourseGroup, courseToToggle: Course.Model) {
  if (hasCourse(self, courseToToggle)) return deleteCourse(self, courseToToggle);
  return addCourse(self, courseToToggle);
}

export function reorderCourses(self: CourseGroup): CourseGroup {
  // TODO
  return self;
}
