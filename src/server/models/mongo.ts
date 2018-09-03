import * as Mongo from 'mongodb';
import { log, getOrThrow } from '../../utilities/utilities';
import * as Model from 'models';

const mongoUri = getOrThrow(process.env.MONGODB_URI);

async function createMongoDbConnection() {
  const match = /\/\/.*\/([^?]*)/.exec(mongoUri);
  if (!match) {
    throw new Error('Could not find database name in mongo URI');
  }
  const databaseName = match[1];
  const client = await Mongo.MongoClient.connect(mongoUri);
  log.info(`P${process.pid} Connected to the database!`);
  const db = client.db(databaseName);

  const collections = {
    get courses() {
      return db.collection<Model.Course.Model>('Courses');
    },
    get sections() {
      return db.collection<Model.Section.Model>('Sections');
    },
    get users() {
      return db.collection<Model.User.Model>('Users');
    },
    get degrees() {
      return db.collection<any>('Degrees');
    },
    get admins() {
      return db.collection<{ uniqueName: string }>('Admins');
    },
    get prerequisiteOverrides() {
      return db.collection<{ courseKey: string; prerequisites: Model.Prerequisite.Model }>(
        'PrerequisiteOverrides',
      );
    },
    close: client.close.bind(client) as (force?: boolean) => Promise<void>,
  };

  // ensure indexes here
  collections.courses.createIndex({ subjectCode: 1, courseNumber: 1 }, { unique: true });
  collections.sections.createIndex(
    { termCode: 1, courseRegistrationNumber: 1, subjectCode: 1, courseNumber: 1, season: 1 },
    { unique: true },
  );
  collections.admins.createIndex({ uniqueName: 1 }, { unique: true });
  collections.prerequisiteOverrides.createIndex({ courseKey: 1 }, { unique: true });

  return collections;
}

export const dbConnection = createMongoDbConnection();
