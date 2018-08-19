import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status';
import { dbConnection } from './models/mongo';

export async function checkAdmin(req: Request, res: Response, next: NextFunction) {
  const { admins } = await dbConnection;
  const uniqueName = req.user.nickname;
  const result = await admins.findOne({ uniqueName });

  if (!result) {
    res.sendStatus(HttpStatus.UNAUTHORIZED);
    return;
  }

  next();
}
