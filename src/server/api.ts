import * as express from 'express';
export const api = express.Router();
import { users } from './users';
import { checkJwts } from './check-jwts';
import { degrees } from './degrees';
import { auth } from './auth';
import { admins } from './admins';
import { prerequisiteOverrides } from './prerequisite-overrides';
import { catalog } from './catalog';

api.use(express.json());
api.use('/auth', auth);
api.use(checkJwts);

api.use('/catalog', catalog);
api.use('/users', users);
api.use('/degrees', degrees);
api.use('/admins', admins);
api.use('/prerequisite-overrides', prerequisiteOverrides);
