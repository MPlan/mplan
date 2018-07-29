if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { fetchCourses, fetchUndergraduateSubjects } from './catalog-umd-umich';
import { dbConnection } from 'server/models/mongo';
import { sequentially } from 'utilities/utilities';
import { flatten } from 'lodash';

async function main() {
  const { courses, parseErrors } = await dbConnection;

  function logger(message: string) {
    console.warn(message);
    parseErrors.insertOne({ message, timestamp: Date.now() });
  }

  const subjects = await fetchUndergraduateSubjects(logger);
  if (!subjects) throw new Error('No subjects');
  const subjectCodes = subjects.map(({ code }) => code);
  const _courses = await sequentially(subjectCodes, async subjectCode => {
    return (await fetchCourses('undergraduate', subjectCode, logger))!;
  });
  const coursesToSave = flatten(_courses.filter(x => !!x));

  await sequentially(coursesToSave, async course => {
    console.log(`Saving ${course.subjectCode} ${course.courseNumber}`);
    const courseFromDb = await courses.findOne({
      subjectCode: course.subjectCode,
      courseNumber: course.courseNumber,
    });

    if (!courseFromDb) {
      const result = await courses.insertOne(course);
      console.log(result);
    } else {
      const result = await courses.findOneAndReplace(
        {
          subjectCode: course.subjectCode,
          courseNumber: course.courseNumber,
        },
        { ...course, lastUpdateDate: Date.now(), lastTermCode: '201910' },
      );
      console.log(result);
    }
  });

  console.log('Done!');
  process.exit(0);
}

main();
