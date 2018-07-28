if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { fetchCourses, fetchUndergraduateSubjects } from './catalog-umd-umich';
import { dbConnection } from 'server/models/mongo';
import { sequentially } from 'utilities/utilities';
import { flatten } from 'lodash';

async function main() {
  const subjects = await fetchUndergraduateSubjects();
  if (!subjects) throw new Error('No subjects');
  const subjectCodes = subjects.map(({ code }) => code);
  const _courses = await sequentially(subjectCodes, async subjectCode => {
    return (await fetchCourses('undergraduate', subjectCode))!;
  });
  const coursesToSave = flatten(_courses.filter(x => !!x));

  const { courses } = await dbConnection;
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
