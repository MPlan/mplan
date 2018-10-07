import * as express from 'express';
import * as Model from '../models';
import * as HttpStatus from 'http-status';
export const degrees = express.Router();
import { dbConnection } from './models/mongo';
import { checkAdmin } from './check-admin';

degrees.get('/', async (req, res) => {
  const { degrees } = await dbConnection;
  const allDegrees = await degrees.find({}).toArray();

  const combinedDegrees = allDegrees.reduce(
    (combined, next) => {
      combined[next.id] = next;
      return combined;
    },
    {} as any,
  );

  res.json(combinedDegrees);

  return;
});

degrees.put('/:masteredDegreeId', checkAdmin, async (req, res) => {
  const masteredDegreeId = req.params.masteredDegreeId as string | undefined;

  if (!masteredDegreeId) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const masteredDegree = req.body as Model.MasteredDegree.Model;
  const { degrees } = await dbConnection;

  const masteredDegreeFromDb = await degrees.findOne({
    id: masteredDegreeId,
  });

  if (!masteredDegreeFromDb) {
    await degrees.insertOne({ _id: masteredDegree.id, ...masteredDegree });
  } else {
    await degrees.findOneAndReplace({ id: masteredDegree.id }, masteredDegree);
  }

  res.sendStatus(HttpStatus.NO_CONTENT);
});

degrees.delete('/:masteredDegreeId', checkAdmin, async (req, res) => {
  const masteredDegreeId = req.params.masteredDegreeId as string | undefined;

  if (!masteredDegreeId) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
    return;
  }

  const { degrees } = await dbConnection;

  await degrees.findOneAndDelete({
    id: masteredDegreeId,
  });

  res.sendStatus(HttpStatus.NO_CONTENT);
});
