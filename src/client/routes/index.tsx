import * as React from 'react';
import { Catalog } from './catalog';
import { Timeline } from './timeline';
import { Warnings } from './warnings';
import { View, Text } from '../components/base';

function Wip() {
  return <View flex justifyContent="center" alignItems="center">
    <Text strong extraLarge>This page is under construction.</Text>
    <Text large>Check back soon.</Text>
  </View>
}

export const Routes = [
  { path: '/timeline', name: 'Timeline', icon: 'codeBranch', component: Timeline, },
  { path: '/warnings', name: 'Timeline Warnings', icon: 'exclamationTriangle', component: Warnings, },
  { path: '/catalog', name: 'Catalog', icon: 'list', component: Catalog, },
  { path: '/critical-path', name: 'Critical Path', icon: 'sitemap', component: Wip, },
  { path: '/degree-checklist', name: 'Degree Checklist', icon: 'check', component: Wip, },
  
];