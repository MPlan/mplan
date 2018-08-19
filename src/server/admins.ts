import * as express from 'express';
import * as HttpStatus from 'http-status';
export const admins = express.Router();
import { dbConnection } from './models/mongo';

admins.get('/', async (_, res) => {
  const { admins } = await dbConnection;
  const adminsFromDb = await admins.find({}).toArray();
  const adminsArray = adminsFromDb.map(admin => admin.uniqueName);

  res.json(adminsArray);
});

admins.put('/', async (req, res) => {
  const body = req.body;
  if (!Array.isArray(body)) {
    res.sendStatus(HttpStatus.BAD_REQUEST);
  }
  const adminsFromRequest = body
    .filter((maybeAdmin: any) => typeof maybeAdmin === 'string')
    .map((admin: string) => admin.trim().toLowerCase()) as string[];

  const { admins } = await dbConnection;
  const adminsFromDb = await admins.find({}).toArray();
  const existingAdmins = adminsFromDb
    .map(admin => admin.uniqueName)
    .map(uniqueName => uniqueName.toLowerCase().trim());

  const adminsToAdd = adminsFromRequest.filter(
    adminFromRequest => !existingAdmins.includes(adminFromRequest),
  );
  const adminsToRemove = existingAdmins.filter(
    existingAdmin => !adminsFromRequest.includes(existingAdmin),
  );

  for (const adminToRemove of adminsToRemove) {
    await admins.findOneAndDelete({ uniqueName: adminToRemove });
  }

  for (const adminToAdd of adminsToAdd) {
    await admins.insertOne({ uniqueName: adminToAdd });
  }

  res.sendStatus(HttpStatus.NO_CONTENT);
});
