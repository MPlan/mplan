import * as express from 'express';
export const api = express.Router();
import * as compression from 'compression';
import { dbConnection } from './models/mongo';
import * as Model from '../models/models';
import { users } from './users';
import { checkJwts } from './check-jwts';
import { degrees } from './degrees';
import { auth } from './auth';

let catalog = {} as Model.JoinedCatalog;
let lastJoinTimestamp = 0;

api.use(express.json());
api.use('/auth', auth);
api.use(checkJwts);

function shouldJoinCatalog(syncStatus: Model.SyncStatus | null | undefined) {
  if (!syncStatus) return true;
  if (syncStatus.lastSyncTimestamp > lastJoinTimestamp) return true;
  return false;
}

api.get('/catalog', compression(), async (req, res) => {
  const { courses, sections, syncStatus } = await dbConnection;

  if (shouldJoinCatalog(await syncStatus.findOne({}))) {
    console.log('Joining catalog...');
    console.time('catalog join');

    const coursesToJoin = await courses.find({}).toArray();

    const coursesArr = await Promise.all(
      coursesToJoin.map(async course => {
        return {
          key: Model.courseKey(course),
          course,
          fallSections: await sections
            .find({
              subjectCode: course.subjectCode,
              courseNumber: course.courseNumber,
              season: 'fall',
            })
            .toArray(),
          winterSections: await sections
            .find({
              subjectCode: course.subjectCode,
              courseNumber: course.courseNumber,
              season: 'winter',
            })
            .toArray(),
          summerSections: await sections
            .find({
              subjectCode: course.subjectCode,
              courseNumber: course.courseNumber,
              season: 'summer',
            })
            .toArray(),
        };
      }),
    );

    catalog = coursesArr.reduce(
      (joinedCatalog, { course, key, fallSections, summerSections, winterSections }) => {
        joinedCatalog[key] = {
          ...course,
          fallSections,
          summerSections,
          winterSections,
        };
        return joinedCatalog;
      },
      {} as Model.JoinedCatalog,
    );

    lastJoinTimestamp = Date.now();

    console.log('Done joining catalog.');
    console.timeEnd('catalog join');
  }

  res.json(catalog);
});

api.use('/users', users);
api.use('/degrees', degrees);
