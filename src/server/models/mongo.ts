import * as cluster from 'cluster';
import * as Mongo from 'mongodb';
import {
  log, getOrThrow, throwIfNotOne, removeEmptyKeys, combineObjects
} from '../../utilities/utilities';
import { Job, JobFailure, JobSuccess, JobInProgress } from './jobs';
import * as Model from '../../models/models';

const mongoUri = getOrThrow(process.env.MONGODB_URI);

export async function updateIfSameTermOrLater<T extends Model.DbSynced>(options: {
  itemsToUpdate: Array<Partial<T> & Model.DbSynced>,
  collection: Mongo.Collection<T>,
  query: (t: Partial<T>) => Partial<T>,
  replace?: boolean,
}) {
  const { collection, itemsToUpdate, query } = options;

  for (const itemToUpdate of itemsToUpdate) {
    const itemQuery = query(itemToUpdate);
    const existingItem = await collection.findOne(itemQuery);
    if (!existingItem) {
      const insertedCount = await collection.insertOne(itemToUpdate);
    } else {
      // don't do an update if the object is from a previous term
      if (itemToUpdate.lastTermCode < existingItem.lastTermCode) { continue; }

      const replacement: T = {
        ...removeEmptyKeys(existingItem as any),
        ...removeEmptyKeys(itemToUpdate as any),
        _id: existingItem._id,
      };

      await collection.findOneAndReplace(itemQuery, replacement);
    }
  }
}

async function createMongoDbConnection() {
  const match = /\/\/.*\/([^?]*)/.exec(mongoUri);
  if (!match) {
    throw new Error('Could not find database name in mongo URI');
  }
  const databaseName = match[1]
  const client = await Mongo.MongoClient.connect(mongoUri);
  log.info(`P${process.pid} Connected to the database!`);
  const db = client.db(databaseName);

  const collections = {
    get jobs() { return db.collection<Job>('Jobs'); },
    get jobFailures() { return db.collection<JobFailure>('JobFailures'); },
    get jobSuccesses() { return db.collection<JobSuccess>('JobSuccesses'); },
    get jobsInProgress() { return db.collection<JobInProgress>('JobsInProgress'); },
    get terms() { return db.collection<Model.Term>('Terms'); },
    get subjects() { return db.collection<Model.Subject>('Subjects'); },
    get courses() { return db.collection<Model.Course>('Courses'); },
    get sections() { return db.collection<Model.Section>('Sections'); },
    get users() { return db.collection<Model.User>('Users'); },
    close: client.close.bind(client) as (force?: boolean) => Promise<void>,
  };

  // ensure indexes here
  collections.terms.createIndex({ code: 1, seasons: 1, year: 1 }, { unique: true });
  collections.subjects.createIndex({ code: 1 }, { unique: true });
  collections.courses.createIndex({ subjectCode: 1, courseNumber: 1 }, { unique: true });
  collections.sections.createIndex({ termCode: 1, courseRegistrationNumber: 1 }, { unique: true });
  collections.sections.createIndex({ courseId: 1 });

  return collections;
}

export const dbConnection = createMongoDbConnection();
