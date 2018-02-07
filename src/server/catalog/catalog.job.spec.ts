import { syncTerms } from './catalog.job';
import { fetchSubjects, fetchTerms } from 'unofficial-umdearborn-catalog-api';

process.env.MONGODB_URI = 'mongodb://local@localhost/mplan-integration-tests';

