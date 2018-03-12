import * as React from 'react';
import * as Model from '../../models/models';
import { View, Text } from '../components';
import styled from 'styled-components';
import * as styles from '../styles';

export interface PrerequisiteProps {
  prerequisite: Model.Prerequisite;
}

const PrerequisiteContainer = styled(View)`
  border: ${styles.border};
  /* padding-left: ${styles.space(-1)}; */
  padding-bottom: ${styles.space(-1)};
`;

const OperandsContainer = styled(View)`
  margin-left: ${styles.space(-1)};
`;

export function Prerequisite({
  prerequisite
}: PrerequisiteProps): JSX.Element | null {
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

  const logicGate = /*if*/ prerequisite.g === '&' ? 'ALL' : 'EITHER';

  return (
    <PrerequisiteContainer>
      <Text small>{logicGate}</Text>
      <OperandsContainer>
        {prerequisite.o.map((p, i) => (
          <Prerequisite key={i} prerequisite={p} />
        ))}
      </OperandsContainer>
    </PrerequisiteContainer>
  );
}
