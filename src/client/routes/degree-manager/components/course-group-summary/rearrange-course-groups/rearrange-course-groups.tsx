import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Modal } from 'components/modal';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { SortableCourseGroupList } from './sortable-course-group-list';
import { SortEnd } from 'react-sortable-hoc';

const Columns = styled(View)`
  flex-direction: row;
`;
const Column = styled(View)`
  flex: 1 1 calc(33% - ${styles.space(-1)});
  margin-right: ${styles.space(-1)};
`;
const ColumnTitle = styled(Text)`
  margin: 0 ${styles.space(-1)};
  margin-bottom: ${styles.space(0)};
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
`;

export interface CourseGroupViewModel {
  id: string;
  name: string;
  column: number;
}

interface RearrangeCourseGroupsProps {
  courseGroupsColumnOne: CourseGroupViewModel[];
  courseGroupsColumnTwo: CourseGroupViewModel[];
  courseGroupsColumnThree: CourseGroupViewModel[];
  open: boolean;
  onClose: () => void;
  onRearrange: (fromColumn: number, toColumn: number, oldIndex: number, newIndex: number) => void;
}

export class RearrangeCourseGroups extends React.PureComponent<RearrangeCourseGroupsProps, {}> {
  handleOnLeftColumnOne = () => {};
  handleOnRightColumnOne = (groupId: string) => {
    const { courseGroupsColumnOne, courseGroupsColumnTwo, onRearrange } = this.props;
    const fromColumn = 1;
    const toColumn = 2;
    const oldIndex = courseGroupsColumnOne.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, courseGroupsColumnTwo.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnLeftColumnTwo = (groupId: string) => {
    const { courseGroupsColumnOne, courseGroupsColumnTwo, onRearrange } = this.props;
    const fromColumn = 2;
    const toColumn = 1;
    const oldIndex = courseGroupsColumnTwo.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, courseGroupsColumnOne.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnRightColumnTwo = (groupId: string) => {
    const { courseGroupsColumnTwo, courseGroupsColumnThree, onRearrange } = this.props;
    const fromColumn = 2;
    const toColumn = 3;
    const oldIndex = courseGroupsColumnTwo.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, courseGroupsColumnThree.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnLeftColumnThree = (groupId: string) => {
    const { courseGroupsColumnTwo, courseGroupsColumnThree, onRearrange } = this.props;
    const fromColumn = 3;
    const toColumn = 2;
    const oldIndex = courseGroupsColumnThree.findIndex(group => group.id === groupId);
    const newIndex = Math.min(oldIndex, courseGroupsColumnTwo.length);

    onRearrange(fromColumn, toColumn, oldIndex, newIndex);
  };
  handleOnRightColumnThree = () => {};

  handleSortEndColumnOne = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(1, 1, oldIndex, newIndex);
  };
  handleSortEndColumnTwo = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(2, 2, oldIndex, newIndex);
  };
  handleSortEndColumnThree = ({ oldIndex, newIndex }: SortEnd) => {
    this.props.onRearrange(3, 3, oldIndex, newIndex);
  };

  render() {
    const {
      open,
      onClose,
      courseGroupsColumnOne,
      courseGroupsColumnTwo,
      courseGroupsColumnThree,
    } = this.props;

    return (
      <Modal title="Rearranging course groups…" open={open} onBlurCancel={onClose} size="large">
        <Columns>
          <Column>
            <ColumnTitle>Column One</ColumnTitle>
            <SortableCourseGroupList
              distance={5}
              lockAxis="y"
              groups={courseGroupsColumnOne}
              onLeft={this.handleOnLeftColumnOne}
              onRight={this.handleOnRightColumnOne}
              onSortEnd={this.handleSortEndColumnOne}
            />
          </Column>
          <Column>
            <ColumnTitle>Column Two</ColumnTitle>
            <SortableCourseGroupList
              distance={5}
              lockAxis="y"
              groups={courseGroupsColumnTwo}
              onLeft={this.handleOnLeftColumnTwo}
              onRight={this.handleOnRightColumnTwo}
              onSortEnd={this.handleSortEndColumnTwo}
            />
          </Column>
          <Column>
            <ColumnTitle>Column Three</ColumnTitle>
            <SortableCourseGroupList
              distance={5}
              lockAxis="y"
              groups={courseGroupsColumnThree}
              onLeft={this.handleOnLeftColumnThree}
              onRight={this.handleOnRightColumnThree}
              onSortEnd={this.handleSortEndColumnThree}
            />
          </Column>
        </Columns>
        <Actions>
          <Button onClick={onClose}>Done</Button>
        </Actions>
      </Modal>
    );
  }
}
