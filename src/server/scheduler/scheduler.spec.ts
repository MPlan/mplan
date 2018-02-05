process.env.MONGODB_URI = 'mongodb://local@localhost/mplan-integration-tests';
process.env.IGNORE_LOG_LEVEL_DEBUG = 'true';
import { findJobTodo, collections, Job } from './scheduler';
import { log } from '../../utilities/utilities';
import * as Mongo from 'mongodb';
import { range } from 'lodash';

beforeEach(async () => {
  log.debug('dropping and re-creating collections...');
  try {
    const { jobs, jobFailures } = await collections();
    await jobs.drop();
    await jobFailures.drop();
  } catch {
  } finally {
    const { jobs, jobFailures } = await collections();
  }
});

describe('scheduler', () => {
  describe('findJobTodo', () => {
    it('returns undefined when the collection is empty', async () => {
      const { jobs } = await collections();
      const jobTodo = await findJobTodo();
      expect(jobTodo).toBeUndefined();
    });

    it('returns undefined when there are no uncompleted jobs or unworked on', async () => {
      const { jobs } = await collections();

      const jobBeingWorkedOn: Job = {
        beingWorkedOn: true,
        _id: new Mongo.ObjectId(),
        jobName: 'testJob',
        startedBy: 'TEST',
        submissionTime: new Date().getTime(),
        submittedByProcessPid: process.pid,
        timeCompleted: undefined,
        timeToBeCompleted: new Date().getTime(),
      };

      const completedJob: Job = {
        beingWorkedOn: false,
        _id: new Mongo.ObjectId(),
        startedBy: 'TEST',
        submittedByProcessPid: new Date().getTime(),
        submissionTime: process.pid,
        timeCompleted: new Date().getTime(),
        timeToBeCompleted: new Date().getTime(),
        jobName: 'testJob',
      };

      const otherCompletedJob: Job = {
        beingWorkedOn: false,
        _id: new Mongo.ObjectId(),
        startedBy: 'TEST',
        submittedByProcessPid: new Date().getTime(),
        submissionTime: process.pid,
        timeCompleted: new Date().getTime(),
        timeToBeCompleted: new Date().getTime(),
        jobName: 'testJob',
      };

      await jobs.insertMany([jobBeingWorkedOn, completedJob, otherCompletedJob]);

      const jobTodo = await findJobTodo();
      expect(jobTodo).toBeUndefined();

    })
    it('returns undefined when too many jobs are run');

    it('returns the oldest job', async () => {
      const { jobs } = await collections();

      const jobsToSubmit = range(10).map(i => {
        const timestamp = new Date().getTime() - (Math.random() * 100 * 1000);
        const job: Job = {
          _id: new Mongo.ObjectId(),
          beingWorkedOn: false,
          jobName: 'testJob',
          startedBy: 'TEST',
          submissionTime: timestamp,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          timeToBeCompleted: timestamp,
        };
        return job;
      });

      // const first
      await jobs.insertMany(jobsToSubmit);
      const jobTodoFirst = jobsToSubmit.sort((jobA, jobB) =>
        jobA.timeToBeCompleted - jobB.timeToBeCompleted
      )[0];

      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      expect(jobTodo._id.toHexString()).toBe(jobTodoFirst._id.toHexString());
    });
  })
});