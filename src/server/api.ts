import * as express from 'express';
export const api = express.Router();
import * as compression from 'compression';
import { dbConnection } from './models/mongo';
import * as Model from '../models/models';
import { users } from './users';
import { checkJwts } from './check-jwts';
import { degrees } from './degrees';
import { auth } from './auth';
import { admins } from './admins';
import { prerequisiteOverrides } from './prerequisite-overrides';

let catalog: Model.JoinedCatalog | undefined;

api.use(express.json());
api.use('/auth', auth);
api.use(checkJwts);

api.get('/catalog', compression(), async (_, res) => {
  const { courses } = await dbConnection;

  if (!catalog) {
    console.log('Joining catalog...');
    console.time('catalog join');

    const coursesToJoin = await courses.find({}).toArray();

    const coursesArr = await Promise.all(
      coursesToJoin.map(async course => {
        return {
          key: Model.courseKey(course),
          course,
        };
      }),
    );

    catalog = coursesArr.reduce(
      (joinedCatalog, { course, key }) => {
        joinedCatalog[key] = {
          ...course,
        };
        return joinedCatalog;
      },
      {} as Model.JoinedCatalog,
    );

    console.log('Done joining catalog.');
    console.timeEnd('catalog join');
  }

  res.json(catalog);
});

api.use('/users', users);
api.use('/degrees', degrees);
api.use('/admins', admins);
api.use('/prerequisite-overrides', prerequisiteOverrides);
