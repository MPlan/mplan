if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as path from 'path';
import * as throng from 'throng';

import { api } from './api';
import { getOrThrow, log } from '../utilities/utilities';
import { queue, executeSchedulerQueue } from './scheduler/scheduler';
import { dbConnection } from './models/mongo';

const app = express();

// vars
const port = parseInt(process.env.PORT || '8090');
const webConcurrency = parseInt(process.env.WEB_CONCURRENCY || '1');

async function start(workerId: number) {
  app.use('/api', api);
  app.use(express.static(path.resolve(__dirname, '../web-root')));
  app.use('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../web-root/index.html'));
  });

  app.listen(port, () => log.info(`Cluster started on port '${port}'`));

  // await queue('catalogTestJob', new Date().getTime() + 1000 * 60);

  process.on('exit', async () => {
    log.info('Process exit detected, attempting disconnect from database...');
    const db = await dbConnection;
    await db.close();
    log.info('Disconnected successful from the database.');
    log.info('Exiting process...');
  });

  await queue({
    jobName: 'syncTerms',
    plannedStartTime: new Date().getTime()
  });
  await executeSchedulerQueue();
}

async function master() {
  log.info('Application started');
}

throng({ workers: webConcurrency, start, master });
