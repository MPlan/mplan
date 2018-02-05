import { MongoClient } from 'mongodb';
import { log, getOrThrow } from '../../utilities'

const mongoUri = getOrThrow(process.env.MONGODB_URI);
const metaDbName = getOrThrow(process.env.MONGODB_META_DB_NAME);
const mplanDbName = getOrThrow(process.env.MONGODB_MPLAN_DB_NAME);

async function createMongoDbConnection() {
  const client = await MongoClient.connect(mongoUri);
  log.info(`Connected to the database!`);

  const meta = client.db(metaDbName);
  const mplan = client.db(mplanDbName);
  return { meta, mplan };
}

export const dbConnection = createMongoDbConnection();