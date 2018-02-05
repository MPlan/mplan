process.env.MONGODB_URI = 'mongodb://local@localhost/mplan-integration-tests';
import {
  findJobTodo, maxJobsRunAtOnce, countOfJobsBeingWorkedOn, runJob,
  markJobAsStarted, queue, markJobAsFinished, markJobAsFailure
} from './scheduler';
import { Job, JobFailure } from '../models/jobs';
import { log } from '../../utilities/utilities';
import * as Mongo from 'mongodb';
import { range } from 'lodash';
import { dbConnection } from '../models/mongo';

describe('scheduler', () => {
  if (process.env.SKIP_SCHEDULER_INTEGRATION_TESTS) { return; }

  beforeAll(() => {
    process.env.IGNORE_LOG_LEVEL_DEBUG = 'true';
    process.env.IGNORE_LOG_LEVEL_ERROR = 'true';
    process.env.IGNORE_LOG_LEVEL_INFO = 'true';
  });

  beforeEach(async () => {
    log.debug('dropping and re-creating collections...');
    try {
      const { jobs, jobFailures } = await dbConnection;
      await jobs.drop();
      await jobFailures.drop();
    } catch {
    } finally {
      const { jobs, jobFailures } = await dbConnection;
    }
  });

  afterAll(async () => {
    delete process.env.IGNORE_LOG_LEVEL_DEBUG;
    delete process.env.IGNORE_LOG_LEVEL_ERROR;
    delete process.env.IGNORE_LOG_LEVEL_INFO;

    try {
      const { jobs, jobFailures } = await dbConnection;
      await jobs.drop();
      await jobFailures.drop();
    } catch {
    }
  });

  describe('countOfJobsBeingWorkedOn', async () => {
    it(`counts the number of jobs where the 'timeStarted' is 'undefined'`, async () => {
      const { jobs } = await dbConnection;
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

  describe('findJobTodo', () => {
    it('returns undefined when the collection is empty', async () => {
      const { jobs } = await dbConnection;
      const jobTodo = await findJobTodo();
      expect(jobTodo).toBeUndefined();
    });

    it('returns undefined when there are no uncompleted jobs or unworked on', async () => {
      const { jobs } = await dbConnection;

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
      const { jobs } = await dbConnection;

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
      const { jobs } = await dbConnection;

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

  describe('markJobAsStarted', async () => {
    it(`updates the job in the DB with 'workedOnByProcessPid' and 'timeStarted'`, async () => {
      const { jobs } = await dbConnection;

      const jobTodoToInsert: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        plannedStartTime: new Date().getTime() - 1000,
        startedByUser: 'TEST',
        submissionTime: new Date().getTime() - 2000,
        submittedByProcessPid: process.pid,
        timeCompleted: undefined,
        timeStarted: undefined,
        workedOnByProcessPid: undefined,
      };

      await jobs.insertOne(jobTodoToInsert);

      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();

      await markJobAsStarted(jobTodo);
      const startedJobCount = await countOfJobsBeingWorkedOn();
      expect(startedJobCount).toBe(1);

      const startedJob = (await jobs.findOne({}))!;
      expect(startedJob).toBeDefined();
      expect(startedJob.timeStarted).toBeDefined();
      expect(startedJob.workedOnByProcessPid).toBeDefined();
      expect(startedJob.timeCompleted).toBeFalsy();
    });
  });

  describe('markJobAsFinished', () => {
    it(`updates the 'timeCompleted' field in the job document`, async () => {
      const { jobs } = await dbConnection;
      await queue('__testJob', new Date().getTime());
      const todo = (await findJobTodo())!;
      expect(todo).toBeDefined();
      await markJobAsStarted(todo);
      await markJobAsFinished(todo);

      const jobFromDb = (await jobs.findOne({}))!;
      expect(jobFromDb).toBeDefined();
      expect(jobFromDb.timeCompleted).toBeDefined();
    });
  });

  describe('markJobAsFailure', () => {
    it(`adds a document to 'JobFailures' and marks the current job to be redone`, async () => {
      const { jobs, jobFailures } = await dbConnection;

      const jobToFail: Job = {
        _id: new Mongo.ObjectId(),
        jobName: '__testJob',
        plannedStartTime: new Date().getTime() - 2000,
        startedByUser: 'TEST',
        submissionTime: new Date().getTime() - 3000,
        submittedByProcessPid: process.pid,
        timeCompleted: undefined,
        timeStarted: new Date().getTime() - 1000,
        workedOnByProcessPid: process.pid,
      };

      await jobs.insertOne(jobToFail);

      const jobToFailFromDb = (await jobs.findOne({}))!;
      expect(jobToFailFromDb).toBeDefined();

      await markJobAsFailure(jobToFailFromDb, 'some test error');

      const failedJobFromDb = (await jobs.findOne({}))!;
      expect(failedJobFromDb).toBeDefined();
      expect(failedJobFromDb.timeStarted).toBeFalsy();
      expect(failedJobFromDb.workedOnByProcessPid).toBeFalsy();
      expect(failedJobFromDb.timeCompleted).toBeFalsy();

      const jobFailuresFromDb = await jobFailures.find({});
      const failureDocumentCount = await jobFailuresFromDb.count();
      expect(failureDocumentCount).toBe(1);

      const jobFailureFromDb = (await jobFailuresFromDb.next());
      expect(jobFailureFromDb).toBeDefined();
      expect(jobFailureFromDb.jobId.toHexString()).toBe(failedJobFromDb._id.toHexString());
      expect(jobFailureFromDb.timeFailed).toBeDefined();
      expect(jobFailureFromDb.failedByProcessPid).toBeDefined();
      expect(jobFailureFromDb.errorMessage).toBe('some test error');
      expect(jobFailureFromDb.stack).toBeDefined();
    });
  });

  describe('queue', () => {
    it(`queues jobs by adding entries to the jobs collection`, async () => {
      await queue('__testJob', new Date().getTime());
      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      expect(jobTodo.jobName).toBeDefined();
      expect(jobTodo.plannedStartTime).toBeDefined();
      expect(jobTodo.startedByUser).toBeDefined();
      expect(jobTodo.submissionTime).toBeDefined();
      expect(jobTodo.submittedByProcessPid).toBeDefined();
      expect(jobTodo.timeCompleted).toBeFalsy();
      expect(jobTodo.timeStarted).toBeFalsy();
      expect(jobTodo.workedOnByProcessPid).toBeFalsy();
    });
  });

  describe('runJob', () => {
    it('adds a failure document when the job throws', async () => {
      const { jobFailures, jobs } = await dbConnection;
      await queue('__testJobThatFails', new Date().getTime());
      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      await runJob(jobTodo);

      const jobAfterFail = (await jobs.findOne({}))!;
      expect(jobAfterFail).toBeDefined();
      expect(jobAfterFail.timeCompleted).toBeFalsy();
      expect(jobAfterFail.timeStarted).toBeFalsy();
      expect(jobAfterFail.timeCompleted).toBeFalsy();
      expect(jobAfterFail.workedOnByProcessPid).toBeFalsy();

      const jobFailure = (await jobFailures.findOne({}))!;
      expect(jobFailure).toBeDefined();
      expect(jobFailure.errorMessage).toBe('failing job');
      expect(jobFailure.stack).toBeDefined();
      expect(jobFailure.jobId.toHexString()).toBe(jobTodo._id.toHexString());
      expect(jobFailure.timeFailed).toBeDefined();
    });

    it('runs a job', async () => {
      const { jobs, jobFailures } = await dbConnection;
      await queue('__testJob', new Date().getTime());
      const jobTodo = (await findJobTodo())!;
      expect(jobTodo).toBeDefined();
      await runJob(jobTodo);
      const completedJob = (await jobs.findOne({}))!;
      expect(completedJob).toBeDefined();
      expect(completedJob.timeCompleted).toBeDefined();
      expect(completedJob.workedOnByProcessPid).toBeDefined();
      expect(completedJob.timeStarted).toBeDefined();

      const jobFailure = await jobFailures.findOne({});
      expect(jobFailure).toBeFalsy();
    });
  });
});
