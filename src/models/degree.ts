import * as MasteredDegrees from './mastered-degrees';
import * as CourseGroup from './course-group';
import * as Catalog from './catalog';
import * as Course from './course';
import { flatten } from 'lodash';
import { memoizeLast } from 'utilities/memoize-last';
import { ObjectId } from 'utilities/object-id';
import { maxBy } from 'utilities/max-by';

interface Degree {
  masteredDegreeId?: string;
  courseGroupData: { [courseGroupId: string]: CourseGroup.Model };
}
export { Degree as Model };

export function hasCourse(self: Degree, course: Course.Model, catalog: Catalog.Model) {
  const allCourses = getAllCourses(self, catalog);
  const courseCatalogId = Course.getCatalogId(course);
  return !!Array.from(allCourses.values()).find(
    course => Course.getCatalogId(course) === courseCatalogId,
  );
}

export function getMasteredDegree(self: Degree, masteredDegrees: MasteredDegrees.Model) {
  const { masteredDegreeId } = self;
  if (!masteredDegreeId) return undefined;
  return MasteredDegrees.getMasteredDegree(masteredDegrees, masteredDegreeId);
}

export function getDegreeName(self: Degree, masteredDegrees: MasteredDegrees.Model) {
  const masteredDegree = getMasteredDegree(self, masteredDegrees);

  if (masteredDegree) return masteredDegree.name;
  return '';
}

export const getAllCourses = memoizeLast((self: Degree, catalog: Catalog.Model) => {
  const { courseGroupData } = self;

  const courseArr = flatten(
    Object.values(courseGroupData).map(courseGroup => CourseGroup.getCourses(courseGroup, catalog)),
  );

  const courses = new Set<Course.Model>();
  for (const course of courseArr) {
    courses.add(course);
  }

  return courses;
});

export function getClosure(self: Degree) {}
export function getLevels(self: Degree) {}
export function getTotalCredits(self: Degree) {}
export function getCompletedCredits(self: Degree) {}
export function getPercentComplete(self: Degree) {}
// export function generatePlan()
export function addNewCourseGroup(self: Degree): Degree {
  const lastGroup = maxBy(Object.values(self.courseGroupData), group => group.position);
  const position = (lastGroup && lastGroup.position) || 0;
  const newCourseGroup: CourseGroup.Model = {
    completedCourseIds: {},
    courseIds: [],
    id: ObjectId(),
    position: Math.ceil(position) + 2,
  };

  return {
    ...self,
    courseGroupData: {
      ...self.courseGroupData,
      [newCourseGroup.id]: newCourseGroup,
    },
  };
}

export function deleteCourseGroup(self: Degree, courseGroupIdToDelete: string): Degree {
  const newCourseGroupData = Object.entries(self.courseGroupData)
    .filter(([courseGroupId]) => courseGroupIdToDelete)
    .reduce(
      (courseGroupData, [courseGroupId, courseGroup]) => {
        courseGroupData[courseGroupId] = courseGroup;
        return courseGroupData;
      },
      {} as { [catalogId: string]: CourseGroup.Model },
    );

  return {
    ...self,
    courseGroupData: newCourseGroupData,
  };
}

export function updateCourseGroup(
  self: Degree,
  courseGroupIdToUpdate: string,
  update: (courseGroup: CourseGroup.Model) => CourseGroup.Model,
): Degree {
  const courseGroupToUpdate = self.courseGroupData[courseGroupIdToUpdate];
  if (!courseGroupIdToUpdate) return self;

  return {
    ...self,
    courseGroupData: {
      ...self.courseGroupData,
      [courseGroupIdToUpdate]: update(courseGroupToUpdate),
    },
  };
}

export function reorderCourseGroups(self: Degree) {}
