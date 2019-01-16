import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { memoizeLast } from 'utilities/memoize-last';
import { SortEnd } from 'react-sortable-hoc';

import { Page as _Page } from 'components/page';
import { Text } from 'components/text';
import { View } from 'components/view';
import { PrimaryButton } from 'components/button';
import { RequirementGroup, CourseModel } from './components/requirement-group';
import { Modal } from 'components/modal';
import { Reorder } from 'components/reorder';

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
const ReorderCourse = styled(View)`
  padding: ${styles.space(0)} ${styles.space(1)};
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
  warnings: string[];
  onToggleCourseComplete: (groupId: string, courseId: string) => void;
  onRemoveCourse: (groupId: string, courseId: string) => void;
  onRearrange: (groupId: string, sortEnd: SortEnd) => void;
  columnOne: RequirementGroupModel[];
  columnTwo: RequirementGroupModel[];
  columnThree: RequirementGroupModel[];
}

interface DegreeState {
  activeGroupId: string | undefined;
  activeRearrangeGroupId: string | undefined;
}

export class Degree extends React.PureComponent<DegreeProps, DegreeState> {
  state: DegreeState = {
    activeGroupId: undefined,
    activeRearrangeGroupId: undefined,
  };

  get activeGroup() {
    const { columnOne, columnTwo, columnThree } = this.props;
    const { activeGroupId } = this.state;
    return this._getActiveGroup(activeGroupId, columnOne, columnTwo, columnThree);
  }
  _getActiveGroup = memoizeLast(
    (
      activeGroupId: string | undefined,
      columnOne: RequirementGroupModel[],
      columnTwo: RequirementGroupModel[],
      columnThree: RequirementGroupModel[],
    ) => {
      if (!activeGroupId) return undefined;

      const columnOneMatch = columnOne.find(group => group.id === activeGroupId);
      if (columnOneMatch) return columnOneMatch;
      const columnTwoMatch = columnTwo.find(group => group.id === activeGroupId);
      if (columnTwoMatch) return columnTwoMatch;
      const columnThreeMatch = columnThree.find(group => group.id === activeGroupId);
      if (columnThreeMatch) return columnThreeMatch;

      return undefined;
    },
  );

  get activeRearrangeGroup() {
    const { columnOne, columnTwo, columnThree } = this.props;
    const { activeRearrangeGroupId } = this.state;
    return this._getActiveGroup(activeRearrangeGroupId, columnOne, columnTwo, columnThree);
  }
  _getActiveRearrangeGroup = memoizeLast(
    (
      activeGroupId: string | undefined,
      columnOne: RequirementGroupModel[],
      columnTwo: RequirementGroupModel[],
      columnThree: RequirementGroupModel[],
    ) => {
      if (!activeGroupId) return undefined;

      const columnOneMatch = columnOne.find(group => group.id === activeGroupId);
      if (columnOneMatch) return columnOneMatch;
      const columnTwoMatch = columnTwo.find(group => group.id === activeGroupId);
      if (columnTwoMatch) return columnTwoMatch;
      const columnThreeMatch = columnThree.find(group => group.id === activeGroupId);
      if (columnThreeMatch) return columnThreeMatch;

      return undefined;
    },
  );

  handleEditGroup(groupId: string) {
    this.setState({
      activeGroupId: groupId,
    });
  }
  handleEditGroupClose = () => {
    this.setState({ activeGroupId: undefined });
  };

  handleRearrangeGroup(groupId: string) {
    this.setState({
      activeRearrangeGroupId: groupId,
    });
  }
  handleRearrangeClose = () => {
    this.setState({ activeRearrangeGroupId: undefined });
  };

  handleRearrangeEnd = (sortEnd: SortEnd) => {
    const { activeRearrangeGroupId } = this.state;
    if (!activeRearrangeGroupId) return;

    this.props.onRearrange(activeRearrangeGroupId, sortEnd);
  };

  renderReorderCourse = (course: CourseModel) => (
    <ReorderCourse>
      <Text>{course.name}</Text>
    </ReorderCourse>
  );

  render() {
    const {
      degreeName,
      currentCredits,
      totalCredits,
      warnings,
      columnOne,
      columnTwo,
      columnThree,
      onToggleCourseComplete,
      onRemoveCourse,
    } = this.props;

    const { activeGroupId, activeRearrangeGroupId } = this.state;

    const percentage = (currentCredits * 100) / totalCredits;

    return (
      <>
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
            {warnings.map((warning, index) => (
              <Warning key={index}>{warning}</Warning>
            ))}
          </Warnings>
          <Body>
            <Column>
              {columnOne.map(group => (
                <RequirementGroup
                  key={group.id}
                  {...group}
                  onToggleCourseComplete={courseId => onToggleCourseComplete(group.id, courseId)}
                  onEdit={() => this.handleEditGroup(group.id)}
                  onRearrange={() => this.handleRearrangeGroup(group.id)}
                  onRemoveCourse={courseId => onRemoveCourse(group.id, courseId)}
                />
              ))}
            </Column>
            <Column>
              {columnTwo.map(group => (
                <RequirementGroup
                  key={group.id}
                  {...group}
                  onToggleCourseComplete={courseId => onToggleCourseComplete(group.id, courseId)}
                  onEdit={() => this.handleEditGroup(group.id)}
                  onRearrange={() => this.handleRearrangeGroup(group.id)}
                  onRemoveCourse={courseId => onRemoveCourse(group.id, courseId)}
                />
              ))}
            </Column>
            <Column>
              {columnThree.map(group => (
                <RequirementGroup
                  key={group.id}
                  {...group}
                  onToggleCourseComplete={courseId => onToggleCourseComplete(group.id, courseId)}
                  onEdit={() => this.handleEditGroup(group.id)}
                  onRearrange={() => this.handleRearrangeGroup(group.id)}
                  onRemoveCourse={courseId => onRemoveCourse(group.id, courseId)}
                />
              ))}
            </Column>
          </Body>
        </Page>
        <Modal
          open={!!activeGroupId}
          onBlurCancel={this.handleEditGroupClose}
          size="large"
          title={(this.activeGroup && this.activeGroup.name) || 'Current group'}
        >
          edit modal
        </Modal>
        <Reorder
          title={`Reordering course in ${(this.activeRearrangeGroup &&
            this.activeRearrangeGroup.name) ||
            ''}…`}
          open={!!activeRearrangeGroupId}
          elements={(this.activeRearrangeGroup && this.activeRearrangeGroup.courses) || []}
          onClose={this.handleRearrangeClose}
          onReorder={this.handleRearrangeEnd}
          render={this.renderReorderCourse}
        />
      </>
    );
  }
}
