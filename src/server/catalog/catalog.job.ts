import { log } from '../../utilities/utilities';
import { fetchTerms } from 'unofficial-umdearborn-catalog-api';
import { dbConnection } from '../models/mongo';
import * as Mongo from 'mongodb';
import * as Model from '../models/models';

export async function catalogTestJob() {
  log.debug('this is a test job!!');
}

export async function syncTerms() {
  const { terms } = await dbConnection;
  const termsFromUmConnect = await fetchTerms();

  const termsToSave = termsFromUmConnect.map(termFromUnConnect => {
    const term: Model.Term = {
      _id: new Mongo.ObjectId(),
      lastUpdateDate: new Date().getTime(),
      ...termFromUnConnect,
    };
    return term;
  });

  terms.insertMany([termsToSave]);
}