import * as Catalog from './catalog';
import { memoizeLast } from 'utilities/memoize-last';

interface RequirementGroup {
  id: string;
  name: string;
  descriptionHtml: string;
  courseValidationEnabled: boolean;
  /** array of catalog ids */
  courses: string[];
  presetCourses: { [catalogId: string]: true | undefined };
  creditMinimum: number;
  creditMaximum: number;
  position: number;
  column: number;
}
export { RequirementGroup as Model };

export const getCourses = memoizeLast((self: RequirementGroup, catalog: Catalog.Model) => {
  return self.courses
    .map(catalogId => ({
      course: catalog[catalogId],
      preset: self.presetCourses[catalogId],
    }))
    .filter(({ course }) => !!course);
});

export function addCourse(self: RequirementGroup, catalogId: string): RequirementGroup {
  return {
    ...self,
    courses: [...self.courses, catalogId],
  };
}

export function removeCourse(self: RequirementGroup, catalogIdToDelete: string): RequirementGroup {
  const presetCourses = Object.keys(self.presetCourses)
    .filter(catalogId => catalogId !== catalogIdToDelete)
    .reduce(
      (presetCourses, catalogId) => {
        presetCourses[catalogId] = true;
        return presetCourses;
      },
      {} as { [catalogId: string]: true | undefined },
    );

  return {
    ...self,
    courses: self.courses.filter(catalogId => catalogId !== catalogIdToDelete),
    presetCourses,
  };
}

export function togglePreset(self: RequirementGroup, catalogIdToToggle: string): RequirementGroup {
  if (self.presetCourses[catalogIdToToggle]) {
    // remove course
    return {
      ...self,
      presetCourses: Object.keys(self.presetCourses)
        .filter(catalogId => catalogId !== catalogIdToToggle)
        .reduce(
          (presetCourses, catalogId) => {
            presetCourses[catalogId] = true;
            return presetCourses;
          },
          {} as { [catalogId: string]: true | undefined },
        ),
    };
  }

  // add courses
  return {
    ...self,
    presetCourses: {
      ...self.presetCourses,
      [catalogIdToToggle]: true,
    },
  };
}

export function rearrangeCourses(
  self: RequirementGroup,
  oldIndex: number,
  newIndex: number,
): RequirementGroup {
  if (oldIndex === newIndex) return self;

  const catalogId = self.courses[oldIndex];
  const { courses } = self;

  const withoutOldIndex = [
    ...courses.slice(0, oldIndex),
    ...courses.slice(oldIndex + 1, courses.length),
  ];

  const withNewIndex = [
    ...withoutOldIndex.slice(0, newIndex),
    catalogId,
    ...withoutOldIndex.slice(newIndex, withoutOldIndex.length),
  ];

  return {
    ...self,
    courses: withNewIndex,
  };
}
