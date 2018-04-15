import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import * as Model from '../models';
import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';

const Container = styled(View)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  &:hover {
    box-shadow: 0 0.1rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  background-color: ${styles.white};
  &:active {
    box-shadow: 0 0.2rem 1.3rem 0 rgba(12, 0, 51, 0.2);
  }
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`;
const Name = styled(Text)`
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
  margin-bottom: ${styles.space(-1)};
`;
const Details = styled(View)`
  flex-direction: row;
`;
const CreditHourTotal = styled(Text)`
  min-width: 6rem;
  margin-right: ${styles.space(0)};
`;
const DegreeGroupTotal = styled(Text)``;
const NameAndDetails = styled(View)`
  flex: 1;
  margin-right: ${styles.space(0)};
`;
const Icon = styled(View)`
  min-width: ${styles.space(1)};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export interface DegreeItemProps {
  masteredDegree: Model.MasteredDegree;
}

export function DegreeItem(props: DegreeItemProps) {
  const { masteredDegree } = props;
  return (
    <Container>
      <NameAndDetails>
        <Name>{masteredDegree.name}</Name>
        <Details>
          <CreditHourTotal>120 Credits</CreditHourTotal>
          <DegreeGroupTotal>8 Degree groups</DegreeGroupTotal>
        </Details>
      </NameAndDetails>
      <Icon>
        <Fa icon="chevronRight" />
      </Icon>
    </Container>
  );
}
