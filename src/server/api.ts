import * as express from 'express';
export const api = express.Router();
import * as compression from 'compression';

import { dbConnection } from './models/mongo';
import * as Model from '../models/models';

api.get('/test', (req, res) => {
  res.json({ hello: 'world' });
});

let courses: { [key: string]: Model.Course };

api.get('/courses', compression(), async (req, res) => {
  if (!courses) {
    const db = await dbConnection;
    const coursesArr = await db.courses.find({}).toArray();
    courses = coursesArr.reduce((obj, course) => {
      obj[course._id.toHexString()] = course;
      return obj;
    }, {} as { [key: string]: Model.Course })
  }

  res.json(courses);
});
