import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Modal } from 'components/modal';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { SortableCourseGroupList } from './sortable-course-group-list';

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
  open: boolean;
  onClose: () => void;
  courseGroupsColumnOne: CourseGroupViewModel[];
  courseGroupsColumnTwo: CourseGroupViewModel[];
  courseGroupsColumnThree: CourseGroupViewModel[];
}

export class RearrangeCourseGroups extends React.PureComponent<RearrangeCourseGroupsProps, {}> {
  handleOnLeftColumnOne = (groupId: string) => {};
  handleOnRightColumnOne = (groupId: string) => {};
  handleOnLeftColumnTwo = (groupId: string) => {};
  handleOnRightColumnTwo = (groupId: string) => {};
  handleOnLeftColumnThree = (groupId: string) => {};
  handleOnRightColumnThree = (groupId: string) => {};

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
              axis="y"
              groups={courseGroupsColumnOne}
              onLeft={this.handleOnLeftColumnOne}
              onRight={this.handleOnRightColumnOne}
            />
          </Column>
          <Column>
            <ColumnTitle>Column Two</ColumnTitle>
            <SortableCourseGroupList
              distance={5}
              axis="y"
              groups={courseGroupsColumnTwo}
              onLeft={this.handleOnLeftColumnTwo}
              onRight={this.handleOnRightColumnTwo}
            />
          </Column>
          <Column>
            <ColumnTitle>Column Three</ColumnTitle>
            <SortableCourseGroupList
              distance={5}
              axis="y"
              groups={courseGroupsColumnThree}
              onLeft={this.handleOnLeftColumnThree}
              onRight={this.handleOnRightColumnThree}
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
