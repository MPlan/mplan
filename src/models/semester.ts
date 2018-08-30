import { store } from './store';
import { Course } from './course';

export interface Semester {
  id: string;
  courseIds: string[];
}

export function getSeason(self: Semester) {
  // const plan = store.current
  return '';
}

export function getYear(self: Semester) {
  return 0;
}

export function getName(self: Semester) {
  const season = getSeason(self);
  const year = getYear(self);

  const seasonFirstLetter = season.substring(0, 1).toUpperCase();
  const seasonRest = season.substring(1);
  return `${seasonFirstLetter}${seasonRest} ${year}`;
}

export function getShortName(self: Semester) {
  const season = getSeason(self);
  const year = getYear(self);

  return `${season.substring(0, 1).toUpperCase()}${year}`;
}

export function getCourseCount(self: Semester) {
  return self.courseIds.length;
}

export function getCourses(self: Semester) {
  const { catalog } = store.current;
  const { courseIds } = self;

  return courseIds.map(courseId => catalog[courseId]);
}

// TODO: this should use the credit hours pickers eventually
export function getTotalCredits(self: Semester) {
  const courses = getCourses(self);

  return courses
    .map(
      course =>
        Array.isArray(course.creditHours) ? course.creditHours[1] : course.creditHours || 0,
    )
    .reduce((sum, next) => sum + next, 0);
}

export function addCourse(self: Semester, courseToAdd: Course): Semester {
  const { courseIds } = self;

  const newCourseIds = [
    ...courseIds.filter(courseId => courseId !== courseToAdd.id),
    courseToAdd.id,
  ];

  return {
    ...self,
    courseIds: newCourseIds,
  };
}

export function deleteCourse(self: Semester, courseToDelete: Course): Semester {
  const { courseIds } = self;

  return {
    ...self,
    courseIds: courseIds.filter(courseId => courseId !== courseToDelete.id),
  };
}

export function clearCourses(self: Semester): Semester {
  return {
    ...self,
    courseIds: [],
  };
}
