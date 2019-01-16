import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Page as _Page } from 'components/page';
import { Text } from 'components/text';
import { View } from 'components/view';
import { PrimaryButton } from 'components/button';
import { RequirementGroup, CourseModel } from './components/requirement-group';

const { round } = Math;

const Page = styled(_Page)`
  flex: 1 0 auto;
`;
const TitleLeft = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;
const Status = styled(View)``;
const PercentageRow = styled(View)`
  flex-direction: row;
  /* margin-bottom: ${styles.space(-1)}; */
  align-items: baseline;
`;
const Percentage = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: bold;
  margin-right: ${styles.space(-1)};
  min-width: 6rem;
  text-align: right;
`;
const CompleteText = styled(Text)`
  font-size: ${styles.space(1)};
`;
const CreditsRow = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
const Credits = styled(Text)`
  font-size: ${styles.space(1)};
  margin-right: ${styles.space(-1)};
  min-width: 6rem;
  text-align: right;
`;
const CreditsText = styled(Text)``;
const TutorialButton = styled(PrimaryButton)`
  margin-right: ${styles.space(0)};
`;
const Warnings = styled(View)`
  flex: 0 0 auto;
  margin-bottom: ${styles.space(0)};
  & > *:not(:last-child) {
    margin-bottom: ${styles.space(-1)};
  }
`;
const Warning = styled(Text)`
  font-weight: bold;
  color: ${styles.danger};
  padding: 0 ${styles.space(1)};
`;
const Body = styled(View)`
  flex: 1 0 auto;
  flex-direction: row;
  padding: 0 ${styles.space(1)};
  overflow-x: auto;
  & > *:not(:last-child) {
    margin-right: ${styles.space(1)};
  }
`;
const Column = styled(View)`
  flex: 0 0 auto;
  width: 24rem;
`;

interface RequirementGroupModel {
  id: string;
  name: string;
  courses: CourseModel[];
}

interface DegreeProps {
  degreeName: string;
  currentCredits: number;
  totalCredits: number;
  columnOne: RequirementGroupModel[];
  columnTwo: RequirementGroupModel[];
  columnThree: RequirementGroupModel[];
}
interface DegreeState {}

export class Degree extends React.PureComponent<DegreeProps, DegreeState> {
  render() {
    const {
      degreeName,
      currentCredits,
      totalCredits,
      columnOne,
      columnTwo,
      columnThree,
    } = this.props;

    const percentage = (currentCredits * 100) / totalCredits;

    return (
      <Page
        title={degreeName}
        titleLeft={
          <TitleLeft>
            <Status>
              <PercentageRow>
                <Percentage>{isNaN(percentage) ? '0' : round(percentage)}%</Percentage>
                <CompleteText>complete</CompleteText>
              </PercentageRow>
              <CreditsRow>
                <Credits>
                  {currentCredits}/{totalCredits}
                </Credits>
                <CreditsText>credits</CreditsText>
              </CreditsRow>
            </Status>
          </TitleLeft>
        }
      >
        <Warnings>
          <Warning>A warning</Warning>
          <Warning>Another warning</Warning>
        </Warnings>
        <Body>
          <Column>
            {columnOne.map(requirementGroup => (
              <RequirementGroup
                key={requirementGroup.id}
                {...requirementGroup}
                onClickCourse={() => {}}
                onEdit={() => {}}
              />
            ))}
          </Column>
          <Column>
            {columnTwo.map(requirementGroup => (
              <RequirementGroup
                key={requirementGroup.id}
                {...requirementGroup}
                onClickCourse={() => {}}
                onEdit={() => {}}
              />
            ))}
          </Column>
          <Column>
            {columnThree.map(requirementGroup => (
              <RequirementGroup
                key={requirementGroup.id}
                {...requirementGroup}
                onClickCourse={() => {}}
                onEdit={() => {}}
              />
            ))}
          </Column>
        </Body>
      </Page>
    );
  }
}
