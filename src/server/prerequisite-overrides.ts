import * as express from 'express';
import * as Model from 'models';
import * as HttpStatus from 'http-status';
export const prerequisiteOverrides = express.Router();
import { checkAdmin } from './check-admin';
import { dbConnection } from './models/mongo';

prerequisiteOverrides.get('/', async (_, res) => {
  const { prerequisiteOverrides } = await dbConnection;
  const prerequisiteOverridesFromDb = await prerequisiteOverrides.find({}).toArray();
  const overridesObject = prerequisiteOverridesFromDb.reduce(
    (acc, next) => {
      acc[next.courseKey] = next.prerequisites;
      return acc;
    },
    {} as { [courseKey: string]: Model.Prerequisite.Model },
  );

  res.json(overridesObject);
});

prerequisiteOverrides.put('/:courseKey', checkAdmin, async (req, res) => {
  const courseKey = req.params.courseKey as string;
  if (!courseKey) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }
  const body = req.body;
  if (!body.prerequisites) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }
  const prerequisites = body.prerequisites;

  const { prerequisiteOverrides } = await dbConnection;

  const exists = !!(await prerequisiteOverrides.findOne({ courseKey }));

  if (!exists) {
    await prerequisiteOverrides.insertOne({ courseKey, prerequisites });
  } else {
    await prerequisiteOverrides.findOneAndReplace({ courseKey }, { courseKey, prerequisites });
  }

  res.sendStatus(HttpStatus.NO_CONTENT);
});

prerequisiteOverrides.delete('/:courseKey', checkAdmin, async (req, res) => {
  const courseKey = req.params.courseKey;
  if (!courseKey) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const { prerequisiteOverrides } = await dbConnection;

  const exists = !!(await prerequisiteOverrides.findOne({ courseKey }));

  if (!exists) {
    res.sendStatus(HttpStatus.NOT_FOUND);
    return;
  }

  await prerequisiteOverrides.findOneAndDelete({ courseKey });
  res.sendStatus(HttpStatus.NO_CONTENT);
});
