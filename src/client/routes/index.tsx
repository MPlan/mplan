import * as React from 'react';
import { Timeline } from './timeline';
import { Sequence } from './sequence';
import { Degree } from './degree';
import { DegreeEditor } from './degree-editor';
import { Catalog } from './catalog';
import { Admin } from './admin';
import { Settings } from './settings';
import { View } from 'components/view';
import { Text } from 'components/text';
import styled from 'styled-components';
import * as styles from '../styles';

const WipContainer = styled(View)`
  flex: 1 1 auto;
  justify-content: center;
  align-items: center;
`;

function Wip() {
  return (
    <WipContainer>
      <Text strong extraLarge color={styles.textLight}>
        This page is under construction.
      </Text>
      <Text large color={styles.textLight}>
        Check back soon.
      </Text>
    </WipContainer>
  );
}

export const Routes = [
  { path: '/dashboard', name: 'Dashboard', icon: 'chartLine', component: Wip },
  { path: '/degree', name: 'Degree', icon: 'graduationCap', component: Degree },
  { path: '/sequence', name: 'Sequence', icon: 'exchange', component: Sequence },
  { path: '/timeline', name: 'Timeline', icon: 'codeCommit', component: Timeline },
  { path: '/catalog', name: 'Catalog', icon: 'book', component: Catalog },
  { path: '/degree-editor', name: 'Degree editor', icon: 'edit', component: DegreeEditor },
  { path: '/students', name: 'Act as student', icon: 'user', component: Wip },
  { path: '/admin', name: 'Manage Admins', icon: 'userEdit', component: Admin },
];

export const BottomRoutes = [
  { path: '/settings', name: 'Settings', icon: 'cog', component: Settings },
];
