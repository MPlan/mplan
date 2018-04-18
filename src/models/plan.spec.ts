import * as fs from 'fs';
import * as path from 'path';
import * as Immutable from 'immutable';
import * as Record from './';
const rawCatalog = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './catalog.json')).toString(),
);
import * as Model from './models';

export function convertCatalogJsonToRecord(courses: Model.Catalog) {
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseCode, course]) => {
    const { _id, sections: rawSections, ...restOfCourse } = course;

    const sections = Object.entries(rawSections).reduce((sections, [_season, sectionList]) => {
      const season = _season as 'Fall' | 'Winter' | 'Summer';
      const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
        const section = new Record.Section({ ...rawSection });
        return sectionSet.add(section);
      }, Immutable.Set<Record.Section>());

      return sections.set(season, sectionSet);
    }, Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Record.Section>>());

    const courseRecord = new Record.Course({
      ...restOfCourse,
      _id: Record.ObjectId(course._id),
      fallSections: sections.get('Fall') || Immutable.Set<Record.Section>(),
      winterSections: sections.get('Winter') || Immutable.Set<Record.Section>(),
      summerSections: sections.get('Summer') || Immutable.Set<Record.Section>(),
    });
    return catalogRecord.set(courseCode, courseRecord);
  }, Immutable.Map<string, Record.Course>());

  const catalog = new Record.Catalog({ courseMap });
  return catalog;
}

describe('Plan', () => {
  let catalog: Record.Catalog;

  beforeAll(() => {
    catalog = convertCatalogJsonToRecord(rawCatalog);
  });

  it('works', () => {
    new Record.Plan();
  });
});
