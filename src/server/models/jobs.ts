import * as Mongo from 'mongodb';
import {
  syncTerms, syncSubjects, syncCatalogEntries, syncCourseDetails
} from '../catalog/catalog.job';

async function __testJob() { return 'test job!'; }
async function __testJobThatFails() { throw new Error('failing job'); }

/**
 * Add static jobs to this object.
 */
export const JobTypes = {
  syncTerms,
  syncSubjects,
  syncCatalogEntries,
  syncCourseDetails,
  __testJob,
  __testJobThatFails,
};

type _JobTypes = typeof JobTypes;
export interface JobTypes extends _JobTypes { }

/**
 * The 'schema' for the 'Job's collection.
 */
export interface Job {
  /**
   * an ID provided by mongodb
   */
  _id: Mongo.ObjectId,
  /**
   * the name of the static job to run
   */
  jobName: keyof JobTypes,
  /**
   * parameters for the job. Parameters are persisted to the database when added and are used when
   * the job is run.
   */
  parameters: string[] | undefined | null,
  /** 
   * a timestamp denote when this job can first be run
   */
  plannedStartTime: number,
  /**
   * the timestamp when this job was started by a worker. initially, it will be undefined
   */
  timeStarted: number | undefined | null,
  /**
   * timestamp when this job was submitted to the queue
   */
  submissionTime: number,
  /**
   * the process that submitted the job
   */
  submittedByProcessPid: number,
  /**
   * timestamp when this job was completed. this field will not be populated until it is completed
   */
  timeCompleted: number | undefined | null,
  /**
   * the user who has added the job to the queue. this will be `SYSTEM` for jobs that are automated
   */
  startedByUser: string,
  /**
   * the process that worked on the job. this field is used to ensure that no two processes will
   * work on the same job (though that would be a very rare race condition).
   */
  workedOnByProcessPid: number | undefined | null,
  attempts: number,
}

export interface JobFailure {
  /**
   * an ID provided by mongodb
   */
  _id: Mongo.ObjectId,
  /**
   * the corresponding ID of the job that failed
   */
  jobId: Mongo.ObjectId,
  /**
   * a timestamp when the job failed
   */
  timeFailed: number,
  /**
   * the PID of the process the job was running in when it failed
   */
  failedByProcessPid: number,
  /**
   * If the job failed by throwing an `Error` object, this field would be populated with that error.
   * Otherwise, this field will what ever error object passed as a string
   */
  errorMessage: string,
  /**
   * If the job failed by throwing an `Error` object, this field would be populated with its stack
   * trace, otherwise it will have the value of `null` or `undefined`
   */
  stack: string | undefined | null,
  attempt: number,
}
