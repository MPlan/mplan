import * as cluster from 'cluster';
import { MongoClient } from 'mongodb';
import { log, getOrThrow } from '../../utilities/utilities';
import { Job, JobFailure } from './jobs';

const mongoUri = getOrThrow(process.env.MONGODB_URI);

async function createMongoDbConnection() {
  const match = /\/\/.*\/([^?]*)/.exec(mongoUri);
  if (!match) {
    throw new Error('Could not find database name in mongo URI');
  }
  const databaseName = match[1]
  const client = await MongoClient.connect(mongoUri);
  log.info(`Connected to the database!`);
  const db = client.db(databaseName);

  const collections = {
    get jobs() { return db.collection<Job>('Jobs'); },
    get jobFailures() { return db.collection<JobFailure>('JobFailures'); },
    close: client.close.bind(client) as (force?: boolean) => Promise<void>,
  }

  return collections;
}

export const dbConnection = createMongoDbConnection();