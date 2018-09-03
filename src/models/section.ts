import * as Course from './course';

interface Section {
  id: string;
  subjectCode: string;
  courseNumber: string;
  termCode: string;
  season: 'fall' | 'summer' | 'winter';
  instructors: string[];
  times: string[];
  days: string[];
  locations: string[];
  capacity: number;
  remaining: number;
  crossList: [string, string][];
}
export { Section as Model };

export function getCatalogId(self: Section) {
  return Course.makeCatalogId(self.subjectCode, self.courseNumber);
}
