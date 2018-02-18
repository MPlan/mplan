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

  it('convertCatalogJsonToRecord', () => {
    expect(Immutable.isImmutable(catalog)).toBe(true);
    const cis450 = catalog.courseMap.get('CIS__|__450')!;
    expect(cis450.name).toBe('Operating Systems');
  });

  describe('User', () => {
    describe('critical path', () => {
      
    });
  });
});
