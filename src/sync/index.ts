if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { fetchCourses, fetchSubjects } from './catalog-umd-umich';
import { dbConnection } from 'server/models/mongo';
import { sequentially } from 'utilities/utilities';
import { flatten } from 'lodash';

async function main() {
  const { courses, parseErrors } = await dbConnection;
  const jobStartTimestamp = Date.now();

  function logger(message: string) {
    console.warn(message);
    parseErrors.insertOne({ message, timestamp: Date.now(), jobStartTimestamp });
  }

  console.log('Fetching subjects...');
  const undergraduateSubjects = await fetchSubjects('undergraduate', logger);
  const graduateSubjects = await fetchSubjects('graduate', logger);

  if (!undergraduateSubjects) throw new Error('No undergraduate subjects');
  if (!graduateSubjects) throw new Error('No graduate subjects');
  console.log('Done getting subjects.');

  console.log('Fetching courses...');
  // undergraduate
  const undergraduateSubjectCodes = undergraduateSubjects.map(({ code }) => code);
  const _undergraduateCourses = await sequentially(undergraduateSubjectCodes, async subjectCode => {
    return (await fetchCourses('undergraduate', subjectCode, logger))!;
  });
  const undergraduateCoursesToSave = flatten(_undergraduateCourses.filter(x => !!x));
  // graduate
  const graduateSubjectCodes = graduateSubjects.map(({ code }) => code);
  const _graduateCourses = await sequentially(graduateSubjectCodes, async subjectCode => {
    return (await fetchCourses('graduate', subjectCode, logger))!;
  });
  const graduateCoursesToSave = flatten(_graduateCourses.filter(x => !!x));

  const coursesToSave = [...undergraduateCoursesToSave, ...graduateCoursesToSave];
  console.log('Done fetching courses.');

  console.log('Saving courses to database...');
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

  console.log('Done saving courses to database.');
}

main()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
