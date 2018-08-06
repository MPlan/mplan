if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as Model from 'models/models';
import { dbConnection } from 'server/models/mongo';
const { max, floor } = Math;

async function main() {
  const { courses, sections } = await dbConnection;

  console.log('Loading all sections into memory...');
  const sectionsFromDb = await sections.find({}).toArray();
  console.log('Done loading sections.');

  console.log('Calculating terms and seats remaining...');
  const sectionsLookup = sectionsFromDb.reduce(
    (lookup, section) => {
      const courseKey = Model.courseKey(section);
      const course = lookup[courseKey] || {};
      const previousSeatsRemaining =
        (course[section.termCode] && course[section.termCode].seatsRemaining) || 0;

      const seatsRemaining = max(section.remaining, 0) + previousSeatsRemaining;
      course[section.termCode] = { seatsRemaining };
      lookup[courseKey] = course;

      return lookup;
    },
    {} as { [courseKey: string]: { [termCode: string]: { seatsRemaining: number } } },
  );

  const lookupEntries = Object.entries(sectionsLookup);
  let index = 0;
  for (const [courseKey, sectionsSummary] of lookupEntries) {
    const percentage = floor((index * 100) / (lookupEntries.length - 1));
    const parseResult = Model.parseCourseKey(courseKey);
    if (!parseResult) throw new Error(`Failed to parse course key "${courseKey}"`);
    const { courseNumber, subjectCode } = parseResult;
    try {
      await courses.findOneAndUpdate({ subjectCode, courseNumber }, { $set: { sectionsSummary } });
      console.log(`${percentage}% Updated ${subjectCode} ${courseNumber}.`);
    } catch (e) {
      console.error(`Failed to update ${subjectCode} ${courseNumber}`, e);
    }
    index += 1;
  }
  console.log('Done updating.');
}

main()
  .then(() => {
    console.log('DONE!');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
