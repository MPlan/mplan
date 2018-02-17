import * as React from 'react';
import { Catalog } from './catalog';
import { Timeline } from './timeline';
import { Warnings } from './warnings';
import { View, Text } from '../components';
import styled from 'styled-components';

const WipContainer = styled(View) `
  flex: 1;
  justify-content: center;
  align-items: center;
`;

function Wip() {
  return <WipContainer>
    <Text strong extraLarge>This page is under construction.</Text>
    <Text large>Check back soon.</Text>
  </WipContainer>
}

export const Routes = [
  { path: '/timeline', name: 'Timeline', icon: 'codeBranch', component: Timeline, },
  { path: '/warnings', name: 'Timeline Warnings', icon: 'exclamationTriangle', component: Warnings, },
  { path: '/catalog', name: 'Catalog', icon: 'list', component: Catalog, },
  { path: '/critical-path', name: 'Critical Path', icon: 'sitemap', component: Wip, },
  { path: '/degree-checklist', name: 'Degree Checklist', icon: 'check', component: Wip, },
];