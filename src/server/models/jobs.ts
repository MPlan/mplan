import * as Mongo from 'mongodb';

async function __testJob() { return 'test job!'; }
async function __testJobThatFails() { throw new Error('failing job'); }

// add jobs here
export const JobTypes = {
  __testJob,
  __testJobThatFails
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
}

export interface JobFailure {
  _id: Mongo.ObjectId,
  jobId: Mongo.ObjectId,
  timeFailed: number,
  failedByProcessPid: number,
  errorMessage: string,
  stack: string | undefined | null,
}
