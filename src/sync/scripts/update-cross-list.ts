if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as Model from 'models';
import { dbConnection } from 'server/models/mongo';
import { sequentially } from 'utilities/utilities';
const { floor } = Math;

async function main() {
  const { sections, courses } = await dbConnection;

  console.log('Getting sections...');
  const sectionsFromDb = await sections.find({}).toArray();
  console.log('Done getting sections.');

  console.log('Calculating cross listed courses...');

  const initial = {} as {
    [courseKey: string]: {
      subjectCode: string;
      courseNumber: string;
      crossList: [string, string][];
    };
  };

  const crossListLookup = sectionsFromDb.reduce((crossListLookup: typeof initial, section) => {
    const course = crossListLookup[Model.Section.getCatalogId(section)] || {
      subjectCode: section.subjectCode,
      courseNumber: section.courseNumber,
      crossList: [],
    };

    for (const incomingCourse of section.crossList) {
      if (
        !course.crossList.find(existingCourse => {
          if (incomingCourse[0] !== existingCourse[0]) return false;
          if (incomingCourse[1] !== existingCourse[1]) return false;
          return true;
        })
      ) {
        course.crossList.push(incomingCourse);
      }
    }

    crossListLookup[Model.Course.makeCatalogId(course.subjectCode, course.courseNumber)] = course;
    return crossListLookup;
  }, initial);
  console.log('Done calculating cross listed courses.');

  console.log('Saving cross listed courses...');
  const crossListArray = Object.values(crossListLookup);
  let index = 0;
  await sequentially(crossListArray, async ({ subjectCode, courseNumber, crossList }) => {
    await courses.findOneAndUpdate({ subjectCode, courseNumber }, { $set: { crossList } });
    const percentage = floor((index * 100) / (crossListArray.length - 1));
    console.log(`${percentage}% Saved ${subjectCode} ${courseNumber}`);
    index += 1;
  });
  console.log('Done saving cross listed courses.');
}

main()
  .then(() => {
    console.log('DONE.');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
