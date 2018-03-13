import * as Recordize from 'recordize';
import * as Record from '../../models/records';
export * from '../../models/records';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
export const store = Recordize.createStore(new Record.App());

async function fetchCatalog() {
  const response = await fetch('/api/catalog');
  const courses = (await response.json()) as Model.Catalog;
  const courseMap = Object.entries(courses).reduce(
    (catalogRecord, [courseId, course]) => {
      const { _id, sections: rawSections, ...restOfCourse } = course;

      const sections = Object.entries(rawSections).reduce(
        (sections, [_season, sectionList]) => {
          const season = _season as 'Fall' | 'Winter' | 'Summer';
          const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
            const section = new Record.Section({ ...rawSection });
            return sectionSet.add(section);
          }, Immutable.Set<Record.Section>());

          return sections.set(season, sectionSet);
        },
        Immutable.Map<
          'Fall' | 'Winter' | 'Summer',
          Immutable.Set<Record.Section>
        >()
      );

      const courseRecord = new Record.Course({
        ...restOfCourse,
        _id: Record.ObjectId(course._id),
        sections
      });
      return catalogRecord.set(courseId, courseRecord);
    },
    Immutable.Map<string, Record.Course>()
  );

  const catalog = new Record.Catalog({ courseMap });
  return catalog;
}

async function updateStoreWithCatalog() {
  const catalog = await fetchCatalog();

  store.sendUpdate(store =>
    store.set('catalog', catalog).update(
      'user',
      user =>
        user
          // SOFTWARE ENGINEERING
          // .addToDegree(catalog.getCourse('CIS', '4962')!)
          // .addToDegree(catalog.getCourse('CIS', '450')!)
          // .addToDegree(catalog.getCourse('COMP', '270')!)
          // .addToDegree(catalog.getCourse('CIS', '200')!)
          // .addToDegree(catalog.getCourse('CIS', '150')!)
          // .addToDegree(catalog.getCourse('CIS', '3501')!)
          // .addToDegree(catalog.getCourse('MATH', '115')!)
          // .addToDegree(catalog.getCourse('COMP', '105')!)

      // DATA SCIENCE
      // .addToDegree(catalog.getCourse('CIS', '1501')!)
      // .addToDegree(catalog.getCourse('MATH', '115')!)
      // .addToDegree(catalog.getCourse('MATH', '116')!)
      // .addToDegree(catalog.getCourse('MATH', '215')!)
      // .addToDegree(catalog.getCourse('MATH', '227')!)
      // .addToDegree(catalog.getCourse('CIS', '2001')!)
      // .addToDegree(catalog.getCourse('CIS', '275')!)
      // .addToDegree(catalog.getCourse('CIS', '350')!)
      // .addToDegree(catalog.getCourse('CIS', '3200')!)
      // .addToDegree(catalog.getCourse('CIS', '422')!)
      // .addToDegree(catalog.getCourse('IMSE', '317')!)
      // .addToDegree(catalog.getCourse('ENGR', '400')!)
      // .addToDegree(catalog.getCourse('STAT', '305')!)
      // .addToDegree(catalog.getCourse('STAT', '326')!)
      // .addToDegree(catalog.getCourse('CIS', '4971')!)
      // .addToDegree(catalog.getCourse('CIS', '4972')!)
      // .addToDegree(catalog.getCourse('STAT', '430')!)

      // CE/EE DUAL MAJOR
      // written and oral communication
      .addToDegree(catalog.getCourse('COMP', '105')!)
      .addToDegree(catalog.getCourse('COMP', '270')!)
      // social and behavioral analysis
      .addToDegree(catalog.getCourse('ECON', '201')!)
      // intersections
      .addToDegree(catalog.getCourse('ENGR', '400')!)
      // intro to engineering
      .addToDegree(catalog.getCourse('ENGR', '100')!)
      // mathematics
      .addToDegree(catalog.getCourse('MATH', '115')!)
      .addToDegree(catalog.getCourse('MATH', '116')!)
      .addToDegree(catalog.getCourse('MATH', '205')!)
      .addToDegree(catalog.getCourse('MATH', '216')!)
      .addToDegree(catalog.getCourse('MATH', '217')!)
      // chemistry and physics
      .addToDegree(catalog.getCourse('CHEM', '134')!)
      .addToDegree(catalog.getCourse('PHYS', '150')!)
      .addToDegree(catalog.getCourse('PHYS', '151')!)
      // discrete math and probability/statistics
      .addToDegree(catalog.getCourse('ECE', '276')!)
      .addToDegree(catalog.getCourse('IMSE', '317')!)
      // ece core
      .addToDegree(catalog.getCourse('ECE', '210')!)
      .addToDegree(catalog.getCourse('ECE', '270')!)
      .addToDegree(catalog.getCourse('ECE', '273')!)
      .addToDegree(catalog.getCourse('ECE', '311')!)
      .addToDegree(catalog.getCourse('ECE', '3731')!)
      // ce core
      .addToDegree(catalog.getCourse('ECE', '370')!)
      .addToDegree(catalog.getCourse('ECE', '375')!)
      .addToDegree(catalog.getCourse('ECE', '471')!)
      .addToDegree(catalog.getCourse('ECE', '473')!)
      .addToDegree(catalog.getCourse('ECE', '475')!)
      .addToDegree(catalog.getCourse('ECE', '478')!)
      // ee core
      .addToDegree(catalog.getCourse('ECE', '3171')!)
      .addToDegree(catalog.getCourse('ECE', '385')!)
      .addToDegree(catalog.getCourse('ECE', '450')!)
      .addToDegree(catalog.getCourse('ECE', '460')!)
      .addToDegree(catalog.getCourse('ECE', '480')!)
      .addToDegree(catalog.getCourse('ECE', '4951')!)
      // applied business
      .addToDegree(catalog.getCourse('ENGR', '400')!)
      // capstone
      .addToDegree(catalog.getCourse('ECE', '4981')!)
      .addToDegree(catalog.getCourse('ECE', '4983')!)
    )
  );
}

updateStoreWithCatalog();
