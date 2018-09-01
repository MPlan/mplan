import { Plan } from './plan';
import { Degree } from './degree';
import { Prerequisite } from './prerequisite';

export interface User {
  id: string;
  username: string;
  registerDate: number;
  lastLoginDate: number;
  lastUpdateDate: number;
  chosenDegree: boolean;
  plan: Plan;
  degree: Degree;
  isAdmin: boolean;
  userPrerequisiteOverrides: { [catalogId: string]: Prerequisite };
}
