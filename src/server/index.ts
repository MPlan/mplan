if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import * as express from 'express';
import * as path from 'path';
import * as throng from 'throng';
import * as compression from 'compression';
import * as Sentry from '@sentry/node';

import { api } from './api';
import { log, getOrThrow } from '../utilities/utilities';
import { dbConnection } from './models/mongo';

const app = express();

// vars
const port = parseInt(process.env.PORT || '8090');
const webConcurrency = parseInt(process.env.WEB_CONCURRENCY || '1');
const sentryDsn = getOrThrow(process.env.SENTRY_DSN);

async function start() {
  // require https in production
  if (process.env.NODE_ENV === 'production') {
    // https://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect
    app.use((req, res, next) => {
      if (req.headers['x-forwarded-proto'] !== 'https') {
        res.redirect(process.env.APP_URL + req.url);
        return;
      }
      next();
    });

    Sentry.init({ dsn: sentryDsn });
  }

  app.use(Sentry.Handlers.requestHandler());
  app.use('/api', api);
  app.use(Sentry.Handlers.errorHandler());
  app.use(compression(), express.static(path.resolve(__dirname, '../web-root')));
  app.use('*', compression(), (_, res) => {
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
}

async function master() {
  log.info('Application started');
}

throng({ workers: webConcurrency, start, master });
