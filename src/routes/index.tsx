import { Catalog } from './catalog';
import { Timeline } from './timeline';

export const Routes = [
  { path: '/timeline', name: 'Timeline', icon: 'calendarAlt', component: Timeline, },
  { path: '/catalog', name: 'Catalog', icon: 'book', component: Catalog, },
];