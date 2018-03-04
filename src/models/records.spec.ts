import * as fs from 'fs';
import * as path from 'path';
import * as Immutable from 'immutable';
import * as Record from './records';
const rawCatalog = JSON.parse(fs.readFileSync(path.resolve(__dirname, './catalog.json')).toString());

import { convertCatalogJsonToRecord } from './records';

describe('record models', () => {
  let catalog: Record.Catalog;

  beforeAll(() => {
    catalog = convertCatalogJsonToRecord(rawCatalog);
  });

  it('allCombinations', () => {
    const one = new Record.Course({ name: '1' });
    const setOne = Immutable.Set<Record.Course>([one]);
    const setSetOne = Immutable.Set<Immutable.Set<Record.Course>>([setOne]);

    const a = new Record.Course({ name: 'A' });
    const b = new Record.Course({ name: 'B' });
    const setA = Immutable.Set<Record.Course>([a]);
    const setB = Immutable.Set<Record.Course>([b]);
    const setAB = Immutable.Set<Immutable.Set<Record.Course>>([setA, setB]);

    const x = new Record.Course({ name: 'X' });
    const y = new Record.Course({ name: 'Y' });
    const setX = Immutable.Set<Record.Course>([x]);
    const setY = Immutable.Set<Record.Course>([y]);
    const setXY = Immutable.Set<Immutable.Set<Record.Course>>([setX, setY]);


    const result = Record.allCombinations([setAB, setXY, setSetOne]);

    const expectedResult = Immutable.Set<Immutable.Set<Record.Course>>()
      .add(Immutable.Set<Record.Course>([one, a, x]))
      .add(Immutable.Set<Record.Course>([one, a, y]))
      .add(Immutable.Set<Record.Course>([one, b, x]))
      .add(Immutable.Set<Record.Course>([one, b, y]))

    expect(result.equals(expectedResult)).toBe(true);
  });

  it('convertCatalogJsonToRecord', () => {
    expect(Immutable.isImmutable(catalog)).toBe(true);
    const cis450 = catalog.getCourse('CIS', '450')!;
    expect(cis450.name).toBe('Operating Systems');
  });

  it('prerequisitesFlattened', () => {
    const course = catalog.getCourse('CIS', '450')!;
    const prerequisitesFlattened = course.prerequisitesFlattened(catalog);

    console.log(`unflattened course prerequisite options for ${course.subjectCode} ${course.courseNumber}`);
    console.log(`
ALL
|--IMSE 317
|
+--EITHER
   |--ALL
   |  |--ECE 370
   |  +--MATH 276
   |
   |--ALL
   |  |--ECE 370
   |  +--ECE 276
   |
   +--ALL
      |--CIS 310
      +--EITHER
         |--CIS 350
         |--CIS 3501
         +--ISME 350
`);

    console.log(`flattend course prerequisite options for ${course.subjectCode} ${course.courseNumber}`);
    console.log('EITHER');
    console.log('|')
    for (const prerequisiteSet of prerequisitesFlattened) {
      const set = prerequisiteSet.map(course => typeof course === 'string'
        ? course
        : `${course.subjectCode} ${course.courseNumber}`
      );
      console.log(`|--ALL`)
      for (const course of set) {
        console.log(`|  |--${course}`)
      }
      console.log('|')
    }
  });

  // it('prerequisiteDepth', () => {
  //   const course = catalog.getCourse('CIS', '4962')!;

  //   console.log(course.prerequisiteDepth(catalog));
  // });

  it('pointer equality test', () => {
    const cis375 = catalog.getCourse('CIS', '375');
    const alsoCis375 = catalog.getCourse('CIS', '375');
    expect(cis375).toBe(alsoCis375);
  })

  it('preferredCoursesCount', () => {
    const cis375 = catalog.getCourse('ECE', '370')!;
    const cis350 = catalog.getCourse('CIS', '350')!;
    const cis200 = catalog.getCourse('CIS', '200')!;

    const preferredCourses = Immutable.Set<string | Record.Course>().add(cis350).add(cis200);

    const result = cis375.preferredCoursesCount(catalog, preferredCourses);
    console.log({ result });
  });

  it('preferredSequence', () => {
    // course we want to find the preferred sequence
    const cis4962 = catalog.getCourse('CIS', '4962')!;

    // preferred courses to input into the algorithm
    const cis350 = catalog.getCourse('CIS', '350')!;
    const cis200 = catalog.getCourse('CIS', '200')!;
    const comp270 = catalog.getCourse('COMP', '270')!;

    const preferredCourses = Immutable.Set<string | Record.Course>()
      .add(cis350)
      .add(cis200)
      .add(comp270);

    const preferredSequence = cis4962.preferredSequence(catalog, preferredCourses)!;

    function convertToString(set: Immutable.Set<string | Record.Course>) {
      const namesOfCourses: Array<any> = [];

      for (let course of set) {
        if (typeof course === 'string') {
          namesOfCourses.push(course);
        } else {
          const courseName = `${course.subjectCode} ${course.courseNumber}`;
          namesOfCourses.push(courseName);
          const subPreferredCourses = course.preferredSequence(catalog, preferredCourses);
          if (!subPreferredCourses) { continue; }
          namesOfCourses.push(convertToString(subPreferredCourses));
        }
      }

      return namesOfCourses;
    }

    console.log(JSON.stringify(convertToString(preferredSequence), null, 2));


    // const queue = [] as Array<string | Record.Course>;

    // function print(set: Immutable.Set<string | Record.Course>) {
    //   for (const course in set) {
    //     queue.push(course);
    //   }
    // }
  })

  describe('User', () => {
    describe('critical path', () => {

    });
  });
});
