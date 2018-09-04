import * as MasteredDegree from './mastered-degree';
import { maxBy } from 'utilities/max-by';
import { memoizeLast } from 'utilities/memoize-last';

interface MasteredDegrees {
  [masteredDegreeId: string]: MasteredDegree.Model;
}
export { MasteredDegrees as Model };

export const getAsArray = memoizeLast((self: MasteredDegrees) => {
  return Object.values(self).sort((a, b) => a.position - b.position);
});

export function getMasteredDegree(self: MasteredDegrees, masteredDegreeId: string) {
  return self[masteredDegreeId] as MasteredDegree.Model | undefined;
}

export function getLastPosition(self: MasteredDegrees) {
  const lastMasteredDegree = maxBy(Object.values(self), masteredDegree => masteredDegree.position);
  if (!lastMasteredDegree) return 0;
  return lastMasteredDegree.position;
}

export function updatedMasteredDegree(
  self: MasteredDegrees,
  masteredDegreeId: string,
  update: (masteredDegree: MasteredDegree.Model) => MasteredDegree.Model,
): MasteredDegrees {
  const masteredDegreeToUpdate = getMasteredDegree(self, masteredDegreeId);
  if (!masteredDegreeToUpdate) return self;

  const updatedMasteredDegree = update(masteredDegreeToUpdate);

  return {
    ...self,
    [updatedMasteredDegree.id]: updatedMasteredDegree,
  };
}

export function addMasteredDegree(
  self: MasteredDegrees,
  masteredDegree: MasteredDegree.Model,
): MasteredDegrees {
  return {
    ...self,
    [masteredDegree.id]: masteredDegree,
  };
}
