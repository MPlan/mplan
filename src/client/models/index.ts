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
  const cis4962 = catalog.getCourse('CIS', '4962')!;
  const cis450 = catalog.getCourse('CIS', '450')!;
  const comp270 = catalog.getCourse('COMP', '270')!;
  const cis200 = catalog.getCourse('CIS', '200')!;
  const cis150 = catalog.getCourse('CIS', '150')!;
  const cis3501 = catalog.getCourse('CIS', '3501')!;
  const math115 = catalog.getCourse('MATH', '115')!;

  store.sendUpdate(store => store
    .set('catalog', catalog)
    .update('user', user => user
      .addToDegree(cis4962)
      .addToDegree(cis450)
      .addToDegree(comp270)
      .addToDegree(cis200)
      .addToDegree(cis3501)
      .addToDegree(cis150)
      .addToDegree(math115)
    )
  );
}

updateStoreWithCatalog();