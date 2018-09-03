import * as MasteredDegrees from './mastered-degrees';
import * as User from './user';
import * as Prerequisite from './prerequisite';
import * as Catalog from './catalog';

interface App {
  catalog: Catalog.Model;
  user: User.Model | undefined;
  masteredDegrees: MasteredDegrees.Model;
  admins: string[];
  prerequisiteOverrides: { [courseKey: string]: Prerequisite.Model };
  loaded: boolean;
}

export { App as Model };
