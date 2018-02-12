import * as React from 'react';
import { Catalog } from './catalog';
import { Timeline } from './timeline';

function Wip() {
  return <div>todo</div>
}

export const Routes = [
  { path: '/timeline', name: 'Timeline', icon: 'codeBranch', component: Timeline, },
  { path: '/warnings', name: 'Timeline Warnings', icon: 'exclamationTriangle', component: Wip, },
  { path: '/catalog', name: 'Catalog', icon: 'list', component: Catalog, },
  { path: '/critical-path', name: 'Critical Path', icon: 'sitemap', component: Wip, },
  { path: '/degree-checklist', name: 'Degree Checklist', icon: 'check', component: Wip, },
  
];