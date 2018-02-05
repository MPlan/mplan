import { dbConnection } from '../db/mongo';
import { log } from '../../utilities/utilities'

export async function catalogTestJob() {
  log.debug('this is a test job!!');
}
