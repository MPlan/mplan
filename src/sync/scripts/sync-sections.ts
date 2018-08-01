if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { dbConnection } from 'server/models/mongo';
import { fetchSections } from 'sync';
import { RemoveProps } from 'utilities/typings';
import { sequentially, wait } from 'utilities/utilities';
import { flatten } from 'lodash';
import * as Model from 'models';

async function main() {
  const { courses, sections, syncErrors, syncReports, syncStatus } = await dbConnection;

  await wait(10 * 1000);
  const jobTimestamp = Date.now();
  const termCodes = process.argv
    .slice(2)
    .map(x => x.trim())
    .filter(x => !!x);

  function logger(message: string) {
    console.log(message);

    const report: RemoveProps<Model.Report, '_id'> = {
      message,
      timestamp: Date.now(),
      jobTimestamp,
    };
    syncReports.insertOne(report);
  }

  function errorLogger(message: string) {
    console.warn(message);

    const report: RemoveProps<Model.Report, '_id'> = {
      message,
      timestamp: Date.now(),
      jobTimestamp,
    };
    syncErrors.insertOne(report);
  }

  logger(`Started job to sync sections from terms: ${termCodes.join(', ')} at ${jobTimestamp}`);

  logger('Fetching all courses from DB...');
  const coursesFromDb = await courses.find({}).toArray();
  const courseCount = coursesFromDb.length;
  logger('Done fetching courses.');

  logger(`Starting to fetch sections for all term codes (${termCodes.join(', ')})..`);

  for (const termCode of termCodes) {
    logger(`Fetching sections for term code "${termCode}"`);
    const sectionSections = await sequentially(coursesFromDb, async (course, index) => {
      const sections = await fetchSections(
        termCode,
        course.subjectCode,
        course.courseNumber,
        errorLogger,
      );
      logger(
        `${Math.floor(((index + 1) * 100) / courseCount)}% Got sections for "${termCode} ${
          course.subjectCode
        } ${course.courseNumber}".`,
      );
      return sections;
    });
    logger(`Done fetching sections for term code "${termCode}"`);

    logger(`Saving sections to DB for term code "${termCode}"...`);
    const sectionsToSave = flatten(
      sectionSections.filter(sections => !!sections).map(sections => sections!),
    );

    let sectionIndex = 0;
    for (const sectionToSave of sectionsToSave) {
      const percentage = `${Math.floor((sectionIndex * 100) / sectionsToSave.length)}%`;
      const existingSection = await sections.findOne({
        termCode: sectionToSave.termCode,
        courseRegistrationNumber: sectionToSave.courseRegistrationNumber,
        subjectCode: sectionToSave.subjectCode,
        courseNumber: sectionToSave.courseNumber,
      });

      if (existingSection) {
        // replace
        const result = await sections.findOneAndReplace(
          {
            termCode: sectionToSave.termCode,
            courseRegistrationNumber: sectionToSave.courseRegistrationNumber,
            subjectCode: sectionToSave.subjectCode,
            courseNumber: sectionToSave.courseNumber,
          },
          sectionToSave,
        );
        logger(`${percentage} | Replaced section: ${JSON.stringify(result)}`);
      } else {
        // insert
        const result = await sections.insertOne(sectionToSave);
        logger(`${percentage} | Inserted section: ${JSON.stringify(result)}`);
      }
      sectionIndex += 1;
    }
    logger(`Done saving sections to DB for term code "${termCode}"`);
  }
  logger(`Done syncing sections from terms: ${termCodes.join(', ')}`);

  logger(`Updating sync status...`);
  const status = await syncStatus.findOne({});
  if (!status) {
    await syncStatus.insertOne({ lastSyncTimestamp: Date.now() });
  } else {
    await syncStatus.findOneAndReplace({}, { lastSyncTimestamp: Date.now() });
  }
}

main()
  .then(() => console.log('DONE!'))
  .catch(e => console.error(`Failed to sync sections: ${e && e.message}`, e));
