import * as Mongo from 'mongodb';
import { catalogTestJob } from '../catalog/catalog.job';
import { dbConnection } from '../db/mongo';
import { log, wait } from '../../utilities/utilities';

export interface Job {
  _id: Mongo.ObjectId,
  jobName: keyof typeof jobs,
  timeToBeCompleted: number,
  submissionTime: number,
  submittedByProcessPid: number,
  timeCompleted: number | undefined,
}

// add jobs here
const jobs = {
  catalogTestJob,
};

export async function queue(jobName: keyof typeof jobs, timeToBeCompleted: number) {
  const db = await dbConnection;
  const jobCollections = db.collection('jobs');
  const job: Job = {
    _id: new Mongo.ObjectId(),
    jobName,
    timeToBeCompleted,
    submissionTime: new Date().getTime(),
    submittedByProcessPid: process.pid,
    timeCompleted: undefined,
  };
  const result = await jobCollections.insertOne(job);
  log.debug({ result });
}

export async function runScheduler() {
  const db = await dbConnection;
  const jobCollection = db.collection<Job>('jobs');
  log.info('Starting scheduler...');
  while (true) {
    const job = await jobCollection.findOne({ timeCompleted: undefined });
    if (!job) {
      log.info('Found no jobs to finish!');
    } else {
      log.info(`Found job '${job._id.toHexString()}'. Running job now...`);
      await jobs[job.jobName]();
      log.info(`Completed job '${job._id.toHexString()}'!`);
      await jobCollection.updateOne(
        { _id: job._id },
        {
          $set: {
            timeCompleted: new Date().getTime()
          }
        }
      );
    }
    await wait(1000 * 30);
  }
}
