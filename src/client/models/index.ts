import * as Recordize from 'recordize';
import * as Record from '../../models/records';
export * from '../../models/records';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
export const store = Recordize.createStore(new Record.App());
import { oneLine } from 'common-tags';

async function fetchCatalog() {
  const response = await fetch('/api/catalog');
  const courses = (await response.json()) as Model.Catalog;
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseId, course]) => {
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
      sections,
    });
    return catalogRecord.set(courseId, courseRecord);
  }, Immutable.Map<string, Record.Course>());

  const catalog = new Record.Catalog({ courseMap });
  return catalog;
}

async function updateStoreWithCatalog() {
  const catalog = await fetchCatalog();

  store.sendUpdate(store =>
    store
      .set('catalog', catalog)
      .updateDegree(degree =>
        degree
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Written and Oral Comm',
              description: oneLine`
                (6 credits) Composition Placement Exam required COMP 105 (3) and COMP 270 (3). Both
                required if not taken to fulfill DDC Written and Oral Communication.
              `,
              courses: Immutable.List([
                catalog.getCourse('COMP', '105')!,
                catalog.getCourse('COMP', '270')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Humanities and the Arts',
              description: oneLine`
                (6 credits) See DDC approved list in Degree Works or
                https://app.smartsheet.com/b/publish?EQBCT=daff687f800b4fe89910a9cea66b1627
              `,
              courses: Immutable.List([
                catalog.getCourse('MHIS', '100')!,
                catalog.getCourse('ARTH', '101')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Social and Beh. Analysis',
              description: oneLine`
                (9 credits) ECON 201 (3) or ECON 202 (3) is REQUIRED. If not taken in fulfillment
                of DDC Soc. and Beh. Analysis. Other (6 credits) must be chosen from DDC approved
                list in Degree Works or
                https://app.smartsheet.com/b/publish?EQBCT=daff687f800b4fe89910a9cea66b1627
              `,
              courses: Immutable.List([
                catalog.getCourse('ECON', '201')!,
                catalog.getCourse('SOC', '200')!,
                catalog.getCourse('PSYC', '101')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Intersections',
              description: oneLine`
                (6 credits) ENGR 400 (3) is REQUIRED. Other (3 credits) must be chosen from DDC
                approved list in Degree Works or
                https://app.smartsheet.com/b/publish?EQBCT=daff687f800b4fe89910a9cea66b1627
              `,
              courses: Immutable.List([catalog.getCourse('ENGR', '400')!]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Intro to Engineering',
              description: oneLine`
                (2 credits) ENGR 100 (2)
              `,
              courses: Immutable.List([catalog.getCourse('ENGR', '100')!]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Mathematics',
              description: oneLine`
                (16 credits) MATH 115 (4), MATH 116 (4), MATH 205 (3), MATH 216 (3), and MATH 217
                (2) (Fulfills DDC Quant. Thinking)
              `,
              courses: Immutable.List([
                catalog.getCourse('MATH', '115')!,
                catalog.getCourse('MATH', '116')!,
                catalog.getCourse('MATH', '205')!,
                catalog.getCourse('MATH', '216')!,
                catalog.getCourse('MATH', '217')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Chemistry and Physics',
              description: oneLine`
                (12 credits) CHEM 144 (4), PHYS 150 (4), and PHYS 151 (4) (Fulfills DDC Natural
                Sciences)
              `,
              courses: Immutable.List([
                catalog.getCourse('CHEM', '144')!,
                catalog.getCourse('PHYS', '150')!,
                catalog.getCourse('PHYS', '151')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Discrete Math & Prob/Stats',
              description: oneLine`
                (7 credits) ECE/MATH 276 (4), IMSE 317 (3)
              `,
              courses: Immutable.List([
                catalog.getCourse('ECE', '276')!,
                catalog.getCourse('IMSE', '317')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'ECE Core',
              description: oneLine`
                (20 credits) 5 courses: ECE 210 (4), ECE 270 (4), ECE 273 (4), ECE 311 (4), ECE 3731
                (4)
              `,
              courses: Immutable.List([
                catalog.getCourse('ECE', '210')!,
                catalog.getCourse('ECE', '270')!,
                catalog.getCourse('ECE', '273')!,
                catalog.getCourse('ECE', '311')!,
                catalog.getCourse('ECE', '3731')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'CE Core',
              description: oneLine`
                (28 credits) 8 courses: ECE 370 (4), ECE 375 (4), ECE 471 (4), ECE 473 (4), ECE 475
                (4), ECE 478 (4), ECE 4982 (2), ECE 4984 (2). (Senior Design Courses fulfill DDC
                  Upper Writing and Capstone Experience)
              `,
              courses: Immutable.List([
                catalog.getCourse('ECE', '370')!,
                catalog.getCourse('ECE', '375')!,
                catalog.getCourse('ECE', '471')!,
                catalog.getCourse('ECE', '473')!,
                catalog.getCourse('ECE', '475')!,
                catalog.getCourse('ECE', '478')!,
                catalog.getCourse('ECE', '4982')!,
                catalog.getCourse('ECE', '4984')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Professional Electives',
              description: oneLine`
                (6-8 credits) Pick TWO of the following and DELETE the rest:
                ECE 3171 (4), ECE 387 (4), ECE 413 (3), ECE 428 (3), ECE 433 (4), ECE 434 (4),
                ECE 435 (4), ECE 438 (4), ECE 467 (4), ECE 4881 (3).

                Note: Students receive credit for only one course from ECE 3171, ECE 317, and ECE
                3801.
              `,
              courses: Immutable.List([
                catalog.getCourse('ECE', '3171')!,
                catalog.getCourse('ECE', '387')!,
                // catalog.getCourse('ECE', '413')!,
                // catalog.getCourse('ECE', '428')!,
                // catalog.getCourse('ECE', '433')!,
                // catalog.getCourse('ECE', '434')!,
                // catalog.getCourse('ECE', '435')!,
                // catalog.getCourse('ECE', '438')!,
                // catalog.getCourse('ECE', '467')!,
                // catalog.getCourse('ECE', '4881')!,
              ]),
            }),
          )
          .addDegreeGroup(
            new Record.DegreeGroup({
              _id: Record.ObjectId(),
              name: 'Approved Electives',
              description: oneLine`
                (5-7 credits) See here for a partial list of approved electives
                https://umich.app.box.com/s/jlldhza7b597ba1w7dtimpd3xnaorkr3
                Note: Professional Electives and Approved Electives must total AT LEAST 13 CREDITS.
              `,
              courses: Immutable.List([
                catalog.getCourse('ECE', '433')!,
                catalog.getCourse('ECE', '434')!,
              ]),
            }),
          ),
      )
      .updatePlan(plan =>
        plan.update('semesters', semesters =>
          semesters.add(
            new Record.Semester({
              _id: Record.ObjectId(),
              season: 'Fall',
              year: 2018,
            })
              .addCourse(catalog.getCourse('ENGR', '100')!)
              .addCourse(catalog.getCourse('COMP', '105')!),
          ),
        ),
      ),
  );
}

updateStoreWithCatalog();
