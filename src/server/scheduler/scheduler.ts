import * as Mongo from 'mongodb';
import { dbConnection } from '../models/mongo';
import { log, wait, pad } from '../../utilities/utilities';
import { Job, JobFailure, JobTypes, JobSuccess, JobInProgress } from '../models/jobs';

export const pollingWaitTime = 1000;
export const maxJobsRunAtOnce = 4;
export const maxAttempts = 3;

// TODO
// export interface SchedulerSettings {
//   _id: Mongo.ObjectId,
//   // pollingTime: 
// }

function throwIfNotOne(options: { [key: string]: number | undefined }) {
  const first = Object.entries(options)[0];
  if (!first) { throw new Error(`Used 'throwIfNotOne' incorrectly.`); }
  const [key, value] = first;
  if (value !== 1) {
    throw new Error(`Expected '${key}' to be '1' but found '${value}' instead`);
  }
}

export async function queue(
  jobName: keyof JobTypes,
  plannedStartTime: number,
  parameters?: string[],
  startedByUser?: string
) {
  const { jobs } = await dbConnection;
  const job: Job = {
    _id: new Mongo.ObjectId(),
    jobName,
    parameters: parameters || [],
    plannedStartTime,
    startedByUser: startedByUser || 'SYSTEM',
    submissionTime: new Date().getTime(),
    submittedByProcessPid: process.pid,
    // these will be populated later when it gets picked up by a worker
    attempts: 0,
  };
  const result = await jobs.insertOne(job);
  log.info(`Inserted job '${job.jobName}' with the id of ${job._id} to the queue.`);
}

export async function countOfJobsBeingWorkedOn() {
  const { jobs } = await dbConnection;
  const numberOfJobsBeingWorkedOn = await jobs.find({
    timeStarted: { $ne: undefined },
    timeCompleted: { $eq: undefined },
  }).count();
  return numberOfJobsBeingWorkedOn;
}

export async function findJobTodo() {
  const { jobs } = await dbConnection;
  const numberOfJobsBeingWorkedOn = await countOfJobsBeingWorkedOn();

  if (numberOfJobsBeingWorkedOn > maxJobsRunAtOnce) { return undefined; }

  const job = await (jobs
    .find({
      plannedStartTime: { $lt: new Date().getTime() },
    })
    .sort({ submissionTime: 1 })
    // .limit(1)/
    .next()
  );

  if (!job) { return undefined; }
  return job;
}

export async function markJobAsStarted(jobToStart: Job) {
  const { jobs, jobsInProgress } = await dbConnection;

  const jobFromDb = await jobs.findOne({ _id: jobToStart._id });

  if (!jobFromDb) {
    throw new Error(`Could not find job with id '${jobToStart._id}' when marking job as started.`);
  }

  const jobInProgress: JobInProgress = {
    ...jobFromDb,
    _id: new Mongo.ObjectId(),
    jobId: jobToStart._id,
    timeStarted: new Date().getTime(),
    workedOnByProcessPid: process.pid,
  };

  const deletedCount = (await jobs.deleteOne({ _id: jobToStart._id })).deletedCount;
  throwIfNotOne({ deletedCount });
  const insertedCount = (await jobsInProgress.insertOne(jobInProgress)).insertedCount;
  throwIfNotOne({ insertedCount });

  log.info(`Marked job '${jobToStart._id}' as started.`);
}

export async function markJobAsFinished(jobToFinish: Job) {
  const { jobsInProgress, jobSuccesses } = await dbConnection;

  const jobFromDb = await jobsInProgress.findOne({ jobId: jobToFinish._id });
  if (!jobFromDb) {
    throw new Error(`Could not find job with id '${jobToFinish._id}' when marking job as finished`);
  }

  const deletedCount = (await jobsInProgress.deleteOne({ jobId: jobToFinish._id })).deletedCount;
  throwIfNotOne({ deletedCount });

  const jobSuccess: JobSuccess = {
    ...jobFromDb,
    _id: new Mongo.ObjectId(),
    jobId: jobToFinish._id,
    timeCompleted: new Date().getTime(),
  }

  const insertedCount = (await jobSuccesses.insertOne(jobSuccess)).insertedCount;
  throwIfNotOne({ insertedCount });

  log.info(`Finished job '${jobToFinish.jobName}' '${jobToFinish._id}'!`);
}

export async function markJobAsFailure(jobToFail: Job, error: any) {
  const { jobsInProgress, jobFailures, jobs } = await dbConnection;

  const jobFromDb = await jobsInProgress.findOne({ jobId: jobToFail._id });
  if (!jobFromDb) {
    throw new Error(`Could not find job with id '${jobToFail._id}' when trying to fail this job.`);
  }

  const deletedCount = (await jobsInProgress.deleteOne({ jobId: jobToFail._id })).deletedCount;
  throwIfNotOne({ deletedCount });

  const errorMessage = (/*if*/ error && error.message ? error.message : error + '') as string;
  const stack = (/*if*/ error && error.stack ? error.stack : undefined) as string | undefined;

  const jobFailure: JobFailure = {
    ...jobFromDb,
    _id: new Mongo.ObjectId(),
    jobId: jobToFail._id,
    timeFailed: new Date().getTime(),
    errorMessage,
    stack,
  };

  const insertedCount = (await jobFailures.insertOne(jobFailure)).insertedCount;
  throwIfNotOne({ insertedCount });

  const newAttempt: Job = {
    ...jobToFail,
    _id: new Mongo.ObjectId(),
    attempts: jobToFail.attempts + 1,
  };

  if (newAttempt.attempts >= maxAttempts) { return; }
  const insertedNewAttemptCount = (await jobs.insertOne(newAttempt)).insertedCount;
  throwIfNotOne({ insertedNewAttemptCount });
}

export async function runJob(jobToRun: Job) {
  const { jobs, jobFailures } = await dbConnection;
  log.info(`Working on job '${jobToRun.jobName}' '${jobToRun._id}'...`);

  try {
    await markJobAsStarted(jobToRun);
    // run the job
    await (JobTypes[jobToRun.jobName] as any)(...(jobToRun.parameters));
    await markJobAsFinished(jobToRun);
  } catch (error) {
    log.error(error);
    await markJobAsFailure(jobToRun, error);
  }
}

export async function executeSchedulerQueue() {
  log.info('Starting scheduler...');
  while (true) {
    const jobTodo = await findJobTodo();
    if (jobTodo) {
      await runJob(jobTodo);
    }
    await wait(pollingWaitTime);
  }
}
