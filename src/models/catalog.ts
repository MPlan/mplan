import * as Course from './course';

interface Catalog {
  [catalogId: string]: Course.Model;
}
export { Catalog as Model };

export function getCourse(self: Catalog, subjectCode: string, courseNumber: string) {
  const catalogId = Course.makeCatalogId(subjectCode, courseNumber);
  return self[catalogId] as Course.Model | undefined;
}
