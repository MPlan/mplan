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

export function createNewMasteredDegree(self: MasteredDegrees, newDegreeName: string) {
  const lastPosition = maxBy(Object.values(self), masteredDegree => masteredDegree.position)
    .position;
  const newDegree: MasteredDegree.Model = {
    descriptionHtml: 'No description provided.',
    id: ObjectId(),
    masteredDegreeGroups: {},
    minimumCredits: 120,
    name: newDegreeName,
    published: false,
    position: Math.ceil(lastPosition) + 2,
  };

  return {
    ...self,
    [newDegree.id]: newDegree,
  };
}
