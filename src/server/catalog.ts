import * as express from 'express';
import * as compression from 'compression';
export const catalog = express.Router();
import { dbConnection } from './models/mongo';
import * as Model from 'models';
let joinedCatalog: Model.Catalog.Model | undefined;

catalog.get('/', compression(), async (_, res) => {
  const { courses } = await dbConnection;

  if (!joinedCatalog) {
    console.log('Joining catalog...');
    console.time('catalog join');

    const coursesToJoin = await courses.find({}).toArray();

    const coursesArr = await Promise.all(
      coursesToJoin.map(async course => {
        return {
          key: Model.Course.getCatalogId(course),
          course,
        };
      }),
    );

    joinedCatalog = coursesArr.reduce(
      (joinedCatalog, { course, key }) => {
        joinedCatalog[key] = {
          ...course,
        };
        return joinedCatalog;
      },
      {} as Model.Catalog.Model,
    );

    console.log('Done joining catalog.');
    console.timeEnd('catalog join');
  }

  res.json(joinedCatalog);
});
