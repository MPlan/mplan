import { log, combineUniquely } from '../../utilities/utilities';
import {
  fetchTerms, fetchSubjects, fetchCatalogEntries, fetchCourseDetail
} from 'unofficial-umdearborn-catalog-api';
import { dbConnection } from '../models/mongo';
import * as Mongo from 'mongodb';
import * as Model from '../models/models';
import { queue } from '../scheduler/scheduler';
import { isEqual } from 'lodash';

export async function syncTerms() {
  const { terms } = await dbConnection;
  // const termsFromUmConnect = (await fetchTerms()).filter(t =>
  //   // last 5 years
  //   t.year > new Date().getFullYear() - 5
  // );
  const termsFromUmConnect = (await fetchTerms()).slice(0, 1);


  const termsToSave = termsFromUmConnect.map(termFromUmconnect => {
    const term: Model.Term = {
      ...termFromUmconnect,
      _id: new Mongo.ObjectId(),
      lastUpdateDate: new Date().getTime(),
      lastTermCode: termFromUmconnect.code,
    };
    return term;
  });

  await terms.insertMany(termsToSave);

  const termCodeFromLastFiveYears = termsFromUmConnect.map(t => t.code);

  for (const termCode of termCodeFromLastFiveYears) {
    await queue({
      jobName: 'syncSubjects',
      plannedStartTime: new Date().getTime(),
      parameters: [termCode],
      priority: 10,
    });
  };
}

export async function syncSubjects(termCode: string) {
  if (!termCode) { return; }
  const subjectsFromUmconnect = await fetchSubjects(termCode);

  const subjectsToSave = subjectsFromUmconnect.map(s => {
    const subject: Model.Subject = {
      _id: new Mongo.ObjectId(),
      lastTermCode: termCode,
      lastUpdateDate: new Date().getTime(),
      ...s,
    };
    return subject;
  });

  const { subjects } = await dbConnection;
  await subjects.insertMany(subjectsToSave);

  for (const subjectToSave of subjectsToSave.slice(3)) {
    await queue({
      jobName: 'syncCatalogEntries',
      plannedStartTime: new Date().getTime(),
      parameters: [termCode, subjectToSave.code],
      priority: 20,
    });
  }
}

export async function syncCatalogEntries(termCode: string, subjectCode: string) {
  if (!termCode) { return; }
  if (!subjectCode) { return; }

  // download all catalog entries
  const catalogEntriesFromUmconnect = await fetchCatalogEntries(termCode, subjectCode);

  // create a map for faster lookups
  const catalogEntryMap = catalogEntriesFromUmconnect.reduce((obj, entry) => {
    obj[entry.courseNumber] = entry;
    return obj;
  }, {} as { [courseNumber: string]: typeof catalogEntriesFromUmconnect[0] });

  // create new courses to insert
  const newCoursesToInsert = catalogEntriesFromUmconnect.map(c => {
    const catalogEntry: Model.Course = {
      _id: new Mongo.ObjectId(),
      corequisites: undefined,
      courseNumber: c.courseNumber,
      credits: 0,
      creditsMin: undefined,
      crossList: [],
      description: '',
      lastTermCode: termCode,
      lastUpdateDate: new Date().getTime(),
      name: c.name,
      prerequisites: undefined,
      restrictions: '',
      subjectCode: c.subjectCode,
      scheduleTypes: c.scheduleTypes,
    };

    return catalogEntry;
  });

  const { courses } = await dbConnection;

  // try to insert them all (the unique indexes should stop duplicates)
  await courses.insertMany(newCoursesToInsert);

  // find the courses the should be updated
  const coursesEligibleForUpdates = await courses.find({}).filter((c: Model.Course) => {
    const lastTermCode = parseInt(c.lastTermCode);
    const currentTermCode = parseInt(termCode);
    if (lastTermCode > currentTermCode) { return false; }
    return true;
  }).toArray();

  // update the courses
  const coursesToUpdate = coursesEligibleForUpdates.map(c => {
    const newCourse = catalogEntryMap[c.courseNumber];

    const updatedCourse: Model.Course = {
      ...c,
      scheduleTypes: combineUniquely(c.scheduleTypes, newCourse && newCourse.scheduleTypes || []),
      name: newCourse && newCourse.name || c.name || '',
    };

    return updatedCourse;
  }).filter(updatedCourse => {
    const newCourse = catalogEntryMap[updatedCourse.courseNumber];
    return !isEqual(newCourse, updatedCourse);
  });

  // do a find and replace for each
  for (const courseToUpdate of coursesToUpdate.slice(0, 1)) {
    await courses.findOneAndReplace({ _id: courseToUpdate._id }, courseToUpdate);
    await queue({
      jobName: 'syncCourseDetails',
      plannedStartTime: new Date().getTime(),
      parameters: [termCode, subjectCode, courseToUpdate.courseNumber],
      priority: 30,
    });
  }
}

export async function syncCourseDetails(termCode: string, subjectCode: string, courseNumber: string) {
  const courseDetail = await fetchCourseDetail(termCode, subjectCode, courseNumber);

  const { courses } = await dbConnection;

  const courseFromDb = await courses.findOne({ subjectCode, courseNumber });
  if (!courseFromDb) {
    log.warn(`course ${termCode} ${subjectCode} ${courseNumber} from db was not found!`);
    return;
  }

  const lastTermCode = parseInt(courseFromDb.lastTermCode);
  const currentTermCode = parseInt(termCode);

  if (lastTermCode <= currentTermCode) {
    const updatedCourseFromDb: Model.Course = {
      ...courseFromDb,
      prerequisites: courseDetail.prerequisites,
      corequisites: courseDetail.corequisites,
      description: courseDetail.description || '',
      restrictions: courseDetail.restrictions || '',
    };

    await courses.findOneAndReplace({ _id: updatedCourseFromDb._id }, updatedCourseFromDb);
  }

  // sync sections
}
