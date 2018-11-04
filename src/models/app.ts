import * as MasteredDegrees from './mastered-degrees';
import * as User from './user';
import * as Prerequisite from './prerequisite';
import * as Catalog from './catalog';

interface App {
  catalog: Catalog.Model;
  user: User.Model | undefined;
  masteredDegrees: MasteredDegrees.Model;
  watchedMasteredDegrees: { [masteredDegreeId: string]: true };
  admins: string[];
  prerequisiteOverrides: { [courseKey: string]: Prerequisite.Model };
  loaded: boolean;
  saveCount: number;
}

export function addPrerequisiteOverride(
  self: App,
  catalogId: string,
  prerequisiteOverride: Prerequisite.Model,
): App {
  return {
    ...self,
    prerequisiteOverrides: {
      ...self.prerequisiteOverrides,
      [catalogId]: prerequisiteOverride,
    },
  };
}

export function deletePrerequisiteOverride(self: App, catalogId: string): App {
  return {
    ...self,
    prerequisiteOverrides: Object.entries(self.prerequisiteOverrides)
      .filter(([key]) => key !== catalogId)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as typeof self.prerequisiteOverrides,
      ),
  };
}

export { App as Model };
