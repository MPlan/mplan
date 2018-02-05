import * as Mongo from 'mongodb';
import { catalogTestJob } from '../catalog/catalog.job';
import { dbConnection } from '../db/mongo';
import { log, wait } from '../../utilities/utilities';

const pollingWaitTime = 60 * 1000;
const maxJobsRunAtOnce = 4;

async function testJob() {
  return 'test job!';
}

// add jobs here
const JobTypes = {
  catalogTestJob,
  testJob,
};

type _JobTypes = typeof JobTypes;
export interface JobTypes extends _JobTypes { }

export interface Job {
  _id: Mongo.ObjectId,
  jobName: keyof JobTypes,
  timeToBeCompleted: number,
  submissionTime: number,
  submittedByProcessPid: number,
  timeCompleted: number | undefined,
  beingWorkedOn: boolean,
  startedBy: string,
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

export async function queue(jobName: keyof typeof JobTypes, timeToBeCompleted: number) {
  const db = await dbConnection;
  const jobCollections = db.collection<Job>('jobs');
  const job: Job = {
    _id: new Mongo.ObjectId(),
    jobName,
    timeToBeCompleted,
    submissionTime: new Date().getTime(),
    submittedByProcessPid: process.pid,
    beingWorkedOn: false,
    timeCompleted: undefined,
    startedBy: 'SYSTEM',
  };
  const result = await jobCollections.insertOne(job);
  log.debug({ result });
}


export async function findJobTodo() {
  const { jobs } = await collections();
  const cursor = jobs.find({ beingWorkedOn: true });
  const numberOfJobsBeingWorkedOn = await cursor.count();

  if (numberOfJobsBeingWorkedOn > maxJobsRunAtOnce) { return undefined; }

  const job = await (jobs
    .find({ beingWorkedOn: false, timeCompleted: undefined })
    .sort({ submissionTime: 1 })
    .next()
  );

  if (!job) { return undefined; }
  return job;
}

export async function runJob(jobToRun: Job) {
  const { jobs, jobFailures } = await collections();
  log.info(`Working on job '${jobToRun._id}'...`);
  await jobs.updateOne(
    { _id: jobToRun._id },
    {
      $set: {
        beingWorkedOn: true,
      }
    }
  );

  try {
    await JobTypes[jobToRun.jobName]();
    log.info(`Finished job '${jobToRun._id}'!`);

    const jobFinishUpdate: Partial<Job> = {
      beingWorkedOn: false,
      timeCompleted: new Date().getTime(),
    }
    await jobs.updateOne({ _id: jobToRun._id }, { $set: jobFinishUpdate });
  } catch (error) {
    log.error(`Error with job ${jobToRun._id}`);
    const jobFailure: JobFailure = {
      _id: new Mongo.ObjectId(),
      failedByProcessPid: process.pid,
      jobId: jobToRun._id,
      timeFailed: new Date().getTime(),
      error
    };
    await jobFailures.insertOne(jobFailure);
    const jobFinishWithFailureUpdate: Partial<Job> = {
      beingWorkedOn: false,
    }
    await jobs.updateOne({ _id: jobToRun._id }, { $set: jobFinishWithFailureUpdate });
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
