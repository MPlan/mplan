import * as MasteredDegree from './mastered-degree';

interface MasteredDegrees {
  [masteredDegreeId: string]: MasteredDegree.Model;
}
export { MasteredDegrees as Model };

export function getMasteredDegree(self: MasteredDegrees, masteredDegreeId: string) {
  return self[masteredDegreeId] as MasteredDegree.Model | undefined;
}
