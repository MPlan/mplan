import * as React from 'react';
import * as Model from '../../models/models';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';

export interface PrerequisiteProps {
  prerequisite: Model.Prerequisite;
}

const PrerequisiteContainer = styled(View)``;

const OperandsContainer = styled(View)`
  margin-left: ${styles.space(-1)};
`;

export function Prerequisite({ prerequisite }: PrerequisiteProps): JSX.Element | null {
  if (prerequisite === undefined) {
    return null;
  }
  if (prerequisite === null) {
    return null;
  }
  if (typeof prerequisite === 'string') {
    return <Text small>{prerequisite}</Text>;
  }
  if (Array.isArray(prerequisite)) {
    const subjectCode = prerequisite[0];
    const courseNumber = prerequisite[1];
    return (
      <Text small>
        {subjectCode} {courseNumber}
      </Text>
    );
  }

  const logicGate = (prerequisite as any).and ? 'ALL' : 'EITHER';
  const operators = ((prerequisite as any).and || (prerequisite as any).or) as Model.Prerequisite[];

  return (
    <PrerequisiteContainer>
      <Text small>{logicGate}</Text>
      <OperandsContainer>
        {operators.map((p, i) => <Prerequisite key={i} prerequisite={p} />)}
      </OperandsContainer>
    </PrerequisiteContainer>
  );
}
