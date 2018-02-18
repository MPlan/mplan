if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as path from 'path';
import * as throng from 'throng';
import * as compression from 'compression';

import { api } from './api';
import { getOrThrow, log } from '../utilities/utilities';
import { queue, executeSchedulerQueue, restartUnfinishedJobs } from './scheduler/scheduler';
import { dbConnection } from './models/mongo';

const app = express();

// vars
const port = parseInt(process.env.PORT || '8090');
const webConcurrency = parseInt(process.env.WEB_CONCURRENCY || '1');

async function start(workerId: number) {
  // require https in production
  if (process.env.NODE_ENV === 'production') {
    // https://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(process.env.APP_URL + req.url);
        return;
      }
      next();
    })
  }

  app.use('/api', api);
  app.use(compression(), express.static(path.resolve(__dirname, '../web-root')));
  app.use('*', compression(), (req, res) => {
    res.sendFile(path.resolve(__dirname, '../web-root/index.html'));
  });

  app.listen(port, () => log.info(`Cluster started on port '${port}'`));

  process.on('exit', async () => {
    log.info('Process exit detected, attempting disconnect from database...');
    const db = await dbConnection;
    await db.close();
    log.info('Disconnected successful from the database.');
    log.info('Exiting process...');
  });

  
  // process.exit(0);
  // await executeSchedulerQueue();
}

async function master() {
  log.info('Application started');
  // await restartUnfinishedJobs();
  // await queue({
  //   jobName: 'sync',
  //   plannedStartTime: new Date().getTime()
  // });
}

throng({ workers: webConcurrency, start, master });
