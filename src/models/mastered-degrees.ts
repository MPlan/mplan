import { ObjectId } from 'utilities/object-id';
import * as MasteredDegree from './mastered-degree';
import { maxBy } from 'utilities/max-by';

interface MasteredDegrees {
  [masteredDegreeId: string]: MasteredDegree.Model;
}
export { MasteredDegrees as Model };

export function getMasteredDegree(self: MasteredDegrees, masteredDegreeId: string) {
  return self[masteredDegreeId] as MasteredDegree.Model | undefined;
}

export function getLastPosition(self: MasteredDegrees) {
  const lastMasteredDegree = maxBy(Object.values(self), masteredDegree => masteredDegree.position);
  if (!lastMasteredDegree) return 0;
  return lastMasteredDegree.position;
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
