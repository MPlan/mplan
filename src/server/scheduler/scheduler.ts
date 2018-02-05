import * as Mongo from 'mongodb';
import { catalogTestJob } from '../catalog/catalog.job';
import { dbConnection } from '../models/mongo';
import { log, wait } from '../../utilities/utilities';
import { Job, JobFailure, JobTypes } from '../models/jobs';

export const pollingWaitTime = 60 * 1000;
export const maxJobsRunAtOnce = 4;

// TODO
// export interface SchedulerSettings {
//   _id: Mongo.ObjectId,
//   // pollingTime: 
// }

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
    parameters,
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
  const { jobs } = await dbConnection;
  const numberOfJobsBeingWorkedOn = await jobs.find({
    timeStarted: { $ne: undefined }
  }).count();
  return numberOfJobsBeingWorkedOn;
}

export async function findJobTodo() {
  const { jobs } = await dbConnection;
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
  const { jobs } = await dbConnection;
  const jobStartedUpdate: Partial<Job> = {
    workedOnByProcessPid: process.pid,
    timeStarted: new Date().getTime(),
  };
  await jobs.updateOne({ _id: jobToStart._id }, { $set: jobStartedUpdate });
}

export async function markJobAsFinished(jobToFinish: Job) {
  const { jobs } = await dbConnection;

  // then update the DB with the time completed marking it as a finished job
  const jobFinishUpdate: Partial<Job> = {
    timeCompleted: new Date().getTime(),
  }
  await jobs.updateOne({ _id: jobToFinish._id }, { $set: jobFinishUpdate });
  log.info(`Finished job '${jobToFinish._id}'!`);
}

export async function markJobAsFailure(jobToFail: Job, error: any) {
  const { jobs, jobFailures } = await dbConnection;
  log.error(`Error with job ${jobToFail._id}`);
  const jobFailure: JobFailure = {
    _id: new Mongo.ObjectId(),
    errorMessage: /*if*/ error instanceof Error ? error.message : error + '',
    stack: /*if*/ error instanceof Error ? error.stack : undefined,
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
  const { jobs, jobFailures } = await dbConnection;
  log.info(`Working on job '${jobToRun._id}'...`);

  try {
    await markJobAsStarted(jobToRun);
    // run the job
    await (JobTypes[jobToRun.jobName] as any)(...(jobToRun.parameters || []));
    await markJobAsFinished(jobToRun);
  } catch (error) {
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
