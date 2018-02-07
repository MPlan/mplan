import { log, combineUniquely, sequentially, flatten } from '../../utilities/utilities';
import {
  fetchTerms, fetchSubjects, fetchCatalogEntries, fetchCourseDetail, fetchScheduleListings, fetchScheduleDetail,
} from 'unofficial-umdearborn-catalog-api';
import { dbConnection, updateIfSameTermOrLater } from '../models/mongo';
import * as Mongo from 'mongodb';
import * as Model from '../models/models';
import { queue } from '../scheduler/scheduler';
import { isEqual } from 'lodash';

export async function sync() {
  const { terms } = await dbConnection;
  const termsFromUmConnect = (await fetchTerms()).filter(t =>
    // last 5 years
    t.year >= new Date().getFullYear() - 5
  );

  const termsToSave = termsFromUmConnect.map(termFromUmconnect => {
    const term: Model.Term = {
      ...termFromUmconnect,
      _id: new Mongo.ObjectId(),
      lastUpdateDate: new Date().getTime(),
      lastTermCode: termFromUmconnect.code,
    };
    return term;
  });

  await updateIfSameTermOrLater({
    itemsToUpdate: termsToSave,
    collection: terms,
    query: term => ({ code: term.code })
  });

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

  await updateIfSameTermOrLater({
    itemsToUpdate: subjectsToSave,
    collection: subjects,
    query: subject => ({ code: subject.code }),
  });

  for (const subjectToSave of subjectsToSave) {
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

  // create new courses to insert
  const newCourses = catalogEntriesFromUmconnect.map(c => {
    const catalogEntry: Partial<Model.Course> & Model.DbSynced = {
      _id: new Mongo.ObjectId(),
      courseNumber: c.courseNumber,
      crossList: [],
      description: '',
      lastTermCode: termCode,
      lastUpdateDate: new Date().getTime(),
      name: c.name,
      restrictions: '',
      subjectCode: c.subjectCode,
      scheduleTypes: c.scheduleTypes,
    };

    return catalogEntry;
  });

  const { courses } = await dbConnection;

  await updateIfSameTermOrLater({
    collection: courses,
    itemsToUpdate: newCourses,
    query: course => ({ subjectCode: course.subjectCode, courseNumber: course.courseNumber }),
  });

  for (const newCourse of newCourses) {
    const courseNumber = newCourse && newCourse.courseNumber;
    if (!courseNumber) { continue; }
    await queue({
      jobName: 'syncCourseDetails',
      parameters: [termCode, subjectCode, courseNumber],
      plannedStartTime: new Date().getTime(),
      priority: 30,
    });
  }
}

export async function syncCourseDetails(termCode: string, subjectCode: string, courseNumber: string) {
  const courseFromUmconnect = await fetchCourseDetail(termCode, subjectCode, courseNumber);

  const { courses } = await dbConnection;

  const updatedCourseDetail: Partial<Model.Course> & Model.DbSynced = {
    _id: new Mongo.ObjectId(),
    corequisites: courseFromUmconnect.corequisites,
    courseNumber,
    description: courseFromUmconnect.description,
    lastTermCode: termCode,
    lastUpdateDate: new Date().getTime(),
    prerequisites: courseFromUmconnect.prerequisites,
    restrictions: courseFromUmconnect.restrictions,
    subjectCode,
  }

  await updateIfSameTermOrLater({
    collection: courses,
    itemsToUpdate: [updatedCourseDetail],
    query: course => ({ subjectCode: course.subjectCode, courseNumber: course.courseNumber }),
  });
}

export async function syncSchedules(
  termCode: string,
  subjectCode: string,
  courseNumber: string,
  ...scheduleTypes: string[],
) {
  const schedules = flatten(await sequentially(
    scheduleTypes,
    scheduleType => fetchScheduleListings(termCode, subjectCode, courseNumber, scheduleType)
  ));

  const sections = await sequentially(schedules, async schedule => {
    const scheduleDetail = await fetchScheduleDetail(termCode, schedule.crn);
    return {
      ...schedule,
      ...scheduleDetail,
    };
  });
}
