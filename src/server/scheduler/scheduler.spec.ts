process.env.MONGODB_URI = 'mongodb://local@localhost/mplan-integration-tests';
import {
  findJobTodo, collections, Job, maxJobsRunAtOnce, countOfJobsBeingWorkedOn
} from './scheduler';
import { log } from '../../utilities/utilities';
import * as Mongo from 'mongodb';
import { range } from 'lodash';



describe('scheduler', () => {

  beforeAll(() => {
    process.env.IGNORE_LOG_LEVEL_DEBUG = 'true';
  });

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

  afterAll(async () => {
    delete process.env.IGNORE_LOG_LEVEL_DEBUG;
    try {
      const { jobs, jobFailures } = await collections();
      await jobs.drop();
      await jobFailures.drop();
    } catch {
    }
  });

  describe('countOfJobsBeingWorkedOn', async () => {
    it(`counts the number of jobs where the 'timeStarted' is 'undefined'`, async () => {
      const { jobs } = await collections();
      const expectedNumberOfJobsBeingWorkedOn = 5;

      const jobsBeingWorkedOn = range(expectedNumberOfJobsBeingWorkedOn).map(i => {
        const timestamp = new Date().getTime();
        const job: Job = {
          _id: new Mongo.ObjectId(),
          jobName: '__testJob',
          plannedStartTime: timestamp,
          startedByUser: 'TEST',
          submissionTime: timestamp,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          timeStarted: timestamp,
          workedOnByProcessPid: process.pid,
        };
        return job;
      });

      const uncompletedJobs = range(3).map(i => {
        const timestamp = new Date().getTime();
        const job: Job = {
          _id: new Mongo.ObjectId(),
          jobName: '__testJob',
          plannedStartTime: timestamp,
          startedByUser: 'TEST',
          submissionTime: timestamp,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          timeStarted: undefined,
          workedOnByProcessPid: undefined,
        };
        return job;
      });

      await jobs.insertMany([...jobsBeingWorkedOn, ...uncompletedJobs]);

      expect(await countOfJobsBeingWorkedOn()).toBe(expectedNumberOfJobsBeingWorkedOn);
    });
  });

  describe('countOfJobsTodo', () => {
    it(`counts the number of jobs todo`);
  })

  describe('findJobTodo', () => {
    it('returns undefined when the collection is empty', async () => {
      const { jobs } = await collections();
      const jobTodo = await findJobTodo();
      expect(jobTodo).toBeUndefined();
    });

    it('returns undefined when there are no uncompleted jobs or unworked on', async () => {
      const { jobs } = await collections();

      const jobBeingWorkedOn: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        startedByUser: 'TEST',
        submissionTime: new Date().getTime(),
        submittedByProcessPid: process.pid,
        timeCompleted: undefined,
        plannedStartTime: new Date().getTime(),
        workedOnByProcessPid: process.pid,
        timeStarted: new Date().getTime(),
      };

      const completedJob: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        plannedStartTime: new Date().getTime() - 2000,
        startedByUser: 'TEST',
        submissionTime: new Date().getTime() - 3000,
        submittedByProcessPid: process.pid,
        timeCompleted: new Date().getTime(),
        timeStarted: new Date().getTime() - 1000,
        workedOnByProcessPid: process.pid,
      };

      const otherCompletedJob: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        plannedStartTime: new Date().getTime() - 2000,
        startedByUser: 'TEST',
        submissionTime: new Date().getTime() - 3000,
        submittedByProcessPid: process.pid,
        timeCompleted: new Date().getTime(),
        timeStarted: new Date().getTime() - 1000,
        workedOnByProcessPid: process.pid,
      };

      await jobs.insertMany([jobBeingWorkedOn, completedJob, otherCompletedJob]);

      const jobTodo = await findJobTodo();
      expect(jobTodo).toBeUndefined();

    })
    it('returns undefined when too many jobs are run', async () => {
      const { jobs } = await collections();

      const jobsBeingWorkedOn = range(maxJobsRunAtOnce).map(i => {
        const timestamp = new Date().getTime() - (i * 1000);
        const job: Job = {
          _id: new Mongo.ObjectId(),
          jobName: '__testJob',
          plannedStartTime: timestamp - 2000,
          startedByUser: 'TEST',
          submissionTime: timestamp - 3000,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          timeStarted: timestamp - 1000,
          workedOnByProcessPid: process.pid,
        };
        return job;
      });

      const jobsThatCanBeWorkedOn = range(3).map(i => {
        const timestamp = new Date().getTime() - (1000 * i * 60);
        const job: Job = {
          _id: new Mongo.ObjectId(),
          jobName: '__testJob',
          plannedStartTime: timestamp - 1000,
          startedByUser: 'TEST',
          submissionTime: timestamp - 2000,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          timeStarted: undefined,
          workedOnByProcessPid: undefined,
        };
        return job;
      });

      const jobsToSubmit = [...jobsBeingWorkedOn, ...jobsThatCanBeWorkedOn];

      await jobs.insertMany(jobsToSubmit);

      const firstJob = jobsThatCanBeWorkedOn[jobsThatCanBeWorkedOn.length - 1];
      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      expect(jobTodo._id.toHexString()).toBe(firstJob._id.toHexString());

      const oneMoreJob: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        startedByUser: 'TEST',
        submissionTime: new Date().getTime(),
        submittedByProcessPid: process.pid,
        timeCompleted: undefined,
        plannedStartTime: new Date().getTime(),
        workedOnByProcessPid: process.pid,
        timeStarted: new Date().getTime(),
      }

      await jobs.insertOne(oneMoreJob);

      const noJob = await findJobTodo();
      expect(noJob).toBeUndefined();
    });

    it('returns the oldest job', async () => {
      const { jobs } = await collections();

      const jobsToSubmit = range(maxJobsRunAtOnce - 1).map(i => {
        const timestamp = new Date().getTime() - (Math.random() * 100 * 1000);
        const job: Job = {
          _id: new Mongo.ObjectId(),
          jobName: '__testJob',
          startedByUser: 'TEST',
          submissionTime: timestamp,
          submittedByProcessPid: process.pid,
          timeCompleted: undefined,
          plannedStartTime: timestamp,
          workedOnByProcessPid: undefined,
          timeStarted: undefined,
        };
        return job;
      });

      // const first
      await jobs.insertMany(jobsToSubmit);
      const jobTodoFirst = jobsToSubmit.sort((jobA, jobB) =>
        jobA.plannedStartTime - jobB.plannedStartTime
      )[0];

      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      expect(jobTodo._id.toHexString()).toBe(jobTodoFirst._id.toHexString());
    });
  });

  describe('runJob', () => {
    it(`updates the 'beingWorkedOn' flag before it starts a job`);
    it(`inserts a 'JobFailure' entry when the job throws or rejects`);
    it(``);
  });
});