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
export { User as Model };
