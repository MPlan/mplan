import * as Mongo from 'mongodb';

export interface DbSynced {
  _id: Mongo.ObjectId,
  lastUpdateDate: number,
  lastTermCode: string,
}

export interface Term extends DbSynced {
  code: string,
  season: string,
  year: number,
}

export interface Subject extends DbSynced {
  code: string,
  name: string,
}

export type Prerequisite = undefined | [string, string] | string | {
  /** the logic gate to use */
  g: '&' | '|',
  /**
   * the operands of the logic gate
   * 
   * can be:
   * 
   * * another `Prerequisite`
   * * a tuple of `[subjectCode, courseNumber]` e.g. `["CIS", "310"]`
   * * or a simple string e.g. `"Remedial Math"`
   */
  o: Prerequisite[],
}

export interface Course extends DbSynced {
  /** the subject code of this course. e.g. `CIS` */
  subjectCode: string,
  /** the course number of this course. e.g. `450` */
  courseNumber: string,
  /** the full name of the course */
  name: string,
  /** the description of the course */
  description: string,
  /**
   * the number of credit hours of the course determined by the most recent sections in the most
   * recent terms of this course
   */
  credits: number,
  /**
   * a credit range is possible if the `creditsMin` is present.
   */
  creditsMin: number,
  /** the restriction placed on this course */
  restrictions: string,
  /** represents the set of courses needed to have been taken before the course */
  prerequisites: Prerequisite,
  /** represents the set of courses needed to be taken either before or during the course */
  corequisites: Prerequisite,
  /** tuples of courses that this course is cross listed with */
  crossList: Array<[string, string]>,
  scheduleTypes: string[],
}

export interface Section extends DbSynced {
  /** a link to the course id this section belongs to */
  courseId: Mongo.ObjectId,
  /** the term for this section */
  termCode: string,
  /** the course registration number */
  courseRegistrationNumber: string,
  /** unique name of the instructor */
  instructors: string[],
  /** schedule type of this section e.g. Lecture or Internet */
  scheduleTypes: string[],
  /** time of day of this schedule */
  times: string[],
  /** the days this schedule was offered on e.g. TR for Tuesday Thursdays */
  days: string[],
  /** the location of this section as it appears on the SIS */
  locations: string[],
  /** the total capacity *including* cross-listed seats */
  capacity: number,
  /** the remaining seats *including* cross-listed seats */
  remaining: number,
}
