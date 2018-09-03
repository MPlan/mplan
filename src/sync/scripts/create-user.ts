if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as Model from 'models';
import { dbConnection } from 'server/models/mongo';
import { ObjectId } from 'utilities/object-id';

async function createUser(username: string) {
  const { users } = await dbConnection;
  const id = ObjectId();
  const newUser: Model.User.Model & { _id: any } = {
    _id: id,
    id: id,
    chosenDegree: false,
    degree: {
      degreeGroupData: {},
      masteredDegreeId: undefined,
    },
    isAdmin: false,
    lastLoginDate: Date.now(),
    lastUpdateDate: Date.now(),
    plan: {
      anchorSeason: 'fall',
      anchorYear: new Date().getFullYear(),
      semesters: [],
    },
    registerDate: Date.now(),
    username,
    userPrerequisiteOverrides: {},
  };

  await users.insertOne(newUser);
}

const username = process.argv
  .slice(2)
  .map(x => x.trim())
  .filter(x => !!x)[0];

if (!username) throw new Error('did not include username');

createUser(username)
  .then(() => {
    console.log('DONE');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
