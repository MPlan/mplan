import * as express from 'express';
import * as HttpStatus from 'http-status';
export const users = express.Router();
import { dbConnection } from './models/mongo';

users.get('/:username', async (req, res) => {
  try {
    const username = req.params['username'];
    if (username !== req.user.nickname) {
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    if (!username) {
      console.warn('request didnt have user name');
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }
    const { users, admins } = await dbConnection;
    const user = await users.findOne({ username });
    if (!user) {
      console.warn(`request didnt find user ${username}`);
      res.sendStatus(HttpStatus.NOT_FOUND);
      return;
    }

    const isAdmin = !!(await admins.findOne({ uniqueName: username }));

    res.json({ ...user, isAdmin });
    return;
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

users.put('/:username', async (req, res) => {
  try {
    const username = req.params['username'];
    if (!username) {
      console.warn("didn't have username in request");
      res.sendStatus(HttpStatus.BAD_REQUEST);
      return;
    }
    if (username !== req.user.nickname) {
      console.warn("username didn't match JWT");
      res.sendStatus(HttpStatus.UNAUTHORIZED);
      return;
    }
    const { users } = await dbConnection;
    const user = await users.findOne({ username });
    const _userFromRequest = req.body;
    const { isAdmin, ...userFromRequest } = _userFromRequest;
    // console.log('user from request', req.body);

    if (!user) {
      // create
      // TODO: should verify the request before saving
      const insertOp = await users.insertOne(userFromRequest);
      console.info(`inserted ${insertOp.insertedCount} records for ${username}`);
    } else {
      // replace
      const replaceOp = await users.replaceOne({ username }, userFromRequest);
      console.info(`replaced ${replaceOp.modifiedCount} records for ${username}`);
    }
    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch {
    res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
  }
});
