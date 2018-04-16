import * as express from 'express';
import * as HttpStatus from 'http-status';
export const degrees = express.Router();
import { dbConnection } from './models/mongo';

// degrees.get('/', async (req, res) => {
//   try {
//     // const { degrees } = await dbConnection;
//     // const allDegrees = await degrees.find({}).toArray();
//     // allDegrees.reduce()
//     // if (!user) {
//     //   console.warn(`request didnt find user ${username}`);
//     //   res.sendStatus(HttpStatus.NOT_FOUND);
//     //   return;
//     // }
//     // res.json(user);
//     // return;
//   } catch {
//     res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
//   }
// });

degrees.put('/', async (req, res) => {
  try {
    const degreesFromClient = Object.values(req.body).filter((d: any) => !!d._id) as any[];
    console.log(degreesFromClient);
    const { degrees } = await dbConnection;

    for (const degreeFromClient of degreesFromClient) {
      const degreeFromDb = await degrees.findOne({ _id: degreeFromClient._id });
      if (!degreeFromDb) {
        await degrees.insertOne(degreeFromClient);
      } else {
        await degrees.findOneAndReplace({ _id: degreeFromClient._id }, degreeFromClient);
      }
    }
  } catch (e) {
    console.error(e);
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});
