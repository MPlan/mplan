import * as Catalog from './catalog';
import { get } from 'utilities/get';
import { memoizeLast } from 'utilities/memoize-last';
const { min, max, ceil } = Math;

interface MasteredCourseGroup {
  id: string;
  name: string;
  descriptionHtml: string;
  courseValidationEnabled: boolean;
  courses: { [catalogId: string]: { position: number; preset: boolean } };
  creditMinimum: number;
  creditMaximum: number;
  position: number;
  column: number;
}
export { MasteredCourseGroup as Model };

export const getCatalogIds = memoizeLast((self: MasteredCourseGroup) => {
  return Object.entries(self.courses)
    .map(([courseId, settings]) => ({
      courseId,
      position: settings.position,
    }))
    .sort((a, b) => a.position - b.position)
    .map(({ courseId }) => courseId);
});

export const getCourses = memoizeLast((self: MasteredCourseGroup, catalog: Catalog.Model) => {
  return Object.entries(self.courses)
    .map(([catalogId, settings]) => ({
      course: catalog[catalogId],
      settings,
    }))
    .filter(({ course }) => !!course)
    .sort((a, b) => a.settings.position - b.settings.position);
});

export const getPresetCourses = memoizeLast((self: MasteredCourseGroup) => {
  return Object.entries(self.courses)
    .filter(([_, { preset }]) => !!preset)
    .reduce(
      (presetCourses, [courseId]) => {
        presetCourses[courseId] = true;
        return presetCourses;
      },
      {} as {
        [catalogId: string]: true | undefined;
      },
    );
});

export function addCourse(self: MasteredCourseGroup, catalogId: string): MasteredCourseGroup {
  const lastPosition =
    max(...Object.values(self.courses).map(settings => settings.position)) || 100;

  const courses = {
    ...self.courses,
    [catalogId]: { position: ceil(lastPosition) + 2, preset: false, hidden: false },
  };

  return {
    ...self,
    courses,
  };
}

export function removeCourse(
  self: MasteredCourseGroup,
  catalogIdToDelete: string,
): MasteredCourseGroup {
  const courses = Object.entries(self.courses)
    .filter(([catalogId]) => catalogId !== catalogIdToDelete)
    .reduce(
      (courses, [catalogId, settings]) => {
        courses[catalogId] = settings;
        return courses;
      },
      {} as {
        [catalogId: string]: { position: number; preset: boolean };
      },
    );

  return {
    ...self,
    courses,
  };
}

export function togglePreset(
  self: MasteredCourseGroup,
  catalogIdToToggle: string,
): MasteredCourseGroup {
  const course = self.courses[catalogIdToToggle];
  if (!course) return self;

  const courses = {
    ...self.courses,
    [catalogIdToToggle]: {
      ...course,
      preset: !course.preset,
    },
  };

  return {
    ...self,
    courses,
  };
}

export function rearrangeCourses(
  self: MasteredCourseGroup,
  oldIndex: number,
  newIndex: number,
): MasteredCourseGroup {
  const courses = Object.entries(self.courses)
    .map(([catalogId, settings]) => ({ catalogId, ...settings }))
    .sort((a, b) => a.position - b.position);

  const catalogId = courses[oldIndex].catalogId;
  if (!catalogId) return self;

  const offset = oldIndex > newIndex ? -1 : 1;
  const positionCurrent = get(courses, _ => _[newIndex].position);
  const positionOffset = get(courses, _ => _[newIndex + offset].position);

  const lastPosition = max(...courses.map(course => course.position));
  const firstPosition = min(...courses.map(course => course.position));

  const newPosition =
    positionCurrent === undefined
      ? lastPosition + 10
      : positionOffset === undefined
        ? oldIndex > newIndex
          ? firstPosition - 10
          : lastPosition + 10
        : (positionCurrent + positionOffset) / 2;

  const settingsWithNewPosition = {
    ...self.courses[catalogId],
    position: newPosition,
  };

  return {
    ...self,
    courses: {
      ...self.courses,
      [catalogId]: settingsWithNewPosition,
    },
  };
}
