import * as Mongo from 'mongodb';
import { Prerequisite, Corequisite } from 'sync/catalog-umd-umich/models';
export { Prerequisite, Corequisite };

export interface DbSynced {
  _id: Mongo.ObjectId;
  lastUpdateDate: number;
  lastTermCode: string;
}

export interface Term extends DbSynced {
  code: string;
  season: string;
  year: number;
}

export interface Subject extends DbSynced {
  code: string;
  name: string;
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
  /** tuples of courses that this course is cross listed with */
  crossList?: Array<[string, string]> | undefined | null;
  scheduleTypes?: string[] | undefined;
}

export interface Section extends DbSynced {
  /** a link to the course id this section belongs to */
  courseId: Mongo.ObjectId;
  /** the term for this section */
  termCode: string;
  /** the course registration number */
  courseRegistrationNumber: string;
  /** unique name of the instructor */
  instructors: string[];
  /** schedule type of this section e.g. Lecture or Internet */
  scheduleTypes: string[];
  /** time of day of this schedule */
  times: string[];
  /** the days this schedule was offered on e.g. TR for Tuesday Thursdays */
  days: string[];
  /** the location of this section as it appears on the SIS */
  locations: string[];
  /** the total capacity *including* cross-listed seats */
  capacity: number;
  /** the remaining seats *including* cross-listed seats */
  remaining: number;
}

export interface CourseWithSections extends Course {
  sections: { [termCode: string]: Section[] };
}

export interface Catalog {
  [courseId: string]: CourseWithSections;
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
