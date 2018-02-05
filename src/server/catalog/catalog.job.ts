import { log } from '../../utilities/utilities';
import { fetchTerms } from 'unofficial-umdearborn-catalog-api';

export async function catalogTestJob() {
  log.debug('this is a test job!!');
}

export async function syncTerms() {
  const terms = await fetchTerms();
}