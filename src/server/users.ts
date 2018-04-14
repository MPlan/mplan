import * as express from 'express';
import * as HttpStatus from 'http-status';
export const users = express.Router();
import { dbConnection } from './models/mongo';

users.get('/:username', async (req, res) => {
  try {
    const username = req.params['username'];
    if (!username) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }
    const { users } = await dbConnection;
    const user = await users.findOne({ username });
    if (!user) {
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }
    res.json(user);
    return;
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

users.put('/:username', async (req, res) => {
  try {
    const username = req.params['username'];
    if (!username) {
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }
    const { users } = await dbConnection;
    const user = await users.findOne({ username });
    const userFromRequest = req.body;
  
    if (!user) {
      // create
      // TODO: should verify the request before saving
      await users.insertOne(userFromRequest);
    } else {
      // replace
      await users.replaceOne({ username }, userFromRequest);
    }
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});
