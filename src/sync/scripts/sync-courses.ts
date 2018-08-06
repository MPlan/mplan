if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as Model from 'models';
import { fetchCourses, fetchSubjects } from 'sync';
import { dbConnection } from 'server/models/mongo';
import { sequentially } from 'utilities/utilities';
import { RemoveProps } from 'utilities/typings';
import { flatten } from 'lodash';
const { floor } = Math;

async function main() {
  const { courses, syncErrors, syncReports } = await dbConnection;
  const jobTimestamp = Date.now();

  function errorLogger(message: string) {
    console.warn(message);
    const report: RemoveProps<Model.Report, '_id'> = {
      message,
      timestamp: Date.now(),
      jobTimestamp,
    };
    syncErrors.insertOne(report);
  }

  function logger(message: string) {
    console.log(message);

    const report: RemoveProps<Model.Report, '_id'> = {
      message,
      timestamp: Date.now(),
      jobTimestamp,
    };
    syncReports.insertOne(report);
  }

  logger('Fetching subjects...');
  const undergraduateSubjects = await fetchSubjects('undergraduate', errorLogger);
  const graduateSubjects = await fetchSubjects('graduate', errorLogger);

  if (!undergraduateSubjects) throw new Error('No undergraduate subjects');
  if (!graduateSubjects) throw new Error('No graduate subjects');
  logger('Done getting subjects.');

  logger('Fetching courses...');
  // undergraduate
  const undergraduateSubjectCodes = undergraduateSubjects.map(({ code }) => code);
  const _undergraduateCourses = await sequentially(undergraduateSubjectCodes, async subjectCode => {
    return (await fetchCourses('undergraduate', subjectCode, errorLogger))!;
  });
  const undergraduateCoursesToSave = flatten(_undergraduateCourses.filter(x => !!x));
  // graduate
  const graduateSubjectCodes = graduateSubjects.map(({ code }) => code);
  const _graduateCourses = await sequentially(graduateSubjectCodes, async subjectCode => {
    return (await fetchCourses('graduate', subjectCode, errorLogger))!;
  });
  const graduateCoursesToSave = flatten(_graduateCourses.filter(x => !!x));

  const coursesToSave = [...undergraduateCoursesToSave, ...graduateCoursesToSave];
  logger('Done fetching courses.');

  logger('Saving courses to database...');
  await sequentially(coursesToSave, async (course, index) => {
    const percentage = floor((index * 100) / (coursesToSave.length - 1));
    const courseFromDb = await courses.findOne({
      subjectCode: course.subjectCode,
      courseNumber: course.courseNumber,
    });

    if (!courseFromDb) {
      await courses.insertOne(course);
    } else {
      await courses.findOneAndReplace(
        {
          subjectCode: course.subjectCode,
          courseNumber: course.courseNumber,
        },
        { ...course, lastUpdateDate: Date.now(), lastTermCode: '201910' },
      );
    }
    logger(`${percentage}% Saved ${course.subjectCode} ${course.courseNumber}.`);
  });
  logger('Done saving courses to database.');
  logger('Done!');
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
