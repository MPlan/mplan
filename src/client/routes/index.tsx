import * as React from 'react';
import { Timeline } from './timeline';
import { Sequence } from './sequence';
import { Degree } from './degree';
import { DegreeEditor } from './degree-editor';
import { View, Text } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

const WipContainer = styled(View)`
  flex: 1;
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
  { path: '/catalog', name: 'Catalog', icon: 'book', component: Wip },
  { path: '/degree-editor', name: 'Degree Editor', icon: 'edit', component: DegreeEditor },
];
