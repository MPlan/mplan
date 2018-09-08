import * as Plan from './plan';
import * as Degree from './degree';
import * as Prerequisite from './prerequisite';

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
    degreeGroupData: {},
  },
  isAdmin: false,
  userPrerequisiteOverrides: {},
};

export { User as Model };
