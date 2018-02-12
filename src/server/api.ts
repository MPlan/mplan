import * as express from 'express';
export const api = express.Router();
import * as compression from 'compression';

import { dbConnection } from './models/mongo';
import { sequentially, log } from '../utilities/utilities';
import * as Model from '../models/models';

api.get('/test', (req, res) => {
  res.json({ hello: 'world' });
});

let catalog: Model.Catalog;

api.get('/catalog', compression(), async (req, res) => {
  if (!catalog) {
    log.info('calculating catalog for the first time...');
    console.time('catalog');
    const db = await dbConnection;
    const coursesArr = await db.courses.find({}).toArray();
    const courseWithSections = await Promise.all(coursesArr.map(async course => {
      const sections = await db.sections.find({ courseId: course._id }).toArray();
      const courseWithSections: Model.CourseWithSections = {
        ...course,
        sections: sections.reduce((sectionsBySemester, section) => {
          sectionsBySemester[section.termCode] = sectionsBySemester[section.termCode] || [];
          sectionsBySemester[section.termCode].push(section);
          return sectionsBySemester;
        }, {} as { [termCode: string]: Model.Section[] })
      };
      return courseWithSections;
    }));
    catalog = courseWithSections.reduce((catalog, courseWithSection) => {
      catalog[courseWithSection._id.toHexString()] = courseWithSection;
      return catalog;
    }, {} as Model.Catalog);
    log.info('finished calculating catalog!');
    console.timeEnd('catalog');
  }

  res.json(catalog);
});
