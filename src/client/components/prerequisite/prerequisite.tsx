import * as React from 'react';
import * as Model from 'models';
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
  padding-left: ${styles.space(-1)};
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
  margin-left: ${styles.space(-1)};
`;
const StyledActionableText = styled(ActionableText)`
  margin-left: ${styles.space(-1)};
`;

export interface PrerequisiteProps {
  prerequisite: Model.Prerequisite.Model;
  catalog: Model.Catalog.Model;
  disableLinks?: boolean;
}

const PrerequisiteContainer = styled(View)`
  border: 2px solid ${styles.grayLight};
  border-radius: 5px;
  margin: ${styles.space(-1)};
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

      const courseInCatalog = !!Model.Catalog.getCourse(catalog, subjectCode, courseNumber);
      const courseString = `${subjectCode} ${courseNumber}${concurrent ? '*' : ''}`;

      return courseInCatalog ? (
        <StyledActionableText onClick={() => this.handleCourseClick(subjectCode, courseNumber)}>
          {courseString}
        </StyledActionableText>
      ) : (
        <StringPrerequisite>{courseString}</StringPrerequisite>
      );
    }

    const logicGate = Model.Prerequisite.isAndPrerequisite(prerequisite)
      ? prerequisite.and.length >= 3
        ? 'All:'
        : 'Both:'
      : 'One of:';
    const operators = ((prerequisite as any).and ||
      (prerequisite as any).or) as Model.Prerequisite.Model[];

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
