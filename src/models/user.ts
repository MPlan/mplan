import * as Plan from './plan';
import * as Degree from './degree';
import * as Prerequisite from './prerequisite';
import * as Course from './course';

interface User {
  id: string;
  username: string;
  registerDate: number;
  lastLoginDate: number;
  lastUpdateDate: number;
  chosenDegree: boolean;
  plan: Plan.Model;
  degree: Degree.Model;
  isAdmin: boolean;
  userPrerequisiteOverrides: { [catalogId: string]: Prerequisite.Model };
}

export const emptyUser: User = {
  id: '',
  username: '',
  registerDate: 0,
  lastLoginDate: 0,
  lastUpdateDate: 0,
  chosenDegree: false,
  plan: {
    anchorSeason: '',
    anchorYear: 0,
    semesters: [],
  },
  degree: {
    courseGroupData: {},
  },
  isAdmin: false,
  userPrerequisiteOverrides: {},
};

export function addPrerequisiteOverride(
  self: User,
  subjectCode: string,
  courseNumber: string,
  prerequisite: Prerequisite.Model,
): User {
  const catalogId = Course.makeCatalogId(subjectCode, courseNumber);

  return {
    ...self,
    userPrerequisiteOverrides: {
      ...self.userPrerequisiteOverrides,
      [catalogId]: prerequisite,
    },
  };
}

export function removePrerequisiteOverride(
  self: User,
  subjectCode: string,
  courseNumber: string,
): User {
  const catalogId = Course.makeCatalogId(subjectCode, courseNumber);
  return {
    ...self,
    userPrerequisiteOverrides: Object.entries(self.userPrerequisiteOverrides)
      .filter(([key]) => key !== catalogId)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as typeof self.userPrerequisiteOverrides,
      ),
  };
}

export { User as Model };
