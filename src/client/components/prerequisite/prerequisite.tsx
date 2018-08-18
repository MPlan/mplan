import * as React from 'react';
import * as Model from 'models/models';
import { Catalog } from 'models';
import { View } from 'components/view';
import { Text } from 'components/text';
import styled from 'styled-components';
import * as styles from 'styles';
import { ActionableText } from 'components/actionable-text';
import { history } from 'client/history';

const Operator = styled(Text)`
  font-size: ${styles.space(-1)};
  font-style: italic;
  font-weight: bold;
  margin-left: ${styles.space(-1)};
  width: 2.5rem;
`;
const StringPrerequisite = styled(Text)`
  width: 6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    white-space: normal;
    overflow: visible;
  }
`;

export interface PrerequisiteProps {
  prerequisite: Model.Prerequisite;
  catalog: Catalog;
  disableLinks?: boolean;
}

const PrerequisiteContainer = styled(View)`
  /* border: 2px solid transparent; */
  border: 2px solid ${styles.grayLight};
  border-radius: 5px;
  margin: ${styles.space(-1)};
  /* margin-bottom: ${styles.space(-1)}; */
  flex-direction: row;
  align-items: center;
`;

const OperandsContainer = styled(View)`
  margin-left: ${styles.space(-1)};
`;

export class Prerequisite extends React.PureComponent<PrerequisiteProps, {}> {
  handleCourseClick(subjectCode: string, courseNumber: string) {
    if (this.props.disableLinks) return;
    history.push(`/catalog/${subjectCode}/${courseNumber}`);
  }

  render(): JSX.Element | null {
    const { prerequisite, catalog, disableLinks } = this.props;
    if (prerequisite === undefined) return null;
    if (prerequisite === null) return null;
    if (typeof prerequisite === 'string') {
      return <StringPrerequisite>{prerequisite}</StringPrerequisite>;
    }

    if (Array.isArray(prerequisite)) {
      const subjectCode = prerequisite[0].toUpperCase();
      const courseNumber = prerequisite[1].toUpperCase();
      const concurrent = prerequisite[2] === 'CONCURRENT';

      const courseInCatalog = !!catalog.getCourse(subjectCode, courseNumber);
      const courseString = `${subjectCode} ${courseNumber}${concurrent ? '*' : ''}`;

      return courseInCatalog ? (
        <ActionableText onClick={() => this.handleCourseClick(subjectCode, courseNumber)}>
          {courseString}
        </ActionableText>
      ) : (
        <StringPrerequisite>{courseString}</StringPrerequisite>
      );
    }

    const logicGate = Model.isAndPrerequisite(prerequisite)
      ? prerequisite.and.length >= 3
        ? 'All:'
        : 'Both:'
      : 'One of:';
    const operators = ((prerequisite as any).and ||
      (prerequisite as any).or) as Model.Prerequisite[];

    return (
      <PrerequisiteContainer>
        <Operator>{logicGate}</Operator>
        <OperandsContainer>
          {operators.map((p, i) => (
            <Prerequisite key={i} prerequisite={p} catalog={catalog} disableLinks={disableLinks} />
          ))}
        </OperandsContainer>
      </PrerequisiteContainer>
    );
  }
}
