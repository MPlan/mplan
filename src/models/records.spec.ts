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
    const course = catalog.getCourse('ARTH', '400')!;
    const prerequisitesFlattened = course.prerequisitesFlattened(catalog);

    console.log('{');
    for (const prerequisiteSet of prerequisitesFlattened) {
      const set = prerequisiteSet.map(course => typeof course === 'string'
        ? course
        : `${course.subjectCode} ${course.courseNumber}`
      ).join(', ');
      console.log(`  { ${set} }`);
    }
    console.log('}');
  });

  describe('User', () => {
    describe('critical path', () => {

    });
  });
});
