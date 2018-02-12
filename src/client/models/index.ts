import * as Recordize from 'recordize';
import * as Record from '../../models/records';
export * from '../../models/records';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
export const store = Recordize.createStore(new Record.App());

async function fetchCatalog() {
  const response = await fetch('/api/catalog');
  const courses = await response.json() as Model.Catalog;
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseId, course]) => {
    const { _id, sections: rawSections, ...restOfCourse } = course;

    const sections = (Object
      .entries(rawSections)
      .reduce((sections, [_season, sectionList]) => {
        const season = _season as 'Fall' | 'Winter' | 'Summer';
        const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
          const section = new Record.Section({ ...rawSection });
          return sectionSet.add(section);
        }, Immutable.Set<Record.Section>());

        return sections.set(season, sectionSet);
      }, Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Record.Section>>())
    );

    const courseRecord = new Record.Course({
      ...restOfCourse,
      _id: Record.ObjectId(course._id),
      sections,
    });
    return catalogRecord.set(courseId, courseRecord);
  }, Immutable.Map<string, Record.Course>());

  const catalog = new Record.Catalog({ courseMap });
  return catalog;
}

async function updateStoreWithCatalog() {
  const catalog = await fetchCatalog();
  store.sendUpdate(store => store.update('catalog', () => catalog));
}

updateStoreWithCatalog();