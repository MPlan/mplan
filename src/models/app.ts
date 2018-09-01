import { Course } from './course';
import { MasteredDegree } from './mastered-degree';
import { User } from './user';
import { Prerequisite } from './prerequisite';

export interface App {
  catalog: { [courseId: string]: Course };
  user: User | undefined;
  masteredDegrees: { [masteredDegreeId: string]: MasteredDegree };
  admins: string[];
  prerequisiteOverrides: { [courseKey: string]: Prerequisite };
}
