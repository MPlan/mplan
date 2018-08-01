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

  const { courses, sections, syncErrors, syncReports, syncStatus } = await dbConnection;

  logger('Fetching all courses from DB...');
  const coursesFromDb = await courses.find({}).toArray();
  logger('Done fetching courses.');

  logger(`Starting to fetch sections for all term codes (${termCodes.join(', ')})..`);

  for (const termCode of termCodes) {
    logger(`Fetching sections for term code "${termCode}"`);
    const sectionSections = await sequentially(coursesFromDb, async course => {
      return await fetchSections(termCode, course.subjectCode, course.courseNumber, errorLogger);
    });
    logger(`Done fetching sections for term code "${termCode}"`);

    logger(`Saving sections to DB for term code "${termCode}"...`);
    const sectionsToSave = flatten(
      sectionSections.filter(sections => !!sections).map(sections => sections!),
    );

    for (const sectionToSave of sectionsToSave) {
      const existingSection = sections.findOne({
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
        logger(`Replaced section: ${JSON.stringify(result)}`);
      } else {
        // insert
        const result = await sections.insertOne(sectionToSave);
        logger(`Inserted section: ${JSON.stringify(result)}`);
      }
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
