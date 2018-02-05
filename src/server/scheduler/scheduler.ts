import * as Mongo from 'mongodb';
import { catalogTestJob } from '../catalog/catalog.job';
import { dbConnection } from '../db/mongo';
import { log, wait } from '../../utilities/utilities';

export const pollingWaitTime = 60 * 1000;
export const maxJobsRunAtOnce = 4;

async function __testJob() {
  return 'test job!';
}

async function __testJobThatFails() {
  throw new Error('failing job');
}

// add jobs here
const JobTypes = {
  catalogTestJob,
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
  error: any,
}

// TODO
// export interface SchedulerSettings {
//   _id: Mongo.ObjectId,
//   // pollingTime: 
// }

export async function collections() {
  const db = await dbConnection;
  return {
    get jobs() { return db.collection<Job>('Jobs'); },
    get jobFailures() { return db.collection<JobFailure>('JobFailures'); },
  };
}

export async function queue(
  jobName: keyof JobTypes,
  plannedStartTime: number,
  startedByUser?: string
) {
  const { jobs } = await collections();
  const job: Job = {
    _id: new Mongo.ObjectId(),
    jobName,
    plannedStartTime,
    startedByUser: startedByUser || 'SYSTEM',
    submissionTime: new Date().getTime(),
    submittedByProcessPid: process.pid,
    // these will be populated later when it gets picked up by a worker
    timeCompleted: undefined,
    timeStarted: undefined,
    workedOnByProcessPid: undefined,
  };
  const result = await jobs.insertOne(job);
  log.info(`Inserted job '${job.jobName}' with the id of ${job._id} to the queue.`);
}

export async function countOfJobsBeingWorkedOn() {
  const { jobs } = await collections();
  const numberOfJobsBeingWorkedOn = await jobs.find({
    timeStarted: { $ne: undefined }
  }).count();
  return numberOfJobsBeingWorkedOn;
}

export async function countOfJobsTodo() {
  const { jobs } = await collections();
  const numberOfJobsTodo = await jobs.find({ timeStarted: undefined });
  return numberOfJobsTodo;
}


export async function findJobTodo() {
  const { jobs } = await collections();
  const numberOfJobsBeingWorkedOn = await countOfJobsBeingWorkedOn();
  log.debug({ numberOfJobsBeingWorkedOn });

  if (numberOfJobsBeingWorkedOn > maxJobsRunAtOnce) { return undefined; }

  const job = await (jobs
    .find({ timeStarted: undefined, timeCompleted: undefined })
    .sort({ submissionTime: 1 })
    .limit(1)
    .next()
  );

  if (!job) { return undefined; }
  return job;
}

export async function markJobAsStarted(jobToStart: Job) {
  const { jobs } = await collections();
  const jobStartedUpdate: Partial<Job> = {
    workedOnByProcessPid: process.pid,
    timeStarted: new Date().getTime(),
  };
  await jobs.updateOne({ _id: jobToStart._id }, { $set: jobStartedUpdate });
}

export async function markJobAsFinished(jobToFinish: Job) {
  const { jobs } = await collections();

  // then update the DB with the time completed marking it as a finished job
  const jobFinishUpdate: Partial<Job> = {
    timeCompleted: new Date().getTime(),
  }
  await jobs.updateOne({ _id: jobToFinish._id }, { $set: jobFinishUpdate });
  log.info(`Finished job '${jobToFinish._id}'!`);
}

export async function markJobAsFailure(jobToFail: Job, error: any) {
  const { jobs, jobFailures } = await collections();
  log.error(`Error with job ${jobToFail._id}`);
  const jobFailure: JobFailure = {
    _id: new Mongo.ObjectId(),
    error,
    failedByProcessPid: process.pid,
    jobId: jobToFail._id,
    timeFailed: new Date().getTime(),
  };
  await jobFailures.insertOne(jobFailure);
  const jobFinishWithFailureUpdate: Partial<Job> = {
    workedOnByProcessPid: undefined,
    timeStarted: undefined,
  }
  await jobs.updateOne({ _id: jobToFail._id }, { $set: jobFinishWithFailureUpdate });
}

export async function runJob(jobToRun: Job) {
  const { jobs, jobFailures } = await collections();
  log.info(`Working on job '${jobToRun._id}'...`);

  try {
    await markJobAsStarted(jobToRun);
    // run the job
    await JobTypes[jobToRun.jobName]();
    await markJobAsFinished(jobToRun);
  } catch (error) {
    await markJobAsFailure(jobToRun, error);
  }
}

export async function runScheduler() {
  log.info('Starting scheduler...');
  while (true) {
    const jobTodo = await findJobTodo();
    if (!jobTodo) {
      log.info('Found no jobs to finish!');
    } else {
      await runJob(jobTodo);
    }
    await wait(pollingWaitTime);
  }
}
