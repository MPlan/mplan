if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import { queue } from './scheduler/scheduler';
import { log } from '../utilities/utilities';

async function main() {
  await queue({
    jobName: 'sync',
    plannedStartTime: new Date().getTime(),
    priority: 10,
  });
  process.exit(0);
}

main();