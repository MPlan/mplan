import * as React from 'react';
import * as Model from '../../models/models';
import { View } from './view';
import { Text } from './text';
import styled from 'styled-components';
import * as styles from '../styles';

const Operator = styled(Text)`
  font-size: ${styles.space(-1)};
  font-style: italic;
  font-weight: bold;
`;
const Course = styled(Text)``;
const StringPrerequisite = styled(Text)``;

export interface PrerequisiteProps {
  prerequisite: Model.Prerequisite;
}

const PrerequisiteContainer = styled(View)`
  /* border: 2px solid transparent; */
  border: 2px solid ${styles.grayLight};
  border-radius: 5px;
  margin-bottom: ${styles.space(-1)};
  flex-direction: row;
`;

const OperandsContainer = styled(View)`
  margin-left: ${styles.space(-1)};
`;

export class Prerequisite extends React.PureComponent<PrerequisiteProps, {}> {
  render(): JSX.Element | null {
    const { prerequisite } = this.props;
    if (prerequisite === undefined) return null;
    if (prerequisite === null) return null;
    if (typeof prerequisite === 'string') {
      return <StringPrerequisite>{prerequisite}</StringPrerequisite>;
    }

    if (Array.isArray(prerequisite)) {
      const subjectCode = prerequisite[0];
      const courseNumber = prerequisite[1];
      const concurrent = prerequisite[2] === 'CONCURRENT';

      return (
        <Course>
          {subjectCode} {courseNumber}
          {concurrent ? '*' : ''}
        </Course>
      );
    }

    const logicGate = (prerequisite as any).and ? 'All' : 'Either';
    const operators = ((prerequisite as any).and ||
      (prerequisite as any).or) as Model.Prerequisite[];

    return (
      <PrerequisiteContainer>
        <Operator>{logicGate}</Operator>
        <OperandsContainer>
          {operators.map((p, i) => (
            <Prerequisite key={i} prerequisite={p} />
          ))}
        </OperandsContainer>
      </PrerequisiteContainer>
    );
  }
}
