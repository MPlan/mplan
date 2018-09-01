import { MasteredDegrees } from './mastered-degrees';
import { User } from './user';
import { Prerequisite } from './prerequisite';
import { Catalog } from './catalog';

export interface App {
  catalog: Catalog;
  user: User | undefined;
  masteredDegrees: MasteredDegrees;
  admins: string[];
  prerequisiteOverrides: { [courseKey: string]: Prerequisite };
}
