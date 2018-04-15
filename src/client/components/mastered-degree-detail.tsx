import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';

const Container = styled(View)``;

const Title = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
`;
const Header = styled(View)`
  margin: ${styles.space(1)};
`;

export interface MasteredDegreeDetailProps {
  masteredDegree: Model.MasteredDegree;
}

export function MasteredDegreeDetail(props: MasteredDegreeDetailProps) {
  const { masteredDegree } = props;
  return (
    <Container>
      <Header>
        <Title>{masteredDegree.name}</Title>
      </Header>
    </Container>
  );
}
