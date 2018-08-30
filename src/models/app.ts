import { Course } from './course';

export interface App {
  catalog: { [courseId: string]: Course };
  user: {};
  masteredDegrees: { [masteredDegreeId: string]: {} };
  admins: string[];
  prerequisiteOverrides: { [courseKey: string]: {} };
}
