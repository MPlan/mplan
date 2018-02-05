import * as Mongo from 'mongodb';

export interface DbSynced {
  _id: Mongo.ObjectId,
  lastUpdateDate: number,
}

export interface Term extends DbSynced {
  code: string,
  season: string,
  year: number,
}
