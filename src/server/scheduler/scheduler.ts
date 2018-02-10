import * as Mongo from 'mongodb';
import { oneLine } from 'common-tags';
import { dbConnection } from '../models/mongo';
import { log, wait, pad, throwIfNotOne } from '../../utilities/utilities';
import { Job, JobFailure, JobTypes, JobSuccess, JobInProgress } from '../models/jobs';
import * as colors from 'colors';

export const pollingWaitTime = 1000;
export const maxJobsRunAtOnce = 4;
export const maxAttempts = 3;

// TODO
// export interface SchedulerSettings {
//   _id: Mongo.ObjectId,
//   // pollingTime: 
// }

function colorMap(action: 'insert' | 'complete' | 'in-prog', message: string) {
  if (action === 'insert') { return colors.cyan(message); }
  if (action === 'in-prog') { return colors.yellow(message); }
  if (action === 'complete') { return colors.green(message); }
  return message;
}

function logJob(job: Job, action: 'insert' | 'complete' | 'in-prog') {
  log.info(oneLine`
    ${colorMap(action, pad(action.toUpperCase(), 'complete'.length, true))}
    ${pad(job.jobName, 20, true)}
    ${job.parameters.map(p => pad(p, 5, true)).join('|')}| #${job._id}
  `);
}

export async function queue(options: {
  jobName: keyof JobTypes,
  plannedStartTime: number,
  priority?: number,
  parameters?: string[],
  startedByUser?: string
}) {
  const { jobName, plannedStartTime, priority, parameters, startedByUser } = options;
  const { jobs } = await dbConnection;
  const job: Job = {
    _id: new Mongo.ObjectId(),
    jobName,
    parameters: parameters || [],
    plannedStartTime,
    startedByUser: startedByUser || 'SYSTEM',
    submissionTime: new Date().getTime(),
    submittedByProcessPid: process.pid,
    attempts: 0,
    priority: priority || 0,
  };
  const result = await jobs.insertOne(job);
  logJob(job, 'insert');
}

export async function countOfJobsBeingWorkedOn() {
  const { jobs } = await dbConnection;
  jobs.updateOne
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

  const highestPriorityJob = await (jobs
    .find({ plannedStartTime: { $lt: new Date().getTime() } })
    .sort({ priority: -1 })
    .limit(1)
    .next()
  );
  if (!highestPriorityJob) { return undefined; }

  const job = await (jobs
    .find({
      plannedStartTime: { $lt: new Date().getTime() },
      priority: highestPriorityJob.priority,
    })
    .sort({ submissionTime: 1 })
    .limit(1)
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

  logJob(jobInProgress, 'in-prog');
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

  logJob(jobToFinish, 'complete');
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

export async function restartUnfinishedJobs() {
  const { jobsInProgress, jobs } = await dbConnection;

  let findJobAndDeleteOp = await jobsInProgress.findOneAndDelete({});
  while (findJobAndDeleteOp.value) {
    const jobInProgress = findJobAndDeleteOp.value;
    const jobToRetry: Job = {
      _id: new Mongo.ObjectId(),
      attempts: jobInProgress.attempts + 1,
      jobName: jobInProgress.jobName,
      parameters: jobInProgress.parameters,
      plannedStartTime: jobInProgress.plannedStartTime,
      priority: jobInProgress.priority,
      startedByUser: jobInProgress.startedByUser,
      submissionTime: jobInProgress.submissionTime,
      submittedByProcessPid: process.pid,
    };

    await jobs.insertOne(jobToRetry);
    logJob(jobToRetry, 'insert');
    findJobAndDeleteOp = await jobsInProgress.findOneAndDelete({});
  }
}
