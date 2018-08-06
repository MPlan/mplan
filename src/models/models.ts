import * as Mongo from 'mongodb';
import { Prerequisite, Corequisite } from 'sync/catalog-umd-umich/models';
export { Prerequisite, Corequisite };
import { Section as _Section } from 'sync/selfservice-umd-umich/sections';

export interface Section extends _Section, DbSynced {}

export interface DbSynced {
  _id: Mongo.ObjectId;
  lastUpdateDate: number;
}

export interface Course extends DbSynced {
  /** the subject code of this course. e.g. `CIS` */
  subjectCode: string;
  /** the course number of this course. e.g. `450` */
  courseNumber: string;
  /** the full name of the course */
  name: string;
  /** the description of the course */
  description: string | undefined | null;
  creditHours?: [number, number] | number | undefined | null;
  restrictions?: string[] | undefined | null;
  /** represents the set of courses needed to have been taken before the course */
  prerequisites?: Prerequisite | undefined;
  /** represents the set of courses needed to be taken either before or during the course */
  corequisites?: Corequisite[] | undefined;
  sectionsSummary?: { [termCode: string]: undefined | { seatsRemaining: number } };
}

export interface User extends DbSynced {
  username: string;
  name: string;
  picture: string;
  registerDate: number;
  lastLoginDate: number;
  plan: any;
  degree: any;
}

export interface Report {
  _id: Mongo.ObjectId;
  message: string;
  timestamp: number;
  jobTimestamp: number;
}

export function courseKey(course: { subjectCode: string; courseNumber: string }) {
  return `${course.subjectCode}__|__${course.courseNumber}`.toUpperCase();
}

export function parseCourseKey(courseKey: string) {
  const match = /(.*)__\|__(.*)/.exec(courseKey);
  if (!match) return undefined;
  const subjectCode = match[1];
  const courseNumber = match[2];

  return { subjectCode, courseNumber };
}

export interface JoinedCatalog {
  [courseLookupKey: string]: Course;
}

export interface SyncStatus {
  lastSyncTimestamp: number;
}
