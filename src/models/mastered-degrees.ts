import { MasteredDegree } from './mastered-degree';

export interface MasteredDegrees {
  [masteredDegreeId: string]: MasteredDegree;
}

export function getMasteredDegree(self: MasteredDegrees, masteredDegreeId: string) {
  return self[masteredDegreeId] as MasteredDegree | undefined;
}
